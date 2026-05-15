// src/components/ScrollToTopButton.jsx
import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Функція, яка перевіряє, наскільки далеко ми проскролили
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true); // Показуємо кнопку, якщо проскролили більше 300px
    } else {
      setIsVisible(false); // Ховаємо, якщо ми нагорі
    }
  };

  // Функція плавного підйому
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Робить скрол плавним (як по маслу)
    });
  };

  // Вішаємо "слухача" скролу при завантаженні компонента
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    // Прибираємо слухача, коли компонент знищується
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <button onClick={scrollToTop} className="scroll-btn" title="Повернутися вгору">
          {/* Мінімалістична SVG-стрілочка вгору */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </button>
      )}
    </div>
  );
}