// src/pages/ProductDetails.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

const IMG_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='16' font-family='Arial'%3EФото%3C/text%3E%3C/svg%3E";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products, sellers } = useData();

  // Шукаємо за slug або за id (обидва приводимо до рядка)
  const product = products.find(
    p => p.slug === id || String(p.id) === String(id)
  );

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Товар не знайдено :(</h2>
        <Link to="/catalog">Повернутися до каталогу</Link>
      </div>
    );
  }

  // Знаходимо продавця щоб отримати його slug для посилання
  const seller = sellers.find(s => String(s.id) === String(product.sellerId));
  const sellerLink = seller
    ? `/markets/${seller.slug || seller.id}`
    : `/markets/${product.sellerId}`;

  const handleAddToCart = () => {
    addToCart(product);
    alert(`Товар "${product.name}" додано до кошика!`);
  };

  return (
    <div className="product-details-page">
      <div className="breadcrumbs">
        <Link to="/">Головна</Link> / <Link to="/catalog">Каталог</Link> / <span>{product.name}</span>
      </div>

      <div className="product-details-container">
        <div className="product-image-section">
          <img
            src={product.imageUrl || IMG_PLACEHOLDER}
            alt={product.name}
            onError={e => { e.target.src = IMG_PLACEHOLDER; }}
          />
        </div>

        <div className="product-info-section">
          <h1>{product.name}</h1>

          <div className="product-seller-info">
            <p className="seller-label">Продавець:</p>
            <Link to={sellerLink} className="seller-shop-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" className="shop-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <strong>{product.owner}</strong>
            </Link>
          </div>

          <div className="product-price">{product.price} ₴</div>

          <p className={`product-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? 'В наявності' : 'Немає в наявності'}
          </p>

          <div className="product-description">
            <h3>Опис товару:</h3>
            <p>{product.description}</p>
          </div>

          <button
            className="add-to-cart-btn-large"
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            Додати в кошик
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
