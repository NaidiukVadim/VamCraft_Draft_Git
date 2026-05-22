// backend/index.js
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const prisma = new PrismaClient();

// Налаштування CORS та JSON
const cors = require('cors');

// Дозволяємо запити саме з твого сайту на GitHub Pages
app.use(cors({
  origin: "https://naidiukvadim.github.io", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ==========================================
// НАЛАШТУВАННЯ ЗАВАНТАЖЕННЯ ФОТО (MULTER)
// ==========================================

// Створюємо папку uploads, якщо її ще немає
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Вчимо сервер "роздавати" файли з папки uploads, щоб React міг їх показати
app.use('/uploads', express.static('uploads'));

// Налаштовуємо, куди і як зберігати фото
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Зберігаємо в папку uploads
  },
  filename: function (req, file, cb) {
    // Даємо файлу унікальне ім'я (щоб не перезаписати існуючі)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

// ==========================================
// API МАРШРУТИ
// ==========================================

// --- ТОВАРИ ---
// Отримати всі товари
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { seller: true, category: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Помилка при отриманні товарів" });
  }
});

// СТВОРИТИ НОВИЙ ТОВАР (з картинкою)
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, categoryId, sellerId, slug } = req.body;
    
    // Формуємо посилання на фото (якщо воно є)
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: slug || `${Date.now()}`,
        description,
        price: parseFloat(price),
        imageUrl: imageUrl, 
        categoryId: parseInt(categoryId),
        sellerId: parseInt(sellerId),
      },
      // Обов'язково повертаємо дані продавця і категорії
      include: {
        seller: true,
        category: true
      }
    });
    
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при створенні товару" });
  }
});

// --- ПРОДАВЦІ ---
// Отримати всіх продавців
app.get('/api/sellers', async (req, res) => {
  try {
    const sellers = await prisma.seller.findMany();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: "Помилка при отриманні продавців" });
  }
});

// СТВОРИТИ НОВОГО ПРОДАВЦЯ
app.post('/api/sellers', upload.single('logo'), async (req, res) => {
  try {
    const { name, description, phone, telegram, slug } = req.body;
    
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newSeller = await prisma.seller.create({
      data: {
        name,
        slug: slug || `seller-${Date.now()}`,
        description,
        phone,
        telegram,
        logoUrl: logoUrl,
        isActive: true,
      }
    });
    
    res.json(newSeller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при створенні продавця" });
  }
});

// --- ЗАМОВЛЕННЯ ---
// Отримати всі замовлення
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true // Обов'язково підтягуємо товари з бази
      },
      orderBy: {
        createdAt: 'desc' // Щоб найновіші замовлення були зверху
      }
    });

    // Підлаштовуємо дані під фронтенд (перейменовуємо orderItems в items)
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.orderItems 
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Помилка при отриманні замовлень:", error);
    res.status(500).json({ error: "Не вдалося отримати замовлення" });
  }
});

// СТВОРИТИ НОВЕ ЗАМОВЛЕННЯ
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerPhone, city, postBranch, comment, totalPrice, items } = req.body;

    const newOrder = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        city,
        postBranch,
        comment: comment || "",
        totalPrice: parseFloat(totalPrice),
        status: "NEW", // Відповідно до твого enum OrderStatus
        // Зберігаємо товари у зв'язану таблицю orderItems
        orderItems: {
          create: items.map(item => ({
            productId: parseInt(item.id),
            sellerId: parseInt(item.sellerId), // Обов'язкове поле
            quantity: parseInt(item.quantity),
            priceAtPurchase: parseFloat(item.price)
          }))
        }
      },
      include: {
        orderItems: true // Повертаємо збережене замовлення разом із товарами
      }
    });

    res.json(newOrder);
  } catch (error) {
    console.error("Помилка при збереженні замовлення:", error);
    res.status(500).json({ error: "Не вдалося зберегти замовлення" });
  }
});

// ==========================================
// ЗАПУСК СЕРВЕРА
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер успішно запущено на http://localhost:${PORT}`);
});