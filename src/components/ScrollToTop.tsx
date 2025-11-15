import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Ensures the window scrolls to the top whenever the route pathname changes.
 * Add this once inside the Router so every navigation lands at the top.
 */
export default function ScrollToTop(): null {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use instant jump to top to avoid visible smooth scrolling from previous page
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
