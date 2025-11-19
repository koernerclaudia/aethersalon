import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import EventList from '../components/EventList';
import { sampleEvents, samplePastEvents } from '../data/sampleData';
// no react-router Link needed here
import ImageCarousel from '../components/ImageCarousel';
import sp1 from '../assets/steampunk-1.jpg';
import sp2 from '../assets/steampunk-2.avif';
import sp3 from '../assets/steampunk-3.jpg';

type EventItem = {
  id: number;
  title: string;
  date: string;
  location: string;
  description?: string;
  longText?: string;
  photos?: string[];
  raw?: any;
};

const Events: React.FC = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const [events, setEvents] = useState<EventItem[]>(sampleEvents);
  const [displayedUpcomingState, setDisplayedUpcomingState] = useState<EventItem[]>(
    // match Home: show up to 3 upcoming events by default
    sampleEvents.slice(0, 3)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // filters temporarily removed — show upcoming events from today onwards

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

          // Compute upcoming events the same way Home does: prefer 'von' and include only today or later, then take up to 3
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          function homeParseEventDate(e: any): Date | null {
            const raw = e.raw || {};

            const find = (cands: string[]) => {
              for (const c of cands) {
                const v = raw[c];
                if (v !== undefined && v !== null) return v;
              }
              return undefined;
            };

            let maybe = find(['von', 'Von', 'from', 'From', 'start', 'Start']);
            if (maybe === undefined) maybe = find(['Datum', 'datum', 'Date', 'date']);
            if (!maybe) maybe = e.date || '';
            if (Array.isArray(maybe) && maybe.length > 0) maybe = maybe[0];
            if (!maybe) return null;
            const d = new Date(maybe);
            if (!Number.isNaN(d.getTime())) return d;
            return null;
          }

          const upcoming = payload.events
            .filter((ev: any) => {
              const d = homeParseEventDate(ev);
              if (!d) return false;
              d.setHours(0, 0, 0, 0);
              return d >= today;
            })
            .sort((a: any, b: any) => {
              const da = homeParseEventDate(a);
              const db = homeParseEventDate(b);
              if (!da && !db) return 0;
              if (!da) return 1;
              if (!db) return -1;
              return da.getTime() - db.getTime();
            })
            .slice(0, 3);

          setDisplayedUpcomingState(upcoming);
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

  // try to derive a Date object for an event; prefer 'von' (start) field when available,
  // then fall back to raw.Datum / date fields and parsing localized German month names.
  function parseEventDate(e: EventItem): Date | null {
    // Try top-level fields first (some normalized events put 'von' directly)
    const top = (e as any) || {};
    const raw = (e as any).raw || {};

    const find = (cands: string[]) => {
      for (const c of cands) {
        if (top[c] !== undefined && top[c] !== null) return top[c];
        if (raw[c] !== undefined && raw[c] !== null) return raw[c];
      }
      return undefined;
    };

    // Prefer explicit 'von'/'from' start date
    let maybe = find(['von', 'Von', 'from', 'From', 'start', 'Start']);
    if (maybe === undefined) maybe = find(['Datum', 'datum', 'Date', 'date']);
    if (!maybe) maybe = (top.date || top.Datum || top.datum || '') as any;

    if (Array.isArray(maybe) && maybe.length > 0) maybe = maybe[0];
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
    const re = /^(\d{1,2})\.?\s+([A-Za-zäöüÄÖÜß]+)\s+(\d{4})$/;
    const match = m.match(re);
    if (match) {
      const day = parseInt(match[1], 10);
      const monthName = match[2];
      const year = parseInt(match[3], 10);
      const monthIndex = monthMap[monthName] ?? monthMap[monthName.replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u')];
      if (typeof monthIndex === 'number') {
        return new Date(year, monthIndex, day);
      }
    }

    return null;
  }

  const today = new Date();
  // normalize today's time to start of day for comparisons
  today.setHours(0,0,0,0);

  // For now, don't pre-filter by control buttons — keep the full events list here.
  const filteredEvents = events;

  // sort ascending (earliest first). Events without parseable dates go to the end.
  const sortedEvents = filteredEvents.slice().sort((a, b) => {
    const da = parseEventDate(a);
    const db = parseEventDate(b);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return da.getTime() - db.getTime();
  });

  // Build upcoming events list (only events with a parseable start date >= today)
  const upcomingEventsList = events
    .filter((e) => {
      const d = parseEventDate(e);
      if (!d) return false;
      d.setHours(0, 0, 0, 0);
      const t = new Date();
      t.setHours(0, 0, 0, 0);
      return d >= t;
    })
    .sort((a, b) => {
      const da = parseEventDate(a)!;
      const db = parseEventDate(b)!;
      return da.getTime() - db.getTime();
    });

  // Debugging: log event counts so we can see why nothing shows up locally
  // (Left in temporarily to help trace data-shape issues.)
  // eslint-disable-next-line no-console
  console.debug('[Events page] events.length=', events.length, 'upcomingEventsList.length=', upcomingEventsList.length, 'displayedUpcoming.length=', displayedUpcomingState.length);

  return (
    <div className="min-h-screen pt-24 px-4 pb-20 relative">
      {/* Full-bleed background carousel mounted behind the page content */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[56vh] md:h-[48vh]"
        style={{
          marginLeft: '-50vw',
          width: '100vw',
          zIndex: 0,
        }}
      >
        <ImageCarousel
          images={[sp1, sp2, sp3]}
          heightClass="h-full"
          showDots={false}
          showControls={false}
          noRound={true}
          ariaHidden={true}
          overlayClassName="bg-black/50"
        />
      </div>

      <div className="container mx-auto max-w-5xl px-4 relative z-10 py-20">
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
          <p className="text-lg text-dark-text dark:text-dark-text max-w-2xl mx-auto">
            Besuchen Sie uns auf diesen Events und tauchen Sie ein in die faszinierende Welt
            des Steampunk. Wir freuen uns auf Ihr Kommen!
          </p>
        </motion.div>
</div>
<div className="mx-auto max-w-5xl px-4">
        {/* Status */}
        {loading && (
          <div className="text-center mb-6 text-sm text-dark-text/70">Lade Veranstaltungen…</div>
        )}
        {error && (
          <div className="text-center mb-6 text-sm text-red-500">{error}</div>
        )}

        {/* Filter controls removed temporarily — showing upcoming events from today onwards */}

        {/* Upcoming Events (compact, no photos) */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.2 }} className="mb-20">
          <h2 className="text-2xl font-heading font-semibold text-dark-text mb-4">Kommende Veranstaltungen</h2>
          <EventList events={displayedUpcomingState} showAll={true} />
        </motion.div>

        {/* Past Events (list view) */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-heading font-semibold text-dark-text mb-6">Vergangene Veranstaltungen</h2>
          {/* Past events: those with a parseable date strictly before today */}
          <EventList
            events={
              // use sortedEvents (already ascending) and pick those strictly before today
              (sortedEvents.filter((e) => {
                const d = parseEventDate(e);
                if (!d) return false;
                d.setHours(0, 0, 0, 0);
                return d < today;
              }).length > 0
                ? sortedEvents.filter((e) => {
                    const d = parseEventDate(e);
                    if (!d) return false;
                    d.setHours(0, 0, 0, 0);
                    return d < today;
                  })
                : samplePastEvents)
            }
            showAll={true}
          />
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
              href="mailto:info@aethersalon1889.de?subject=Event-Anfrage" target='_blank'
              className="btn bg-brass text-dark-bg hover:bg-brass/90"
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
