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
  return records.map((r, idx) => {
    const f = r.fields || {};
    // Try several common field names used in Airtable setups
    const name = f.Name || f.name || f.title || f.Title || 'Untitled Produkt';
    const category = f.Category || f.category || f.Kategorie || 'Unkategorisiert';
    // Images in Airtable are usually an array of objects with a `url` property
    let image: string | undefined = undefined;
    if (Array.isArray(f.Images) && f.Images[0] && f.Images[0].url) image = f.Images[0].url;
    if (!image && Array.isArray(f.Image) && f.Image[0] && f.Image[0].url) image = f.Image[0].url;
    if (!image && typeof f.Image === 'string') image = f.Image;

    return {
      id: Number(r.id) || idx + 1,
      name,
      category,
      image: image || '',
      description: f.Description || f.description || f.Beschreibung || '',
      price: typeof f.Price === 'number' ? f.Price : parseFloat(f.Price || '') || undefined,
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
