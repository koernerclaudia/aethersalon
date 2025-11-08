// Vercel serverless function: proxy to Airtable Veranstaltungen table
// Reads AIRTABLE_API_KEY, AIRTABLE_BASE_ID, and optional AIRTABLE_EVENTS_TABLE from process.env

type AirtableRecord = {
  id: string;
  fields: Record<string, any>;
};

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_EVENTS_TABLE = process.env.AIRTABLE_EVENTS_TABLE || 'Veranstaltungen';

function normalize(records: AirtableRecord[]) {
  return records.map((r, idx) => {
    const f = r.fields || {};
    const title = f.Titel || f.Title || f.name || `Veranstaltung ${idx + 1}`;
    // Datum might be an ISO string or a date-only string. We'll try to parse and
    // format it in German locale (e.g. "15. März 2025"). If parsing fails,
    // return the original string.
    const dateRaw = f.Datum || f.datum || f.Date || '';
    let date = '';
    if (typeof dateRaw === 'string' && dateRaw) {
      const parsed = new Date(dateRaw);
      if (!Number.isNaN(parsed.getTime())) {
        try {
          date = new Intl.DateTimeFormat('de-DE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(parsed);
        } catch (e) {
          // Fallback to the raw string if Intl formatting fails
          date = dateRaw;
        }
      } else {
        date = dateRaw;
      }
    }

    const location = f.Ort || f.Location || f['Veranstaltungsort'] || '';

    return {
      id: idx + 1,
      title,
      date,
      location,
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

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return res.status(500).json({ error: 'Airtable environment variables not configured on this deployment.' });
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      AIRTABLE_EVENTS_TABLE
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
    const events = normalize(records);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ events });
  } catch (err: any) {
    console.error('Airtable events proxy error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error', details: err?.message || String(err) });
  }
}
