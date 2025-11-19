import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import bgUrl from '../assets/werkstatt.webp';
import Lightbox from '../components/Lightbox';
import d3druck from '../assets/3D-Druck.webp';
import schweißplatz from '../assets/Schweißplatz.webp';
import werkstattImg from '../assets/Werkstatt2.webp';
import makerspace from '../assets/makerspace.webp';

// Use module imports for local assets so Vite bundles them correctly.
const gallery = [
  d3druck,
  schweißplatz,
  schweißplatz,
  d3druck,
];

const werkstatt = [
  {
    name: 'Aethersalon - 1889 Werkstatt',
    role: 'Unser Ort der Magie',
    bio: '...',
    image: werkstattImg,
  },
  {
    name: 'Makerspace',
    role: 'Events & Kommunikation',
    bio: ' Ein Raum, sich mit Gleichgesinnten kreativ zu verwirklichen. Gemeinschaftliche Nutzung von Ressourcen zur Holz-/Metall- und Kunststoff-Bearbeitung. Zu sogenannten Makerdays verwandelt sich die Werkstatt zu einen universalen Kreativzentrum,wo die Teilnehmer das zur Verfügung stehende Equipment für die Umsetzung ihrer Ideen nutzenKönnen und sich gegenseitig mit Rat und Tat zur Seite stehen.',
    image: makerspace,
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
      title: 'Lackierraum',
      text: '...',
    },
    {
      image: gallery[1],
      title: 'Elektronikplatz',
      text: '...',
    },
    {
      image: gallery[2],
      title: 'Schweißplatz',
      text: '...',
    },
    {
      image: gallery[3],
      title: '3D Drucker Ecke',
      text: '...',
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
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
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
            In unserer Werkstatt werden mechanische Objekte von Hand gefertigt.<br></br> Sie bietet Raum, sich mit Gleichgesinnten kreativ zu verwirklichen.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 mt-12 space-y-16">
        {werkstatt.map((m, i) => (
          <div
            key={m.name}
            className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="md:w-1/2">
              <img src={m.image} alt={m.name} className="w-full h-64 object-cover rounded-lg shadow-md" />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl font-heading font-semibold text-theme mb-2">{m.name}</h3>
              <div className="text-sm text-brass mb-3">{m.role}</div>
              <p className="text-theme-80 leading-relaxed">{m.bio}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Highlights: three-card section */}
      <section className="mx-auto max-w-5xl px-4 mt-12">
        <h2 className="text-3xl font-heading font-bold text-theme mb-6">Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((c) => (
            <div key={c.title} className="rounded-lg border border-brass/30 bg-theme-50 overflow-hidden">
              <div className="relative w-full aspect-[4/3]">
                <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-theme mb-2">{c.title}</h3>
                <p className="text-theme-80">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-5xl px-4 mt-12">
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
      <section className="mx-auto max-w-5xl px-4 mt-12">
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
      <section className="mx-auto max-w-5xl px-4 mt-12">
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
