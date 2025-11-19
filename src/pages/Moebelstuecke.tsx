import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import { sampleProducts } from '../data/sampleData';
import Button from '../components/Button';

type Product = {
  id: number;
  name: string;
  category: string;
  image: string;
  description?: string;
  shortDescription?: string;
  material?: string;
  sku?: string;
  stock?: number;
  manufacturer?: string;
  price?: number;
};

const Moebelstuecke: React.FC = () => {
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
        // Request only Möbelstück items from the API
        const res = await fetch(`/api/products?only=${encodeURIComponent('Möbelstück')}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        if (payload?.products && Array.isArray(payload.products)) {
          if (!mounted) return;
          setProducts(payload.products);
        }
      } catch (err: any) {
        console.warn('Failed to fetch Möbelstücke from /api/products — falling back to sample data:', err?.message || err);
        if (!mounted) return;
        setError('Möbelstücke konnten nicht geladen werden — Beispiel-Daten werden angezeigt.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen pt-24 px-8 pb-20">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-dark-text dark:text-dark-text mb-6">
            Möbelstücke
          </h1>
          <p className="text-lg text-dark-text dark:text-dark-text max-w-2xl mx-auto">
            Unsere ausgewählten Möbelstücke: handgefertigte Einrichtungsobjekte mit Steampunk-Ästhetik.
          </p>
        </motion.div>

        {/* Status */}
        {loading && (
          <div className="text-center mb-6 text-sm text-dark-text/70">Lade Möbelstücke…</div>
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
                <ProductGrid products={products} showAll={true} hideCategory={true} hideStock={true} />
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="max-w-3xl mx-auto p-8 border border-brass/30 rounded-lg bg-dark-bg/50">
            <h2 className="text-2xl font-heading font-semibold text-brass mb-4">
              Interesse an einem Möbelstück?
            </h2>
            <p className="text-dark-text dark:text-dark-text mb-6">
              Kontaktieren Sie uns für Details, Lieferzeiten und Preise. Viele unserer Möbelstücke
              sind Unikate oder Kleinserien.
            </p>
            <Button
              href="mailto:info@aethersalon1889.de?subject=M%C3%B6belst%C3%BCck-Anfrage"
              className="bg-brass text-dark-bg hover:bg-brass/90"
            >
              Anfrage senden
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Moebelstuecke;
