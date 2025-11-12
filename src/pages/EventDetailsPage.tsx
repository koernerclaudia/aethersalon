import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sampleEvents } from '../data/sampleData';

type EventItem = {
  id: number | string;
  title: string;
  date: string;
  location: string;
  raw?: any;
  description?: string;
};

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // try single-event endpoint first for efficiency
        let payload: any = null;
        if (!Number.isNaN(Number(id))) {
          const res = await fetch(`/api/events/${id}`);
          if (res.ok) {
            payload = await res.json();
            if (payload?.event) {
              if (mounted) setEvent(payload.event as EventItem);
              return;
            }
          }
        }

        // fallback: fetch all and find
        const resAll = await fetch('/api/events');
        if (!resAll.ok) throw new Error(`HTTP ${resAll.status}`);
        const all = await resAll.json();
        const items: EventItem[] = all?.events || [];
        const found = items.find((e) => String(e.id) === String(id));
        if (mounted) setEvent(found || null);
      } catch (err: any) {
        // fallback to sample data
        const found = sampleEvents.find((e) => String(e.id) === String(id));
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

  return (
    <div className="min-h-screen pt-24 px-8 pb-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link to="/events" className="text-sm text-brass hover:underline">← Zurück zu Veranstaltungen</Link>
        </div>

        <div className="rounded-lg overflow-hidden border border-brass/30 p-6 bg-theme-50">
          <h1 className="text-4xl font-heading font-bold text-theme mb-2">{event.title}</h1>
          <div className="text-sm text-brass mb-4">{event.date}</div>
          <div className="mb-4 text-theme-80">{event.location}</div>
          {event.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Beschreibung</h2>
              <p className="text-theme-80">{event.description}</p>
            </div>
          )}

          <div>
            <a href={`mailto:info@aethersalon1889.de?subject=Anfrage zu ${encodeURIComponent(event.title)}`} className="inline-block px-6 py-3 bg-brass text-dark-bg font-semibold rounded-full hover:bg-brass/90">Kontakt aufnehmen</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
