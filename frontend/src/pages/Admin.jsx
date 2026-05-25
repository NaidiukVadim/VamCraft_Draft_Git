// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import "./Admin.css";

import heroImg     from "../assets/hero-img.svg?url";
import heroDownImg from "../assets/hero-down-img.png";

const BACKEND_URL = "https://vamcraft-draft-git.onrender.com";

function Admin() {
  const {
    products, sellers, orders, banners,
    addProduct, updateProduct, deleteProduct,
    addSeller, updateSeller, deleteSeller,
    updateOrderStatus, updateBanners,
  } = useData();

  const [activeTab,        setActiveTab]        = useState("products");
  const [productView,      setProductView]      = useState("list");
  const [sellerView,       setSellerView]       = useState("list");
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingSellerId,  setEditingSellerId]  = useState(null);
  const [selectedOrderId,  setSelectedOrderId]  = useState(null);
  const [orderFilter,      setOrderFilter]      = useState("all");

  const initialProductState = {
    name: "", price: "", categoryId: "1", sellerId: "",
    description: "", isRecommended: false, showOnHome: false, imageUrl: "", imageFile: null,
  };

  const initialSellerState = {
    name: "", description: "", phone: "", telegram: "",
    logoUrl: "", logoFile: null,
  };

  const [productData, setProductData] = useState(initialProductState);
  const [sellerData,  setSellerData]  = useState(initialSellerState);

  const defaultBanners = {
    heroTop:    { title: "Унікальні вироби ручної роботи", subtitle: "Знайдіть ідеальний подарунок або прикрасу для себе", imageUrl: "" },
    heroBottom: { title: "Речі, що мають душу",            subtitle: "Відкрийте для себе крафтові майстерні України та оберіть унікальні вироби ручної роботи.", imageUrl: "" },
  };
  const [bannerData, setBannerData] = useState(defaultBanners);

  useEffect(() => { if (banners) setBannerData(banners); }, [banners]);

  const formatDate = (iso) => {
    if (!iso) return "Дата невідома";
    const d = new Date(iso);
    return d.toLocaleDateString("uk-UA") + " " +
      d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
  };

  const orderStatuses = {
    new:        { label: "Нове",         class: "status-new" },
    processing: { label: "Обробляється", class: "status-processing" },
    completed:  { label: "Завершено",    class: "status-completed" },
    cancelled:  { label: "Скасовано",    class: "status-cancelled" },
  };

  const filteredOrders = orderFilter === "all"
    ? orders
    : orders.filter(o => o.status.toLowerCase() === orderFilter.toLowerCase());

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProductData(prev => ({
      ...prev,
      imageUrl:  URL.createObjectURL(file),
      imageFile: file,
    }));
  };

  const handleImageUpload = (e, setter, key) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(prev => {
        if (key.includes(".")) {
          const [obj, k] = key.split(".");
          return { ...prev, [obj]: { ...prev[obj], [k]: reader.result } };
        }
        return { ...prev, [key]: reader.result };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleEditProduct = (p) => {
    setProductData({ ...p, imageFile: null });
    setEditingProductId(p.id);
    setProductView("create");
  };

  // ФУНКЦІЯ ДЛЯ ТАБЛИЦІ (Тільки showOnHome)
  const handleToggleShowOnHome = async (product) => {
    const newStatus = !product.showOnHome;

    updateProduct(product.id, { showOnHome: newStatus });

    const formData = new FormData();
    formData.append("showOnHome", newStatus);

    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${product.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Не вдалося зберегти статус на сервері");
      }
    } catch (err) {
      console.error(err);
      updateProduct(product.id, { showOnHome: !newStatus });
      alert("Помилка при оновленні статусу. Перевірте з'єднання.");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name",        productData.name);
    formData.append("price",       productData.price);
    formData.append("description", productData.description);
    formData.append("categoryId",  productData.categoryId);
    formData.append("sellerId",    productData.sellerId);
    
    // ФОРМА РЕДАГУВАННЯ відправляє обидва статуси:
    formData.append("isRecommended", productData.isRecommended); // Рекомендовані
    formData.append("showOnHome", productData.showOnHome);       // На головній

    if (productData.imageFile) {
      formData.append("image", productData.imageFile);
    } else if (productData.imageUrl && !productData.imageUrl.startsWith("blob:")) {
      formData.append("imageUrl", productData.imageUrl);
    }

    try {
      if (editingProductId) {
        const res = await fetch(`${BACKEND_URL}/api/products/${editingProductId}`, {
          method: "PUT",
          body: formData,
        });

        if (res.ok) {
          const updatedItem = await res.json();
          updateProduct(editingProductId, updatedItem);
          alert("Товар успішно оновлено в базі даних!");
        } else {
          const err = await res.text();
          alert(`Помилка сервера: ${err}`);
          return;
        }
      } else {
        const res = await fetch(`${BACKEND_URL}/api/products`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const saved = await res.json();
          addProduct(saved);
          alert("Товар успішно збережено на сервері!");
        } else {
          const err = await res.text();
          alert(`Помилка сервера: ${err}`);
          return;
        }
      }
      setProductData(initialProductState);
      setEditingProductId(null);
      setProductView("list");
    } catch (err) {
      console.error(err);
      alert("Не вдалося з'єднатися з сервером.");
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Видалити товар?")) deleteProduct(id);
  };

  const handleEditSeller = (s) => {
    setSellerData({ ...s, logoFile: null });
    setEditingSellerId(s.id);
    setSellerView("create");
  };

  const handleSellerSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", sellerData.name);
    formData.append("description", sellerData.description);
    formData.append("phone", sellerData.phone);
    formData.append("telegram", sellerData.telegram);

    if (sellerData.logoFile) {
      formData.append("logo", sellerData.logoFile);
    } else if (sellerData.logoUrl && !sellerData.logoUrl.startsWith("blob:")) {
      formData.append("logoUrl", sellerData.logoUrl);
    }

    try {
      if (editingSellerId) {
        updateSeller(editingSellerId, sellerData);
        alert("Дані продавця оновлено локально!");
        products.forEach(p => {
          if (String(p.sellerId) === String(editingSellerId))
            updateProduct(p.id, { owner: sellerData.name });
        });
      } else {
        const res = await fetch(`${BACKEND_URL}/api/sellers`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const savedSeller = await res.json();
          addSeller(savedSeller); 
          alert("Продавця успішно додано в базу даних!");
        } else {
          const err = await res.text();
          alert(`Помилка сервера: ${err}`);
          return;
        }
      }
      setSellerData(initialSellerState);
      setEditingSellerId(null);
      setSellerView("list");
    } catch (err) {
      console.error(err);
      alert("Не вдалося з'єднатися з сервером.");
    }
  };

  const handleDeleteSeller = (id) => {
    if (window.confirm("Видалити продавця разом з усіма його товарами?")) deleteSeller(id);
  };

  const toggleOrderDetails = (id) =>
    setSelectedOrderId(selectedOrderId === id ? null : id);

  const handleBannerSubmit = (e) => {
    e.preventDefault();
    if (updateBanners) { updateBanners(bannerData); alert("Банери успішно оновлено!"); }
    else               { alert("Помилка: updateBanners не знайдено в DataContext."); }
  };

  const BackBtn = ({ onClick }) => (
    <button className="back-btn btn-with-icon" onClick={onClick}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
      </svg>
      До списку
    </button>
  );

  const AddBtn = ({ onClick, label }) => (
    <button className="add-new-btn btn-with-icon" onClick={onClick}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      {label}
    </button>
  );

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        {[
          { key: "products", label: "Товари" },
          { key: "sellers",  label: "Продавці" },
          { key: "orders",   label: "Замовлення" },
          { key: "banners",  label: "Банери" },
        ].map(({ key, label }) => (
          <button key={key}
            className={activeTab === key ? "active" : ""}
            onClick={() => {
              setActiveTab(key);
              if (key === "products") setProductView("list");
              if (key === "sellers")  setSellerView("list");
            }}>
            {label}
          </button>
        ))}
      </div>

      <div className="admin-content">

        {/* ══ ТОВАРИ ══ */}
        {activeTab === "products" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3>Керування товарами ({products.length})</h3>
              {productView === "list"
                ? <AddBtn onClick={() => { setProductData(initialProductState); setEditingProductId(null); setProductView("create"); }} label="Додати товар"/>
                : <BackBtn onClick={() => setProductView("list")}/>
              }
            </div>

            {productView === "list" ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Назва товару</th><th>Майстерня</th>
                    <th>Ціна</th><th>На головній</th><th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td data-label="Назва">{p.name}</td>
                      <td data-label="Майстерня"><strong>{p.owner || (p.seller && p.seller.name)}</strong></td>
                      <td data-label="Ціна">{p.price} ₴</td>
                      <td data-label="На гол.">
                        {/* ТУТ ТЕПЕР SHOW ON HOME */}
                        <input 
                          type="checkbox" 
                          checked={p.showOnHome || false} 
                          onChange={() => handleToggleShowOnHome(p)}
                        />
                      </td>
                      <td data-label="Дії" className="actions-cell">
                        <button onClick={() => handleEditProduct(p)} className="btn-edit">Ред.</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="btn-disable">Видал.</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <form onSubmit={handleProductSubmit} className="admin-form">
                <div className="form-group"><label>Назва товару:</label>
                  <input type="text" required value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})}/></div>
                <div className="form-group"><label>Ціна (₴):</label>
                  <input type="number" required value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})}/></div>
                <div className="form-group"><label>Категорія:</label>
                  <select value={productData.categoryId} onChange={e => setProductData({...productData, categoryId: e.target.value})}>
                    <option value="1">Еко Декор</option>
                  </select>
                </div>
                <div className="form-group"><label>Продавець:</label>
                  <select required value={productData.sellerId} onChange={e => setProductData({...productData, sellerId: e.target.value})}>
                    <option value="" disabled>Оберіть майстра...</option>
                    {sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group checkbox-group">
                  {/* ТУТ ТЕПЕР IS RECOMMENDED */}
                  <label>
                    <input type="checkbox" checked={productData.isRecommended}
                      onChange={e => setProductData({...productData, isRecommended: e.target.checked})}/>
                    Показувати в "Рекомендованих"
                  </label>
                </div>
                <div className="form-group"><label>Опис:</label>
                  <textarea rows="4" required value={productData.description}
                    onChange={e => setProductData({...productData, description: e.target.value})}/></div>
                <div className="form-group">
                  <label>Фотографія товару:</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input type="file" accept="image/*" className="custom-file-input" onChange={handleProductImageUpload}/>
                    <input type="text" placeholder="Або вставте URL..."
                      value={productData.imageUrl?.startsWith('blob:') ? '' : (productData.imageUrl || '')}
                      onChange={e => setProductData({...productData, imageUrl: e.target.value, imageFile: null})}/>
                  </div>
                  {productData.imageUrl && (
                    <img src={productData.imageUrl} alt="preview"
                      style={{ height: 60, width: "auto", marginTop: 10, borderRadius: 4, objectFit: "cover" }}
                      onError={e => { e.target.style.display = 'none'; }}/>
                  )}
                </div>
                <button type="submit" className="admin-submit-btn">
                  {editingProductId ? "Оновити товар" : "Зберегти товар"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ══ ПРОДАВЦІ ══ */}
        {activeTab === "sellers" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3>Керування продавцями ({sellers.length})</h3>
              {sellerView === "list"
                ? <AddBtn onClick={() => { setSellerData(initialSellerState); setEditingSellerId(null); setSellerView("create"); }} label="Додати продавця"/>
                : <BackBtn onClick={() => setSellerView("list")}/>
              }
            </div>

            {sellerView === "list" ? (
              <table className="admin-table">
                <thead>
                  <tr><th>Майстерня</th><th>Телефон</th><th>Товарів</th><th>Дії</th></tr>
                </thead>
                <tbody>
                  {sellers.map(s => {
                    const cnt = products.filter(p => String(p.sellerId) === String(s.id)).length;
                    return (
                      <tr key={s.id}>
                        <td data-label="Майстерня"><strong>{s.name}</strong></td>
                        <td data-label="Телефон">{s.phone}</td>
                        <td data-label="Товарів">{cnt}</td>
                        <td data-label="Дії" className="actions-cell">
                          <button onClick={() => handleEditSeller(s)} className="btn-edit">Ред.</button>
                          <button onClick={() => handleDeleteSeller(s.id)} className="btn-disable">Видал.</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <form onSubmit={handleSellerSubmit} className="admin-form">
                <div className="form-group"><label>Назва майстерні:</label>
                  <input type="text" required value={sellerData.name} onChange={e => setSellerData({...sellerData, name: e.target.value})}/></div>
                <div className="form-group"><label>Опис:</label>
                  <textarea rows="4" required value={sellerData.description} onChange={e => setSellerData({...sellerData, description: e.target.value})}/></div>
                <div className="form-group"><label>Телефон:</label>
                  <input type="tel" value={sellerData.phone} onChange={e => setSellerData({...sellerData, phone: e.target.value})}/></div>
                <div className="form-group"><label>Telegram URL:</label>
                  <input type="url" value={sellerData.telegram} onChange={e => setSellerData({...sellerData, telegram: e.target.value})}/></div>
                <div className="form-group">
                  <label>Логотип магазину:</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input type="file" accept="image/*" className="custom-file-input"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setSellerData(prev => ({
                          ...prev,
                          logoUrl: URL.createObjectURL(file),
                          logoFile: file 
                        }));
                      }}
                    />
                    <input type="text" placeholder="Або вставте URL..." value={sellerData.logoUrl}
                      onChange={e => setSellerData({...sellerData, logoUrl: e.target.value, logoFile: null})}/>
                  </div>
                  {sellerData.logoUrl && (
                    <img src={sellerData.logoUrl} alt="preview"
                      style={{ height: 60, width: "auto", marginTop: 10, borderRadius: 4, objectFit: "cover" }}
                      onError={e => { e.target.style.display = 'none'; }}/>
                  )}
                </div>
                <button type="submit" className="admin-submit-btn">
                  {editingSellerId ? "Оновити продавця" : "Зберегти продавця"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ══ ЗАМОВЛЕННЯ ══ */}
        {activeTab === "orders" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3>Історія замовлень</h3>
            </div>

            <div className="order-tabs-container">
              {[
                { id: "all",        label: `Всі (${orders.length})` },
                { id: "new",        label: `Нові (${orders.filter(o => o.status.toLowerCase() === "new").length})` },
                { id: "processing", label: `В обробці (${orders.filter(o => o.status.toLowerCase() === "processing").length})` },
                { id: "completed",  label: `Завершені (${orders.filter(o => o.status.toLowerCase() === "completed").length})` },
                { id: "cancelled",  label: `Скасовані (${orders.filter(o => o.status.toLowerCase() === "cancelled").length})` },
              ].map(tab => (
                <button key={tab.id}
                  className={`order-tab ${orderFilter === tab.id ? "active" : ""}`}
                  onClick={() => setOrderFilter(tab.id)}>
                  {tab.label}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <p className="empty-state">У цій категорії замовлень поки що немає.</p>
            ) : (
              <table className="admin-table orders-table">
                <thead>
                  <tr><th>№</th><th>Дата</th><th>Клієнт / Телефон</th><th>Сума</th><th>Статус</th><th>Дії</th></tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const statusKey = order.status ? order.status.toLowerCase() : "new";
                    const statusInfo = orderStatuses[statusKey] || orderStatuses.new;
                    const isExpanded = selectedOrderId === order.id;
                    return (
                      <React.Fragment key={order.id}>
                        <tr className={isExpanded ? "expanded-row" : ""}>
                          <td data-label="№">{order.id}</td>
                          <td data-label="Дата">{formatDate(order.createdAt || order.date)}</td>
                          <td data-label="Клієнт">
                            <strong>{order.customerName}</strong><br/>
                            <span className="text-muted">{order.customerPhone}</span>
                          </td>
                          <td data-label="Сума" className="price-cell">{order.totalPrice || order.totalAmount} ₴</td>
                          <td data-label="Статус">
                            <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>
                          </td>
                          <td data-label="Дії" className="actions-cell">
                            <button onClick={() => toggleOrderDetails(order.id)} className="btn-view">
                              {isExpanded ? "Сховати" : "Деталі"}
                            </button>
                            <select value={statusKey}
                              onChange={e => updateOrderStatus(order.id, e.target.value.toUpperCase())}
                              className="status-select-inline">
                              {Object.entries(orderStatuses).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
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
                                  {order.items?.map(item => (
                                    <li key={item.id} className="order-item-detail">
                                      <span className="item-name">{item.name || `Товар ID: ${item.productId}`}</span>
                                      <span className="item-meta">
                                        {item.quantity} шт. × {item.priceAtPurchase || item.price} ₴ = <strong>{item.quantity * (item.priceAtPurchase || item.price)} ₴</strong>
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                {order.comment && (
                                  <div className="order-comment"><strong>Коментар:</strong> {order.comment}</div>
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

        {/* ══ БАНЕРИ ══ */}
        {activeTab === "banners" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h3>Керування банерами</h3>
            </div>
            <form onSubmit={handleBannerSubmit} className="admin-form banner-form" style={{ maxWidth: "100%" }}>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

                {/* Верхній банер */}
                <div className="banner-section-block" style={{ flex: "1 1 45%" }}>
                  <h4 className="banner-section-title">Верхній банер (Головний екран)</h4>
                  <div style={{ height: 150, backgroundColor: "#eaeaea", borderRadius: 8, marginBottom: 15, overflow: "hidden" }}>
                    <img src={bannerData.heroTop.imageUrl || heroImg} alt="preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { e.target.src = heroImg; }}/>
                  </div>
                  <div className="form-group"><label>Заголовок:</label>
                    <input type="text" required value={bannerData.heroTop.title}
                      onChange={e => setBannerData({...bannerData, heroTop: {...bannerData.heroTop, title: e.target.value}})}/></div>
                  <div className="form-group"><label>Підзаголовок:</label>
                    <textarea rows="2" required value={bannerData.heroTop.subtitle}
                      onChange={e => setBannerData({...bannerData, heroTop: {...bannerData.heroTop, subtitle: e.target.value}})}/></div>
                  <div className="form-group"><label>Зображення:</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <input type="file" accept="image/*" className="custom-file-input"
                        onChange={e => handleImageUpload(e, setBannerData, "heroTop.imageUrl")}/>
                      <input type="text" placeholder="Або вставте URL..." value={bannerData.heroTop.imageUrl}
                        onChange={e => setBannerData({...bannerData, heroTop: {...bannerData.heroTop, imageUrl: e.target.value}})}/>
                    </div>
                  </div>
                </div>

                {/* Нижній банер */}
                <div className="banner-section-block" style={{ flex: "1 1 45%" }}>
                  <h4 className="banner-section-title">Нижній банер (Перед майстрами)</h4>
                  <div style={{ height: 150, backgroundColor: "#eaeaea", borderRadius: 8, marginBottom: 15, overflow: "hidden" }}>
                    <img src={bannerData.heroBottom.imageUrl || heroDownImg} alt="preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { e.target.src = heroDownImg; }}/>
                  </div>
                  <div className="form-group"><label>Заголовок:</label>
                    <input type="text" required value={bannerData.heroBottom.title}
                      onChange={e => setBannerData({...bannerData, heroBottom: {...bannerData.heroBottom, title: e.target.value}})}/></div>
                  <div className="form-group"><label>Підзаголовок:</label>
                    <textarea rows="2" required value={bannerData.heroBottom.subtitle}
                      onChange={e => setBannerData({...bannerData, heroBottom: {...bannerData.heroBottom, subtitle: e.target.value}})}/></div>
                  <div className="form-group"><label>Зображення:</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <input type="file" accept="image/*" className="custom-file-input"
                        onChange={e => handleImageUpload(e, setBannerData, "heroBottom.imageUrl")}/>
                      <input type="text" placeholder="Або вставте URL..." value={bannerData.heroBottom.imageUrl}
                        onChange={e => setBannerData({...bannerData, heroBottom: {...bannerData.heroBottom, imageUrl: e.target.value}})}/>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right", marginTop: 10 }}>
                <button type="submit" className="admin-submit-btn" style={{ padding: "15px 40px", fontSize: 18 }}>
                  Зберегти всі банери
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;