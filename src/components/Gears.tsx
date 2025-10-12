import React from 'react';
import { motion } from 'framer-motion';

const Gears: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
      {/* Large Gear - Top Right */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-20 -right-20 w-64 h-64"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-brass">
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.3" />
          {[...Array(8)].map((_, i) => (
            <rect
              key={i}
              x="48"
              y="10"
              width="4"
              height="15"
              fill="currentColor"
              transform={`rotate(${i * 45} 50 50)`}
            />
          ))}
        </svg>
      </motion.div>

      {/* Medium Gear - Bottom Left */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-16 -left-16 w-48 h-48"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-brass">
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="12" fill="currentColor" opacity="0.3" />
          {[...Array(12)].map((_, i) => (
            <rect
              key={i}
              x="48"
              y="15"
              width="4"
              height="12"
              fill="currentColor"
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}
        </svg>
      </motion.div>

      {/* Small Gear - Middle Right */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 -right-8 w-32 h-32"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-brass">
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.3" />
          {[...Array(6)].map((_, i) => (
            <rect
              key={i}
              x="48"
              y="20"
              width="4"
              height="10"
              fill="currentColor"
              transform={`rotate(${i * 60} 50 50)`}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
};

export default Gears;
