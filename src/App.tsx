// React import not required with the new JSX transform
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PartnersProvider } from './context/PartnersContext';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Moebelstuecke from './pages/Moebelstuecke';
import Partners from './pages/Partners';
import Events from './pages/Events';
import ProductDetails from './pages/ProductDetails';
import EventDetails from './pages/EventDetailsPage';
import About from './pages/About';
import Workshop from './pages/Workshop';
import PasswordGate from './pages/PasswordGate.tsx';
import History from './pages/History';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import Cookies from './pages/Cookies';
import Contact from './pages/Contact';

// Placeholder Contact page is extracted to src/pages/Contact.tsx (History is implemented in ./pages/History)

function App() {
  return (
  <ThemeProvider>
   <PartnersProvider>
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
                <Route path="/moebelstuecke" element={<Moebelstuecke />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/history" element={<History />} />
                <Route path="/workshop" element={<Workshop />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/datenschutz" element={<Datenschutz />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </PasswordGate>
      </Router>
     </PartnersProvider>
    </ThemeProvider>
  );
}

export default App;
