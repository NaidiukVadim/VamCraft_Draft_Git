// src/pages/Markets.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';
import './Markets.css';

function Markets() {
  const { sellers, products } = useData();

  return (
    <div className="markets-page">
      <div className="markets-top-text">
        <h2>Магазини майстрів</h2>
        <p>Відкрийте для себе унікальні крамнички наших талановитих авторів.</p>
      </div>

      <div className="sellers-grid">
        {sellers.map(seller => {
          // Завжди використовуємо slug — normalizeSeller його гарантує
          const shopUrl = `/markets/${seller.slug}`;
          const sellerProducts = products.filter(
            p => String(p.sellerId) === String(seller.id)
          );

          return (
            <div key={seller.id} className="seller-card">

              <div className="seller-header">
                <Link to={shopUrl}>
                  <img
                    src={seller.logoUrl || ''}
                    alt={seller.name}
                    className="seller-logo"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </Link>

                <div className="seller-info">
                  <Link to={shopUrl} style={{ textDecoration: 'none' }}>
                    <h3 className="seller-name-link">{seller.name}</h3>
                  </Link>
                  <p className="seller-description">{seller.description}</p>

                  <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
                    <symbol id={`phone-${seller.id}`} viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </symbol>
                    <symbol id={`tg-${seller.id}`} viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.198-.054-.31-.346-.116l-6.405 4.026-2.76-.864c-.6-.188-.614-.6.125-.89l10.785-4.156c.5-.188.948.115.78.891z"/>
                    </symbol>
                  </svg>

                  <div className="seller-contacts">
                    {seller.phone && (
                      <a href={`tel:${seller.phone}`} className="contact-item">
                        <svg className="contact-icon" style={{ width: 18, height: 18, fill: 'currentColor' }}>
                          <use xlinkHref={`#phone-${seller.id}`} />
                        </svg>
                        {seller.phone}
                      </a>
                    )}
                    {seller.telegram && (
                      <a href={seller.telegram} target="_blank" rel="noopener noreferrer" className="contact-item">
                        <svg className="contact-icon" style={{ width: 18, height: 18, fill: 'currentColor' }}>
                          <use xlinkHref={`#tg-${seller.id}`} />
                        </svg>
                        Telegram
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="seller-products-section">
                <div className="seller-products-header"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <h4 style={{ margin: 0 }}>Товари магазину</h4>
                  <Link to={shopUrl}
                    style={{ color: '#D97757', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Всі товари →
                  </Link>
                </div>

                {sellerProducts.length > 0 ? (
                  <div className="products-grid" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    {sellerProducts.slice(0, 3).map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="products-placeholder">
                    <p>Тут незабаром з'являться товари від "{seller.name}"...</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Markets;
