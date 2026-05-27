// src/components/ProductCard.jsx
import './ProductCard.css';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Placeholder SVG якщо картинка не завантажилась
const IMG_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14' font-family='Arial'%3EФото%3C/text%3E%3C/svg%3E";

function ProductCard({ product, isRecommendedStyle }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    // Додаткова перевірка в функції на випадок, якщо хтось обійде disabled
    if (!product.inStock) return; 
    
    addToCart(product);
    alert(`Товар "${product.name}" додано в кошик!`);
  };

  const productLink = `/product/${product.slug || product.id}`;

  const shortDescription = product.description 
    ? product.description.split('.')[0] 
    : `Куплено ${product.salesCount || 0} разів`;

  return (
    <div className={`product-card ${isRecommendedStyle ? 'recommended-card' : ''} ${!product.inStock ? 'out-of-stock-card' : ''}`}>

      <Link to={productLink} className="product-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="image-placeholder">
          <img
            src={product.imageUrl || IMG_PLACEHOLDER}
            alt={product.name}
            onError={(e) => { e.target.src = IMG_PLACEHOLDER; }}
          />
          {/* Візуальна плашка "Немає в наявності" поверх фото для кращого UX */}
          {!product.inStock && (
            <div className="out-of-stock-badge">Немає в наявності</div>
          )}
        </div>

        <div className="product-info">
          <p className="product-owner">{product.owner}</p>
          <h3 className="product-title">{product.name}</h3>
          {isRecommendedStyle && (
            <p className="product-full-description">{shortDescription}</p>
          )}
        </div>
      </Link>

      <div className="product-info-bottom">
        <div className="price-row">
          <p className={`product-price ${isRecommendedStyle ? 'price-large' : ''}`}>
            {product.price} ₴
          </p>

          <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
            <symbol id="cart-icon" viewBox="0 0 18 16">
              <path d="M0 0.75C0 0.334375 0.334375 0 0.75 0H2.17188C2.85938 0 3.46875 0.4 3.75312 1H16.5969C17.4187 1 18.0188 1.78125 17.8031 2.575L16.5219 7.33437C16.2563 8.31563 15.3656 9 14.35 9H5.33437L5.50313 9.89062C5.57188 10.2437 5.88125 10.5 6.24062 10.5H15.25C15.6656 10.5 16 10.8344 16 11.25C16 11.6656 15.6656 12 15.25 12H6.24062C5.15938 12 4.23125 11.2312 4.03125 10.1719L2.41875 1.70312C2.39688 1.58438 2.29375 1.5 2.17188 1.5H0.75C0.334375 1.5 0 1.16562 0 0.75ZM4 14.5C4 14.303 4.0388 14.108 4.11418 13.926C4.18956 13.744 4.30005 13.5786 4.43934 13.4393C4.57863 13.3001 4.74399 13.1896 4.92597 13.1142C5.10796 13.0388 5.30302 13 5.5 13C5.69698 13 5.89204 13.0388 6.07403 13.1142C6.25601 13.1896 6.42137 13.3001 6.56066 13.4393C6.69995 13.5786 6.81044 13.744 6.88582 13.926C6.9612 14.108 7 14.303 7 14.5C7 14.697 6.9612 14.892 6.88582 15.074C6.81044 15.256 6.69995 15.4214 6.56066 15.5607C6.42137 15.6999 6.25601 15.8104 6.07403 15.8858C5.89204 15.9612 5.69698 16 5.5 16C5.30302 16 5.10796 15.9612 4.92597 15.8858C4.74399 15.8104 4.57863 15.6999 4.43934 15.5607C4.30005 15.4214 4.18956 15.256 4.11418 15.074C4.0388 14.892 4 14.697 4 14.5ZM14.5 13C14.8978 13 15.2794 13.158 15.5607 13.4393C15.842 13.7206 16 14.1022 16 14.5C16 14.8978 15.842 15.2794 15.5607 15.5607C15.2794 15.842 14.8978 16 14.5 16C14.1022 16 13.7206 15.842 13.4393 15.5607C13.158 15.2794 13 14.8978 13 14.5C13 14.1022 13.158 13.7206 13.4393 13.4393C13.7206 13.158 14.1022 13 14.5 13ZM7.875 5C7.875 5.34375 8.15625 5.625 8.5 5.625H9.875V7C9.875 7.34375 10.1562 7.625 10.5 7.625C10.8438 7.625 11.125 7.34375 11.125 7V5.625H12.5C12.8438 5.625 13.125 5.34375 13.125 5C13.125 4.65625 12.8438 4.375 12.5 4.375H11.125V3C11.125 2.65625 10.8438 2.375 10.5 2.375C10.1562 2.375 9.875 2.65625 9.875 3V4.375H8.5C8.15625 4.375 7.875 4.65625 7.875 5Z"/>
            </symbol>
          </svg>

          {/* ДОДАНО disabled={!product.inStock} НА ОБИДВІ КНОПКИ */}
          {isRecommendedStyle ? (
            <button 
              className="add-to-cart-btn-text" 
              disabled={!product.inStock} 
              onClick={handleAddToCart}
            >
              {product.inStock ? 'Додати в кошик' : 'Немає'}
            </button>
          ) : (
            <button 
              className="add-to-cart-btn" 
              title={product.inStock ? "Додати в кошик" : "Товару немає в наявності"} 
              disabled={!product.inStock} 
              onClick={handleAddToCart}
            >
              <svg className="cart-icon">
                <use xlinkHref="#cart-icon" />
              </svg>
            </button>
          )}
        </div>

        {!isRecommendedStyle && (
          <div className="description-row">
            <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
              <symbol id="fire-icon" viewBox="0 0 13 14" width="13" height="14">
                <path d="M4.35586 0.147614C4.56914 -0.0519949 4.9 -0.0492606 5.11328 0.150349C5.86797 0.858552 6.57617 1.62144 7.23789 2.44722C7.53867 2.05347 7.88047 1.62418 8.24961 1.27418C8.46563 1.07183 8.79922 1.07183 9.01523 1.27691C9.96133 2.17926 10.7625 3.37144 11.3258 4.50347C11.8809 5.6191 12.25 6.75933 12.25 7.56324C12.25 11.0523 9.52109 14 6.125 14C2.69062 14 0 11.0496 0 7.56051C0 6.51051 0.486719 5.22808 1.24141 3.95933C2.0043 2.67144 3.08164 1.32886 4.35586 0.147614ZM6.17148 11.375C6.86328 11.375 7.47578 11.1836 8.05273 10.8007C9.20391 9.99683 9.51289 8.38902 8.82109 7.12574C8.69805 6.87965 8.38359 6.86324 8.20586 7.07105L7.5168 7.87222C7.33633 8.08004 7.01094 8.07457 6.84141 7.85855C6.39023 7.28433 5.58359 6.25894 5.12422 5.67652C4.95195 5.45777 4.62383 5.45504 4.44883 5.67379C3.52461 6.8359 3.05977 7.56871 3.05977 8.39176C3.0625 10.2648 4.44609 11.375 6.17148 11.375Z" fill="#F97316"/>
              </symbol>
            </svg>
            <svg className="fire-icon">
              <use xlinkHref="#fire-icon" />
            </svg>
            <p className="product-description">{shortDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;