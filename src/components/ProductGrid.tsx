import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Product {
  id: number | string;
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

  return (
    <div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={fadeInUp}
            className="group relative overflow-hidden rounded-lg border border-brass/30 hover:border-brass transition-all duration-300 glow"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6 bg-dark-bg/90 dark:bg-dark-bg/90">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm text-brass mb-2 block">{product.category}</span>
                  <h3 className="text-xl font-heading font-semibold text-dark-text dark:text-dark-text">
                    {product.name}
                  </h3>
                  {product.shortDescription && (
                    <p className="text-sm text-dark-text/80 mt-2">{product.shortDescription}</p>
                  )}
                </div>
                <div className="text-right ml-4">
                  {product.price !== undefined && (
                    <div className="text-lg font-semibold text-dark-text mb-1">
                      {typeof product.price === 'number' && product.price > 0 ? `${product.price.toFixed(2)} €` : '—'}
                    </div>
                  )}
                  {product.sku && (
                    <div className="text-xs text-dark-text/70">SKU: {product.sku}</div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-sm text-dark-text/80">
                {product.material && (
                  <div className="mb-1">Material: <span className="font-medium">{product.material}</span></div>
                )}
                {product.manufacturer && (
                  <div className="mb-1">Hersteller: <span className="font-medium">{product.manufacturer}</span></div>
                )}
                {typeof product.stock === 'number' && (
                  <div>Bestand: <span className="font-medium">{product.stock}</span></div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {!showAll && (
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-brass text-dark-bg font-semibold rounded hover:bg-brass/90 transition-colors"
          >
            Alle Produkte ansehen
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
