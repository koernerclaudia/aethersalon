import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import logoUrl from '../assets/logo-wordmark.svg';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Veranstaltungen', path: '/events' },
    { name: 'Produkte', path: '/products' },
    { name: 'Werkstatt', path: '/workshop' },
    { name: 'Kontakt', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-3">
  <div className="relative flex items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
            <img src={logoUrl} alt="Aethersalon Logo" className="h-7 w-auto" />
          </Link>

          {/* Desktop Navigation */}
        
<div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-6 font-normal z-10">
  {navLinks.map((link) => (
    <Link
      key={link.path}
      to={link.path}
      className={`text-sm transition-colors relative group ${
        location.pathname === link.path
          ? 'text-brass'
          : 'text-dark-text dark:text-dark-text hover:text-brass'
      }`}
    >
      {link.name}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 bg-brass transition-all duration-300 ${
          location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
  ))}
</div>


          {/* Theme Toggle & Mobile Menu Button */}
          <div className="ml-auto flex items-center space-x-3 z-20">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-brass/20 hover:bg-brass/30 transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg
                  className="w-5 h-5 text-brass"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-brass"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-dark-text dark:text-dark-text"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="relative z-60 flex items-start justify-center pt-28 px-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full max-w-md bg-transparent">
                  <div className="flex flex-col items-center space-y-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`text-lg text-center font-heading transition-colors ${
                          location.pathname === link.path
                            ? 'text-brass'
                            : 'text-white hover:text-brass'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
