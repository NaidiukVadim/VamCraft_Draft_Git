// src/pages/OrderConfirmation.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const orderNumber = Math.floor(Math.random() * 90000) + 10000;

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1>Замовлення прийнято!</h1>
        <p className="order-number">Номер вашого замовлення: <strong>#{orderNumber}</strong></p>
        <p className="confirmation-text">
          Дякуємо за покупку! Наш майстер зв'яжеться з вами найближчим часом для підтвердження деталей доставки.
        </p>
        <div className="confirmation-actions">
          <Link to="/catalog" className="continue-btn">Продовжити покупки</Link>
          <Link to="/" className="home-link">На головну</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;   