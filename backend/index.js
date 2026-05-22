// backend/index.js
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const prisma = new PrismaClient();

// Налаштування CORS
app.use(cors({
  origin: [
    "https://naidiukvadim.github.io", 
    "http://localhost:5173"           
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ==========================================
// НАЛАШТУВАННЯ ЗАВАНТАЖЕННЯ ФОТО (MULTER)
// ==========================================

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

// ==========================================
// API МАРШРУТИ
// ==========================================

// --- ТОВАРИ ---
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

app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, categoryId, sellerId, slug } = req.body;
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
      include: { seller: true, category: true }
    });
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Помилка при створенні товару" });
  }
});

// --- ПРОДАВЦІ ---
app.get('/api/sellers', async (req, res) => {
  try {
    const sellers = await prisma.seller.findMany();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: "Помилка при отриманні продавців" });
  }
});

app.post('/api/sellers', upload.single('logo'), async (req, res) => {
  try {
    // Дістаємо logoUrl з текстових полів форми (на випадок, якщо це посилання з інтернету)
    const { name, description, phone, telegram, slug, logoUrl: bodyLogoUrl } = req.body;
    
    // ВАЖЛИВО: Перевіряємо, що саме прийшло. Файл - в пріоритеті, інакше - текстове посилання.
    const finalLogoUrl = req.file ? `/uploads/${req.file.filename}` : (bodyLogoUrl || null);

    const newSeller = await prisma.seller.create({
      data: {
        name,
        slug: slug || `seller-${Date.now()}`,
        description,
        phone,
        telegram,
        logoUrl: finalLogoUrl, // Тепер тут збережеться URL, якщо ти його ввів
        isActive: true,
      }
    });
    res.json(newSeller);
  } catch (error) {
    res.status(500).json({ error: "Помилка при створенні продавця" });
  }
});

// --- ЗАМОВЛЕННЯ ---
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' }
    });
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.orderItems 
    }));
    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ error: "Не вдалося отримати замовлення" });
  }
});

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
        status: "NEW",
        orderItems: {
          create: items.map(item => ({
            productId: parseInt(item.id),
            sellerId: parseInt(item.sellerId),
            quantity: parseInt(item.quantity),
            priceAtPurchase: parseFloat(item.price)
          }))
        }
      },
      include: { orderItems: true }
    });
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Не вдалося зберегти замовлення" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
});