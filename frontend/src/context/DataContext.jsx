// // src/context/DataContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { mockProducts as initialProducts } from '../../mockData/products.js';
// import { mockSellers as initialSellers } from '../../mockData/sellers.js';

// // Функція для створення красивих URL (Slugify)
// const generateSlug = (text) => {
//   if (!text) return ''; 
  
//   const ukrToLat = {
//     'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
//     'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
//     'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
//     'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya',
//     ' ': '-'
//   };
  
//   return text.toLowerCase()
//     .split('')
//     .map(char => ukrToLat[char] || char) 
//     .join('')
//     .replace(/[^a-z0-9-]/g, '')          
//     .replace(/-+/g, '-')                 
//     .replace(/^-|-$/g, '');              
// };

// const DataContext = createContext();

// export const DataProvider = ({ children }) => {
//   // Ініціалізація товарів
//   const [products, setProducts] = useState(() => {
//     const saved = localStorage.getItem('app_products');
//     const dataToLoad = saved ? JSON.parse(saved) : initialProducts;
//     return dataToLoad.map(p => ({
//       ...p,
//       slug: p.slug || generateSlug(p.name)
//     }));
//   });

//   // Ініціалізація продавців
//   const [sellers, setSellers] = useState(() => {
//     const saved = localStorage.getItem('app_sellers');
//     const dataToLoad = saved ? JSON.parse(saved) : initialSellers;
//     return dataToLoad.map(s => ({
//       ...s,
//       slug: s.slug || generateSlug(s.name)
//     }));
//   });

//   // Ініціалізація замовлень
//   const [orders, setOrders] = useState(() => {
//     const saved = localStorage.getItem('app_orders');
//     return saved ? JSON.parse(saved) : []; 
//   });

//   // ======= НОВЕ: Стан для динамічних банерів =======
//   const initialBanners = {
//     heroTop: { 
//       title: 'Унікальні вироби ручної роботи', 
//       subtitle: 'Знайдіть ідеальний подарунок або прикрасу для себе', 
//       imageUrl: '' 
//     },
//     heroBottom: { 
//       title: 'Речі, що мають душу', 
//       subtitle: 'Відкрийте для себе крафтові майстерні України та оберіть унікальні вироби ручної роботи.', 
//       imageUrl: '' 
//     }
//   };

//   const [banners, setBanners] = useState(() => {
//     const saved = localStorage.getItem('app_banners');
//     return saved ? JSON.parse(saved) : initialBanners;
//   });

//   // Збереження всіх даних в localStorage
//   useEffect(() => {
//     localStorage.setItem('app_products', JSON.stringify(products));
//   }, [products]);

//   useEffect(() => {
//     localStorage.setItem('app_sellers', JSON.stringify(sellers));
//   }, [sellers]);

//   useEffect(() => {
//     localStorage.setItem('app_orders', JSON.stringify(orders));
//   }, [orders]);

//   useEffect(() => {
//     localStorage.setItem('app_banners', JSON.stringify(banners));
//   }, [banners]);

//   // ===================== ФУНКЦІЇ КЕРУВАННЯ =====================

//   const addSeller = (newSeller) => {
//     const slug = generateSlug(newSeller.name);
//     setSellers(prev => [...prev, { ...newSeller, id: `seller_${Date.now()}`, slug }]);
//   };

//   const updateSeller = (id, updatedData) => {
//     setSellers(prev => prev.map(s => String(s.id) === String(id) ? { ...s, ...updatedData } : s));
//   };

//   const deleteSeller = (id) => {
//     setSellers(prev => prev.filter(s => String(s.id) !== String(id)));
//     setProducts(prev => prev.filter(p => String(p.sellerId) !== String(id)));
//   };

//   const addProduct = (newProduct) => {
//     const baseSlug = generateSlug(newProduct.name);
//     const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
//     setProducts(prev => [...prev, { ...newProduct, id: `prod_${Date.now()}`, slug: uniqueSlug, salesCount: 0, inStock: true }]);
//   };

//   const updateProduct = (id, updatedData) => {
//     setProducts(prev => prev.map(p => String(p.id) === String(id) ? { ...p, ...updatedData } : p));
//   };

//   const deleteProduct = (id) => {
//     setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
//   };

//   const addOrder = (orderDetails) => {
//     const newOrder = {
//       id: `order_${Date.now()}`,
//       date: new Date().toISOString(),
//       status: 'new',
//       ...orderDetails
//     };
//     setOrders(prev => [newOrder, ...prev]);
//     return newOrder.id;
//   };

