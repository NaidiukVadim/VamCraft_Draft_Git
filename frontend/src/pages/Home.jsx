// src/pages/Home.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import AOS from 'aos';
import 'aos/dist/aos.css';

import ProductCard from '../components/ProductCard';
import { useData } from '../context/DataContext';

import heroImg from '../assets/hero-img.svg?url'; 
import heroDownImg from '../assets/hero-down-img.png';

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const { products, sellers, banners } = useData();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeller, setSelectedSeller] = useState('');

  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category).filter(Boolean))];
  }, [products]);

  const uniqueSellers = useMemo(() => {
    return [...new Set(products.map(p => p.owner).filter(Boolean))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchCategory = selectedCategory === '' || product.category === selectedCategory;
      const matchSeller = selectedSeller === '' || product.owner === selectedSeller;
      return matchCategory && matchSeller;
    });
  }, [products, selectedCategory, selectedSeller]);

  const isFiltering = selectedCategory !== '' || selectedSeller !== '';

  const recommendedProducts = products.filter(p => p.isRecommended);
  const popularProducts = [...products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 4);

  const btmRef = useRef();

  return (
    <>
      {/* --- ВЕРХНЯ ЧАСТИНА (HERO SECTION) --- */}
      <div className="hero-section">
        <div className="left-part">
          <div className="top">
            <h1>{banners?.heroTop?.title || 'Унікальні вироби ручної роботи'}</h1>
            <p>{banners?.heroTop?.subtitle || 'Знайдіть ідеальний подарунок або прикрасу для себе'}</p>
            <Link to="/catalog">Переглянути каталог</Link>
          </div>
          <div className="down">
            <div className="text" data-aos="fade-up" data-aos-delay="0">
              <h2>2 500+</h2>
              <p>Унікальних речей</p>
            </div>
            <div className="text" data-aos="fade-up" data-aos-delay="150">
              <h2>350 +</h2>
              <p>Українських майстрів</p>
            </div>
            <div className="text" data-aos="fade-up" data-aos-delay="300">
              <h2>98 %</h2>
              <p>Позитивних відгуків</p>
            </div>
          </div>
        </div>
        <div className="right-part">
          <img src={banners?.heroTop?.imageUrl || heroImg} alt="hero image" />
        </div>
      </div>

      <main>
        {/* --- ПАНЕЛЬ ФІЛЬТРІВ --- */}
        <div className="home-filters-wrapper">
          <div className="home-filters-bar">
            <div className="filter-item">
              <span className="filter-label-text">Категорія:</span>
              <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="modern-select"
                >
                  <option value="">Всі категорії</option>
                  {categories.map((c, index) => (
                    <option key={c.id || index} value={c.name || c}>
                      {c.name || c}
                    </option>
                  ))}
                </select>
            </div>

            <div className="filter-divider"></div>

            <div className="filter-item">
              <span className="filter-label-text">Майстер:</span>
              <select 
                value={selectedSeller} 
                onChange={(e) => setSelectedSeller(e.target.value)}
                className="modern-select"
              >
                <option value="">Всі майстри</option>
                {uniqueSellers.map((s, index) => (
                  <option key={s?.id || index} value={s?.name || s}>
                    {s?.name || s}
                  </option>
                ))}
              </select>
            </div>

            {isFiltering && (
              <button 
                onClick={() => { setSelectedCategory(''); setSelectedSeller(''); }}
                className="modern-reset-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Скинути
              </button>
            )}
          </div>
        </div>

        {isFiltering ? (
          <div className="filtered-results-section animate-fade-in" key={`${selectedCategory}-${selectedSeller}`}>
            <h2 className='filter-search-text'>Результати пошуку ({filteredProducts.length})</h2>
            <div className="products-grid" style={{ marginBottom: '40px' }}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p>На жаль, за вашими критеріями нічого не знайдено.</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="main-head">
              <h2>Популярні товари</h2>
              <div className='arrow-container'>
                <Link to="/catalog" className="view-all-link">
                  Дивитись усі
                  <svg className="arrow-icon" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.7063 6.70859C14.0969 6.31797 14.0969 5.68359 13.7063 5.29297L8.70625 0.292969C8.31563 -0.0976562 7.68125 -0.0976562 7.29063 0.292969C6.9 0.683594 6.9 1.31797 7.29063 1.70859L10.5875 5.00234H1C0.446875 5.00234 0 5.44922 0 6.00234C0 6.55547 0.446875 7.00234 1 7.00234H10.5844L7.29375 10.2961C6.90312 10.6867 6.90312 11.3211 7.29375 11.7117C7.68437 12.1023 8.31875 12.1023 8.70938 11.7117L13.7094 6.71172L13.7063 6.70859Z" fill="#D97757"/>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="products-grid">
              {popularProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="recommended-section">
              <h2>Рекомендовані товари</h2>
              <p className='choosen-cards-admin'>Обрані адміністратором спеціально для вас</p> 
              <div className="products-grid rec-sec">
                {recommendedProducts.map(product => (
                  <ProductCard key={product.id} product={product} isRecommendedStyle={true} />
                ))}
              </div>
            </div>

            <div className="hero-section-btm">
              <div className="right-part" data-aos="fade-right">
                <img src={banners?.heroBottom?.imageUrl || heroDownImg} alt="hero image" className="floating-img" />
              </div>
              
              <div className="left-part">
                <div className="top">
                  <h1 data-aos="fade-up" data-aos-delay="100">{banners?.heroBottom?.title || 'Речі, що мають душу'}</h1>
                  <p data-aos="fade-up" data-aos-delay="300">{banners?.heroBottom?.subtitle || 'Відкрийте для себе крафтові майстерні України та оберіть унікальні вироби ручної роботи.'}</p>
                  <div data-aos="fade-up" data-aos-delay="500">
                    <Link to="/markets">Список доступних магазинів</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="home-masters-section">
              <div className="masters-header-center">
                <h2>Наші майстри</h2>
                <p>Познайомтесь з талановитими українськими ремісниками</p>
              </div>
              
              <div className="home-masters-grid">
                {sellers.slice(0, 4).map(seller => {
                  const productCount = products.filter(p => p.sellerId === seller.id).length;
                  return (
                    <div key={seller.id} className="home-master-card">
                      <img src={seller.logoUrl} alt={seller.name} className="home-master-logo" />
                      <h3 className="home-master-name">{seller.name}</h3>
                      <p className="home-master-desc">{seller.description}</p>
                      <div className="home-master-stats">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <path d="M3 9h18"></path>
                          <path d="M9 21V9"></path>
                        </svg>
                        <span>{productCount} товарів</span>
                      </div>
                      <Link to={`/markets/${seller.slug || seller.id}`} className="home-master-btn">
                        Відвідати магазин
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main> 
    </>
  );
}

export default Home;