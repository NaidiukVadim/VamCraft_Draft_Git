// src/context/DataContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const BACKEND_URL = 'https://vamcraft-draft-git.onrender.com';

export const normalizeImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const normalizeProduct = (p) => ({
  ...p,
  owner:    p.owner || p.seller?.name || 'Невідомий майстер',
  sellerId: String(p.sellerId || p.seller?.id || ''),
  category: p.category?.name ?? p.category ?? '',
  imageUrl: normalizeImageUrl(p.imageUrl || p.image_url || p.image || ''),
  id:       String(p.id),
  slug:     p.slug || String(p.id),
  inStock:  p.inStock ?? p.in_stock ?? true,
  salesCount: p.salesCount ?? p.sales_count ?? 0,
  isRecommended: p.isPromoted ?? p.is_promoted ?? false, 
  showOnHome: p.showOnHome ?? p.show_on_home ?? false,   
});

const normalizeSeller = (s) => ({
  ...s,
  id:      String(s.id),
  slug:    s.slug || String(s.id),
  logoUrl: normalizeImageUrl(s.logoUrl || s.logo_url || s.logo || ''),
});

const generateSlug = (text) => {
  if (!text) return '';
  const ukrToLat = {
    'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ye',
    'ж':'zh','з':'z','и':'y','і':'i','ї':'yi','й':'y','к':'k','л':'l',
    'м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u',
    'ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ь':'','ю':'yu','я':'ya',' ':'-',
  };
  return text.toLowerCase()
    .split('').map(c => ukrToLat[c] ?? c).join('')
    .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products,  setProducts]  = useState([]);
  const [sellers,   setSellers]   = useState([]);
  const [orders,    setOrders]    = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const initialBanners = {
    heroTop:    { title: 'Унікальні вироби ручної роботи', subtitle: 'Знайдіть ідеальний подарунок або прикрасу для себе', imageUrl: '' },
    heroBottom: { title: 'Речі, що мають душу',            subtitle: 'Відкрийте для себе крафтові майстерні України та оберіть унікальні вироби ручної роботи.', imageUrl: '' },
  };

  const [banners, setBanners] = useState(() => {
    try { return JSON.parse(localStorage.getItem('app_banners') || 'null') || initialBanners; }
    catch { return initialBanners; }
  });

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const fetchOptions = { cache: 'no-store' }; 

        const [resP, resS, resO] = await Promise.all([
          fetch(`${BACKEND_URL}/api/products`, fetchOptions),
          fetch(`${BACKEND_URL}/api/sellers`, fetchOptions),
          fetch(`${BACKEND_URL}/api/orders`, fetchOptions), 
        ]);

        if (!resP.ok) throw new Error(`Products: ${resP.status}`);
        if (!resS.ok) throw new Error(`Sellers: ${resS.status}`);
        if (!resO.ok) throw new Error(`Orders: ${resO.status}`);

        const [rawProducts, rawSellers, rawOrders] = await Promise.all([
          resP.json(),
          resS.json(),
          resO.json(),
        ]);

        setProducts((Array.isArray(rawProducts) ? rawProducts : rawProducts.data ?? []).map(normalizeProduct));
        setSellers((Array.isArray(rawSellers)   ? rawSellers   : rawSellers.data   ?? []).map(normalizeSeller));
        setOrders(Array.isArray(rawOrders) ? rawOrders : []); 

      } catch (err) {
        console.error('Помилка завантаження:', err);
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => { localStorage.setItem('app_banners', JSON.stringify(banners)); }, [banners]);

  const addSeller = (s) => {
    const slug = generateSlug(s.name);
    setSellers(prev => [...prev, normalizeSeller({ ...s, id: `seller_${Date.now()}`, slug })]);
  };
  const updateSeller = (id, data) =>
    setSellers(prev => prev.map(s => s.id === String(id) ? { ...s, ...data } : s));
  const deleteSeller = (id) => {
    setSellers(prev => prev.filter(s => s.id !== String(id)));
    setProducts(prev => prev.filter(p => p.sellerId !== String(id)));
  };

  const addProduct = (p) => {
    const slug = `${generateSlug(p.name)}-${Date.now().toString().slice(-4)}`;
    setProducts(prev => [...prev, normalizeProduct({ ...p, id: `prod_${Date.now()}`, slug, salesCount: 0, inStock: true })]);
  };
  const updateProduct = (id, data) =>
    setProducts(prev => prev.map(p => p.id === String(id) ? { ...p, ...normalizeProduct({ ...p, ...data }) } : p));
  const deleteProduct = (id) =>
    setProducts(prev => prev.filter(p => p.id !== String(id)));

  const addOrder = (orderFromServer) => {
    setOrders(prev => [orderFromServer, ...prev]);
  };
  
  // ДОДАНО ВІДПРАВКУ СТАТУСУ ЗАМОВЛЕННЯ НА БЕКЕНД
  const updateOrderStatus = async (id, status) => {
    try {
      // Спочатку оптимістично оновлюємо UI
      setOrders(prev => prev.map(o => String(o.id) === String(id) ? { ...o, status } : o));
      
      const res = await fetch(`${BACKEND_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (!res.ok) {
        throw new Error("Помилка збереження статусу");
      }
    } catch (error) {
      console.error(error);
      alert("Не вдалося зберегти статус замовлення в базу даних.");
    }
  };

  const updateBanners = (b) => setBanners(b);

  return (
    <DataContext.Provider value={{
      products, sellers, orders, banners, isLoading, fetchError,
      addSeller, updateSeller, deleteSeller,
      addProduct, updateProduct, deleteProduct,
      addOrder, updateOrderStatus, updateBanners,
      BACKEND_URL, normalizeImageUrl,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);