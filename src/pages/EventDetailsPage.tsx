import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Lightbox from '../components/Lightbox';
import { sampleEvents } from '../data/sampleData';

type EventItem = {
  id: number | string;
  title: string;
  date: string;
  location: string;
  locationRaw?: string;
  raw?: any;
  description?: string;
  mainImage?: string;
  images?: string[];
  von?: string;
  bis?: string;
  organizer?: string;
  organizerWebsite?: string;
};

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Try single-event endpoint first for any id (numeric or Airtable record id)
        let payload: any = null;
        if (id) {
          try {
            const res = await fetch(`/api/events/${id}`);
            if (res.ok) {
              payload = await res.json();
              if (payload?.event) {
                if (mounted) setEvent(payload.event as EventItem);
                return;
              }
            }
          } catch (e) {
            // ignore and fall back to listing
          }
        }

        // fallback: fetch all and find by normalized id or raw Airtable id
        const resAll = await fetch('/api/events');
        if (!resAll.ok) throw new Error(`HTTP ${resAll.status}`);
        const all = await resAll.json();
        const items: EventItem[] = all?.events || [];
        const found = items.find((e) => String(e.id) === String(id) || String((e as any).rawId) === String(id));
        if (mounted) setEvent(found || null);
      } catch (err: any) {
        // fallback to sample data
        const found = sampleEvents.find((e) => String(e.id) === String(id) || String((e as any).rawId) === String(id));
        if (found) setEvent(found as EventItem);
        else setError('Veranstaltung konnte nicht geladen werden.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className="min-h-screen pt-24 px-8"><div className="mx-auto max-w-5xl">Lade Veranstaltung…</div></div>;
  if (error) return <div className="min-h-screen pt-24 px-8"><div className="mx-auto max-w-5xl text-red-500">{error}</div></div>;
  if (!event) return <div className="min-h-screen pt-24 px-8"><div className="mx-auto max-w-5xl">Veranstaltung nicht gefunden.</div></div>;
  // Prefer using raw Airtable fields when available (match ProductDetails approach)
  const rawFields: any = (event as any)?.raw?.fields || (event as any)?.raw || {};

  const extractAttachments = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) {
      return field.map((a: any) => a && (a.url || a.thumbnails?.large?.url || a.filename)).filter(Boolean);
    }
    return [];
  };

  const mainFromRaw = extractAttachments(rawFields['HauptBild'] || rawFields['Hauptbild']);
  const bilderFromRaw = extractAttachments(rawFields['Bilder'] || rawFields['Fotos'] || rawFields['Bildergalerie'] || rawFields['FotosGallerie']);

  const mainImage = event.mainImage || (mainFromRaw.length > 0 ? mainFromRaw[0] : (bilderFromRaw.length > 0 ? bilderFromRaw[0] : ''));
  const images = (event.images && event.images.length > 0) ? event.images : Array.from(new Set([...(mainImage ? [mainImage] : []), ...bilderFromRaw]));

  const organizer = event.organizer || rawFields['Veranstalter'] || rawFields['Organisator'] || '';
  const organizerWebsite = event.organizerWebsite || rawFields['Veranstalter-Website'] || rawFields['Veranstalter Website'] || rawFields['OrganizerWebsite'] || '';

  const vonRaw = rawFields['Von'] || rawFields['von'] || rawFields['Start'] || rawFields['start'] || event.von || '';
  const bisRaw = rawFields['Bis'] || rawFields['bis'] || rawFields['Ende'] || rawFields['end'] || event.bis || '';

  const formatMaybe = (v: any) => {
    if (!v) return '';
    const val = Array.isArray(v) && v.length > 0 ? v[0] : v;
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

  const von = formatMaybe(vonRaw);
  const bis = formatMaybe(bisRaw);

  const descriptionHtml = rawFields['Beschreibung'] || rawFields['Beschreibung/HTML'] || rawFields['Description'] || event.description || '';

  return (
    <div className="min-h-screen pt-24 px-8 pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link to="/events" className="text-sm text-brass hover:underline">← Zurück zu Veranstaltungen</Link>
        </div>

        <div className="rounded-lg overflow-hidden border border-brass/30 p-6 bg-theme-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: main photo */}
            <div>
              {mainImage ? (
                <img src={mainImage} alt={event.title} className="w-full h-[420px] object-cover rounded-md" />
              ) : (
                <div className="w-full h-[420px] bg-dark-bg/10 rounded-md flex items-center justify-center">Kein Bild verfügbar</div>
              )}
            </div>

            {/* Right: title + metadata + large description */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-heading font-bold text-theme mb-2">{event.title}</h1>
              <div className="text-sm text-brass mb-4">{event.date}</div>

              {/* Metadata block: organizer, date range, location (moved to right column) */}
              <div className="mb-6 text-theme-80 space-y-2">
                {organizer && (
                  <div>
                    <strong>Veranstalter:</strong>{' '}
                    {organizerWebsite ? (
                      <a href={(organizerWebsite.startsWith('http') ? organizerWebsite : `https://${organizerWebsite}`)} target="_blank" rel="noopener noreferrer" className="text-brass hover:underline">{organizer}</a>
                    ) : (
                      <span>{organizer}</span>
                    )}
                  </div>
                )}

                {(von || bis) && (
                  <div>
                    <strong>Datum:</strong> {von}{bis ? ` — ${bis}` : ''}
                  </div>
                )}

                {(rawFields['Ort'] || rawFields['Location'] || event.location || event.locationRaw) && (
                  <div>
                    <strong>Ort:</strong>{' '}
                    <a
                      href={(rawFields && (rawFields['OrtLink'] || rawFields['LocationLink'] || rawFields['Google Maps'] || rawFields['MapsLink'])) || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawFields['Ort'] || event.locationRaw || event.location || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brass hover:underline"
                    >
                      {rawFields['Ort'] || event.location || event.locationRaw}
                    </a>
                  </div>
                )}

              <div className="prose prose-lg text-theme-80 mt-4">
                <h2 className="text-xl font-semibold mb-2">Beschreibung</h2>
                <div dangerouslySetInnerHTML={{ __html: String(descriptionHtml || '') }} />
              </div>
              </div>
            </div>
          </div>

          {/* Bilder: mosaic 3 columns */}
          {images && images.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-heading font-semibold mb-4">Bilder</h3>
              <div className="columns-4 gap-4">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightbox({ open: true, index: i })}
                    className="mb-4 w-full break-inside-avoid rounded-md overflow-hidden focus:outline-none"
                    aria-label={`Öffne Bild ${i + 1}`}
                  >
                    <img src={src} alt={`${event.title} Bild ${i + 1}`} className="w-full object-cover rounded-md" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {lightbox.open && (
            <Lightbox images={images} startIndex={lightbox.index} onClose={() => setLightbox({ open: false, index: 0 })} />
          )}

          <div className="mt-8">
            <a href={`mailto:info@aethersalon1889.de?subject=Anfrage zu ${encodeURIComponent(event.title)}`} className="inline-block px-6 py-3 bg-brass text-dark-bg font-semibold rounded-full hover:bg-brass/90">Kontakt aufnehmen</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
