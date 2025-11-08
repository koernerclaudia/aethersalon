import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
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
        className="max-w-3xl mx-auto space-y-6"
      >
        {events.map((event) => (
          <motion.div
            key={event.id}
            variants={fadeInUp}
            className="p-6 border border-brass/30 rounded-lg hover:border-brass transition-all duration-300 bg-dark-bg/50 dark:bg-dark-bg/50"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-heading font-semibold text-dark-text dark:text-dark-text mb-2">
                  {event.title}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-dark-text/80 dark:text-dark-text/80">
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
                    {event.date}
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
                    {event.location}
                  </span>
                </div>
              </div>
              {!showAll && (
                <Link
                  to={`/events/${event.id}`}
                  className="mt-4 md:mt-0 inline-block px-4 py-2 bg-brass text-dark-bg font-semibold rounded hover:bg-brass/90 transition-colors"
                >
                  Mehr erfahren
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {!showAll && (
        <div className="text-center mt-12">
          <Link
            to="/events"
            className="inline-block px-8 py-3 border-2 border-brass text-dark-text dark:text-dark-text font-semibold rounded hover:bg-brass/10 transition-colors"
          >
            Alle Veranstaltungen
          </Link>
        </div>
      )}
    </div>
  );
};

export default EventList;
