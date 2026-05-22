// src/pages/Cart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import './Cart.css'; 

// === СЮДИ ВСТАВ СВІЙ КЛЮЧ АПІ НОВОЇ ПОШТИ ===
const NP_API_KEY = '40851768e0b7810855658e7d0f463e70'; 

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart(); 
  const { addOrder } = useData(); // Можна залишити для локального стейту, якщо потрібно
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    postBranch: '',
    comment: ''
  });

  // Стани для збереження даних з Нової Пошти
  const [cities, setCities] = useState([]);
  const [branches, setBranches] = useState([]);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Функція для пошуку міст через API
  const fetchCities = async (query) => {
    if (!query) return;
    try {
      const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: NP_API_KEY,
          modelName: 'Address',
          calledMethod: 'getCities',
          methodProperties: {
            FindByString: query,
            Limit: "50" 
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        setCities(data.data);
      }
    } catch (error) {
      console.error("Помилка завантаження міст:", error);
    }
  };

  // Функція для завантаження відділень конкретного міста
  const fetchBranches = async (cityRef) => {
    try {
      const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: NP_API_KEY,
          modelName: 'Address',
          calledMethod: 'getWarehouses',
          methodProperties: {
            CityRef: cityRef,
            Limit: "200"
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        setBranches(data.data);
      }
    } catch (error) {
      console.error("Помилка завантаження відділень:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, city: val, postBranch: '' }));
    setBranches([]); 

    const matchedCity = cities.find(c => c.Description === val);
    
    if (matchedCity) {
      fetchBranches(matchedCity.Ref);
    } else if (val.length >= 2) {
      fetchCities(val);
    }
  };

  // Оновлена функція відправки на бекенд
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    // Формуємо об'єкт для відправки (назви полів відповідають схемі бекенду)
    const orderData = {
      customerName: formData.name,
      customerPhone: formData.phone,
      city: formData.city,
      postBranch: formData.postBranch,
      comment: formData.comment,
      totalPrice: totalPrice,
      items: cartItems.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        sellerId: item.sellerId
      }))
    };

    try {
      const response = await fetch('https://vamcraft-draft-git.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // Якщо бекенд успішно зберіг
        const savedOrder = await response.json();
        
        // Оновлюємо локальний стейт (щоб в адмінці одразу з'явилося без оновлення сторінки)
        if (addOrder) {
          addOrder(savedOrder);
        }
        
        clearCart();
        navigate('/confirmation');
      } else {
        alert("Виникла помилка при оформленні замовлення на сервері.");
      }
    } catch (error) {
      console.error("Помилка з'єднання з сервером:", error);
      alert("Не вдалося відправити замовлення. Перевірте з'єднання.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-page">
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          Ваш кошик порожній
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </h2>
        <p>Здається, ви ще нічого не додали. Перегляньте наш каталог, там багато цікавого!</p>
        <Link to="/catalog" className="go-to-catalog-btn">Перейти в каталог</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Оформлення замовлення</h1>
      
      <div className="cart-container">
        <div className="cart-main-content">
          
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-seller">Майстерня: {item.seller?.name || item.owner || 'Невідомо'}</p>
                  <div className="cart-item-price">{item.price} ₴</div>
                </div>
                <div className="cart-item-controls">
                  <button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <div className="cart-item-total">
                  {item.price * item.quantity} ₴
                </div>
                <button type="button" className="remove-item-btn" onClick={() => removeFromCart(item.id)} title="Видалити">
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="checkout-form-container">
            <h2>Дані для доставки</h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="checkout-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Ім'я та прізвище *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Іван Іваненко" required autoComplete="off" />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Номер телефону *</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+380..." required autoComplete="off" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">Місто *</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    list="cities-list" 
                    value={formData.city} 
                    onChange={handleCityChange} 
                    placeholder="Почніть вводити місто..." 
                    required 
                    autoComplete="off" 
                  />
                  <datalist id="cities-list">
                    {cities.map(city => (
                      <option key={city.Ref} value={city.Description} />
                    ))}
                  </datalist>
                </div>

                <div className="form-group">
                  <label htmlFor="postBranch">Відділення пошти *</label>
                  <input 
                    type="text" 
                    id="postBranch" 
                    name="postBranch" 
                    list="branches-list" 
                    value={formData.postBranch} 
                    onChange={handleChange} 
                    placeholder={branches.length > 0 ? "Виберіть відділення..." : "Спочатку введіть місто"} 
                    required 
                    autoComplete="off" 
                    disabled={branches.length === 0} 
                  />
                  <datalist id="branches-list">
                    {branches.map(branch => (
                      <option key={branch.Ref} value={branch.Description} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Коментар до замовлення (необов'язково)</label>
                <textarea id="comment" name="comment" value={formData.comment} onChange={handleChange} rows="3" placeholder="Побажання щодо доставки або пакування..."></textarea>
              </div>
            </form>
          </div>
        </div>

        <div className="cart-summary">
          <h2>Разом</h2>
          <div className="summary-row">
            <span>Товари ({cartItems.length}):</span>
            <span>{totalPrice} ₴</span>
          </div>
          <div className="summary-row">
            <span>Доставка:</span>
            <span>За тарифами пошти</span>
          </div>
          <div className="summary-total">
            <span>До сплати:</span>
            <span>{totalPrice} ₴</span>
          </div>
          <button type="submit" form="checkout-form" className="checkout-btn">
            Підтвердити замовлення
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;