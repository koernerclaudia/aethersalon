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

    const location = f.Ort || f.Location || f['Veranstaltungssort'] || f['Veranstaltungsort'] || '';
    const description = f.Beschreibung || f.Description || f.description || f.Text || f.Details || '';

    // helper: extract attachment URLs from common attachment fields
    const extractAttachments = (field: any): string[] => {
      if (!field) return [];
      if (Array.isArray(field)) {
        return field.map((a: any) => a && (a.url || a.thumbnails?.large?.url || a.filename) ).filter(Boolean);
      }
      return [];
    };

    const mainImageCandidates = extractAttachments(f.HauptBild || f.Hauptbild || f['HauptBild']);
    const bilder = extractAttachments(f.Bilder || f.Fotos || f.FotosGallerie || f.Bildergalerie || f.Bilderliste || f.Images);
    // If main image missing, fallback to first of bilder
    const mainImage = mainImageCandidates.length > 0 ? mainImageCandidates[0] : (bilder.length > 0 ? bilder[0] : '');

    const vonRaw = f.von || f.Von || f.from || f.Start || f.start || f['Von'] || f['von'] || null;
    const bisRaw = f.bis || f.Bis || f.to || f.Ende || f['Bis'] || null;

    const formatMaybeDate = (maybe: any) => {
      if (!maybe) return '';
      const val = Array.isArray(maybe) && maybe.length > 0 ? maybe[0] : maybe;
      const d = new Date(val);
      if (!Number.isNaN(d.getTime())) {
        try {
          return new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
        } catch (e) {
          return String(val);
        }
      }
      return String(val);
    };

    const von = formatMaybeDate(vonRaw);
    const bis = formatMaybeDate(bisRaw);

    // organizer
    const organizer = f.Veranstalter || f.Organisator || f.Organizer || '';
    const organizerWebsite = f['Veranstalter-Website'] || f['Veranstalter Website'] || f.VeranstalterWebsite || f.OrganizerWebsite || '';

    return {
      id: idx + 1,
      title,
      date,
      location,
      locationRaw: location,
      description,
      rawId: r.id,
      raw: f,
      mainImage,
      images: // include mainImage first then other bilder, uniq
        Array.from(new Set([...(mainImage ? [mainImage] : []), ...bilder])),
      von,
      bis,
      organizer,
      organizerWebsite,
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
    // If the request path includes an id segment (/api/events/:id), try to return a single event.
    // Example: /api/events/recXXXXXXXX or /api/events/1
    const path = String(req.url || '');
    const singleMatch = path.match(/^\/api\/events\/([^\/?#]+)/);
    if (singleMatch) {
      const idSegment = singleMatch[1];

      // If idSegment looks like an Airtable record id (starts with 'rec'), fetch that record directly.
      if (/^rec/i.test(idSegment)) {
        const recordUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
          AIRTABLE_EVENTS_TABLE
        )}/${encodeURIComponent(idSegment)}`;

        const r1 = await fetch(recordUrl, {
          headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
        });

        if (!r1.ok) {
          const text = await r1.text();
          return res.status(r1.status).json({ error: 'Airtable error', details: text });
        }

        const payload1 = await r1.json();
        const rec = payload1 && payload1.fields ? payload1 : null;
        if (rec) {
          const events = normalize([ { id: payload1.id, fields: payload1.fields } as any ] as any);
          res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
          return res.status(200).json({ event: events[0] });
        }
      }

      // Otherwise, if idSegment is numeric, fetch all and find by normalized id (the existing behavior)
      const allUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
        AIRTABLE_EVENTS_TABLE
      )}?pageSize=100`;

      const rAll = await fetch(allUrl, {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
      });

      if (!rAll.ok) {
        const text = await rAll.text();
        return res.status(rAll.status).json({ error: 'Airtable error', details: text });
      }

      const payloadAll = await rAll.json();
      const recordsAll: AirtableRecord[] = payloadAll.records || [];
      const eventsAll = normalize(recordsAll);

      // Try to find by numeric normalized id or by raw Airtable id
      const found = eventsAll.find((e) => String(e.id) === String(idSegment) || String(e.rawId) === String(idSegment));
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      return res.status(200).json({ event: found || null });
    }

    // Default: list all events (existing behavior)
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
