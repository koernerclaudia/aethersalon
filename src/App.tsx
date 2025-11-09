import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Events from './pages/Events';
import ProductDetails from './pages/ProductDetails';
import EventDetails from './pages/EventDetails';

// Placeholder pages - to be implemented
const History: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-theme">History</h1><p className="mt-4 text-theme">Coming soon...</p></div></div>;
const Workshop: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-theme">Werkstatt</h1><p className="mt-4 text-theme">Coming soon...</p></div></div>;
const Contact: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-theme">Kontakt</h1><p className="mt-4 text-theme">Coming soon...</p></div></div>;
const Impressum: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-theme">Impressum</h1><p className="mt-4 text-theme">Coming soon...</p></div></div>;
const Datenschutz: React.FC = () => <div className="min-h-screen pt-24 px-4"><div className="container mx-auto"><h1 className="text-4xl font-heading text-theme">Datenschutz</h1><p className="mt-4 text-theme">Coming soon...</p></div></div>;

function App() {
  return (
    <ThemeProvider>
     <Router basename={import.meta.env.BASE_URL}>
  <div className="min-h-screen bg-theme text-theme transition-colors duration-300">
          {/* Gears animation removed per request */}
          <Header />
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/events/:id" element={<EventDetails />} />
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
