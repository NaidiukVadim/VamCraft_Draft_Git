// src/pages/Catalog.jsx
import React, { useState } from 'react'; 
import ProductCard from '../components/ProductCard';
import { useData } from '../context/DataContext';
import './Catalog.css'; 

function Catalog({ searchQuery = '' }) {
  const { products } = useData();

  const [sortOrder, setSortOrder] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const displayedProducts = products
    .filter(product => {
      const min = minPrice === '' ? 0 : Number(minPrice);
      const max = maxPrice === '' ? Infinity : Number(maxPrice);
      const isPriceValid = product.price >= min && product.price <= max;

      const query = searchQuery.toLowerCase();
      
      const nameMatches = product.name ? product.name.toLowerCase().includes(query) : false;
      const descMatches = product.description ? product.description.toLowerCase().includes(query) : false;
      const categoryMatches = product.category ? product.category.toLowerCase().includes(query) : false;
      
      const isSearchValid = nameMatches || descMatches || categoryMatches;

      return isPriceValid && isSearchValid;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0; 
    });

  return (
    <div className="catalog-page">
      <div className="catalog-top-text">
        <h2>{searchQuery ? `Результати пошуку для: "${searchQuery}"` : 'Каталог товарів'}</h2>
        
        <div className="filters-section">
          <div className="filters-wrapper">
            
            <div className="sort-container">
              <label htmlFor="price-sort">Сортувати за ціною: </label>
              <select 
                id="price-sort" 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
                className="sort-select"
              >
                <option value="default">За замовчуванням</option>
                <option value="asc">Від дешевих до дорогих</option>
                <option value="desc">Від дорогих до дешевих</option>
              </select>
            </div>

            <div className="price-filter-container">
              <label>Ціна: </label>
              <input 
                type="number" 
                placeholder="Від" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)} 
                className="price-input"
                min="0"
              />
              <span className="price-separator">-</span>
              <input 
                type="number" 
                placeholder="До" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)} 
                className="price-input"
                min="0"
              />
            </div>

          </div>
        </div>
      </div>

      <div className="products-grid catalog-grid">
        {displayedProducts.length > 0 ? (
          displayedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="no-results">За вашим запитом нічого не знайдено.</p>
        )}
      </div>
    </div>
  );
}

export default Catalog;