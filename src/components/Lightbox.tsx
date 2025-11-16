import React, { useEffect, useCallback, useState } from 'react';

interface LightboxProps {
  images: string[];
  startIndex?: number;
  onClose?: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, startIndex = 0, onClose }) => {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => setIndex(startIndex), [startIndex]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
    },
    [images.length, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4"
      onClick={() => onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* close button moved down next to pagination for better reachability */}

      <button
        onClick={prev}
        aria-label="Previous image"
        className="absolute left-6 text-white text-2xl p-2 rounded hover:bg-white/10"
      >
        ‹
      </button>

  <div className="max-w-[90%] md:max-w-[70%] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[index]}
          alt={`Image ${index + 1}`}
          className="max-w-full max-h-[45vh] md:max-h-[70vh] rounded-lg shadow-lg object-contain"
        />
      </div>

      <button
        onClick={next}
        aria-label="Next image"
        className="absolute right-6 text-white text-2xl p-2 rounded hover:bg-white/10"
      >
        ›
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-xs flex items-center gap-4">
        <div className="opacity-95">{index + 1} / {images.length}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          aria-label="Close"
          className="text-white text-lg leading-none p-2 rounded hover:bg-white/10"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
