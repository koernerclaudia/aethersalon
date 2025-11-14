import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-theme-50 border-t border-brass/30 py-12">
      <div className="mx-auto max-w-5xl px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
          {/* Logo & Description (left) */}
          <div className="flex flex-col items-center md:items-start md:pr-6 md:col-span-2">
            <img
              src="/Aethersalon.svg"
              alt="Aethersalon 1889"
              className="h-auto w-60 opacity-90 hover:opacity-100 transition-opacity mb-4"
            />
            <p className="text-theme text-sm max-w-sm text-center md:text-left">
              Aethersalon 1889 — Kuratiertes Steampunk-Zubehör, Veranstaltungen und
              kuriose Fundstücke für Liebhaber viktorianischer Phantasien.
            </p>
          </div>

          {/* Right: three columns (navigation + legal + contact) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-span-3 text-center sm:text-left">
          {/* Navigation Links (first column) */}
          <div>
            <h3 className="text-xl font-heading font-semibold text-brass mb-3">
              Aethersalon 1889
            </h3>
            <ul className="footer-links space-y-2">
              <li>
                <Link to="/" className="text-theme hover:text-brass transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-theme hover:text-brass transition-colors text-sm">
                  Über Uns
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-theme hover:text-brass transition-colors text-sm">
                  Veranstaltungen
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-theme hover:text-brass transition-colors text-sm">
                  Produkte
                </Link>
              </li>
               <li>
                <Link to="/history" className="text-theme hover:text-brass transition-colors text-sm">
                  Steampunk
                </Link>
              </li>
               <li>
                <Link to="/about" className="text-theme hover:text-brass transition-colors text-sm">
                  Über Uns
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-theme hover:text-brass transition-colors text-sm">
                  Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links & Contact (right) */}
          <div>
             <h3 className="text-xl font-heading font-semibold text-brass mb-3">
              Aethersalon 1889
            </h3>
            <ul className="footer-links space-y-2">
              <li>
                <Link to="/impressum" className="text-theme hover:text-brass transition-colors text-sm">
                  Impressum
                </Link>
              </li>
              </ul>
            <h3 className="text-xl font-heading font-semibold text-brass mb-3">Rechtliches</h3>
            <ul className="footer-links space-y-2">
              <li>
                <Link to="/impressum" className="text-theme hover:text-brass transition-colors text-sm">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/datenschutz" className="text-theme hover:text-brass transition-colors text-sm">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-theme hover:text-brass transition-colors text-sm block">
                  Kontaktformular
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt column */}
          <div>
            <h3 className="text-xl font-heading font-semibold text-brass mb-3">Kontakt</h3>
            <address className="not-italic text-theme text-sm space-y-2">
              <div>Beispielstraße 1</div>
              <div>12345 Musterstadt</div>
              <div>
                <a href="tel:+49123123456" className="text-theme hover:text-brass">+49 123 123456</a>
              </div>
              <div>
                <a href="mailto:info@aethersalon1889.de" className="text-theme hover:text-brass">info@aethersalon1889.de</a>
              </div>
            </address>
            <div className="mt-4">
              <a href="#" className="text-brass hover:text-brass/80 transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-brass/20 text-center md:text-left md:flex md:items-center md:justify-between">
          <p className="text-theme text-sm">© {currentYear} Aethersalon 1889. Alle Rechte vorbehalten.</p>
          <div className="mt-4 md:mt-0">
            <nav className="flex flex-wrap justify-center md:justify-end gap-4">
              <Link to="/impressum" className="text-theme hover:text-brass text-sm">Impressum</Link>
              <Link to="/datenschutz" className="text-theme hover:text-brass text-sm">Datenschutz</Link>
            </nav>
          </div>
        </div>
      </div>
      {/* end footer */}
    </footer>
  );
};

export default Footer;