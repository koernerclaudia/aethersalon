// Serverless function: return a single product normalized from an Airtable record id
type AirtableRecord = {
  id: string;
  fields: Record<string, any>;
};

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE;
const AIRTABLE_PARTNERS_TABLE = process.env.AIRTABLE_PARTNERS_TABLE || 'Partner';
const AIRTABLE_PERSONS_TABLE = process.env.AIRTABLE_PERSONS_TABLE || 'Personen';

function normalizeSingle(r: AirtableRecord, partnerMap: Record<string, string> = {}) {
  const f = r.fields || {};
  const placeholderImage = 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400';

  const name = f.Titel || f.TITLE || f.Title || f.Name || f.name || `Produkt`;

  let category = '';
  if (f['Art des Produkts']) category = String(f['Art des Produkts']);
  else if (Array.isArray(f.Produktgruppe) && f.Produktgruppe.length > 0) category = String(f.Produktgruppe[0]);
  else category = 'Unkategorisiert';

  let image: string | undefined = undefined;
  const attachmentFields = ['Produkt-Bild', 'Bilder', 'Images', 'Image', 'Attachment', 'Attachments'];
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

  const description = f.Beschreibung || f.Kurzbeschreibung || f['Kurz-Beschreibung'] || '';
  const shortDescription = f['Kurz-Beschreibung'] || f.Kurzbeschreibung || '';
  const material = f.Beschaffenheit || '';
  const sku = f.Artikelnummer || f['Artikelnummer'] || '';
  const stock = typeof f.Bestand === 'number' ? f.Bestand : parseInt(String(f.Bestand || ''), 10) || 0;

  const manufacturers: string[] = [];
  const manufacturerIds: string[] = [];
  let manufacturer: string | undefined = undefined;
  let manufacturerId: string | undefined = undefined;
  const hv = f['Hergestellt von'];
  if (Array.isArray(hv) && hv.length > 0) {
    for (const item of hv) {
      if (typeof item === 'string' && item.startsWith('rec')) {
        manufacturerIds.push(item);
        manufacturers.push(partnerMap[item] || item);
      } else if (typeof item === 'string') {
        manufacturers.push(item);
      } else if (item && typeof item === 'object' && item.id) {
        const id = String(item.id);
        manufacturerIds.push(id);
        manufacturers.push(partnerMap[id] || id);
      }
    }
  } else if (typeof hv === 'string' && hv.trim()) {
    const parts = hv.split(/[;,\/\n]+/).map((s: string) => s.trim()).filter(Boolean);
    if (parts.length > 1) {
      for (const p of parts) manufacturers.push(p);
    } else {
      manufacturers.push(hv);
    }
  }
  if (manufacturers.length > 0) manufacturer = manufacturers[0];
  if (manufacturerIds.length > 0) manufacturerId = manufacturerIds[0];

  let price: number | undefined = undefined;
  if (typeof f.Einzelpreis === 'number') price = f.Einzelpreis;
  else if (typeof f.Einzelpreis === 'string') price = parseFloat(f.Einzelpreis.replace(',', '.')) || undefined;

  return {
    rawId: r.id,
    raw: f,
    id: r.id,
    name,
    category,
    image: image || placeholderImage,
    description,
    shortDescription,
    material,
    sku,
    stock,
    manufacturer,
    manufacturerId,
    manufacturers,
    manufacturerIds,
    price,
  };
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
    const urlObj = typeof req?.url === 'string' ? new URL(req.url, 'http://localhost') : null;
    const rawId = (req && (req.query as any)?.rawId) || (urlObj && urlObj.pathname.split('/').pop());
    if (!rawId) return res.status(400).json({ error: 'Missing rawId in request' });

    // Build partner map (partners + persons) to resolve linked manufacturers
    const partnerMap: Record<string, string> = {};
    try {
      let pOffset: string | undefined = undefined;
      do {
        const pUrl: string = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_PARTNERS_TABLE)}?pageSize=100${pOffset ? `&offset=${pOffset}` : ''}`;
        const pr = await fetch(pUrl, { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' } });
        if (!pr.ok) break;
        const pPayload: any = await pr.json();
        const pRecords: AirtableRecord[] = pPayload.records || [];
        for (const rec of pRecords) {
          const name = rec.fields?.Name || rec.fields?.Titel || rec.fields?.Name_des_Partners || rec.fields?.name || '';
          if (rec.id) partnerMap[rec.id] = String(name || rec.id);
        }
        pOffset = pPayload.offset;
      } while (pOffset);
    } catch (e) {
      // ignore
    }

    try {
      let perOffset: string | undefined = undefined;
      do {
        const perUrl: string = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_PERSONS_TABLE)}?pageSize=100${perOffset ? `&offset=${perOffset}` : ''}`;
        const pr = await fetch(perUrl, { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' } });
        if (!pr.ok) break;
        const pPayload: any = await pr.json();
        const pRecords: AirtableRecord[] = pPayload.records || [];
        for (const rec of pRecords) {
          const fields = rec.fields || {};
          const nameParts: string[] = [];
          if (fields.Vorname) nameParts.push(String(fields.Vorname));
          if (fields.Nachname) nameParts.push(String(fields.Nachname));
          const name = nameParts.length > 0 ? nameParts.join(' ') : (fields.Name || fields.Titel || fields.name || '');
          if (rec.id) partnerMap[rec.id] = String(name || rec.id);
        }
        perOffset = pPayload.offset;
      } while (perOffset);
    } catch (e) {
      // ignore
    }

    // Fetch the single record
    const recUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_PRODUCTS_TABLE)}/${encodeURIComponent(rawId)}`;
    const rr = await fetch(recUrl, { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' } });
    if (!rr.ok) {
      const text = await rr.text();
      return res.status(rr.status).json({ error: 'Airtable error', details: text });
    }
    const recPayload: any = await rr.json();
    const rec: AirtableRecord = recPayload || null;
    if (!rec) return res.status(404).json({ error: 'Record not found' });

    const product = normalizeSingle(rec, partnerMap);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ product });
  } catch (err: any) {
    console.error('Single product proxy error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error', details: err?.message || String(err) });
  }
}
