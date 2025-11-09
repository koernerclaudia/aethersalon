import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import { useLocation, useNavigate } from 'react-router-dom';

type Product = {
  id: number;
  name: string;
  category: string;
  image: string;
  description?: string;
  shortDescription?: string;
  material?: string;
  stock?: number;
  manufacturer?: string;
  price?: number;
};

const Products: React.FC = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // helper to apply tag/category filters from a search string
  const applyFilters = (items: Product[], search: string) => {
    const params = new URLSearchParams(search);
    const tag = params.get('tag');
    const category = params.get('category');

    return items.filter((p) => {
      let ok = true;
      if (tag) {
        ok = ok && Array.isArray((p as any).tags) && (p as any).tags.some((t: string) => t.toLowerCase() === tag.toLowerCase());
      }
      if (category) {
        ok = ok && (!!p.category && p.category.toLowerCase() === category.toLowerCase());
      }
      return ok;
    });
  };

  useEffect(() => {
    let mounted = true;
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        // Always fetch the full unfiltered list first to populate "allProducts"
        const fullRes = await fetch('/api/products');
        if (!fullRes.ok) {
          const text = await fullRes.text().catch(() => '');
          throw new Error(`HTTP ${fullRes.status} ${text}`);
        }
        const fullPayload = await fullRes.json();
        if (!mounted) return;
        const fullList = fullPayload?.products && Array.isArray(fullPayload.products) ? fullPayload.products : [];
        setAllProducts(fullList);

        // Then fetch the filtered list (if any query present) from the server so filtering is done against full Airtable dataset
        if (location.search) {
          const filteredRes = await fetch(`/api/products${location.search}`);
          if (!filteredRes.ok) {
            const text = await filteredRes.text().catch(() => '');
            throw new Error(`HTTP ${filteredRes.status} ${text}`);
          }
          const filteredPayload = await filteredRes.json();
          const filteredList = filteredPayload?.products && Array.isArray(filteredPayload.products) ? filteredPayload.products : [];
          setProducts(filteredList);
        } else {
          setProducts(fullList);
        }
      } catch (err: any) {
        console.error('Failed to fetch /api/products:', err?.message || err);
        if (!mounted) return;
        setError(String(err?.message || 'Remote products could not be loaded.'));
        setAllProducts([]);
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
    // re-run when the location.search changes so tag filters take effect
  }, [location.search]);

  // expose a retry handler for the UI
  const retry = async () => {
    setLoading(true);
    setError(null);
    try {
      // retry should re-fetch full dataset first, then any server-side filtered list
      const fullRes = await fetch('/api/products');
      if (!fullRes.ok) throw new Error(`HTTP ${fullRes.status}`);
      const fullPayload = await fullRes.json();
      const fullList = fullPayload?.products && Array.isArray(fullPayload.products) ? fullPayload.products : [];
      setAllProducts(fullList);

      if (location.search) {
        const filteredRes = await fetch(`/api/products${location.search}`);
        if (!filteredRes.ok) throw new Error(`HTTP ${filteredRes.status}`);
        const filteredPayload = await filteredRes.json();
        const filteredList = filteredPayload?.products && Array.isArray(filteredPayload.products) ? filteredPayload.products : [];
        setProducts(filteredList);
      } else {
        setProducts(fullList);
      }
    } catch (err: any) {
      console.error('Retry failed:', err?.message || err);
      setError(String(err?.message || 'Remote products could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };

  // category list derived from fetched products (use all 'Art des Produkts' tags)
  const categories = React.useMemo(() => {
    const setCats = new Set<string>();
    allProducts.forEach((p: any) => {
      const ts = p?.tags;
      if (Array.isArray(ts)) {
        ts.forEach((t: string) => {
          if (t) setCats.add(t);
        });
      }
    });
    return Array.from(setCats).sort();
  }, [allProducts]);

  const setCategoryFilter = (cat?: string) => {
    // If no category provided, clear all filters and show everything
    if (!cat) {
      navigate('/products', { replace: true });
      setProducts(allProducts);
      return;
    }

    // Treat category buttons as tag selectors (they correspond to 'Art des Produkts')
    const next = new URLSearchParams();
    next.set('tag', cat);
    const qs = next.toString();
    navigate(`/products?${qs}`);
    // apply immediately from existing allProducts
    setProducts(applyFilters(allProducts, `?${qs}`));
  };

  // Always apply filters against the full list when products or query changes
  React.useEffect(() => {
    setProducts(applyFilters(allProducts, location.search || ''));
  }, [allProducts, location.search]);

  return (
    <div className="min-h-screen pt-24 px-8 pb-20">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-theme mb-6">
            Unsere Produkte
          </h1>
          <p className="text-lg text-theme-80 max-w-2xl mx-auto">
            Entdecken Sie unsere handgefertigten Steampunk-Kreationen. Jedes Stück ist ein Unikat
            und verbindet viktorianische Eleganz mit modernem Design.
          </p>
        </motion.div>

        {/* Victorian Divider */}
        <div className="victorian-divider my-12" />

        {/* Status */}
        {loading && (
          <div className="text-center mb-6 text-sm text-theme-70">Lade Produkte…</div>
        )}
        {error && (
          <div className="text-center mb-6 text-sm text-red-500">
            <div>{error}</div>
            <button onClick={retry} className="mt-3 inline-block px-4 py-2 bg-brass text-dark-bg rounded-full text-sm hover:bg-brass/90 transition-colors">
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Active filter UI removed - filtering now acts on full product set and tag buttons control state */}

          {/* Category filter buttons */}
          {categories.length > 0 && (
            <div className="mx-auto max-w-5xl px-8 mb-8">
              <div className="flex flex-wrap gap-3 items-center justify-center">
                <button
                  onClick={() => setCategoryFilter(undefined)}
                  className={`px-3 py-1 rounded-full text-sm border ${!new URLSearchParams(location.search).get('category') ? 'bg-brass text-dark-bg border-brass' : 'bg-theme-95 text-theme border-brass/20'}`}>
                  Alle
                </button>
                {categories.map((c) => {
                  const active = new URLSearchParams(location.search).get('tag') === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setCategoryFilter(c)}
                      className={`px-3 py-1 rounded-full text-sm border ${active ? 'bg-brass text-dark-bg border-brass' : 'bg-theme-95 text-theme border-brass/20'}`}>
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        {/* Products Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          {products.length > 0 ? (
            <ProductGrid products={products} showAll={true} />
          ) : (
            !loading && (
              <div className="text-center text-theme-70 py-12">Keine Produkte gefunden.</div>
            )
          )}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="max-w-3xl mx-auto p-8 border border-brass/30 rounded-lg bg-theme-50">
            <h2 className="text-2xl font-heading font-semibold text-brass mb-4">
              Interesse an einem Produkt?
            </h2>
            <p className="text-theme mb-6">
              Kontaktieren Sie uns für weitere Informationen, Preise und Verfügbarkeit.
              Wir fertigen auch individuelle Aufträge nach Ihren Wünschen.
            </p>
            <a
              href="mailto:info@aethersalon1889.de?subject=Produktanfrage"
              className="inline-block px-8 py-3 bg-brass text-dark-bg font-semibold rounded-full hover:bg-brass/90 transition-colors"
            >
              Anfrage senden
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Products;
