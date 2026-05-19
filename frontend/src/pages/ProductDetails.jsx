// src/pages/ProductDetails.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext'; 
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const { products } = useData();
  const product = products.find(p => p.slug === id || p.id === id);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Товар не знайдено :(</h2>
        <Link to="/catalog">Повернутися до каталогу</Link>
      </div>
    );
  }

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
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-info-section">
          <h1>{product.name}</h1>
          <div className="product-seller-info">
            <p className="seller-label">Продавець:</p>
            <Link to={`/markets/${product.sellerId}`} className="seller-shop-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shop-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
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
            Додати в корзину
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;