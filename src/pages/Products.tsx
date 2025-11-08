import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import { sampleProducts } from '../data/sampleData';

type Product = {
  id: number;
  name: string;
  category: string;
  image: string;
  description?: string;
  price?: number;
};

const Products: React.FC = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        if (payload?.products && Array.isArray(payload.products) && payload.products.length > 0) {
          if (!mounted) return;
          setProducts(payload.products);
        }
      } catch (err: any) {
        console.warn('Failed to fetch /api/products, using sample data:', err?.message || err);
        if (!mounted) return;
        setError('Remote products could not be loaded — showing sample data.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="container mx-auto">
        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-dark-text dark:text-dark-text mb-6">
            Unsere Produkte
          </h1>
          <p className="text-lg text-dark-text/80 dark:text-dark-text/80 max-w-2xl mx-auto">
            Entdecken Sie unsere handgefertigten Steampunk-Kreationen. Jedes Stück ist ein Unikat
            und verbindet viktorianische Eleganz mit modernem Design.
          </p>
        </motion.div>

        {/* Victorian Divider */}
        <div className="victorian-divider my-12" />

        {/* Status */}
        {loading && (
          <div className="text-center mb-6 text-sm text-dark-text/70">Lade Produkte…</div>
        )}
        {error && (
          <div className="text-center mb-6 text-sm text-red-500">{error}</div>
        )}

        {/* Products Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <ProductGrid products={products} showAll={true} />
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
              Interesse an einem Produkt?
            </h2>
            <p className="text-dark-text dark:text-dark-text mb-6">
              Kontaktieren Sie uns für weitere Informationen, Preise und Verfügbarkeit.
              Wir fertigen auch individuelle Aufträge nach Ihren Wünschen.
            </p>
            <a
              href="mailto:info@aethersalon1889.de?subject=Produktanfrage"
              className="inline-block px-8 py-3 bg-brass text-dark-bg font-semibold rounded hover:bg-brass/90 transition-colors"
            >
              Anfrage senden
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Products;
