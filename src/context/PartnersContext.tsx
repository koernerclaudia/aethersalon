import React from 'react';
import type { Partner } from '../data/partners';

type ContextShape = {
  partners: Partner[];
  loading: boolean;
  error?: string | null;
  refresh: () => Promise<void>;
};

const PartnersContext = React.createContext<ContextShape | undefined>(undefined);

export const PartnersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [partners, setPartners] = React.useState<Partner[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/partners');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      if (Array.isArray(payload?.partners)) setPartners(payload.partners);
      else setPartners([]);
    } catch (err: any) {
      console.warn('PartnersProvider: failed to load partners', err);
      setError(err?.message || String(err));
      setPartners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const ctx: ContextShape = React.useMemo(() => ({ partners, loading, error, refresh: load }), [partners, loading, error, load]);

  return <PartnersContext.Provider value={ctx}>{children}</PartnersContext.Provider>;
};

export function usePartners() {
  const ctx = React.useContext(PartnersContext);
  if (!ctx) throw new Error('usePartners must be used within a PartnersProvider');
  return ctx;
}

export default PartnersContext;
