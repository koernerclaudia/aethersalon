import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import bgUrl from '../assets/sunset.webp';

const team = [
  {
    name: 'Holger Keil',
    role: 'Hausherr & Werkstattleiter',
    bio: "... alias Holgi Infinitus Steam - Erfinder, Tüftler & Makerkreativer Holzhandwerker - auf der Suche nach der Symbiose von Steampunk & Wohnen",
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=60&auto=format&fit=crop',
  },
  {
    name: 'Sophie Müller',
    role: 'Events & Kommunikation',
    bio: 'Organisiert Auftritte, Märkte und Kooperationen — Ihre Anlaufstelle für Event-Anfragen.',
    image:
      'https://images.unsplash.com/photo-1545996124-1b8a8f2e2f7f?w=800&q=60&auto=format&fit=crop',
  },
];

const History: React.FC = () => {
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
            Was ist Steampunk?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-theme-80 max-w-3xl mx-auto"
          >
            Geschichten, Inspirationen und die Welt hinter unserem Stil.
          </motion.p>
        </div>
      </section>

      {/* Content (copied from About layout) */}
      <section className="container mx-auto max-w-5xl mt-12 space-y-16">
        {team.map((m, i) => (
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

      <section className="container mx-auto max-w-5xl mt-20">
        <h2 className="text-3xl font-heading font-bold text-theme mb-6">Partner & Unterstützer</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {['Partner 1', 'Partner 2', 'Partner 3', 'Partner 4', 'Partner 5', 'Partner 6'].map((p) => (
            <div key={p} className="flex items-center justify-center p-4 border border-brass/30 rounded-lg bg-theme-50">
              <span className="text-theme font-heading text-sm">{p}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-5xl mt-20">
        <h2 className="text-3xl font-heading font-bold text-theme mb-6">Schnellzugriff</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/events" className="block p-6 rounded-lg border border-brass/30 bg-theme-50 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-theme mb-2">Veranstaltungen</h3>
            <p className="text-theme-80">Unsere kommenden Auftritte, Märkte und Workshops.</p>
          </Link>
          <Link to="/products" className="block p-6 rounded-lg border border-brass/30 bg-theme-50 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-theme mb-2">Produkte</h3>
            <p className="text-theme-80">Handgefertigte Objekte, Schmuck und Wohnaccessoires.</p>
          </Link>
          <Link to="/about" className="block p-6 rounded-lg border border-brass/30 bg-theme-50 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-theme mb-2">Über uns</h3>
            <p className="text-theme-80">Lernen Sie das Team kennen und wo Sie uns live erleben können.</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default History;
