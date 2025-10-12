import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
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
              <span className="text-sm text-brass mb-2 block">{product.category}</span>
              <h3 className="text-xl font-heading font-semibold text-dark-text dark:text-dark-text">
                {product.name}
              </h3>
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
