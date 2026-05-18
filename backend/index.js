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
app.use(cors());
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

// Отримати всіх продавців
app.get('/api/sellers', async (req, res) => {
  try {
    const sellers = await prisma.seller.findMany();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: "Помилка при отриманні продавців" });
  }
});

// СТВОРИТИ НОВИЙ ТОВАР (з картинкою)
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    // req.body містить текст, req.file містить файл
    const { name, description, price, categoryId, sellerId, slug } = req.body;
    
    // Формуємо посилання на фото (якщо воно є)
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: slug || `${Date.now()}`, // Тимчасовий слагогенератор
        description,
        price: parseFloat(price),
        imageUrl: imageUrl, 
        categoryId: parseInt(categoryId),
        sellerId: parseInt(sellerId),
      }
    });
    
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при створенні товару" });
  }
});

// ==========================================
// ЗАПУСК СЕРВЕРА
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер успішно запущено на http://localhost:${PORT}`);
});