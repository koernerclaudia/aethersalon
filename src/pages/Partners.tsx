import React from 'react';
import { motion } from 'framer-motion';
import { samplePartners } from '../data/partners';
import Button from '../components/Button';

const Partners: React.FC = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

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
        console.warn('Failed to load partners from API, falling back to sample data', err);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // If navigated here with a hash like #partner-<id>, scroll that element into view
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // delay slightly to allow layout and images to load
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    }
  }, []);

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
         
          <h1 style={{ fontFamily: "'EFCO Brookshire', serif", fontWeight: 400 }} className="text-4xl md:text-5xl text-dark-text mb-4">
            Unsere Partner
          </h1>
          <p className="text-lg text-dark-text">...</p>
        </motion.div>

        <div className="space-y-8 pb-16">
          {partners.map((p, i) => (
            <motion.section
              key={p.id}
              id={`partner-${p.id}`}
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              className={`flex flex-col md:flex-row items-center gap-6 border border-brass/30 rounded-lg overflow-hidden bg-dark-bg/50 p-4 md:p-6 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full md:w-1/2 h-[350px] bg-dark-bg/10 flex items-center justify-center">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: 10 }}
                  />
                ) : (
                  <div className="w-full h-full bg-brass/10 border border-brass/20 rounded-[10px] mx-auto flex items-center justify-center">
                    <span className="text-theme text-sm">Bild fehlt</span>
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 flex flex-col">
                <h3 className="text-2xl font-heading font-semibold text-dark-text mb-3">{p.name}</h3>
                <p className="text-dark-text mb-4">{p.description}</p>
                <div>
                  {p.website && (
                    <Button href={p.website} size="sm" target="_blank" rel="noopener noreferrer" className="bg-brass text-dark-bg hover:bg-brass/90">
                      Zur Website
                    </Button>
                  )}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;
