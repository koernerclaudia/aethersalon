import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import EventList from '../components/EventList';
import { sampleEvents } from '../data/sampleData';

type EventItem = {
  id: number;
  title: string;
  date: string;
  location: string;
  raw?: any;
};

const Events: React.FC = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const [events, setEvents] = useState<EventItem[]>(sampleEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        if (payload?.events && Array.isArray(payload.events) && payload.events.length > 0) {
          if (!mounted) return;
          setEvents(payload.events);
        }
      } catch (err: any) {
        console.warn('Failed to fetch /api/events, using sample data:', err?.message || err);
        if (!mounted) return;
        setError('Remote events could not be loaded — showing sample data.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // try to derive a Date object for an event; prefers raw.Datum (ISO) but falls back to
  // parsing the formatted `date` string (supports German month names used in sample data)
  function parseEventDate(e: EventItem): Date | null {
    const raw = (e as any).raw || {};
    const maybe = raw.Datum || raw.datum || raw.Date || raw.date || e.date || '';
    if (!maybe) return null;

    // First, try native parsing (ISO or similar)
    const d1 = new Date(maybe);
    if (!Number.isNaN(d1.getTime())) return d1;

    // Fallback: try to parse German localized format like '15. März 2025'
    const monthMap: Record<string, number> = {
      Januar: 0, Februar: 1, März: 2, Maerz: 2, April: 3, Mai: 4, Juni: 5, Juli: 6, August: 7, September: 8, Oktober: 9, November: 10, Dezember: 11,
      Mär:2, Mrz:2
    };
    const m = String(maybe).trim();
    // match patterns like '15. März 2025' or '15 März 2025'
    const re = /^(\d{1,2})\.??\s+([A-Za-zäöüÄÖÜß]+)\s+(\d{4})$/;
    const match = m.match(re);
    if (match) {
      const day = parseInt(match[1], 10);
      const monthName = match[2];
      const year = parseInt(match[3], 10);
      const monthIndex = monthMap[monthName] ?? monthMap[monthName.replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u')] ;
      if (typeof monthIndex === 'number') {
        return new Date(year, monthIndex, day);
      }
    }

    return null;
  }

  const today = new Date();
  // normalize today's time to start of day for comparisons
  today.setHours(0,0,0,0);

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    const d = parseEventDate(e);
    if (!d) return filter === 'upcoming'; // unknown dates treated as upcoming
    // normalize
    d.setHours(0,0,0,0);
    if (filter === 'upcoming') return d >= today;
    return d < today;
  });

  return (
    <div className="min-h-screen pt-24 px-8 pb-20">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-dark-text dark:text-dark-text mb-6">
            Veranstaltungen
          </h1>
          <p className="text-lg text-dark-text/80 dark:text-dark-text/80 max-w-2xl mx-auto">
            Besuchen Sie uns auf diesen Events und tauchen Sie ein in die faszinierende Welt
            des Steampunk. Wir freuen uns auf Ihr Kommen!
          </p>
        </motion.div>

        {/* Victorian Divider */}
        <div className="victorian-divider my-12" />

        {/* Status */}
        {loading && (
          <div className="text-center mb-6 text-sm text-dark-text/70">Lade Veranstaltungen…</div>
        )}
        {error && (
          <div className="text-center mb-6 text-sm text-red-500">{error}</div>
        )}

        {/* Filter controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-brass text-dark-bg font-semibold' : 'border border-brass/20'}`}
          >
            Alle
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded ${filter === 'upcoming' ? 'bg-brass text-dark-bg font-semibold' : 'border border-brass/20'}`}
          >
            Kommende
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded ${filter === 'past' ? 'bg-brass text-dark-bg font-semibold' : 'border border-brass/20'}`}
          >
            Vergangene
          </button>
        </div>

        {/* Events List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <EventList events={filteredEvents} showAll={true} />
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="max-w-3xl mx-auto p-8 border border-brass/30 rounded-lg bg-dark-bg/50 dark:bg-dark-bg/50">
            <h2 className="text-2xl font-heading font-semibold text-brass mb-4">
              Möchten Sie uns auf einem Event treffen?
            </h2>
            <p className="text-dark-text dark:text-dark-text mb-6">
              Kontaktieren Sie uns für weitere Informationen zu den Veranstaltungen.
              Wir freuen uns darauf, Sie persönlich kennenzulernen!
            </p>
            <a
              href="mailto:info@aethersalon1889.de?subject=Event-Anfrage"
              className="inline-block px-8 py-3 bg-brass text-dark-bg font-semibold rounded hover:bg-brass/90 transition-colors"
            >
              Kontakt aufnehmen
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Events;
