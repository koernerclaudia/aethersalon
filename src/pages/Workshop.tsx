import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import bgUrl from '../assets/werkstatt.webp';
import Lightbox from '../components/Lightbox';

const gallery = [
  'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1527252009472-3c5a5f7b2d0b?w=1200&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1200&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532634896-26909d0d1d9a?w=1200&q=60&auto=format&fit=crop',
];

const werkstatt = [
  {
    name: 'Location',
    role: 'Werkstattleiter',
    bio: 'Verantwortlich für Konstruktion, Metallbearbeitung und Mechanik. Er bringt Ideen zum Ticken.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=60&auto=format&fit=crop',
  },
  {
    name: 'Makerspace',
    role: 'Events & Kommunikation',
    bio: ' "Ein Raum, sich mit Gleichgesinnten kreativ zu verwirklichen. " Gemeinschaftliche Nutzung von Ressourcen zur Holz-/Metall- und Kunststoff-Bearbeitung. Zu sogenannten Makerdays verwandelt sich die Werkstatt zu einen universalen Kreativzentrum,wo die Teilnehmer das zur Verfügung stehende Equipment für die Umsetzung ihrer Ideen nutzenKönnen und sich gegenseitig mit Rat und Tat zur Seite stehen.',
    image: 'https://images.unsplash.com/photo-1545996124-1b8a8f2e2f7f?w=800&q=60&auto=format&fit=crop',
  },
  {
    name: 'Veranstaltungen',
    role: 'Events & Kommunikation',
    bio: 'Organisiert Auftritte, Märkte und Kooperationen — Ihre Anlaufstelle für Event-Anfragen.',
    image: 'https://images.unsplash.com/photo-1545996124-1b8a8f2e2f7f?w=800&q=60&auto=format&fit=crop',
  },
];

const Workshop: React.FC = () => {
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const cards = [
    {
      image: gallery[0],
      title: 'Maßgeschneiderte Anfertigungen',
      text: 'Individuelle Entwürfe und Kleinserien – von der Idee bis zum fertigen Objekt begleiten wir Sie durch den ganzen Prozess.',
    },
    {
      image: gallery[1],
      title: 'Restaurierung & Pflege',
      text: 'Sorgfältige Überholung historischer Stücke sowie Wartung mechanischer Teile durch erfahrene Handwerker.',
    },
    {
      image: gallery[2],
      title: 'Workshops & Einführung',
      text: 'Praktische Kurse für Einsteiger und Fortgeschrittene: Löten, Ziselieren und mechanische Grundlagen.',
    },
  ];
  return (
    <div className="min-h-screen px-4 pb-20">
      {/* Hero */}
      <section className="relative h-[56vh] md:h-[48vh] flex items-center">
        <div
          className="absolute left-1/2 top-0 w-screen -translate-x-1/2 h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgUrl})`, filter: 'brightness(0.45)' }}
          aria-hidden
        />
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-heading font-bold text-theme mb-4"
          >
            Werkstatt & Makerspace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-theme-80 max-w-3xl mx-auto"
          >
            In unserer Werkstatt werden mechanische Objekte von Hand gefertigt — Reparatur,
            Restauration und individuelle Anfertigungen nach Kundenwunsch.
          </motion.p>
        </div>
      </section>

      {/* Highlights: three-card section */}
      <section className="container mx-auto max-w-5xl mt-12">
        <h2 className="text-3xl font-heading font-bold text-theme mb-6">Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.title} className="p-6 rounded-lg border border-brass/30 bg-theme-50">
              <img src={c.image} alt={c.title} className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-semibold text-theme mb-2">{c.title}</h3>
              <p className="text-theme-80">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-5xl mt-12 space-y-16">
        {werkstatt.map((m, i) => (
          <div
            key={m.name}
            className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="md:w-1/2">
              <img src={m.image} alt={m.name} className="w-full h-64 object-cover rounded-lg shadow-md" />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-heading font-semibold text-theme mb-2">{m.name}</h3>
              <div className="text-sm text-brass mb-3">{m.role}</div>
              <p className="text-theme-80 leading-relaxed">{m.bio}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Services */}
      <section className="container mx-auto max-w-5xl mt-12">
        <h2 className="text-3xl font-heading font-bold text-theme mb-6">Was wir anbieten</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-brass/30 bg-theme-50">
            <h3 className="text-xl font-semibold text-theme mb-2">Maßanfertigungen</h3>
            <p className="text-theme-80">Einzelstücke und Serien nach Entwurf — Metall, Leder und Glas.</p>
          </div>
          <div className="p-6 rounded-lg border border-brass/30 bg-theme-50">
            <h3 className="text-xl font-semibold text-theme mb-2">Reparatur & Service</h3>
            <p className="text-theme-80">Überholung mechanischer Uhren, Zylinderwerke und dekorativer Technik.</p>
          </div>
          <div className="p-6 rounded-lg border border-brass/30 bg-theme-50">
            <h3 className="text-xl font-semibold text-theme mb-2">Workshops</h3>
            <p className="text-theme-80">Hands-on Sessions: Löten, Ziselieren und kleine Mechanik-Projekte.</p>
          </div>
        </div>
      </section>

      {/* Mosaic gallery (column-based masonry: equal column widths, natural photo heights) */}
      <section className="container mx-auto max-w-5xl mt-12">
        <h2 className="text-3xl font-heading font-bold text-theme mb-6">Werkstatt Einblicke</h2>
        <div className="columns-3" style={{ columnGap: '1.25rem' }}>
          {gallery.map((src, i) => (
            <div
              key={src}
              className="mb-5 overflow-hidden rounded-lg cursor-pointer"
              style={{ breakInside: 'avoid' }}
              onClick={() => {
                /* open lightbox */
                // handled below via state
              }}
            >
              {/* the image itself will be clickable via the button wrapper below */}
              <button
                type="button"
                aria-label={`Open image ${i + 1}`}
                onClick={() => setLightbox({ open: true, index: i })}
                className="w-full text-left"
              >
                <img src={src} alt={`Werkstatt ${i + 1}`} className="w-full h-auto rounded-lg object-cover" />
              </button>
            </div>
          ))}
        </div>
        {lightbox.open && (
          <Lightbox
            images={gallery}
            startIndex={lightbox.index}
            onClose={() => setLightbox({ open: false, index: 0 })}
          />
        )}
      </section>

      {/* Quick links */}
      <section className="container mx-auto max-w-5xl mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/events" className="block p-6 rounded-lg border border-brass/30 bg-theme-50 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-theme mb-2">Kommende Workshops</h3>
            <p className="text-theme-80">Termine und Anmeldung zu unseren praktischen Kursen.</p>
          </Link>
          <Link to="/contact" className="block p-6 rounded-lg border border-brass/30 bg-theme-50 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-theme mb-2">Anfragen & Aufträge</h3>
            <p className="text-theme-80">Kontaktieren Sie uns für Sonderanfertigungen oder Reparaturen.</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Workshop;
