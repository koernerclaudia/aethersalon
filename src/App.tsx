import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Gears from './components/Gears';
import Home from './pages/Home';
import Products from './pages/Products';
import Events from './pages/Events';

// Placeholder pages - to be implemented
const About: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-dark-text dark:text-dark-text">Über Mich</h1><p className="mt-4 text-dark-text dark:text-dark-text">Coming soon...</p></div></div>;
const History: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-dark-text dark:text-dark-text">History</h1><p className="mt-4 text-dark-text dark:text-dark-text">Coming soon...</p></div></div>;
const Workshop: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-dark-text dark:text-dark-text">Werkstatt</h1><p className="mt-4 text-dark-text dark:text-dark-text">Coming soon...</p></div></div>;
const Contact: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-dark-text dark:text-dark-text">Kontakt</h1><p className="mt-4 text-dark-text dark:text-dark-text">Coming soon...</p></div></div>;
const Impressum: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-dark-text dark:text-dark-text">Impressum</h1><p className="mt-4 text-dark-text dark:text-dark-text">Coming soon...</p></div></div>;
const Datenschutz: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-dark-text dark:text-dark-text">Datenschutz</h1><p className="mt-4 text-dark-text dark:text-dark-text">Coming soon...</p></div></div>;

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
          <Gears />
          <Header />
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/products" element={<Products />} />
              <Route path="/history" element={<History />} />
              <Route path="/workshop" element={<Workshop />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
