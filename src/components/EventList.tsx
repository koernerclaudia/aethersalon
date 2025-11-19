import React from 'react';
import Button from './Button';
import { motion } from 'framer-motion';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  // keep raw for optional fields like Google Maps Link
  raw?: any;
}

interface EventListProps {
  events: Event[];
  showAll?: boolean;
}

const EventList: React.FC<EventListProps> = ({ events, showAll = false }) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="space-y-6"
      >
        {events.map((event) => (
          <motion.div
            key={event.id}
            variants={fadeInUp}
            className="mx-auto max-w-5xl px-4 p-6 border border-brass/30 rounded-lg hover:border-brass transition-all duration-300 bg-dark-bg/10 dark:bg-dark-bg/10"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-heading font-semibold text-dark-text dark:text-dark-text mb-2">
                  {event.title}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-dark-text dark:text-dark-text">
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-brass"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {(() => {
                      // Prefer explicit 'von'/'bis' fields from Airtable raw fields when present.
                      const raw = (event as any).raw || {};

                      const find = (cands: string[]) => {
                        for (const c of cands) {
                          if (raw[c]) return raw[c];
                        }
                        return undefined;
                      };

                      const fromVal = find(['von', 'Von', 'from', 'From', 'start', 'Start']);
                      const toVal = find(['bis', 'Bis', 'to', 'To', 'end', 'Ende']);

                      const formatVal = (v: any) => {
                        if (!v) return null;
                        let s = v;
                        if (Array.isArray(v) && v.length > 0) s = v[0];
                        if (typeof s !== 'string') return String(s);
                        const d = new Date(s);
                        if (!Number.isNaN(d.getTime())) {
                          try {
                            return new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
                          } catch (_e) {
                            return s;
                          }
                        }
                        return s;
                      };

                      const fromStr = formatVal(fromVal);
                      const toStr = formatVal(toVal);

                      if (fromStr && toStr) {
                        // if identical dates, show single
                        if (fromStr === toStr) return fromStr;
                        return `${fromStr} — ${toStr}`;
                      }

                      if (fromStr) return fromStr;
                      if (toStr) return `bis ${toStr}`;

                      return event.date || '';
                    })()}
                  </span>
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-brass"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {/* If the normalized event includes a raw field with a Google Maps link, use it */}
                    {(() => {
                      const raw = (event as any).raw || {};
                      // common Airtable field names for a maps link
                      const possibleKeys = ['Google Maps Link', 'Google Maps', 'Maps', 'Maps Link', 'Link zu Google Maps', 'Ort Link'];
                      let mapLink: string | undefined;
                      for (const k of possibleKeys) {
                        const v = raw[k];
                        if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'string') {
                          mapLink = v[0];
                          break;
                        }
                        if (typeof v === 'string' && v.includes('http')) {
                          mapLink = v;
                          break;
                        }
                      }

                      if (mapLink) {
                        return (
                          <a
                            href={mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-brass"
                          >
                            {event.location}
                          </a>
                        );
                      }

                      return event.location;
                    })()}
                  </span>
                </div>
              </div>
              <Button
                to={`/events/${(event as any).rawId || event.id}`}
                
                className="mt-4 md:mt-0 bg-brass text-dark-bg hover:bg-brass/90 transition-colors"
              >
                Mehr erfahren
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {!showAll && (
        <div className="text-center mt-12">
          <Button
            to="/events"
            className="border-2 border-brass text-dark-text dark:text-dark-text hover:bg-brass/10 transition-colors"
          >
            Alle Veranstaltungen
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventList;
