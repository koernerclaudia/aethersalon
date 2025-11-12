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

function normalize(records: AirtableRecord[]) {
  // Map the German Airtable schema the user provided to our product shape.
  // If a field is missing we'll keep `image` undefined so the UI can decide
  // whether to render a decorative empty state instead of a generic photograph.

  // Helper: given a field value (array/object/string) try to extract the first usable URL
  function extractFirstUrl(value: any): string | undefined {
    if (!value) return undefined;

    // Attachment array (Airtable): [{ id, url, filename, thumbnails: { large: { url }}}]
    if (Array.isArray(value) && value.length > 0) {
      const first = value[0];
      if (first && typeof first === 'object') {
        if (first.url && typeof first.url === 'string') return first.url;
        if (first.thumbnails && first.thumbnails.large && first.thumbnails.large.url)
          return first.thumbnails.large.url;
        if (first.thumbnails && first.thumbnails.full && first.thumbnails.full.url)
          return first.thumbnails.full.url;
      }
      // Fallback: if array of strings, check first string for URL
      if (typeof value[0] === 'string') {
        const s = String(value[0]);
        const m = s.match(/https?:\/\/[^\s)]+/i);
        if (m) return m[0];
      }
    }

    // If it's an object with a url property
    if (typeof value === 'object' && value !== null && value.url && typeof value.url === 'string') {
      return value.url;
    }

    // If it's a string, normalize whitespace and try to extract a URL
    if (typeof value === 'string') {
      // Remove newlines and excessive whitespace which can break naive regexes
      const collapsed = value.replace(/\s+/g, ' ').trim();
      // Match the first http(s) URL, stop at whitespace or a closing paren
      const m = collapsed.match(/https?:\/\/[^\s)]+/i);
      if (m) return m[0];
    }

    return undefined;
  }

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

    // Image: prefer explicit German attachment field "Produkt Bild", then try other common names
    let image: string | undefined = undefined;
    const attachmentFields = [
      'Produkt Bild', // <-- Airtable column you asked for
      'Bilder',
      'Weitere Bilder',
      'Images',
      'Image',
      'Attachment',
      'Attachments',
    ];

    for (const k of attachmentFields) {
      const v = f[k];
      const url = extractFirstUrl(v);
      if (url) {
        image = url;
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
  image: image,
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
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      AIRTABLE_PRODUCTS_TABLE
    )}?pageSize=100`;

    const r = await fetch(url, {
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
    const products = normalize(records);

    // Cache for a short time on the edge
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ products });
  } catch (err: any) {
    console.error('Airtable proxy error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error', details: err?.message || String(err) });
  }
}