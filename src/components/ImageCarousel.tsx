import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  images: string[];
  heightClass?: string; // tailwind height class, e.g. 'h-64' or 'h-[350px]'
  showDots?: boolean;
  showControls?: boolean;
  noRound?: boolean;
  // autoplay interval in milliseconds
  intervalMs?: number;
  // transition duration in seconds (used for crossfade)
  transitionDuration?: number;
  // optional overlay: either a Tailwind class string like 'bg-black/40' or omitted
  overlayClassName?: string;
  // fallback overlay color/opacity when overlayClassName isn't provided
  overlayColor?: string;
  overlayOpacity?: number;
  // when used purely as decorative background, hide images from AT
  ariaHidden?: boolean;
};

const ImageCarousel: React.FC<Props> = ({
  images,
  heightClass = 'h-64',
  showDots = true,
  showControls = true,
  noRound = false,
  intervalMs = 8000,
  transitionDuration = 1.5,
  overlayClassName,
  overlayColor = 'black',
  overlayOpacity = 0.4,
  ariaHidden = false,
}) => {
  const [index, setIndex] = React.useState(0);
  const length = images.length;

  React.useEffect(() => {
    if (length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % length), intervalMs);
    return () => clearInterval(t);
  }, [length, intervalMs]);

  const prev = () => setIndex((i) => (i - 1 + length) % length);
  const next = () => setIndex((i) => (i + 1) % length);

  if (length === 0) return null;

  const wrapperClass = `relative ${heightClass} ${noRound ? '' : 'overflow-hidden rounded-lg'}`;

  return (
    <>
      <div className={wrapperClass}>
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={images[index] + index}
            src={images[index]}
            alt={`Slide ${index + 1}`}
            className={`w-full h-full object-cover`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: transitionDuration }}
            aria-hidden={ariaHidden}
          />
        </AnimatePresence>

        {length > 1 && showControls && (
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
          </>
        )}
      </div>

      {length > 1 && showDots && (
        <div className="carousel-dots">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`carousel-dot ${i === index ? 'active' : ''}`}
            />
          ))}
        </div>
      )}
      {/* overlay element when carousel used as background. Pages can pass a Tailwind class via overlayClassName */}
      {(overlayClassName || overlayOpacity) && (
        <div
          className={`absolute inset-0 pointer-events-none ${overlayClassName ?? ''}`}
          style={overlayClassName ? undefined : { backgroundColor: overlayColor, opacity: overlayOpacity }}
          aria-hidden
        />
      )}
    </>
  );
};

export default ImageCarousel;
