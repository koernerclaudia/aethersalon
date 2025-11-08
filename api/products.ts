import axios from 'axios';

// Vercel-compatible serverless function to proxy Airtable requests.
// Store the secret AIRTABLE_API_KEY and AIRTABLE_BASE_ID in the hosting platform's
// environment variables (do NOT commit them to the repo).

const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_KEY = process.env.AIRTABLE_API_KEY;
const TABLE = process.env.AIRTABLE_PRODUCTS_TABLE || 'Produkte';

export default async function handler(req: any, res: any) {
  if (!AIRTABLE_BASE || !AIRTABLE_KEY) {
    return res.status(500).json({ error: 'Airtable not configured on server' });
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(TABLE)}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_KEY}`,
      },
      params: {
        view: 'Grid view',
        pageSize: 100,
      },
    });

    const products = (response.data.records || []).map((rec: any) => {
      const f = rec.fields || {};

      // Best-effort image extraction: Airtable attachments are arrays with `url`.
      const image = Array.isArray(f.Images) && f.Images.length > 0
        ? f.Images[0].url
        : Array.isArray(f.Bilder) && f.Bilder.length > 0
        ? f.Bilder[0].url
        : f.Image?.[0]?.url || f.imageUrl || '';

      return {
        id: rec.id,
        name: f.Name || f.name || f.Namen || 'Unnamed',
        description: f.Description || f.Beschreibung || '',
        price: typeof f.Price === 'number' ? f.Price : (f.Preis ? Number(f.Preis) : null),
        category: f.Category || f.Kategorie || '',
        image,
        raw: f,
      };
    });

    return res.status(200).json({ products });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Airtable proxy error', err?.response?.data || err.message || err);
    return res.status(502).json({ error: 'Failed to fetch products from Airtable' });
  }
}
