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

    // Image: the example JSON didn't include attachments; try common attachment fields first.
    let image: string | undefined = undefined;
    const attachmentFields = ['Bilder', 'Images', 'Image', 'Attachment', 'Attachments'];
    for (const k of attachmentFields) {
      const v = f[k];
      if (Array.isArray(v) && v.length > 0 && v[0] && v[0].url) {
        image = v[0].url;
        break;
      }
      if (typeof v === 'string' && v.startsWith('http')) {
        image = v;
        break;
      }
    }

    // Description & short description
    const description = f.Beschreibung || f.Beschreibung || f.Kurzbeschreibung || f.Kurzbeschreibung || '';

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
