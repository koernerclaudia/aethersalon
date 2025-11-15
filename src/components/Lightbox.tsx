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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6"
      onClick={() => onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
        aria-label="Close"
        className="absolute top-6 right-6 text-white text-2xl leading-none p-2 rounded hover:bg-white/10"
      >
        ×
      </button>

      <button
        onClick={prev}
        aria-label="Previous image"
        className="absolute left-6 text-white text-3xl p-2 rounded hover:bg-white/10"
      >
        ‹
      </button>

      <div className="max-w-[92%] max-h-[92%] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[index]}
          alt={`Image ${index + 1}`}
          className="max-w-full max-h-full rounded-lg shadow-lg object-contain"
        />
      </div>

      <button
        onClick={next}
        aria-label="Next image"
        className="absolute right-6 text-white text-3xl p-2 rounded hover:bg-white/10"
      >
        ›
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm">
        {index + 1} / {images.length}
      </div>
    </div>
  );
};

export default Lightbox;