//   const updateOrderStatus = (orderId, newStatus) => {
//     setOrders(prev => prev.map(order => 
//       order.id === orderId ? { ...order, status: newStatus } : order
//     ));
//   };

//   // Функція для оновлення банерів з адмінки
//   const updateBanners = (newBanners) => {
//     setBanners(newBanners);
//   };

//   return (
//     <DataContext.Provider value={{ 
//       products, sellers, orders, banners,
//       addSeller, updateSeller, deleteSeller,
//       addProduct, updateProduct, deleteProduct,
//       addOrder, updateOrderStatus, updateBanners
//     }}>
//       {children}
//     </DataContext.Provider>
//   );
// };

// export const useData = () => useContext(DataContext);

// src/context/DataContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Функція для створення красивих URL (залишаємо для адмінки)
const generateSlug = (text) => {
  if (!text) return ''; 
  
  const ukrToLat = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
    'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
    'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya',
    ' ': '-'
  };
  
  return text.toLowerCase()
    .split('')
    .map(char => ukrToLat[char] || char) 
    .join('')
    .replace(/[^a-z0-9-]/g, '')          
    .replace(/-+/g, '-')                 
    .replace(/^-|-$/g, '');              
};

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // ======= ДАНІ З БЕКЕНДУ =======
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ======= ДАНІ З LOCALSTORAGE (Тимчасово) =======
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('app_orders');
    return saved ? JSON.parse(saved) : []; 
  });

  const initialBanners = {
    heroTop: { 
      title: 'Унікальні вироби ручної роботи', 
      subtitle: 'Знайдіть ідеальний подарунок або прикрасу для себе', 
      imageUrl: '' 
    },
    heroBottom: { 
      title: 'Речі, що мають душу', 
      subtitle: 'Відкрийте для себе крафтові майстерні України та оберіть унікальні вироби ручної роботи.', 
      imageUrl: '' 
    }
  };

  const [banners, setBanners] = useState(() => {
    const saved = localStorage.getItem('app_banners');
    return saved ? JSON.parse(saved) : initialBanners;
  });

  // ===================== ЗАВАНТАЖЕННЯ З БЕКЕНДУ =====================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Запит за товарами
        const resProducts = await fetch('http://localhost:5000/api/products');
        const dataProducts = await resProducts.json();
        
        // Запит за продавцями
        const resSellers = await fetch('http://localhost:5000/api/sellers');
        const dataSellers = await resSellers.json();

        setProducts(dataProducts);
        setSellers(dataSellers);
        setIsLoading(false);
      } catch (error) {
        console.error("Помилка завантаження даних з сервера:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Пустий масив = виконується 1 раз при завантаженні сайту

  // Збереження локальних даних
  useEffect(() => {
    localStorage.setItem('app_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('app_banners', JSON.stringify(banners));
  }, [banners]);

  // ===================== ФУНКЦІЇ КЕРУВАННЯ UI =====================
  // (Поки що вони оновлюють лише локальний стан екрану, згодом підключимо їх до БД)

  const addSeller = (newSeller) => {
    const slug = generateSlug(newSeller.name);
    setSellers(prev => [...prev, { ...newSeller, id: `seller_${Date.now()}`, slug }]);
  };

  const updateSeller = (id, updatedData) => {
    setSellers(prev => prev.map(s => String(s.id) === String(id) ? { ...s, ...updatedData } : s));
  };

  const deleteSeller = (id) => {
    setSellers(prev => prev.filter(s => String(s.id) !== String(id)));
    setProducts(prev => prev.filter(p => String(p.sellerId) !== String(id)));
  };

  const addProduct = (newProduct) => {
    const baseSlug = generateSlug(newProduct.name);
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    setProducts(prev => [...prev, { ...newProduct, id: `prod_${Date.now()}`, slug: uniqueSlug, salesCount: 0, inStock: true }]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => String(p.id) === String(id) ? { ...p, ...updatedData } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
  };

  const addOrder = (orderDetails) => {
    const newOrder = {
      id: `order_${Date.now()}`,
      date: new Date().toISOString(),
      status: 'new',
      ...orderDetails
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const updateBanners = (newBanners) => {
    setBanners(newBanners);
  };

  return (
    <DataContext.Provider value={{ 
      products, sellers, orders, banners, isLoading, // додав isLoading
      addSeller, updateSeller, deleteSeller,
      addProduct, updateProduct, deleteProduct,
      addOrder, updateOrderStatus, updateBanners
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);