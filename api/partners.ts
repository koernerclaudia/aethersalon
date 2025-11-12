// Vercel serverless function: proxy to Airtable 'Partner' table
// Reads AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_PARTNERS_TABLE from process.env

type AirtableRecord = {
  id: string;
  fields: Record<string, any>;
};

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PARTNERS_TABLE = process.env.AIRTABLE_PARTNERS_TABLE || 'Partner';

function extractFirstUrlFromAttachment(fieldValue: any): string | undefined {
  if (!fieldValue) return undefined;
  if (Array.isArray(fieldValue) && fieldValue.length > 0) {
    const first = fieldValue[0];
    if (first && typeof first === 'object') {
      return first.url || first?.thumbnails?.large?.url || first?.thumbnails?.full?.url;
    }
    if (typeof first === 'string' && first.startsWith('http')) return first;
  }
  if (typeof fieldValue === 'object' && fieldValue.url) return fieldValue.url;
  if (typeof fieldValue === 'string') {
    // collapse whitespace and try to extract http(s) url
    const collapsed = fieldValue.replace(/\s+/g, ' ');
    const m = collapsed.match(/https?:\/\/[^\s)"']+/);
    if (m) return m[0];
  }
  return undefined;
}

function normalize(records: AirtableRecord[]) {
  return records.map((r, idx) => {
    const f = r.fields || {};
    const name = f.Name || f.Titel || f.Name_des_Partners || f.name || `Partner ${idx + 1}`;
    const description = f.Beschreibung || f.Description || f.Text || '';
    const website = (Array.isArray(f.Website) && f.Website[0]) || f.Website || f['Webseite'] || f.URL || undefined;

    // image fields could be named 'Logo', 'Bild', 'Image' or similar
    const imageFieldNames = ['Logo', 'Bild', 'Image', 'Logo-Bild', 'Partner-Bild', 'ImageUrl', 'Image URL'];
    let imageUrl: string | undefined;
    for (const k of imageFieldNames) {
      if (f[k]) {
        const u = extractFirstUrlFromAttachment(f[k]);
        if (u) {
          imageUrl = u;
          break;
        }
      }
    }

    // fallback: check any attachment-like fields
    if (!imageUrl) {
      for (const k of Object.keys(f)) {
        const v = f[k];
        const u = extractFirstUrlFromAttachment(v);
        if (u) {
          imageUrl = u;
          break;
        }
      }
    }

    return {
      id: r.id,
      name,
      description,
      website,
      imageUrl,
      raw: f,
    };
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return res.status(500).json({ error: 'Airtable environment variables not configured on this deployment.' });
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_PARTNERS_TABLE)}?pageSize=100`;
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
    const partners = normalize(records);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ partners });
  } catch (err: any) {
    console.error('Airtable partners proxy error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error', details: err?.message || String(err) });
  }
}
