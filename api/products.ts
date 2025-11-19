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
// Prefer the 'Order' view by default (the user confirmed this view exists and is
// sorted by the 'Reihenfolge' column). Can be overridden via env var.
const AIRTABLE_PRODUCTS_VIEW = process.env.AIRTABLE_PRODUCTS_VIEW || 'Order'; // optional: use Airtable view ordering if provided
const AIRTABLE_ORDER_FIELD = process.env.AIRTABLE_ORDER_FIELD || 'Reihenfolge';
const AIRTABLE_PARTNERS_TABLE = process.env.AIRTABLE_PARTNERS_TABLE || 'Partner';
const AIRTABLE_PERSONS_TABLE = process.env.AIRTABLE_PERSONS_TABLE || 'Personen';

function normalize(records: AirtableRecord[], partnerMap: Record<string, string> = {}) {
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

    // Image: prefer explicit German attachment field "Produkt-Bild", then try other common names
let image: string | undefined = undefined;
const attachmentFields = [
  'Produkt-Bild', // <-- Airtable column you asked for
  'Bilder',
  'Images',
  'Image',
  'Attachment',
  'Attachments'
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
    const description = f.Beschreibung || f.Beschreibung || f.Kurzbeschreibung || f['Kurz-Beschreibung'] || '';
    const shortDescription = f['Kurz-Beschreibung'] || f.Kurzbeschreibung || f.Kurzbeschreibung || '';

    // Material / condition (Beschaffenheit)
    const material = f.Beschaffenheit || f.Beschaffenheit || '';

    // SKU / Artikelnummer
    const sku = f.Artikelnummer || f['Artikelnummer'] || '';

    // Stock / Bestand
    const stock = typeof f.Bestand === 'number' ? f.Bestand : parseInt(String(f.Bestand || ''), 10) || 0;

    // Manufacturer / Hergestellt von
    // The products table uses the 'Hergestellt von' column which can be a
    // linked field (array of record ids) or free text. We normalize into
    // arrays for compatibility with multi-valued entries, and keep the first
    // value in `manufacturer`/`manufacturerId` for backwards compatibility.
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
      // Sometimes the field might contain a comma/semicolon separated list
      const parts = hv.split(/[;,\/\n]+/).map((s: string) => s.trim()).filter(Boolean);
      if (parts.length > 1) {
        for (const p of parts) manufacturers.push(p);
      } else {
        // single string value
        manufacturers.push(hv);
      }
    }

    if (manufacturers.length > 0) {
      manufacturer = manufacturers[0];
    }
    if (manufacturerIds.length > 0) {
      manufacturerId = manufacturerIds[0];
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
    // Fetch all pages from Airtable, requesting an explicit sort by the numeric
    // field that controls ordering in the base. The user added a "Reihenfolge"
    // column — we request sort by that field ascending. This guarantees the
    // returned array is in the desired order. We also append pages sequentially
    // so the overall order is preserved.
    const allRecords: AirtableRecord[] = [];
    let offset: string | undefined = undefined;

    // allow callers to override view via query param `?view=Featured` on the
    // request; fall back to env/default `AIRTABLE_PRODUCTS_VIEW` otherwise.
    const requestedView =
      // req.query is available in many serverless adapters
      (req && (req.query as any)?.view) ||
      // fall back to parsing the raw url if needed
      (typeof req?.url === 'string' && new URL(req.url, 'http://localhost').searchParams.get('view')) ||
      AIRTABLE_PRODUCTS_VIEW;

    do {
      const params = new URLSearchParams();
      params.append('pageSize', '100');
      // If a view name is provided via env, prefer the Airtable view order
      // (manual drag order or view-level sorting). Otherwise request an
      // explicit server-side sort by the numeric order field.
      if (requestedView) {
        params.append('view', requestedView);
      } else {
        params.append('sort[0][field]', AIRTABLE_ORDER_FIELD);
        params.append('sort[0][direction]', 'asc');
      }
      if (offset) params.append('offset', offset);

      const pageUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
        AIRTABLE_PRODUCTS_TABLE
      )}?${params.toString()}`;

      const r = await fetch(pageUrl, {
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
      allRecords.push(...records);
      offset = payload.offset;
    } while (offset);

    // Normalize the full list (normalize uses the array index as stable numeric id)
    // Fetch partners and persons tables to resolve linked manufacturer ids to names
    const partnerMap: Record<string, string> = {};
    try {
      let pOffset: string | undefined = undefined;
      do {
        const pUrl: string = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
          AIRTABLE_PARTNERS_TABLE
        )}?pageSize=100${pOffset ? `&offset=${pOffset}` : ''}`;
        const pr = await fetch(pUrl, {
          headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
        });
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
      // ignore partner fetch errors — normalize will fall back to ids
    }

    // Also try to load the Personen table (people) and merge into the same map
    try {
      let perOffset: string | undefined = undefined;
      do {
        const perUrl: string = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
          AIRTABLE_PERSONS_TABLE
        )}?pageSize=100${perOffset ? `&offset=${perOffset}` : ''}`;
        const pr = await fetch(perUrl, {
          headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
        });
        if (!pr.ok) break;
        const pPayload: any = await pr.json();
        const pRecords: AirtableRecord[] = pPayload.records || [];
        for (const rec of pRecords) {
          // Prefer common person name fields: Vorname + Nachname or Name
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
      // ignore person fetch errors
    }

    // Some product records may reference partner record ids that weren't present
    // in the partners list (or the partners table is large). Try to resolve any
    // missing partner ids by requesting the specific record endpoint for those ids.
    const missingIds = new Set<string>();
    for (const r of allRecords) {
      const f = r.fields || {};
      const candidates = [] as any[];
      if (Array.isArray(f['Hergestellt von'])) candidates.push(...f['Hergestellt von']);
      if (typeof f['Hergestellt von'] === 'string') candidates.push(f['Hergestellt von']);
      for (const c of candidates) {
        if (typeof c === 'string' && c.startsWith('rec') && !partnerMap[c]) missingIds.add(c);
      }
    }

    if (missingIds.size > 0) {
      try {
        for (const mid of Array.from(missingIds)) {
          try {
            const recUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
              AIRTABLE_PARTNERS_TABLE
            )}/${encodeURIComponent(mid)}`;
            const rr = await fetch(recUrl, {
              headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
            });
            if (!rr.ok) continue;
            const recPayload: any = await rr.json();
            const recFields = recPayload.fields || {};
            const name = recFields?.Name || recFields?.Titel || recFields?.name || '';
            partnerMap[mid] = String(name || mid);
          } catch (inner) {
            // ignore per-record errors
          }
        }
      } catch (e) {
        // ignore errors resolving missing ids
      }
    }

    // Support optional query parameters to control inclusion/filtering of
    // furniture ("Möbelstück"). By default furniture is excluded
    // (to match previous behaviour). Callers can request furniture with
    // `?includeFurniture=true` or request only a specific "Art des Produkts"
    // via `?only=Möbelstück`.
    const urlObj = typeof req?.url === 'string' ? new URL(req.url, 'http://localhost') : null;
    const onlyParam = (req && (req.query as any)?.only) || (urlObj && urlObj.searchParams.get('only')) || null;
    const includeFurnitureParam = (req && (req.query as any)?.includeFurniture) || (urlObj && urlObj.searchParams.get('includeFurniture')) || null;

    let visibleRecords = allRecords;

    // If `only` is specified, filter to only those records whose
    // "Art des Produkts" matches the given string (supports array/string).
    if (typeof onlyParam === 'string' && onlyParam.trim().length > 0) {
      const onlyVal = String(onlyParam).trim();
      visibleRecords = allRecords.filter((r) => {
        const f = r.fields || {};
        const art = f['Art des Produkts'];
        if (Array.isArray(art)) return art.map(String).some((s) => s.trim() === onlyVal);
        if (typeof art === 'string') return art.trim() === onlyVal;
        return false;
      });
    } else if (String(includeFurnitureParam).toLowerCase() === 'true') {
      // include all records — no filtering required
      visibleRecords = allRecords;
    } else {
      // Default behaviour: exclude Möbelstück records from the public API
      visibleRecords = allRecords.filter((r) => {
        const f = r.fields || {};
        const art = f['Art des Produkts'];
        if (Array.isArray(art)) {
          return !art.map(String).some((s) => s.trim() === 'Möbelstück');
        }
        if (typeof art === 'string') return art.trim() !== 'Möbelstück';
        return true;
      });
    }

    const products = normalize(visibleRecords, partnerMap);

    // Cache for a short time on the edge
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ products });
  } catch (err: any) {
    console.error('Airtable proxy error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error', details: err?.message || String(err) });
  }
}
