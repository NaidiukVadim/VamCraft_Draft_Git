// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { CartProvider } from './context/CartContext.jsx';
import { DataProvider } from './context/DataContext';
import ScrollToTop from './components/ScrollToTop.jsx';

// Просто викликаємо createRoot напряму
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
  </StrictMode>,
);