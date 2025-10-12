import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import EventList from '../components/EventList';
import { sampleProducts, sampleEvents } from '../data/sampleData';

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

  // Get first 3 products and events for homepage
  const featuredProducts = sampleProducts.slice(0, 3);
  const upcomingEvents = sampleEvents.slice(0, 3);

  const partners = [
    'Partner 1',
    'Partner 2',
    'Partner 3',
    'Partner 4',
    'Partner 5',
    'Partner 6',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/steampunkroom.jpg)',
            // 'url(https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=1600)',
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
              src="/Aethersalon.svg"
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
            <Link
              to="/products"
              className="px-8 py-3 bg-brass text-dark-bg font-semibold rounded hover:bg-brass/90 transition-colors glow"
            >
              Produkte entdecken
            </Link>
            <Link
              to="/events"
              className="px-8 py-3 border-2 border-brass text-dark-text dark:text-dark-text font-semibold rounded hover:bg-brass/10 transition-colors"
            >
              Veranstaltungen
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Victorian Divider */}
      <div className="victorian-divider my-16" />

      {/* About Teaser */}
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
            <p className="text-lg text-dark-text/80 dark:text-dark-text/80 mb-8 leading-relaxed">
              Seit 1889 widmen wir uns der faszinierenden Kunst des Steampunk. In unserer Werkstatt
              entstehen einzigartige Kreationen, die Vergangenheit und Zukunft verbinden. Jedes
              Stück erzählt seine eigene Geschichte und trägt den Geist der viktorianischen Ära
              in sich.
            </p>
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

      {/* Victorian Divider */}
      <div className="victorian-divider my-16" />

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
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

      {/* Victorian Divider */}
      <div className="victorian-divider my-16" />

      {/* Upcoming Events */}
      <section className="py-20 px-4 bg-gradient-to-b from-brass/5 to-transparent">
        <div className="container mx-auto">
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

          <EventList events={upcomingEvents} showAll={false} />
        </div>
      </section>

      {/* Victorian Divider */}
      <div className="victorian-divider my-16" />

      {/* Partners */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
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
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
          >
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-center justify-center p-6 border border-brass/30 rounded-lg hover:border-brass transition-colors bg-dark-bg/50 dark:bg-dark-bg/50"
              >
                <span className="text-dark-text dark:text-dark-text font-heading text-lg">
                  {partner}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
