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

    // Category: prefer the explicit field "Art des Produkts" (can be multiple-select),
    // else use Produktgruppe (array of linked record ids).
    // We'll expose both a primary category (first value) and a tags array for multi-select values.
    let category = '';
    let tags: string[] = [];
    const rawArt = f['Art des Produkts'];

    if (Array.isArray(rawArt) && rawArt.length > 0) {
      // Each item might itself contain commas; split each element, trim and dedupe
      const split = rawArt
        .map((v: any) => String(v))
        .flatMap((s) => s.split(','))
        .map((s) => s.trim())
        .filter(Boolean);

      // dedupe while preserving order
      tags = Array.from(new Set(split));
      category = tags[0] || '';
    } else if (typeof rawArt === 'string' && rawArt.trim()) {
      // Sometimes Airtable values may be returned as a comma-separated string
      tags = rawArt.split(',').map((s: string) => s.trim()).filter(Boolean);
      tags = Array.from(new Set(tags));
      category = tags[0] || '';
    } else if (Array.isArray(f.Produktgruppe) && f.Produktgruppe.length > 0) {
      category = String(f.Produktgruppe[0]);
    } else {
      category = 'Unkategorisiert';
    }

    // Image: prefer explicit German attachment field "Produkt-Bild", then try other common names
    let image: string | undefined = undefined;
    const attachmentFields = [
      'Produkt-Bild', // <-- Airtable column you asked for
      'Bilder',
      'Images',
      'Image',
      'Attachment',
      'Attachments',
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
    const description =
      f.Beschreibung ||
      f.Beschreibung ||
      f.Kurzbeschreibung ||
      f.Kurzbeschreibung ||
      '';
    const shortDescription = f.Kurzbeschreibung || f.Kurzbeschreibung || '';

    // Material / condition (Beschaffenheit)
    const material = f.Beschaffenheit || f.Beschaffenheit || '';

    // SKU / Artikelnummer
    const sku = f.Artikelnummer || f['Artikelnummer'] || '';

    // Stock / Bestand
    const stock =
      typeof f.Bestand === 'number'
        ? f.Bestand
        : parseInt(String(f.Bestand || ''), 10) || 0;

    // Manufacturer / Hergestellt von / Herstellername (may be array of names or linked record ids)
    let manufacturer: string | undefined = undefined;
    if (Array.isArray(f['Herstellername']) && f['Herstellername'].length > 0) {
      manufacturer = String(f['Herstellername'][0]);
    } else if (
      Array.isArray(f['Hergestellt von']) &&
      f['Hergestellt von'].length > 0
    ) {
      manufacturer = String(f['Hergestellt von'][0]);
    } else if (typeof f['Herstellername'] === 'string') {
      manufacturer = f['Herstellername'];
    }

    // Price parsing (Einzelpreis)
    let price: number | undefined = undefined;
    if (typeof f.Einzelpreis === 'number') price = f.Einzelpreis;
    else if (typeof f.Einzelpreis === 'string')
      price = parseFloat(f.Einzelpreis.replace(',', '.')) || undefined;

    return {
      // keep a stable numeric id for the UI (ProductGrid expects numbers in this codebase)
      id: idx + 1,
      name,
      category,
      tags,
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
    return res
      .status(500)
      .json({
        error:
          'Airtable environment variables not configured on this deployment.',
      });
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
      return res
        .status(r.status)
        .json({ error: 'Airtable error', details: text });
    }

    const payload = await r.json();
    const records: AirtableRecord[] = payload.records || [];
    const products = normalize(records);

    // Cache for a short time on the edge
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ products });
  } catch (err: any) {
    console.error('Airtable proxy error:', err?.message || err);
    return res.status(500).json({
      error: 'Internal server error',
      details: err?.message || String(err),
    });
  }
}
