import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import EventList from '../components/EventList';
import Button from '../components/Button';
import { sampleEvents } from '../data/sampleData';
import { samplePartners } from '../data/partners';
import logoUrl from '../assets/Aethersalon.svg';
import logoWordmark from '../assets/logo-wordmark.svg';
import bgUrl from '../assets/steampunkroom.webp';
import ImageCarousel from '../components/ImageCarousel';


const Home: React.FC = () => {
  // Animation variants
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

  // Featured products: fetch up to 6 products from the API (no sample fallback)
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);

  const [partners, setPartners] = React.useState(samplePartners);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/partners');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        if (mounted && Array.isArray(payload?.partners)) {
          setPartners(payload.partners);
        }
      } catch (err) {
        console.warn('Failed to load partners for homepage, using sample partners', err);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/products');
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
  const upcomingEvents = sampleEvents.slice(0, 3);

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
              className="w-64 md:w-96 xl:w-[40rem] mx-auto drop-shadow-2xl"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-heading font-bold text-dark-text dark:text-dark-text mb-6 text-shadow"
          >
            Willkommen im Aethersalon 1889
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-dark-text dark:text-dark-text mb-8 max-w-2xl mx-auto"
          >
            Die Zeitreise in die Welt des Steampunk
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button to="/products" size="md" className="bg-brass text-dark-bg hover:bg-brass/90">
              Produkte entdecken
            </Button>

            <Button to="/events" size="md" className="border-2 border-brass text-dark-text dark:text-dark-text font-semibold hover:bg-brass/10">
              Veranstaltungen
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-brass/5">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark-text dark:text-dark-text mb-6">
              Über Aethersalon 1889
            </h2>
            <div className="mb-8">
              <div className="text-lg text-dark-text/80 dark:text-dark-text/80 leading-relaxed columns-1 md:columns-2 text-justify" style={{ columnGap: '3rem' }}>
                <p>
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
  className="text-4xl md:text-5xl text-dark-text mb-4"
>
  Ausgewählte Werke
</h2>

            <p className="text-lg text-dark-text/80 dark:text-dark-text/80">
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
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark-text dark:text-dark-text mb-4">
              Kommende Veranstaltungen
            </h2>
            <p className="text-lg text-dark-text/80 dark:text-dark-text/80">
              Treffen Sie uns auf diesen Events
            </p>
          </motion.div>

          <div className="mb-8">
            <ImageCarousel images={[bgUrl, logoUrl, logoWordmark]} heightClass="h-[300px] md:h-[350px]" />
          </div>

          <EventList events={upcomingEvents} showAll={false} />
        </div>
      </section>
<div className="bg-theme-50 border-t border-brass/30"></div>
      {/* Partners */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark-text dark:text-dark-text mb-4">
              Partner & Unterstützer
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
          >
            {partners.slice(0, 4).map((p) => (
              <motion.div key={p.id} variants={fadeInUp} className="border border-brass/30 rounded-lg overflow-hidden bg-dark-bg/50">
                <div className="w-full h-[250px] bg-dark-bg/10 flex items-center justify-center">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-[250px] object-cover" />
                  ) : (
                    <div className="text-center px-4">
                      <div className="w-[250px] h-[250px] bg-brass/10 border border-brass/20 rounded-md mx-auto flex items-center justify-center">
                        <span className="text-theme text-sm">Bild fehlt</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 md:p-6 flex flex-col h-full">
                  <h3 className="text-xl font-heading font-semibold text-dark-text mb-2">{p.name}</h3>
                 
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
