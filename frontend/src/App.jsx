// src/App.jsx
import { useEffect, useState } from 'react';
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import Home             from './pages/Home';
import Catalog          from './pages/Catalog';
import Markets          from './pages/Markets';
import SellerShop       from './pages/SellerShop';
import Admin            from './pages/Admin';
import Cart             from './pages/Cart';
import ProductDetails   from './pages/ProductDetails';
import OrderConfirmation from './pages/OrderConfirmation';
import { useCart }      from './context/CartContext';
import './App.css';
import ScrollToTopButton from './components/ScrollToTopButton';

function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [searchQuery,        setSearchQuery]        = useState('');
  const [isMobileMenuOpen,   setIsMobileMenuOpen]   = useState(false);

  const navigate = useNavigate();
  const { cartItems } = useCart();

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchQuery(text);
    if (text.trim() !== '') navigate('/catalog');
  };

  const openModal = (e) => {
    e.preventDefault();
    setIsContactModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeModal      = () => setIsContactModalOpen(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Закриваємо дравер при кліку поза хедером
  useEffect(() => {
    const handler = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.header')) setIsMobileMenuOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [isMobileMenuOpen]);

  // Блокуємо скрол тіла коли дравер відкритий
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const categories = ['Кераміка','Текстиль','Дерево','Шкіра','Прикраси','Дім','Скло','Мистецтво'];

  return (
    <div className="app-container">

      {/* ══ SVG СПРАЙТИ ══ */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id="logo-icon" viewBox="0 0 36 30">
          <path className="logo-bg" d="M35.75 30H2V0H35.75V30Z"/>
          <path className="logo-symbol" d="M33.875 9.37497L33.8691 13.6289C33.8633 16.6875 32.4629 19.5468 30.1191 21.4277C30.125 21.3164 30.125 21.2051 30.125 21.0937V20.625C30.125 16.4179 27.957 12.5039 24.3887 10.2715L20.8613 8.06833C20.3574 7.75193 19.8125 7.57615 19.2617 7.51755L16.5723 2.85935C16.1855 2.18552 16.4141 1.32419 17.0879 0.937474C17.7617 0.550755 18.623 0.77927 19.0098 1.4531L23.5801 9.36911C23.7734 9.7031 24.207 9.82029 24.541 9.62693C24.875 9.43357 24.9922 8.99997 24.7988 8.66599L21.166 2.37302C20.7793 1.69919 21.0078 0.837864 21.6816 0.451145C22.3555 0.0644267 23.2109 0.292942 23.5977 0.96677L27.582 7.86911L30.1191 12.2636L30.125 9.37497C30.125 8.33786 30.9688 7.49997 32 7.49997C33.0312 7.49997 33.875 8.34372 33.875 9.37497ZM16.291 5.18552L17.7324 7.67575C16.918 7.93943 16.1855 8.47849 15.6992 9.25779C15.6465 9.33982 15.5996 9.42771 15.5527 9.5156L13.8594 6.58591C13.4727 5.91208 13.7012 5.05075 14.375 4.66404C15.0488 4.27732 15.9102 4.50583 16.2969 5.17966L16.291 5.18552ZM13.5723 8.91794L15.1426 11.6367C15.1777 11.9883 15.2656 12.3281 15.3945 12.6562H15.125H14.3457H12.4883L11.1406 10.3242C10.7539 9.65036 10.9824 8.78904 11.6562 8.40232C12.3301 8.0156 13.1914 8.24411 13.5781 8.91794H13.5723ZM17.2871 10.2539C17.8379 9.37497 18.9922 9.1113 19.8711 9.65622L23.3984 11.8593C26.416 13.7519 28.25 17.0625 28.25 20.625V21.0937C28.25 26.0097 24.2598 30 19.3438 30H9.03125C8.25195 30 7.625 29.373 7.625 28.5937C7.625 27.8144 8.25195 27.1875 9.03125 27.1875H14.4219C14.8086 27.1875 15.125 26.8711 15.125 26.4843C15.125 26.0976 14.8086 25.7812 14.4219 25.7812H7.15625C6.37695 25.7812 5.75 25.1543 5.75 24.375C5.75 23.5957 6.37695 22.9687 7.15625 22.9687H14.4219C14.8086 22.9687 15.125 22.6523 15.125 22.2656C15.125 21.8789 14.8086 21.5625 14.4219 21.5625H5.28125C4.50195 21.5625 3.875 20.9355 3.875 20.1562C3.875 19.3769 4.50195 18.75 5.28125 18.75H14.4219C14.8086 18.75 15.125 18.4336 15.125 18.0468C15.125 17.6601 14.8086 17.3437 14.4219 17.3437H7.15625C6.37695 17.3437 5.75 16.7168 5.75 15.9375C5.75 15.1582 6.37695 14.5312 7.15625 14.5312H15.125H20.5859L17.8789 12.8379C17 12.2871 16.7363 11.1328 17.2812 10.2539H17.2871Z"/>
        </symbol>
        <symbol id="dandruff-icon" viewBox="0 0 16 16">
          <path d="M13 6.5C13 7.93438 12.5344 9.25938 11.75 10.3344L15.7063 14.2937C16.0969 14.6844 16.0969 15.3188 15.7063 15.7094C15.3156 16.1 14.6812 16.1 14.2906 15.7094L10.3344 11.75C9.25938 12.5375 7.93438 13 6.5 13C2.90937 13 0 10.0906 0 6.5C0 2.90937 2.90937 0 6.5 0C10.0906 0 13 2.90937 13 6.5ZM6.5 11C7.09095 11 7.67611 10.8836 8.22208 10.6575C8.76804 10.4313 9.26412 10.0998 9.68198 9.68198C10.0998 9.26412 10.4313 8.76804 10.6575 8.22208C10.8836 7.67611 11 7.09095 11 6.5C11 5.90905 10.8836 5.32389 10.6575 4.77792C10.4313 4.23196 10.0998 3.73588 9.68198 3.31802C9.26412 2.90016 8.76804 2.56869 8.22208 2.34254C7.67611 2.1164 7.09095 2 6.5 2C5.90905 2 5.32389 2.1164 4.77792 2.34254C4.23196 2.56869 3.73588 2.90016 3.31802 3.31802C2.90016 3.73588 2.56869 4.23196 2.34254 4.77792C2.1164 5.32389 2 5.90905 2 6.5C2 7.09095 2.1164 7.67611 2.34254 8.22208C2.56869 8.76804 2.90016 9.26412 3.31802 9.68198C3.73588 10.0998 4.23196 10.4313 4.77792 10.6575C5.32389 10.8836 5.90905 11 6.5 11Z"/>
        </symbol>
        <symbol id="basket-icon" viewBox="0 0 27 24">
          <path d="M0 1.125C0 0.501562 0.501562 0 1.125 0H3.25781C4.28906 0 5.20312 0.6 5.62969 1.5H24.8953C26.1281 1.5 27.0281 2.67188 26.7047 3.8625L24.7828 11.0016C24.3844 12.4734 23.0484 13.5 21.525 13.5H8.00156L8.25469 14.8359C8.35781 15.3656 8.82187 15.75 9.36094 15.75H22.875C23.4984 15.75 24 16.2516 24 16.875C24 17.4984 23.4984 18 22.875 18H9.36094C7.73906 18 6.34688 16.8469 6.04688 15.2578L3.62813 2.55469C3.59531 2.37656 3.44062 2.25 3.25781 2.25H1.125C0.501562 2.25 0 1.74844 0 1.125ZM6 21.75C6 20.5074 7.00736 19.5 8.25 19.5C9.49264 19.5 10.5 20.5074 10.5 21.75C10.5 22.9926 9.49264 24 8.25 24C7.00736 24 6 22.9926 6 21.75ZM21.75 19.5C22.9926 19.5 24 20.5074 24 21.75C24 22.9926 22.9926 24 21.75 24C20.5074 24 19.5 22.9926 19.5 21.75C19.5 20.5074 20.5074 19.5 21.75 19.5Z"/>
        </symbol>
        <symbol id="admin-icon" viewBox="0 0 18 20">
          <path d="M8.75 10C10.0761 10 11.3479 9.47322 12.2855 8.53553C13.2232 7.59785 13.75 6.32608 13.75 5C13.75 3.67392 13.2232 2.40215 12.2855 1.46447C11.3479 0.526784 10.0761 0 8.75 0C7.42392 0 6.15215 0.526784 5.21447 1.46447C4.27678 2.40215 3.75 3.67392 3.75 5C3.75 6.32608 4.27678 7.59785 5.21447 8.53553C6.15215 9.47322 7.42392 10 8.75 10ZM6.96484 11.875C3.11719 11.875 0 14.9922 0 18.8398C0 19.4805 0.519531 20 1.16016 20H16.3398C16.9805 20 17.5 19.4805 17.5 18.8398C17.5 14.9922 14.3828 11.875 10.5352 11.875H6.96484Z"/>
        </symbol>
        <symbol id="facebook-icon" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </symbol>
        <symbol id="instagram-icon" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </symbol>
        <symbol id="telegram-icon" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.198-.054-.31-.346-.116l-6.405 4.026-2.76-.864c-.6-.188-.614-.6.125-.89l10.785-4.156c.5-.188.948.115.78.891z"/>
        </symbol>
        <symbol id="email-icon" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </symbol>
        <symbol id="phone-icon" viewBox="0 0 24 24">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </symbol>
        <symbol id="arrow-icon" viewBox="0 0 14 12">
          <path d="M13.7063 6.70859C14.0969 6.31797 14.0969 5.68359 13.7063 5.29297L8.70625 0.292969C8.31563 -0.0976562 7.68125 -0.0976562 7.29063 0.292969C6.9 0.683594 6.9 1.31797 7.29063 1.70859L10.5875 5.00234H1C0.446875 5.00234 0 5.44922 0 6.00234C0 6.55547 0.446875 7.00234 1 7.00234H10.5844L7.29375 10.2961C6.90312 10.6867 6.90312 11.3211 7.29375 11.7117C7.68437 12.1023 8.31875 12.1023 8.70938 11.7117L13.7094 6.71172L13.7063 6.70859Z"/>
        </symbol>
      </svg>

      {/* ══ ХЕДЕР ══ */}
      <header className="header">

        {/* Лого → Головна */}
        <Link to="/" className="logo-container" style={{ textDecoration: 'none', color: 'inherit' }}
          onClick={() => setSearchQuery('')}>
          <svg className="logo-icon"><use xlinkHref="#logo-icon"/></svg>
          <h1>VamCraft</h1>
        </Link>

        {/* Десктопна навігація */}
        <nav className="header-nav">
          <NavLink to="/" className="nav-link" onClick={() => setSearchQuery('')}>Головна</NavLink>

          <div className="nav-dropdown-wrapper">
            <NavLink to="/catalog" className="nav-link" onClick={() => setSearchQuery('')}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Каталог
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </NavLink>

            <div className="mega-menu">
              <div className="mega-menu-grid">
                {categories.map(cat => (
                  <span key={cat} className="mega-menu-item"
                    onClick={() => { setSearchQuery(cat.toLowerCase()); navigate('/catalog'); }}>
                    {cat}
                  </span>
                ))}
              </div>
              <div className="mega-menu-footer">
                <Link to="/catalog" onClick={() => setSearchQuery('')}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                  Дивитись усі товари
                  <svg className="arrow-icon-b" style={{ width: 14, height: 12, fill: '#D97757' }}>
                    <use xlinkHref="#arrow-icon"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <NavLink to="/markets" className="nav-link">Магазини</NavLink>
        </nav>

        {/* Пошук (десктоп) */}
        <div className="header-search">
          <div className="search-input-wrapper">
            <input type="text" placeholder="Пошук товарів..." className="search-bar"
              value={searchQuery} onChange={handleSearchChange}/>
            <svg className="dandruff-icon"><use xlinkHref="#dandruff-icon"/></svg>
          </div>
        </div>

        {/* Кошик + Адмін (десктоп) */}
        <div className="header-basket">
          <Link to="/cart" className="basket-btn" style={{ position: 'relative' }} title="Кошик">
            <svg className="basket-icon"><use xlinkHref="#basket-icon"/></svg>
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </Link>
          <Link to="/admin" className="admin-btn" title="Адмінпанель">
            <svg className="admin-icon"><use xlinkHref="#admin-icon"/></svg>
          </Link>
        </div>

        {/* Мобільна права частина */}
        <div className="mobile-header-right">
          <Link to="/cart" className="basket-btn mobile-cart-btn" style={{ position: 'relative' }} title="Кошик">
            <svg className="basket-icon"><use xlinkHref="#basket-icon"/></svg>
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </Link>
          <button
            className={`burger-btn ${isMobileMenuOpen ? 'burger-btn--open' : ''}`}
            onClick={() => setIsMobileMenuOpen(p => !p)}
            aria-label="Меню">
            <span/><span/><span/>
          </button>
        </div>

        {/* Оверлей */}
        {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu}/>}

        {/* Мобільний дравер */}
        <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'mobile-menu-drawer--open' : ''}`}>
          <div className="mobile-menu-search">
            <div className="search-input-wrapper">
              <input type="text" placeholder="Пошук товарів..." className="search-bar"
                value={searchQuery}
                onChange={e => { handleSearchChange(e); closeMobileMenu(); }}/>
              <svg className="dandruff-icon"><use xlinkHref="#dandruff-icon"/></svg>
            </div>
          </div>

          <nav className="mobile-nav">
            <NavLink to="/"        className="mobile-nav-link" onClick={() => { setSearchQuery(''); closeMobileMenu(); }}>Головна</NavLink>
            <NavLink to="/catalog" className="mobile-nav-link" onClick={() => { setSearchQuery(''); closeMobileMenu(); }}>Каталог</NavLink>

            <div className="mobile-categories">
              {categories.map(cat => (
                <span key={cat} className="mobile-category-item"
                  onClick={() => { setSearchQuery(cat.toLowerCase()); navigate('/catalog'); closeMobileMenu(); }}>
                  {cat}
                </span>
              ))}
            </div>

            <NavLink to="/markets" className="mobile-nav-link" onClick={closeMobileMenu}>Магазини</NavLink>
            <NavLink to="/admin"   className="mobile-nav-link" onClick={closeMobileMenu}>Адмінпанель</NavLink>
            <a href="#" className="mobile-nav-link" onClick={openModal}>Зв'язатися з нами</a>
          </nav>
        </div>
      </header>

      {/* ══ МАРШРУТИ ══ */}
      <main>
        <Routes>
          <Route path="/"                 element={<Home />} />
          <Route path="/catalog"          element={<Catalog searchQuery={searchQuery} />} />
          <Route path="/markets"          element={<Markets />} />
          <Route path="/markets/:sellerId" element={<SellerShop />} />
          <Route path="/product/:id"      element={<ProductDetails />} />
          <Route path="/admin"            element={<Admin />} />
          <Route path="/cart"             element={<Cart />} />
          <Route path="/confirmation"     element={<OrderConfirmation />} />
        </Routes>
      </main>

      {/* ══ ФУТЕР ══ */}
      <footer>
        <div className="top-text-footer">
          <div className="footer-text-cont">
            <Link to="/" className="footer-container"
              style={{ textDecoration: 'none', color: 'white' }}
              onClick={() => window.scrollTo(0, 0)}>
              <svg className="logo-icon"><use xlinkHref="#logo-icon"/></svg>
              <h1>VamCraft</h1>
            </Link>
            <p>Маркетплейс унікальних хендмейд товарів від талановитих українських майстрів.</p>
            <div className="footer-images">
              <a href="https://www.facebook.com/"  className="social-link"><svg className="social-icon"><use xlinkHref="#facebook-icon"/></svg></a>
              <a href="https://www.instagram.com/" className="social-link"><svg className="social-icon"><use xlinkHref="#instagram-icon"/></svg></a>
              <a href="https://web.telegram.org/a/" className="social-link"><svg className="social-icon"><use xlinkHref="#telegram-icon"/></svg></a>
            </div>
          </div>

          <div className="footer-list">
            <a href="">Підтримка</a>
            <div className="list">
              <a href="#" onClick={openModal}>Зв'язатися з нами</a>
              <a href="">Доставка</a>
              <a href="">Повернення</a>
              <a href="">FAQ</a>
            </div>
          </div>

          <div className="footer-list">
            <a href="">Контакти</a>
            <div className="list">
              <div className="list-row">
                <a href="mailto:info@vamcraft.ua" className="contact-link">
                  <svg className="contact-icon"><use xlinkHref="#email-icon"/></svg>
                  <span>info@vamcraft.ua</span>
                </a>
              </div>
              <div className="list-row">
                <a href="tel:+380671234567" className="contact-link">
                  <svg className="contact-icon"><use xlinkHref="#phone-icon"/></svg>
                  <span>+380 (67) 123-45-67</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="line"/>
        <p className="roots-text">© 2026 VamCraft. Всі права захищені.</p>
      </footer>

      {/* ══ МОДАЛЬНЕ ВІКНО ══ */}
      {isContactModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            <h2>Зв'язатися з нами</h2>
            <p>Заповніть форму, і ми відповімо вам найближчим часом.</p>
            <form className="contact-form">
              <div className="form-group">
                <label>Ваше ім'я</label>
                <input type="text" placeholder="Іван Іваненко" required/>
              </div>
              <div className="form-group">
                <label>Email або Телефон</label>
                <input type="text" placeholder="example@mail.com" required/>
              </div>
              <div className="form-group">
                <label>Повідомлення</label>
                <textarea rows="4" placeholder="Ваше питання..." required/>
              </div>
              <button type="submit" className="submit-btn"
                onClick={e => { e.preventDefault(); alert('Дякуємо! Повідомлення надіслано.'); closeModal(); }}>
                Надіслати
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══ КНОПКА ВГОРУ ══ */}
      <ScrollToTopButton />

    </div>
  );
}

export default App;
