import React from 'react';
import { motion } from 'framer-motion';

const Cookies: React.FC = () => {
  const fadeIn = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <motion.h1 initial="hidden" animate="visible" variants={fadeIn} className="text-4xl font-heading text-dark-text dark:text-dark-text mb-6">
          Cookie-Richtlinie
        </motion.h1>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.05 }} className="prose dark:prose-invert max-w-none">
          <section>
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Allgemeines</h2>
            <p>Diese Website verwendet Cookies, um die Benutzererfahrung zu verbessern, Zugriffe zu analysieren und Funktionalität bereitzustellen.</p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Welche Cookies verwenden wir?</h2>
            <p>
              - Notwendige Cookies: Ermöglichen grundlegende Funktionen wie Navigation und Sicherheit.
              <br />
              - Statistik-/Analyse-Cookies: Helfen uns, Seitenaufrufe und Nutzerverhalten anonymisiert auszuwerten (z. B. Google Analytics).
              <br />
              - Marketing-/Tracking-Cookies: Optional, dienen zur Ausspielung personalisierter Werbung.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Einwilligung & Widerruf</h2>
            <p>
              Beim ersten Besuch werden Sie um Ihre Einwilligung gebeten (sofern erforderlich). Sie können Ihre Einstellungen jederzeit
              über die Cookie-Einstellungen der Website ändern oder in Ihrem Browser gespeicherte Cookies löschen.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Drittanbieter</h2>
            <p>
              Einige Dienste (z. B. Google Analytics, Social-Media-Plugins) können Cookies setzen und Daten an Drittanbieter übermitteln.
              Informationen zu Art, Zweck und Speicherdauer dieser Cookies finden Sie in den jeweiligen Datenschutzhinweisen der Anbieter.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Kontakt</h2>
            <p>
              Bei Fragen zu dieser Cookie-Richtlinie kontaktieren Sie uns bitte per E‑Mail: <a href="mailto:h.keil58@web.de">h.keil58@web.de</a>
            </p>
          </section>

          <p className="mt-6 text-sm text-theme-80">Letzte Aktualisierung: 19.11.2025</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Cookies;
