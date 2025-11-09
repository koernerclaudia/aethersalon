import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sampleProducts } from '../data/sampleData';

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
};

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        const products: Product[] = payload?.products || [];
        // Prefer numeric id match first (legacy), then Airtable rawId if present.
        const found = products.find((p: any) =>
          String(p.id) === String(id) || String((p as any).rawId || '') === String(id)
        );
        if (mounted) setProduct(found || null);
      } catch (err: any) {
        // fallback to sample data
  const found = sampleProducts.find((p) => String(p.id) === String(id));
        if (found) setProduct(found as Product);
        else setError('Produkt konnte nicht geladen werden.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // keep the selected image in sync when product loads/changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image || '');
    }
  }, [product]);

  if (loading) return <div className="min-h-screen pt-24 px-4"><div className="container mx-auto">Lade Produkt…</div></div>;
  if (error) return <div className="min-h-screen pt-24 px-4"><div className="container mx-auto text-red-500">{error}</div></div>;
  if (!product) return <div className="min-h-screen pt-24 px-4"><div className="container mx-auto">Produkt nicht gefunden.</div></div>;

  return (
    <div className="min-h-screen pt-24 px-8 pb-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link to="/products" className="text-sm text-brass hover:underline">← Zurück zu Produkten</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="rounded-lg overflow-hidden border border-brass/30 flex items-center justify-center bg-theme-30 p-2">
              <img src={selectedImage || product.image} alt={product.name} className="w-full h-auto max-h-[420px] object-contain" />
            </div>

            {/* thumbnail gallery with placeholders for up to 3 additional images */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {(() => {
                // derive gallery images from Airtable fields in order of preference:
                // 1) 'Weitere Bilder' (additional images)
                // 2) fallback to 'Produkt-Bild'
                // 3) finally use the main product.image as placeholder
                // note: in the normalized product from the proxy we stored `raw: f` where `f` is the
                // Airtable `fields` object. So `product.raw` IS the fields map (not an object with a
                // `fields` property). Handle both shapes defensively.
                const rawFields = (product as any)?.raw?.fields || (product as any)?.raw || {};
                const attachments: any[] = rawFields['Weitere Bilder'] || rawFields['Produkt-Bild'] || [];
                const gallery = attachments.length > 0
                  ? attachments.map((a) => a?.url || a?.thumbnails?.large?.url || '')
                  : [product.image, product.image, product.image];

                return gallery.slice(0, 3).map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(src)}
                    className="rounded overflow-hidden border border-brass/20 focus:outline-none focus:ring-2 focus:ring-brass"
                    aria-label={`Zeige Bild ${idx + 1}`}
                    type="button"
                  >
                    <img src={src} alt={`${product.name} ${idx + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ));
              })()}
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-heading font-bold text-theme mb-4">{product.name}</h1>
            <div className="text-sm text-brass mb-4">{product.category}</div>
            {product.price !== undefined && (
              <div className="text-2xl font-semibold mb-4">{typeof product.price === 'number' && product.price > 0 ? `${product.price.toFixed(2)} €` : '—'}</div>
            )}

            {product.shortDescription && <p className="mb-4 text-theme-80">{product.shortDescription}</p>}

            {product.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Beschreibung</h2>
                <p className="text-theme-80">{product.description}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <ul className="text-sm text-theme-80 space-y-1">
                {product.material && <li><strong>Material:</strong> {product.material}</li>}
                {product.sku && <li><strong>Artikelnummer:</strong> {product.sku}</li>}
                {product.manufacturer && <li><strong>Hersteller:</strong> {product.manufacturer}</li>}
                {typeof product.stock === 'number' && <li><strong>Bestand:</strong> {product.stock}</li>}
              </ul>
            </div>

            <div>
              <a href={`mailto:info@aethersalon1889.de?subject=Anfrage zu ${encodeURIComponent(product.name)}`} className="inline-block px-6 py-3 bg-brass text-dark-bg font-semibold rounded-full hover:bg-brass/90">Anfrage senden</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
