import React, { useEffect, useState } from 'react';

const PASSWORD = import.meta.env.VITE_SITE_PASSWORD as string | undefined;

const STORAGE_KEY = 'as1889_auth';

type PasswordGateProps = {
  children: React.ReactNode;
};

export const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') setIsAuthed(true);
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!PASSWORD) {
      setError('Password is not configured.');
      return;
    }

    if (passwordInput === PASSWORD) {
      setIsAuthed(true);
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  if (isAuthed) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3c2b4a] via-[#0a0d17] to-[#05060b] text-[#f4e8d8]">
      <div className="max-w-md w-[90%] rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, rgba(10,13,23,0.95), rgba(35,24,50,0.98))', border: '1px solid rgba(255,215,160,0.12)' }}>
        <div className="absolute right-[-40px] top-[-40px] w-28 h-28 rounded-full border-dashed border border-[rgba(255,215,160,0.35)] opacity-50" />
        <header className="mb-4">
          <div className="text-xs tracking-widest uppercase text-[#d7b98b] mb-1">AETHERSALON 1889</div>
          <h1 className="text-xl font-semibold flex items-center gap-2"> <span className="inline-flex w-6 h-6 rounded-full border border-[rgba(255,215,160,0.6)] items-center justify-center text-xs">🔐</span>Zugang zur Webseite</h1>
          <p className="text-sm text-[rgba(244,232,216,0.75)] mt-2">Dieser Bereich des Salons ist reserviert. Gib das Zugangspasswort ein, um das Atelier freizuschalten.</p>
        </header>

        <form onSubmit={handleSubmit} className="mt-2">
          <label className="block text-sm mb-1 text-[rgba(244,232,216,0.9)]">Passwort:</label>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="••••••••••"
            autoComplete="current-password"
            className="w-full p-2.5 rounded-lg border border-[rgba(255,215,160,0.4)] bg-[rgba(255,255,255,0.02)] text-[#f4e8d8] text-sm outline-none"
          />

          {error && <div className="mt-2 text-sm text-[#ffb3a0]">{error}</div>}

          <button type="submit" className="mt-4 w-full py-2 rounded-full font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #e9b15b 0%, #c4782f 45%, #9c5a1f 100%)', color: '#151219' }}>
            Enter Aethersalon
          </button>
        </form>

        <footer className="mt-4 text-xs text-[rgba(244,232,216,0.6)] flex justify-between">
          <span>Nur autorisierte Eingeladene.</span>
          <span className="opacity-80">1889-K</span>
        </footer>
      </div>
    </div>
  );
};

export default PasswordGate;
