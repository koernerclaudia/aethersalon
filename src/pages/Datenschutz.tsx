import React from 'react';
import { motion } from 'framer-motion';

const Datenschutz: React.FC = () => {
  const fadeIn = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <motion.h1 initial="hidden" animate="visible" variants={fadeIn} className="text-4xl font-heading text-dark-text dark:text-dark-text mb-6">
          Datenschutzerklärung
        </motion.h1>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.05 }} className="prose dark:prose-invert max-w-none">
          <section>
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Grundlegendes</h2>
            <p>
              Wir legen großen Wert auf den Schutz Ihrer personenbezogenen Daten. Nachfolgend informieren wir Sie
              über Art, Umfang und Zweck der Erhebung und Verwendung personenbezogener Daten.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Verantwortlicher</h2>
            <p>
              Aethersalon 1889<br />Inhaber: Holger Keil<br />Riesaerstraße 66, 04328 Leipzig<br />E‑Mail: <a href="mailto:h.keil58@web.de">h.keil58@web.de</a>
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Rechtsgrundlagen</h2>
            <p>
              Die Verarbeitung personenbezogener Daten erfolgt auf Basis der Datenschutz-Grundverordnung (DSGVO), des BDSG
              sowie ggf. weiterer gesetzlicher Grundlagen.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Zwecke der Verarbeitung</h2>
            <p>
              Wir verarbeiten personenbezogene Daten z. B. zur Erfüllung von Verträgen, zur Bearbeitung von Anfragen, zur Bereitstellung
              der Website und zu Analysezwecken (z. B. Google Analytics). Sofern erforderlich, holen wir zuvor Ihre Einwilligung ein.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch sowie auf Datenübertragbarkeit.
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an die oben genannte E‑Mail-Adresse.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Drittanbieter & Analyse</h2>
            <p>
              Auf unserer Website können Dienste Dritter eingebunden sein (z. B. Google Fonts, Maps, Analytics). Diese Anbieter verarbeiten
              ggf. Daten in Drittstaaten. Nähere Informationen finden Sie in den weiter unten genannten Abschnitten oder in den
              Datenschutzhinweisen der Drittanbieter.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Kontakt & Beschwerde</h2>
            <p>
              Bei Fragen zum Datenschutz können Sie sich an <a href="mailto:h.keil58@web.de">h.keil58@web.de</a> wenden.
              Ebenso steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde zu.
            </p>
          </section>

          <p className="mt-6 text-sm text-theme-80">Letzte Aktualisierung: 19.11.2025</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Datenschutz;
