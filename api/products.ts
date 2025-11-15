// Vercel serverless function: proxy to Airtable
// Reads AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_PRODUCTS_TABLE from process.env
// Returns a normalized array of products suitable for ProductGrid (id, name, category, image, ...)

type AirtableRecord = {
  id: string;
  fields: Record<string, any>;
};

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE;
// Prefer the 'Order' view by default (the user confirmed this view exists and is
// sorted by the 'Reihenfolge' column). Can be overridden via env var.
const AIRTABLE_PRODUCTS_VIEW = process.env.AIRTABLE_PRODUCTS_VIEW || 'Order'; // optional: use Airtable view ordering if provided
const AIRTABLE_ORDER_FIELD = process.env.AIRTABLE_ORDER_FIELD || 'Reihenfolge';

function normalize(records: AirtableRecord[]) {
  // Map the German Airtable schema the user provided to our product shape.
  // If a field is missing we'll use reasonable fallbacks.
  const placeholderImage =
    'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400';

  return records.map((r, idx) => {
    const f = r.fields || {};

    // Name/title (Airtable field: "Titel")
    const name =
      f.Titel || f.TITLE || f.Title || f.Name || f.name || `Produkt ${idx + 1}`;

    // Category: prefer the explicit field "Art des Produkts", else use Produktgruppe (array of linked record ids)
    let category = '';
    if (f['Art des Produkts']) category = String(f['Art des Produkts']);
    else if (Array.isArray(f.Produktgruppe) && f.Produktgruppe.length > 0)
      category = String(f.Produktgruppe[0]);
    else category = 'Unkategorisiert';

    // Image: prefer explicit German attachment field "Produkt-Bild", then try other common names
let image: string | undefined = undefined;
const attachmentFields = [
  'Produkt-Bild', // <-- Airtable column you asked for
  'Bilder',
  'Images',
  'Image',
  'Attachment',
  'Attachments'
];

for (const k of attachmentFields) {
  const v = f[k];
  // Common Airtable attachment: an array of objects with a `url` property
  if (Array.isArray(v) && v.length > 0 && v[0] && v[0].url) {
    image = v[0].url;
    break;
  }
  // Fallback: sometimes the field can be a plain URL string
  if (typeof v === 'string' && v.startsWith('http')) {
    image = v;
    break;
  }
}

    // Description & short description
    const description = f.Beschreibung || f.Beschreibung || f.Kurzbeschreibung || f.Kurzbeschreibung || '';
    const shortDescription = f.Kurzbeschreibung || f.Kurzbeschreibung || '';

    // Material / condition (Beschaffenheit)
    const material = f.Beschaffenheit || f.Beschaffenheit || '';

    // SKU / Artikelnummer
    const sku = f.Artikelnummer || f['Artikelnummer'] || '';

    // Stock / Bestand
    const stock = typeof f.Bestand === 'number' ? f.Bestand : parseInt(String(f.Bestand || ''), 10) || 0;

    // Manufacturer / Hergestellt von / Herstellername (may be array of names or linked record ids)
    let manufacturer: string | undefined = undefined;
    if (Array.isArray(f['Herstellername']) && f['Herstellername'].length > 0) {
      manufacturer = String(f['Herstellername'][0]);
    } else if (Array.isArray(f['Hergestellt von']) && f['Hergestellt von'].length > 0) {
      manufacturer = String(f['Hergestellt von'][0]);
    } else if (typeof f['Herstellername'] === 'string') {
      manufacturer = f['Herstellername'];
    }

    // Price parsing (Einzelpreis)
    let price: number | undefined = undefined;
    if (typeof f.Einzelpreis === 'number') price = f.Einzelpreis;
    else if (typeof f.Einzelpreis === 'string') price = parseFloat(f.Einzelpreis.replace(',', '.')) || undefined;

    return {
      // keep a stable numeric id for the UI (ProductGrid expects numbers in this codebase)
      id: idx + 1,
      name,
      category,
      image: image || placeholderImage,
      description,
      shortDescription,
      material,
      sku,
      stock,
      manufacturer,
      price,
      rawId: r.id,
      raw: f,
    };
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_PRODUCTS_TABLE) {
    return res.status(500).json({ error: 'Airtable environment variables not configured on this deployment.' });
  }

  try {
    // Fetch all pages from Airtable, requesting an explicit sort by the numeric
    // field that controls ordering in the base. The user added a "Reihenfolge"
    // column — we request sort by that field ascending. This guarantees the
    // returned array is in the desired order. We also append pages sequentially
    // so the overall order is preserved.
    const allRecords: AirtableRecord[] = [];
    let offset: string | undefined = undefined;

    do {
      const params = new URLSearchParams();
      params.append('pageSize', '100');
      // If a view name is provided via env, prefer the Airtable view order
      // (manual drag order or view-level sorting). Otherwise request an
      // explicit server-side sort by the numeric order field.
      if (AIRTABLE_PRODUCTS_VIEW) {
        params.append('view', AIRTABLE_PRODUCTS_VIEW);
      } else {
        params.append('sort[0][field]', AIRTABLE_ORDER_FIELD);
        params.append('sort[0][direction]', 'asc');
      }
      if (offset) params.append('offset', offset);

      const pageUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
        AIRTABLE_PRODUCTS_TABLE
      )}?${params.toString()}`;

      const r = await fetch(pageUrl, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!r.ok) {
        const text = await r.text();
        return res.status(r.status).json({ error: 'Airtable error', details: text });
      }

      const payload = await r.json();
      const records: AirtableRecord[] = payload.records || [];
      allRecords.push(...records);
      offset = payload.offset;
    } while (offset);

    // Normalize the full list (normalize uses the array index as stable numeric id)
    const products = normalize(allRecords);

    // Cache for a short time on the edge
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ products });
  } catch (err: any) {
    console.error('Airtable proxy error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error', details: err?.message || String(err) });
  }
}
