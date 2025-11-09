import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import EventList from '../components/EventList';
import { sampleEvents } from '../data/sampleData';
import logoUrl from '../assets/Aethersalon.svg';
import bgUrl from '../assets/steampunkroom.jpg';


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

  // Get first 3 events for homepage
  const upcomingEvents = sampleEvents.slice(0, 3);

  // Category filter for the featured products section (load from Airtable)
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadProducts() {
      setLoadingProducts(true);
      setProductsError(null);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        const items = payload?.products || [];
        if (!mounted) return;
        setAllProducts(items);
        // initial filter
        setFilteredProducts(selectedCategory === 'All' ? items : items.filter((p: any) => p.category === selectedCategory));
      } catch (err: any) {
        console.error('Failed to load products for Home:', err?.message || err);
        if (!mounted) return;
        setProductsError(String(err?.message || 'Produkte konnten nicht geladen werden.'));
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    }

    loadProducts();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredProducts(
      selectedCategory === 'All'
        ? allProducts
        : allProducts.filter((p: any) => Array.isArray(p.tags) && p.tags.includes(selectedCategory))
    );
  }, [selectedCategory, allProducts]);

  const categories = React.useMemo(() => {
    const setCats = new Set<string>();
    allProducts.forEach((p: any) => {
      if (Array.isArray(p.tags)) p.tags.forEach((t: string) => t && setCats.add(t));
    });
    return Array.from(setCats).sort();
  }, [allProducts]);

  const partners = ['Partner 1', 'Partner 2', 'Partner 3', 'Partner 4'];

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
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.0 }}
              className="text-5xl md:text-5xl font-heading font-bold text-theme mb-6 text-shadow"
            >Willkommen im
            </motion.h1>
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
            
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/products"
              className="px-8 py-3 bg-brass text-dark-bg font-semibold rounded-full hover:bg-brass/90 transition-colors glow"
            >
              Produkte entdecken
            </Link>
            <Link
              to="/events"
              className="px-8 py-3 border-2 border-brass text-theme font-semibold rounded-full hover:bg-brass/10 transition-colors"
            >
              Veranstaltungen
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Victorian Divider */}
      <div className="victorian-divider my-16" />

      {/* About Teaser */}
      <section className="py-12 px-4 bg-gradient-to-b from-transparent to-brass/5">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-theme mb-6">Über Aethersalon 1889</h2>
            <p className="text-lg text-theme-80 mb-8 leading-relaxed">
              Seit 1889 widmen wir uns der faszinierenden Kunst des Steampunk. In unserer Werkstatt
              entstehen einzigartige Kreationen, die Vergangenheit und Zukunft verbinden. Jedes
              Stück erzählt seine eigene Geschichte und trägt den Geist der viktorianischen Ära
              in sich.
            </p>
            <Link to="/about" className="inline-flex items-center text-brass hover:text-brass/80 transition-colors font-semibold">
              Mehr erfahren
              <svg className="w-5 h-5 ml-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="mx-auto max-w-5xl px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-6">
            <h2 style={{ fontFamily: "'EFCO Brookshire', serif", fontWeight: 400 }} className="text-4xl md:text-5xl text-theme mb-4">Ausgewählte Werke</h2>
            <p className="text-lg text-theme-80">Entdecken Sie einzigartige Steampunk-Kreationen</p>
          </motion.div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${selectedCategory === 'All' ? 'bg-brass text-dark-bg' : 'text-theme hover:text-brass'}`}
            >
              Alle
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${selectedCategory === cat ? 'bg-brass text-dark-bg' : 'text-theme hover:text-brass'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loadingProducts ? (
            <div className="text-center py-12 text-theme-80">Lade Produkte…</div>
          ) : productsError ? (
            <div className="text-center py-12 text-red-500">{productsError}</div>
          ) : (
            <ProductGrid products={filteredProducts} showAll={false} />
          )}
        </div>
      </section>

      {/* Victorian Divider */}
      <div className="victorian-divider my-16" />

      {/* Upcoming Events */}
      <section className="py-20 px-4 bg-gradient-to-b from-brass/5 to-transparent">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-theme mb-4">Kommende Veranstaltungen</h2>
            <p className="text-lg text-theme-80">Treffen Sie uns auf diesen Events</p>
          </motion.div>

          <EventList events={upcomingEvents} showAll={false} />
        </div>
      </section>

      {/* Victorian Divider */}
      <div className="victorian-divider my-16" />

      {/* Partners */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-theme mb-4">Partner & Unterstützer</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <motion.div key={index} variants={fadeInUp} className="flex items-center justify-center p-4 border border-brass/30 rounded-lg hover:border-brass transition-colors bg-theme-50 min-h-[64px]">
                <span className="text-theme font-heading text-sm">{partner}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
