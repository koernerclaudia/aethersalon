import React from 'react';
import { motion } from 'framer-motion';

const Impressum: React.FC = () => {
  const fadeIn = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <motion.h1 initial="hidden" animate="visible" variants={fadeIn} className="text-4xl font-heading text-dark-text dark:text-dark-text mb-6">
          Impressum
        </motion.h1>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.05 }} className="prose dark:prose-invert max-w-none">
          <div>
            <h2 className="text-2xl font-heading font-semibold text-brass mb-2">Angaben gemäß § 5 TMG</h2>
           
              Aethersalon 1889
              <br />
              Inhaber: Holger Keil
              <br />
              Riesaerstraße 66
              <br />
              04328 Leipzig
            </div>
         
          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Kontakt</h2>
            <p>
              Telefon: <a href="tel:+4917620700674">+49 176 20700674</a>
              <br />
              E-Mail: <a href="mailto:h.keil58@web.de">h.keil58@web.de</a>
              <br />
              (Zusatze-Mailadresse auf der Seite: <a href="mailto:info@aethersalon1889.de">info@aethersalon1889.de</a>)
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Verantwortlich für den Inhalt gemäß § 55 Abs. 2 RStV</h2>
            <p>Holger Keil, Riesaerstraße 66, 04328 Leipzig</p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Umsatzsteuer</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: <strong>DE — bitte eintragen</strong>
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Handelsregister</h2>
            <p>
              Eintragung im Handelsregister: <strong>falls vorhanden, bitte Registergericht und Registernummer eintragen</strong>
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
              gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir
              für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
              überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter
              sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen
              des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Online-Streitbeilegung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer">https://ec.europa.eu/consumers/odr/</a>.
              Unsere E‑Mail‑Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Hinweis zur außergerichtlichen Streitbeilegung</h2>
            <p>
              Wir sind weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="mt-4 mb-4 pt-4 border-t border-brass/20">
            <h2 className="text-xl font-heading font-semibold text-brass mb-2">Sonstige Angaben / Ergänzungen</h2>
            <p>
              Falls Sie weitere Angaben (z. B. Handelsregister, Umsatzsteuer-ID) erwarten, tragen wir diese nach, sobald Sie uns vorliegen.
              Bitte teilen Sie uns fehlende oder korrigierte Angaben per E‑Mail an <a href="mailto:h.keil58@web.de">h.keil58@web.de</a> mit.
            </p>
          </section>

          <p className="mt-6 text-sm text-theme-80">Letzte Aktualisierung: 19.11.2025</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Impressum;
