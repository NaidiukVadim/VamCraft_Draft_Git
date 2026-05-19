// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  // Дістаємо поточний шлях (наприклад, '/catalog' або '/cart')
  const { pathname } = useLocation();

  // Запускаємо ефект щоразу, коли змінюється шлях
  useEffect(() => {
    // Піднімаємо вікно на координати X: 0, Y: 0
    window.scrollTo(0, 0);
  }, [pathname]);

  // Цей компонент нічого не малює на екрані, він працює "в тіні"
  return null;
}