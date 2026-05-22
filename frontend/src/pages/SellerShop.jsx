// src/pages/SellerShop.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';
import './SellerShop.css';

function SellerShop() {
  const { sellerId } = useParams();
  const { sellers, products } = useData();

  // Шукаємо за slug або за id
  const seller = sellers.find(
    s => s.slug === sellerId || String(s.id) === String(sellerId)
  );

  const sellerProducts = seller
    ? products.filter(p => String(p.sellerId) === String(seller.id))
    : [];

  if (!seller) {
    return (
      <div className="seller-not-found">
        <h2>Магазин не знайдено :(</h2>
        <Link to="/markets">Повернутися до списку магазинів</Link>
      </div>
    );
  }

  return (
    <div className="seller-shop-page">
      <div className="breadcrumbs">
        <Link to="/">Головна</Link> / <Link to="/markets">Магазини</Link> / <span>{seller.name}</span>
      </div>

      <div className="shop-header-card">
        <img
          src={seller.logoUrl || ''}
          alt={seller.name}
          className="shop-logo"
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div className="shop-info">
          <h1>{seller.name}</h1>
          <p className="shop-description">{seller.description}</p>

          <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
            <symbol id="phone-icon-shop" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </symbol>
            <symbol id="telegram-icon-shop" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.198-.054-.31-.346-.116l-6.405 4.026-2.76-.864c-.6-.188-.614-.6.125-.89l10.785-4.156c.5-.188.948.115.78.891z"/>
            </symbol>
          </svg>

          <div className="shop-contacts">
            {seller.phone && (
              <a href={`tel:${seller.phone}`} className="shop-contact-item">
                <svg style={{ width: 18, height: 18, fill: 'currentColor' }}>
                  <use xlinkHref="#phone-icon-shop" />
                </svg>
                {seller.phone}
              </a>
            )}
            {seller.telegram && (
              <a href={seller.telegram} target="_blank" rel="noopener noreferrer" className="shop-contact-item">
                <svg style={{ width: 18, height: 18, fill: 'currentColor' }}>
                  <use xlinkHref="#telegram-icon-shop" />
                </svg>
                Telegram
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="shop-products-section">
        <h2>Товари від {seller.name} ({sellerProducts.length})</h2>

        {sellerProducts.length > 0 ? (
          <div className="products-grid" style={{ paddingLeft: 0, paddingRight: 0 }}>
            {sellerProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="no-products-msg">Цей майстер ще не додав жодного товару.</p>
        )}
      </div>
    </div>
  );
}

export default SellerShop;
