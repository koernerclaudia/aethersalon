import React from 'react';
import { motion } from 'framer-motion';
import { Partner, samplePartners } from '../data/partners';
import { usePartners } from '../context/PartnersContext';
import { Link } from 'react-router-dom';

type Props = {
  partners?: Partner[];
  count?: number;
  className?: string;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const PartnersGrid: React.FC<Props> = ({ partners, count = 4, className = '' }) => {
  // Prefer explicit prop, then context from provider, then sample fallback
  let ctxPartners: Partner[] = [];
  try {
    const ctx = usePartners();
    ctxPartners = ctx.partners || [];
  } catch (e) {
    // usePartners throws if provider isn't present; we'll fall back to samplePartners
    ctxPartners = [];
  }

  const items = (partners && partners.length > 0) ? partners : (ctxPartners.length > 0 ? ctxPartners : samplePartners);

  const renderItems = (list: Partner[]) => list.slice(0, count).map((p) => (
    <motion.div key={p.id} variants={fadeInUp} className="group relative border border-brass/30 rounded-lg overflow-hidden bg-dark-bg/10 hover:border-brass transition-all duration-300">
      <div className="relative w-full h-[250px] bg-dark-bg/10 flex items-center justify-center overflow-hidden">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.name} className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="text-center px-4">
            <div className="w-[250px] h-[250px] bg-brass/10 border border-brass/20 rounded-md mx-auto flex items-center justify-center">
              <span className="text-theme text-sm">Bild fehlt</span>
            </div>
          </div>
        )}
        {/* Details overlay button (match ProductGrid style) */}
        <Link
          to={`/partners#partner-${p.id}`}
          className={'absolute inset-0 flex items-center justify-center transition-opacity duration-200 ' + 'opacity-0 group-hover:opacity-100'}
          aria-label={`Öffne Details zu ${p.name}`}
        >
          <span className="inline-flex items-center justify-center px-3 py-2 bg-black/10 backdrop-blur-sm rounded-full text-sm text-white/90 border border-white/10 hover:bg-black/20">
            Details
          </span>
        </Link>
      </div>

      <div className="p-4 md:p-6 flex flex-col h-full">
        <h3 className="text-2xl font-heading font-semibold text-dark-text mb-2">{p.name}</h3>
      </div>
    </motion.div>
  ));

  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="mx-auto max-w-5xl px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark-text dark:text-dark-text mb-4">Partner & Unterstützer</h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {renderItems(items)}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersGrid;
