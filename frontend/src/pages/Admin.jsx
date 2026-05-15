// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import './Admin.css';

function Admin() {
  const { 
    products, sellers, orders, banners, 
    addProduct, updateProduct, deleteProduct,
    addSeller, updateSeller, deleteSeller,
    updateOrderStatus, updateBanners 
  } = useData();

  const [activeTab, setActiveTab] = useState('products');
  const [productView, setProductView] = useState('list'); 
  const [sellerView, setSellerView] = useState('list');   

  const [editingProductId, setEditingProductId] = useState(null);
  const [editingSellerId, setEditingSellerId] = useState(null);

  const initialProductState = { name: '', price: '', category: 'Кераміка', sellerId: '', description: '', isRecommended: false, imageUrl: '' };
  const initialSellerState = { name: '', description: '', phone: '', telegram: '', logoUrl: '' };

  const [productData, setProductData] = useState(initialProductState);
  const [sellerData, setSellerData] = useState(initialSellerState);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [orderFilter, setOrderFilter] = useState('all');

  const defaultBanners = {
    heroTop: { title: 'Унікальні вироби ручної роботи', subtitle: 'Знайдіть ідеальний подарунок або прикрасу для себе', imageUrl: '' },
    heroBottom: { title: 'Речі, що мають душу', subtitle: 'Відкрийте для себе крафтові майстерні України та оберіть унікальні вироби ручної роботи.', imageUrl: '' }
  };
  const [bannerData, setBannerData] = useState(defaultBanners);

  useEffect(() => {
    if (banners) setBannerData(banners);
  }, [banners]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('uk-UA') + ' ' + date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };

  const orderStatuses = {
    new: { label: 'Нове', class: 'status-new' },
    processing: { label: 'Обробляється', class: 'status-processing' },
    completed: { label: 'Завершено', class: 'status-completed' },
    cancelled: { label: 'Скасовано', class: 'status-cancelled' },
  };

  const filteredOrders = orderFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === orderFilter);

  // ===================== ЛОГІКА ТОВАРІВ =====================
  const handleEditProduct = (product) => {
    setProductData(product);
    setEditingProductId(product.id);
    setProductView('create');
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const seller = sellers.find(s => s.id === productData.sellerId);
    const productToSave = {
      ...productData,
      owner: seller ? seller.name : 'Невідомий майстер',
      price: Number(productData.price)
    };
    if (editingProductId) {
      updateProduct(editingProductId, productToSave);
      alert('Товар успішно оновлено!');
    } else {
      addProduct(productToSave);
      alert('Товар успішно додано!');
    }
    setProductData(initialProductState);
    setEditingProductId(null);
    setProductView('list');
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей товар?')) {
      deleteProduct(id);
    }
  };

  // ===================== ЛОГІКА ПРОДАВЦІВ =====================
  const handleEditSeller = (seller) => {
    setSellerData(seller);
    setEditingSellerId(seller.id);
    setSellerView('create');
  };

  const handleSellerSubmit = (e) => {
    e.preventDefault();
    if (editingSellerId) {
      updateSeller(editingSellerId, sellerData);
      alert('Дані продавця оновлено!');
      products.forEach(p => {
        if (p.sellerId === editingSellerId) updateProduct(p.id, { owner: sellerData.name });
      });
    } else {
      addSeller(sellerData);
      alert('Продавця успішно додано!');
    }
    setSellerData(initialSellerState);
    setEditingSellerId(null);
    setSellerView('list');
  };

  const handleDeleteSeller = (id) => {
    if (window.confirm('Увага! При видаленні продавця будуть видалені ВСІ його товари. Продовжити?')) {
      deleteSeller(id);
    }
  };

  // ===================== ЛОГІКА ЗАМОВЛЕНЬ =====================
  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const toggleOrderDetails = (orderId) => {
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
    } else {
      setSelectedOrderId(orderId);
    }
  };

  // ===================== ЛОГІКА БАНЕРІВ =====================
  const handleBannerSubmit = (e) => {
    e.preventDefault();
    if (updateBanners) {
      updateBanners(bannerData);
      alert('Банери успішно оновлено! Перейдіть на Головну сторінку, щоб побачити зміни.');
    } else {
      alert('Помилка: Функція збереження банерів ще не додана в DataContext.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => { setActiveTab('products'); setProductView('list'); }}>Товари</button>
        <button className={activeTab === 'sellers' ? 'active' : ''} onClick={() => { setActiveTab('sellers'); setSellerView('list'); }}>Продавці</button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Замовлення</button>
        <button className={activeTab === 'banners' ? 'active' : ''} onClick={() => setActiveTab('banners')}>Банери</button>
      </div>

      <div className="admin-content">
        
        {/* Вкладка: ТОВАРИ */}
        {activeTab === 'products' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3>Керування товарами ({products.length})</h3>
              {productView === 'list' ? (
                <button 
                  className="add-new-btn btn-with-icon" 
                  onClick={() => { setProductData(initialProductState); setEditingProductId(null); setProductView('create'); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Додати товар
                </button>
              ) : (
                <button 
                  className="back-btn btn-with-icon" 
                  onClick={() => setProductView('list')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  До списку
                </button>
              )}
            </div>

            {productView === 'list' ? (
              <table className="admin-table">
                <thead>
                  <tr><th>Назва товару</th><th>Майстерня</th><th>Ціна</th><th>На головній</th><th>Дії</th></tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td><strong>{p.owner}</strong></td>
                      <td>{p.price} ₴</td>
                      <td><input type="checkbox" checked={p.isRecommended} readOnly /></td>
                      <td className="actions-cell">
                        <button onClick={() => handleEditProduct(p)} className="btn-edit">Ред.</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="btn-disable">Видал.</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <form onSubmit={handleProductSubmit} className="admin-form">
                <div className="form-group"><label>Назва товару:</label><input type="text" required value={productData.name} onChange={(e) => setProductData({...productData, name: e.target.value})} /></div>
                <div className="form-group"><label>Ціна (₴):</label><input type="number" required value={productData.price} onChange={(e) => setProductData({...productData, price: e.target.value})} /></div>
                <div className="form-group"><label>Категорія:</label>
                  <select value={productData.category} onChange={(e) => setProductData({...productData, category: e.target.value})}>
                    <option value="Кераміка">Кераміка</option>
                    <option value="Дерево">Дерево</option>
                    <option value="Шкіра">Шкіра</option>
                    <option value="Текстиль">Текстиль</option>
                    <option value="Прикраси">Прикраси</option>
                  </select>
                </div>
                <div className="form-group"><label>Продавець (Майстер):</label>
                  <select required value={productData.sellerId} onChange={(e) => setProductData({...productData, sellerId: e.target.value})}>
                    <option value="" disabled>Оберіть майстра...</option>
                    {sellers.map(seller => <option key={seller.id} value={seller.id}>{seller.name}</option>)}
                  </select>
                </div>
                <div className="form-group checkbox-group">
                  <label><input type="checkbox" checked={productData.isRecommended} onChange={(e) => setProductData({...productData, isRecommended: e.target.checked})} />Показувати в "Рекомендованих" на Головній</label>
                </div>
                <div className="form-group"><label>Опис:</label><textarea rows="4" required value={productData.description} onChange={(e) => setProductData({...productData, description: e.target.value})}></textarea></div>
                <div className="form-group"><label>URL Фотографії:</label><input type="text" placeholder="https://..." value={productData.imageUrl} onChange={(e) => setProductData({...productData, imageUrl: e.target.value})} /></div>
                <button type="submit" className="admin-submit-btn">{editingProductId ? 'Оновити товар' : 'Зберегти товар'}</button>
              </form>
            )}
          </div>
        )}

        {/* Вкладка: ПРОДАВЦІ */}
        {activeTab === 'sellers' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3>Керування продавцями ({sellers.length})</h3>
              {sellerView === 'list' ? (
                <button 
                  className="add-new-btn btn-with-icon" 
                  onClick={() => { setSellerData(initialSellerState); setEditingSellerId(null); setSellerView('create'); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Додати продавця
                </button>
              ) : (
                <button 
                  className="back-btn btn-with-icon" 
                  onClick={() => setSellerView('list')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  До списку
                </button>
              )}
            </div>

            {sellerView === 'list' ? (
              <table className="admin-table">
                <thead>
                  <tr><th>Майстерня</th><th>Телефон</th><th>Товарів</th><th>Дії</th></tr>
                </thead>
                <tbody>
                  {sellers.map(s => {
                    const sellerProductsCount = products.filter(p => p.sellerId === s.id).length;
                    return (
                      <tr key={s.id}>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.phone}</td>
                        <td>{sellerProductsCount}</td>
                        <td className="actions-cell">
                          <button onClick={() => handleEditSeller(s)} className="btn-edit">Ред.</button>
                          <button onClick={() => handleDeleteSeller(s.id)} className="btn-disable">Видал.</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <form onSubmit={handleSellerSubmit} className="admin-form">
                <div className="form-group"><label>Назва майстерні / Ім'я:</label><input type="text" required value={sellerData.name} onChange={(e) => setSellerData({...sellerData, name: e.target.value})} /></div>
                <div className="form-group"><label>Опис майстерні:</label><textarea rows="4" required value={sellerData.description} onChange={(e) => setSellerData({...sellerData, description: e.target.value})}></textarea></div>
                <div className="form-group"><label>Телефон:</label><input type="tel" value={sellerData.phone} onChange={(e) => setSellerData({...sellerData, phone: e.target.value})} /></div>
                <div className="form-group"><label>Telegram URL:</label><input type="url" value={sellerData.telegram} onChange={(e) => setSellerData({...sellerData, telegram: e.target.value})} /></div>
                <div className="form-group"><label>URL Логотипу:</label><input type="text" placeholder="https://..." value={sellerData.logoUrl} onChange={(e) => setSellerData({...sellerData, logoUrl: e.target.value})} /></div>
                <button type="submit" className="admin-submit-btn">{editingSellerId ? 'Оновити продавця' : 'Зберегти продавця'}</button>
              </form>
            )}
          </div>
        )}

        {/* Вкладка ЗАМОВЛЕННЯ */}
        {activeTab === 'orders' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3>Історія замовлень</h3>
            </div>

            <div className="order-tabs-container">
              {[
                { id: 'all', label: `Всі (${orders.length})` },
                { id: 'new', label: `Нові (${orders.filter(o => o.status === 'new').length})` },
                { id: 'processing', label: `В обробці (${orders.filter(o => o.status === 'processing').length})` },
                { id: 'completed', label: `Завершені (${orders.filter(o => o.status === 'completed').length})` },
                { id: 'cancelled', label: `Скасовані (${orders.filter(o => o.status === 'cancelled').length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setOrderFilter(tab.id)}
                  className={`order-tab ${orderFilter === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {filteredOrders.length === 0 ? (
              <p className="empty-state">У цій категорії замовлень поки що немає.</p>
            ) : (
              <table className="admin-table orders-table">
                <thead>
                  <tr>
                    <th>№</th>
                    <th>Дата</th>
                    <th>Клієнт / Телефон</th>
                    <th>Сума</th>
                    <th>Статус</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => {
                    const statusInfo = orderStatuses[order.status] || orderStatuses.new;
                    const isExpanded = selectedOrderId === order.id;
                    
                    return (
                      <React.Fragment key={order.id}>
                        <tr className={isExpanded ? 'expanded-row' : ''}>
                          <td>{order.id.split('_')[1]}</td>
                          <td>{formatDate(order.date)}</td>
                          <td>
                            <strong>{order.customerName}</strong><br />
                            <span className="text-muted">{order.customerPhone}</span>
                          </td>
                          <td className="price-cell">{order.totalAmount} ₴</td>
                          <td>
                            <span className={`status-badge ${statusInfo.class}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button onClick={() => toggleOrderDetails(order.id)} className="btn-view">
                              {isExpanded ? 'Сховати' : 'Деталі'}
                            </button>
                            <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="status-select-inline">
                              {Object.entries(orderStatuses).map(([key, info]) => (
                                <option key={key} value={key}>{info.label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                        
                        {isExpanded && (
                          <tr className="order-details-row">
                            <td colSpan="6">
                              <div className="order-details-container">
                                <div className="delivery-info-box">
                                  <strong>Адреса доставки:</strong> м. {order.city}, {order.postBranch}
                                </div>
                                <h4>Склад замовлення:</h4>
                                <ul>
                                  {order.items.map(item => (
                                    <li key={item.id} className="order-item-detail">
                                      <span className="item-name">{item.name}</span>
                                      <span className="item-meta">
                                        {item.quantity} шт. х {item.price} ₴ = <strong>{item.quantity * item.price} ₴</strong>
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                {order.comment && (
                                  <div className="order-comment">
                                    <strong>Коментар клієнта:</strong> {order.comment}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Вкладка БАНЕРИ */}
        {activeTab === 'banners' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3>Керування банерами</h3>
            </div>
            
            <form onSubmit={handleBannerSubmit} className="admin-form banner-form">
              
              <div className="banner-section-block">
                <h4 className="banner-section-title">Верхній банер (Головний екран)</h4>
                <div className="form-group">
                  <label>Заголовок:</label>
                  <input type="text" required value={bannerData.heroTop.title} onChange={(e) => setBannerData({...bannerData, heroTop: {...bannerData.heroTop, title: e.target.value}})} />
                </div>
                <div className="form-group">
                  <label>Підзаголовок:</label>
                  <textarea rows="2" required value={bannerData.heroTop.subtitle} onChange={(e) => setBannerData({...bannerData, heroTop: {...bannerData.heroTop, subtitle: e.target.value}})} />
                </div>
                <div className="form-group">
                  <label>URL Зображення (залиште пустим для стандартного):</label>
                  <input type="text" placeholder="https://..." value={bannerData.heroTop.imageUrl} onChange={(e) => setBannerData({...bannerData, heroTop: {...bannerData.heroTop, imageUrl: e.target.value}})} />
                </div>
              </div>

              <div className="banner-section-block">
                <h4 className="banner-section-title">Нижній банер (Перед майстрами)</h4>
                <div className="form-group">
                  <label>Заголовок:</label>
                  <input type="text" required value={bannerData.heroBottom.title} onChange={(e) => setBannerData({...bannerData, heroBottom: {...bannerData.heroBottom, title: e.target.value}})} />
                </div>
                <div className="form-group">
                  <label>Підзаголовок:</label>
                  <textarea rows="2" required value={bannerData.heroBottom.subtitle} onChange={(e) => setBannerData({...bannerData, heroBottom: {...bannerData.heroBottom, subtitle: e.target.value}})} />
                </div>
                <div className="form-group">
                  <label>URL Зображення (залиште пустим для стандартного):</label>
                  <input type="text" placeholder="https://..." value={bannerData.heroBottom.imageUrl} onChange={(e) => setBannerData({...bannerData, heroBottom: {...bannerData.heroBottom, imageUrl: e.target.value}})} />
                </div>
              </div>

              <button type="submit" className="admin-submit-btn">Зберегти банери</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;