import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Product {
  id: number | string;
  name: string;
  category: string;
  tags?: string[];
  image: string;
  description?: string;
  shortDescription?: string;
  material?: string;
  sku?: string;
  stock?: number;
  manufacturer?: string;
  price?: number;
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

  return (
    <div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className={
          "flex flex-col gap-8 " +
          /*
            Layout behavior:
            - default (mobile): column (one card per row)
            - from 500px up: horizontal flex row with snap scrolling showing one card at a time
            - from md (>=768px): switch to grid with 3 columns
            - from lg (>=1024px): keep 3 columns for a consistent layout
          */
          "min-[500px]:flex-row min-[500px]:overflow-x-auto min-[500px]:snap-x min-[500px]:snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-3"
        }
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={fadeInUp}
            className={
              "group relative overflow-hidden rounded-lg border border-brass/30 hover:border-brass transition-all duration-300 glow " +
              /* When in horizontal snap mode, make each card take most of the viewport so one shows at a time. */
              "min-[500px]:min-w-[85%] md:min-w-0 snap-start"
            }
          >
            <div className="relative aspect-square overflow-hidden">
              {(() => {
                // defensive image sourcing: prefer top-level product.image but fall back to raw Airtable attachments
                let imgSrc = (product as any).image;
                try {
                  if (!imgSrc) {
                    const raw = (product as any).raw || (product as any).rawFields || {};
                    const attachments = raw['Produkt-Bild'] || raw['Bilder'] || raw['Images'] || raw['Image'] || [];
                    if (Array.isArray(attachments) && attachments.length > 0) {
                      imgSrc = attachments[0]?.url || attachments[0]?.thumbnails?.large?.url || imgSrc;
                    }
                  }
                } catch (e) {
                  // ignore and use whatever we have
                }

                return (
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                );
              })()}

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
            <div className="p-6 bg-theme-90">
              <div className="flex items-start justify-between">
                  <div>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {product.tags.map((t) => {
                          const isActive = activeTag && t.toLowerCase() === activeTag;
                          return (
                            <Link
                              key={t}
                              to={`/products?tag=${encodeURIComponent(t)}`}
                              className={`inline-flex items-center px-2 py-0.5 text-[0.625rem] rounded-full border transition-colors ${isActive ? 'bg-brass text-dark-bg border-brass' : 'bg-theme-95 text-theme border-brass/20 hover:bg-brass/5'}`}
                            >
                              {t}
                            </Link>
                          );
                        })}
                    </div>
                  )}
                  <h3 className="text-xl font-heading font-semibold text-theme">
                    {product.name}
                  </h3>
                  {product.shortDescription && (
                    <p className="text-xs text-theme-80 mt-2">{product.shortDescription}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 text-xs text-theme-80">
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
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-brass text-dark-bg font-semibold rounded-full hover:bg-brass/90 transition-colors"
          >
            Alle Produkte ansehen
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
