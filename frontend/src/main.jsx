// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import { CartProvider } from './context/CartContext.jsx';
import { DataProvider } from './context/DataContext';

// ScrollToTop — скидає позицію скролу при зміні маршруту
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ScrollToTop />
      <DataProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </DataProvider>
    </HashRouter>
  </StrictMode>
);
