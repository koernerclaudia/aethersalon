// Vercel serverless function: return a single normalized event by numeric id (1-based index)
import type { VercelRequest, VercelResponse } from '@vercel/node';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_EVENTS_TABLE = process.env.AIRTABLE_EVENTS_TABLE || 'Veranstaltungen';

async function fetchAll() {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_EVENTS_TABLE)}?pageSize=100`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' } });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text);
  }
  const payload = await r.json();
  return payload.records || [];
}

function normalizeRecord(r: any, idx: number) {
  const f = r.fields || {};
  const title = f.Titel || f.Title || f.name || `Veranstaltung ${idx + 1}`;
  const dateRaw = f.Datum || f.datum || f.Date || '';
  let date = '';
  if (typeof dateRaw === 'string' && dateRaw) {
    const parsed = new Date(dateRaw);
    if (!Number.isNaN(parsed.getTime())) {
      try {
        date = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsed);
      } catch (e) {
        date = dateRaw;
      }
    } else {
      date = dateRaw;
    }
  }
  const location = f.Ort || f.Location || f['Veranstaltungsort'] || '';
  return { id: idx + 1, title, date, location, rawId: r.id, raw: f };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) return res.status(500).json({ error: 'Airtable env not configured' });
  const { id } = req.query;
  const idStr = String(id || '');

  try {
    // If id looks like an Airtable record id (rec...), fetch that record directly
    if (/^rec[A-Za-z0-9]+$/.test(idStr)) {
      const recUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_EVENTS_TABLE)}/${encodeURIComponent(idStr)}`;
      const r = await fetch(recUrl, { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' } });
      if (!r.ok) {
        const text = await r.text();
        // forward Airtable status and message
        return res.status(r.status).json({ error: 'Airtable error', details: text });
      }
      const payload = await r.json();
      const normalized = normalizeRecord(payload, 0);
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      return res.status(200).json({ event: normalized });
    }

    // Otherwise, treat as numeric 1-based index
    const idNum = parseInt(idStr, 10);
    if (Number.isNaN(idNum) || idNum < 1) return res.status(400).json({ error: 'Invalid id' });

    const records = await fetchAll();
    const events = records.map((r: any, i: number) => normalizeRecord(r, i));
    const found = events.find((e: any) => e.id === idNum);
    if (!found) return res.status(404).json({ error: 'Not found' });
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ event: found });
  } catch (err: any) {
    return res.status(500).json({ error: 'Airtable error', details: err?.message || String(err) });
  }
}
