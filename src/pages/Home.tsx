import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import EventList from '../components/EventList';
import Button from '../components/Button';
import { sampleEvents } from '../data/sampleData';
import logoUrl from '../assets/Full-Logo-Aethersalon1889.svg';
import bgUrl from '../assets/steampunkroom.webp';
import sp1 from '../assets/steampunk-1.jpg';
import sp2 from '../assets/steampunk-2.avif';
import sp3 from '../assets/steampunk-3.jpg';
import sp4 from '../assets/steampunk-4.jpg';
import ImageCarousel from '../components/ImageCarousel';
import PartnersGrid from '../components/PartnersGrid';


const Home: React.FC = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  // Featured products: fetch up to 6 products from the API (no sample fallback)
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);

  // partners are now provided by the shared PartnersContext/Provider
  // (the PartnersGrid component will consume the context if no partners prop is passed)

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // Request the Airtable view named 'Featured' for homepage featured items
        const res = await fetch('/api/products?view=Featured');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        if (mounted && Array.isArray(payload?.products)) {
          setFeaturedProducts(payload.products.slice(0, 6));
        }
      } catch (err) {
        console.warn('Failed to load products for homepage', err);
        if (mounted) setFeaturedProducts([]);
      } finally {
        /* intentionally no loading state stored; homepage will update when products arrive */
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);
  const [upcomingEvents, setUpcomingEvents] = React.useState<any[]>(sampleEvents.slice(0, 3));

  React.useEffect(() => {
    let mounted = true;

    function parseEventDate(e: any): Date | null {
      const raw = e.raw || {};

      const find = (cands: string[]) => {
        for (const c of cands) {
          const v = raw[c];
          if (v !== undefined && v !== null) return v;
        }
        return undefined;
      };

      // Prefer explicit 'von' (start) field if present, then fall back to common date fields.
      let maybe = find(['von', 'Von', 'from', 'From', 'start', 'Start']);
      if (maybe === undefined) maybe = find(['Datum', 'datum', 'Date', 'date']);
      if (!maybe) maybe = e.date || '';

      // If Airtable returns arrays for date/time fields, pick the first element
      if (Array.isArray(maybe) && maybe.length > 0) maybe = maybe[0];

      if (!maybe) return null;
      const d = new Date(maybe);
      if (!Number.isNaN(d.getTime())) return d;
      return null;
    }

    async function load() {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        if (!mounted) return;
        if (Array.isArray(payload?.events)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const upcoming = payload.events
            .filter((ev: any) => {
              const d = parseEventDate(ev);
              // Only include events with a parseable date and that are today or later.
              if (!d) return false;
              d.setHours(0, 0, 0, 0);
              return d >= today;
            })
            .sort((a: any, b: any) => {
              const da = parseEventDate(a);
              const db = parseEventDate(b);
              if (!da && !db) return 0;
              if (!da) return 1;
              if (!db) return -1;
              return da.getTime() - db.getTime();
            })
            .slice(0, 3);

          setUpcomingEvents(upcoming);
        }
      } catch (err) {
        console.warn('Failed to load events for homepage, using sample events', err);
        if (mounted) setUpcomingEvents(sampleEvents.slice(0, 3));
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // partners now sourced from shared samplePartners data

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgUrl})`,
            filter: 'brightness(0.4)',
          }}
        />

       <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <img
              src={logoUrl}
              alt="Aethersalon 1889 Logo"
              className="w-[40%] md:w-[40%] lg:w-[40%] xl:w-[50%] mx-auto drop-shadow-2xl"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-7xl font-heading font-bold mb-6 text-shadow text-dark-text dark:text-dark-text"
          >
            Willkommen <span className="block sm:inline">an Bord!</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-dark-text"
          >
            Reise in eine Ära voller Innovation, Abenteuer und viktorianischem Stil.
          </motion.p>
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col gap-4 justify-center"
          >
            <Button to="/products" className="bg-brass text-dark-bg hover:bg-brass/90 transition-colors glow">Produkte entdecken
            </Button>
            <Button to="/events" className="border-2 border-brass text-dark-text dark:text-dark-text hover:bg-brass/10 transition-colors">
              Veranstaltungen
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-brass/5">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-dark-text dark:text-dark-text">
             Über <span className="block sm:inline">Aethersalon 1889</span>
            </h2>
            <div className="mb-8">
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-lg leading-relaxed text-dark-text">
                  Seit 1889 widmen wir uns der faszinierenden Kunst des Steampunk. In unserer Werkstatt
                  entstehen einzigartige Kreationen, die Vergangenheit und Zukunft verbinden. Jedes
                  Stück erzählt seine eigene Geschichte und trägt den Geist der viktorianischen Ära
                  in sich.
                </p>
              </div>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center text-brass hover:text-brass/80 transition-colors font-semibold"
            >
              Mehr erfahren
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
          <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2
  style={{ fontFamily: "'EFCO Brookshire', serif", fontWeight: 400 }}
  className="text-4xl md:text-5xl mb-4"
>
  Ausgewählte Werke
</h2>

            <p className="text-lg text-dark-text">
              Entdecken Sie einzigartige Steampunk-Kreationen
            </p>
          </motion.div>

          <ProductGrid products={featuredProducts} showAll={false} />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-4 bg-gradient-to-b from-brass/5 to-transparent">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12"
          >
            <div className="text-center md:text-left mb-4">
              <h2 className="text-4xl md:text-5xl font-heading font-bold">
                Kommende Veranstaltungen
              </h2>
            </div>

            <p className="text-lg text-dark-text">
              Treffen Sie uns auf diesen Events
            </p>
          </motion.div>

          <EventList events={upcomingEvents} showAll={false} />
          <div className="mb-8 mt-8">
            <ImageCarousel images={[sp1, sp2, sp3, sp4]} heightClass="h-[300px] md:h-[350px]" overlayOpacity={0} />
          </div>
        </div>
      </section>
<div className="bg-theme-50 border-t border-brass/30"></div>
  {/* Partners */}
  <PartnersGrid count={4}/>
    </div>
  );
};

export default Home;
