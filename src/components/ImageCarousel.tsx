import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  images: string[];
  heightClass?: string; // tailwind height class, e.g. 'h-64' or 'h-[350px]'
};

const ImageCarousel: React.FC<Props> = ({ images, heightClass = 'h-64' }) => {
  const [index, setIndex] = React.useState(0);
  const length = images.length;

  React.useEffect(() => {
    if (length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % length), 8000);
    return () => clearInterval(t);
  }, [length]);

  const prev = () => setIndex((i) => (i - 1 + length) % length);
  const next = () => setIndex((i) => (i + 1) % length);

  if (length === 0) return null;

  return (
    <div className={`relative overflow-hidden rounded-lg ${heightClass}`}>
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={images[index] + index}
          src={images[index]}
          alt={`Slide ${index + 1}`}
          className={`w-full h-full object-cover`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      {length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-dark-bg/60 text-dark-text p-2 rounded-full hover:bg-dark-bg/80"
          >
            ‹
          </button>

          <button
            aria-label="Next"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-dark-bg/60 text-dark-text p-2 rounded-full hover:bg-dark-bg/80"
          >
            ›
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2 h-2 rounded-full ${i === index ? 'bg-brass' : 'bg-dark-bg/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
