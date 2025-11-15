import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Partners from './pages/Partners';
import Events from './pages/Events';
import ProductDetails from './pages/ProductDetails';
import EventDetails from './pages/EventDetailsPage';
import About from './pages/About';
import Workshop from './pages/Workshop';
import PasswordGate from './pages/PasswordGate.tsx';
import History from './pages/History';

// Placeholder pages - to be implemented (except History which is implemented in ./pages/History)
const Contact: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-dark-text dark:text-dark-text">Kontakt</h1><p className="mt-4 text-dark-text dark:text-dark-text">Coming soon...</p></div></div>;
const Impressum: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-dark-text dark:text-dark-text">Impressum</h1><p className="mt-4 text-dark-text dark:text-dark-text">Coming soon...</p></div></div>;
const Datenschutz: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-dark-text dark:text-dark-text">Datenschutz</h1><p className="mt-4 text-dark-text dark:text-dark-text">Coming soon...</p></div></div>;

function App() {
  return (
    <ThemeProvider>
     <Router basename={import.meta.env.BASE_URL}>
        <PasswordGate>
          <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
            {/* Gears animation removed per request */}
            <Header />
            <ScrollToTop />
            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/products" element={<Products />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/history" element={<History />} />
                <Route path="/workshop" element={<Workshop />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/datenschutz" element={<Datenschutz />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </PasswordGate>
      </Router>
    </ThemeProvider>
  );
}

export default App;
