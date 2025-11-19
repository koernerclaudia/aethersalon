import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sampleProducts } from '../data/sampleData';
import Button from '../components/Button';
import Lightbox from '../components/Lightbox';

type Product = {
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
  raw?: any;
};

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [thumbStart, setThumbStart] = useState<number>(0);
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [manufacturerName, setManufacturerName] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // If the id looks like an Airtable raw id (rec...), try fetching directly
        if (id && String(id).startsWith('rec')) {
          try {
            const single = await fetch(`/api/products/${encodeURIComponent(String(id))}`);
            if (single.ok) {
              const payload = await single.json();
              const p = payload?.product;
              if (p && mounted) {
                setProduct(p as Product);
                setLoading(false);
                return;
              }
            }
          } catch (e) {
            // fall through to list-based lookup below
          }
        }

        // First try: fetch the public product list (default behaviour excludes furniture)
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        const products: Product[] = payload?.products || [];
        // Match by numeric id OR Airtable raw id (rec...)
        let found = products.find((p) => String(p.id) === String(id) || String((p as any).rawId) === String(id));

        // If not found, this might be a furniture record that was filtered out of the default API response.
        // Try fetching including furniture and search again.
        if (!found) {
          try {
            const res2 = await fetch('/api/products?includeFurniture=true');
            if (res2.ok) {
              const payload2 = await res2.json();
              const products2: Product[] = payload2?.products || [];
              found = products2.find((p) => String(p.id) === String(id) || String((p as any).rawId) === String(id));
            }
          } catch (e) {
            // ignore secondary fetch errors — we'll fall back to sample data below
          }
        }

        if (mounted) setProduct(found || null);
      } catch (err) {
        const found = sampleProducts.find((p) => String(p.id) === String(id));
        if (found) setProduct(found as Product);
        else setError('Produkt konnte nicht geladen werden.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    const rawFields = (product as any)?.raw?.fields || (product as any)?.raw || {};
    const attachments: any[] = rawFields['Weitere Bilder'] || rawFields['Produkt-Bild'] || [];
    if (attachments && attachments.length > 0) {
      return attachments.map((a) => a?.url || a?.thumbnails?.large?.url || '').filter(Boolean);
    }
    return [product.image || ''].filter(Boolean);
  }, [product]);

  useEffect(() => {
    if (gallery.length === 0) return;
    setSelectedIndex(0);
    setThumbStart(0);
    setSelectedImage(gallery[0]);
  }, [gallery]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const openLightbox = (start = 0) => {
    setSelectedIndex(start);
    setLightboxOpen(true);
  };

  // Resolve manufacturer(s) to human readable names.
  // Prefer `product.manufacturers` (array) returned by the API. If absent,
  // attempt to resolve linked record ids via `/api/partners`. Falls back to
  // `product.manufacturer` for backward compatibility.
  useEffect(() => {
    if (!product) return;
    const p: any = product as any;

    if (Array.isArray(p.manufacturers) && p.manufacturers.length > 0) {
      setManufacturerName(p.manufacturers.join(', '));
      return;
    }

    // Try to collect linked ids from normalized fields or raw fields
    const ids: string[] = Array.isArray(p.manufacturerIds) ? p.manufacturerIds.slice() : [];
    const rawHv = p.raw?.['Hergestellt von'];
    if ((!ids || ids.length === 0) && Array.isArray(rawHv)) {
      for (const item of rawHv) {
        if (typeof item === 'string' && item.startsWith('rec')) ids.push(item);
        else if (item && typeof item === 'object' && item.id) ids.push(String(item.id));
      }
    }

    if (ids.length === 0) {
      // No linked ids — prefer normalized single manufacturer string
      setManufacturerName(typeof p.manufacturer === 'string' ? p.manufacturer : undefined);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/partners');
        if (!res.ok) {
          if (!cancelled) setManufacturerName(ids.join(', '));
          return;
        }
        const payload = await res.json();
        const partners = payload?.partners || [];
        const map: Record<string, string> = {};
        for (const pr of partners) {
          if (pr && pr.id) map[String(pr.id)] = pr.name || String(pr.id);
        }
        const names = ids.map((id) => map[id] || id);
        if (!cancelled) setManufacturerName(names.join(', '));
      } catch (e) {
        if (!cancelled) setManufacturerName(ids.join(', '));
      }
    })();

    return () => { cancelled = true; };
  }, [product]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setVisibleCount(mq.matches ? 5 : 3);
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', update); else mq.removeListener(update); };
  }, []);

  const canPrev = thumbStart > 0;
  const canNext = thumbStart + visibleCount < gallery.length;
  const prev = () => { if (!canPrev) return; setThumbStart((s) => Math.max(0, s - 1)); };
  const next = () => { if (!canNext) return; setThumbStart((s) => Math.min(gallery.length - visibleCount, s + 1)); };

  useEffect(() => {
    // keep thumbStart and selectedIndex in range when visibleCount or gallery changes
    if (selectedIndex < thumbStart) setThumbStart(selectedIndex);
    if (selectedIndex >= thumbStart + visibleCount) setThumbStart(Math.max(0, selectedIndex - visibleCount + 1));
    if (thumbStart > Math.max(0, gallery.length - visibleCount)) setThumbStart(Math.max(0, gallery.length - visibleCount));
  }, [visibleCount, gallery.length]);

  // Helper to render material field which can be plain text, newline lists, arrays or HTML-rich text
  const renderMaterialContent = (m: any) => {
    if (!m) return null;
    if (Array.isArray(m)) {
      const items = m.map((it) => String(it).trim()).filter(Boolean);
      if (items.length === 0) return null;
      return (
        <ul className="list-disc pl-5 space-y-1">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    }

    if (typeof m === 'string') {
      const s = m.trim();
      // If it's HTML-rich text, render as HTML
      if (/<\/?(ul|ol|li|p|br|strong|em|span|div)/i.test(s)) {
        return <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: s }} />;
      }

      // If it looks like multiple lines or bullet markers, split into list
      const lines = s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length > 1) {
        const items = lines.map((l) => l.replace(/^[-*\u2022]\s*/, '').trim()).filter(Boolean);
        return (
          <ul className="list-disc pl-5 space-y-1">
            {items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        );
      }

      // Single-line plain text
      return <p className="text-dark-text">{s}</p>;
    }

    // Fallback
    return <p className="text-dark-text">{String(m)}</p>;
  };

  if (loading) return <div className="min-h-screen pt-24 px-4"><div className="container mx-auto">Lade Produkt…</div></div>;
  if (error) return <div className="min-h-screen pt-24 px-4"><div className="container mx-auto text-red-500">{error}</div></div>;
  if (!product) return <div className="min-h-screen pt-24 px-4"><div className="container mx-auto">Produkt nicht gefunden.</div></div>;

  const slice = gallery.slice(thumbStart, thumbStart + visibleCount);

  return (
    <div className="min-h-screen pt-24 px-8 pb-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link to="/products" className="text-sm text-brass hover:underline">← Zurück zu Produkten</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="rounded-lg overflow-hidden border border-brass/30 bg-dark-bg/5">
              <div className="relative w-full aspect-square">
                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                  onClick={() => openLightbox(selectedIndex)}
                />
              </div>
            </div>

            <div className="mt-4 relative">
              {gallery.length > 1 && (
                <button
                  onClick={prev}
                  className={`absolute -left-3 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 ${canPrev ? 'text-brass' : 'text-dark-text/50 pointer-events-none'}`}
                  aria-label="Vorherige Bilder"
                  aria-disabled={!canPrev}
                  title={canPrev ? 'Vorherige' : 'Am Anfang'}
                  type="button"
                >
                  <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              )}

              <div className="overflow-hidden">
                <div className="flex gap-3 items-center px-8">
                  {slice.map((src, i) => {
                    const idx = thumbStart + i;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedIndex(idx);
                          setSelectedImage(src);
                          if (idx < thumbStart) setThumbStart(idx);
                          if (idx >= thumbStart + visibleCount) setThumbStart(idx - visibleCount + 1);
                        }}
                        className={`rounded overflow-hidden border focus:outline-none focus:ring-2 focus:ring-brass ${isSelected ? 'border-brass' : 'border-brass/20'}`}
                        type="button"
                      >
                        <img src={src} alt={`${product.name} ${idx + 1}`} className="w-20 h-12 md:w-24 md:h-16 object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {gallery.length > 1 && (
                <button
                  onClick={next}
                  className={`absolute -right-3 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 ${canNext ? 'text-brass' : 'text-dark-text/50 pointer-events-none'}`}
                  aria-label="Nächste Bilder"
                  aria-disabled={!canNext}
                  title={canNext ? 'Nächste' : 'Ende'}
                  type="button"
                >
                  <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {lightboxOpen && (
            <Lightbox
              images={gallery}
              startIndex={selectedIndex}
              onClose={() => setLightboxOpen(false)}
            />
          )}

          <div>
            <h1 className="text-4xl font-heading font-bold text-dark-text mb-4">{product.name}</h1>
            <div className="text-sm text-brass mb-4">{product.category}</div>
            {product.price !== undefined && (
              <div className="text-2xl font-semibold mb-4">{typeof product.price === 'number' && product.price > 0 ? `${product.price.toFixed(2)} €` : '—'}</div>
            )}

            {product.shortDescription && <p className="mb-4 text-dark-text">{product.shortDescription}</p>}

            {product.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Beschreibung</h2>
                <p className="text-dark-text">{product.description}</p>
              </div>
            )}

            {product.material && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Material</h2>
                <div className="text-dark-text text-sm leading-relaxed">
                  {renderMaterialContent((product as any).material)}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <ul className="text-sm text-dark-text space-y-1">
                {product.sku && <li><strong>Artikelnummer:</strong> {product.sku}</li>}
                {(manufacturerName || product.manufacturer) && (
                  <li><strong>Hersteller:</strong> {manufacturerName || product.manufacturer}</li>
                )}
                {typeof product.stock === 'number' && <li><strong>Bestand:</strong> {product.stock}</li>}
              </ul>
            </div>

            <div>
              {(() => {
                const subjectRaw = `Anfrage zu ${product.name}${product.sku ? ` (Artikelnummer: ${product.sku})` : ''}`;
                const subject = encodeURIComponent(subjectRaw);
                return (
                  <Button
                    href={`mailto:info@aethersalon1889.de?subject=${subject}`}
                    className="bg-brass text-dark-bg hover:bg-brass/90"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Anfrage senden
                  </Button>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
