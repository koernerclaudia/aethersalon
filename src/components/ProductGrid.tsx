import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './Button';

interface Product {
  id: number | string;
  name: string;
  category?: string;
  tags?: string[];
  image?: string;
  description?: string;
  shortDescription?: string;
  material?: string;
  sku?: string;
  stock?: number;
  manufacturer?: string;
  price?: number;
  // raw fields from Airtable when available
  raw?: Record<string, any>;
}

interface ProductGridProps {
  products: Product[];
  showAll?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, showAll = false }) => {
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

  const location = useLocation();
  const activeTag = new URLSearchParams(location.search).get('tag')?.toLowerCase();

  // helper to extract tags from product: prefer product.tags, else try raw 'Art des Produkts'
  function extractTags(p: Product): string[] {
    if (Array.isArray(p.tags) && p.tags.length > 0) return p.tags;
    const raw = (p as any).raw || {};
    const field = raw['Art des Produkts'] || raw['Art des Produkts '];
    if (!field) return [];
    // field can be an array or a string with multiple items
    if (Array.isArray(field)) return field.map((s) => String(s).trim()).filter(Boolean);
    if (typeof field === 'string') {
      // split on commas, semicolons, slashes or newlines
      return field
        .split(/[;,\/\n]+/) 
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }

  return (
    <div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className={"grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8"}
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={fadeInUp} className={"group relative overflow-hidden rounded-lg border border-brass/30 hover:border-brass transition-all duration-300 glow w-full"}>
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* faint overlay button shown on hover, centered on image */}
              <Link
                to={`/products/${product.id}`}
                className={
                  'absolute inset-0 flex items-center justify-center transition-opacity duration-200 ' +
                  'opacity-0 group-hover:opacity-100'
                }
                aria-hidden={false}
                aria-label={`Öffne Details zu ${product.name}`}
              >
                <span className="inline-flex items-center justify-center px-3 py-2 bg-black/25 backdrop-blur-sm rounded-full text-sm text-white/90 border border-white/10 hover:bg-black/30">
                  Details
                </span>
              </Link>
            </div>
            <div className="p-6 bg-dark-bg/90 dark:bg-dark-bg/90">
              <div className="flex items-start justify-between">
                <div>
                  {/* Tag pills showing "Art des Produkts" (split into individual tags when multiple) */}
                  {(() => {
                    const tags = extractTags(product);
                    if (!tags || tags.length === 0) return null;
                    return (
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {tags.map((t) => {
                          const isActive = activeTag && t.toLowerCase() === activeTag;
                          return (
                            <Link
                              key={t}
                              to={`/products?tag=${encodeURIComponent(t)}`}
                              className={`inline-flex items-center px-2 py-0.5 text-[0.625rem] rounded-full border transition-colors ${isActive ? 'bg-brass text-dark-bg border-brass' : 'bg-transparent text-white border-brass hover:bg-brass/5'}`}
                            >
                              {t}
                            </Link>
                          );
                        })}
                      </div>
                    );
                  })()}
                  <h3 className="text-xl font-heading font-semibold text-dark-text dark:text-dark-text">
                    {product.name}
                  </h3>
                  {product.shortDescription && (
                    <p className="text-sm text-dark-text/80 mt-2">{product.shortDescription}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 text-sm text-dark-text/80">
                {product.material && (
                  <div className="mb-1">Material: <span className="font-medium">{product.material}</span></div>
                )}
                {/* manufacturer intentionally omitted per request */}
                {typeof product.stock === 'number' && (
                  <div>Bestand: <span className="font-medium">{product.stock}</span></div>
                )}
              </div>
              {/* details action moved to image overlay (hover) */}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {!showAll && (
        <div className="text-center mt-12">
          <Button to="/products" className="bg-brass text-dark-bg hover:bg-brass/90 transition-colors">
            Alle Produkte ansehen
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
