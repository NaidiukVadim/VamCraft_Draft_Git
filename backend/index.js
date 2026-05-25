// backend/index.js
import 'dotenv/config'; // Це дозволить Node.js прочитати файл .env
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';

const app = express();
const prisma = new PrismaClient();

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
// НАЛАШТУВАННЯ CLOUDINARY ТА MULTER
// ==========================================

// 1. Конфігурація Cloudinary з файлу .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Налаштування сховища для прямого завантаження у хмару
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vamcraft', // Папка, яка створиться в твоєму Cloudinary
    format: async (req, file) => 'png', // Формат збереження
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
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
    const { name, description, price, categoryId, sellerId, slug, isRecommended, showOnHome, imageUrl: bodyImageUrl } = req.body;
    
    // Якщо файл завантажено в Cloudinary, беремо шлях звідти (req.file.path). 
    // Інакше беремо текстове посилання, якщо воно є.
    const finalImageUrl = req.file ? req.file.path : (bodyImageUrl || null);

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: slug || `${Date.now()}`,
        description,
        price: parseFloat(price),
        imageUrl: finalImageUrl, 
        categoryId: parseInt(categoryId),
        sellerId: parseInt(sellerId),
        showOnHome: showOnHome === 'true',      // Для популярних
        isPromoted: isRecommended === 'true',   // Для рекомендованих
      },
      include: { seller: true, category: true }
    });
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Помилка при створенні товару" });
  }
});

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, sellerId, isRecommended, showOnHome, imageUrl: bodyImageUrl } = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!existingProduct) return res.status(404).json({ error: "Товар не знайдено" });

    let finalImageUrl = existingProduct.imageUrl;
    
    // Якщо завантажили нове фото, оновлюємо на Cloudinary URL
    if (req.file) {
      finalImageUrl = req.file.path; 
    } else if (bodyImageUrl !== undefined) {
      finalImageUrl = bodyImageUrl; 
    }

    const updateData = {
      name: name || existingProduct.name,
      description: description || existingProduct.description,
      price: price ? parseFloat(price) : existingProduct.price,
      categoryId: categoryId ? parseInt(categoryId) : existingProduct.categoryId,
      sellerId: sellerId ? parseInt(sellerId) : existingProduct.sellerId,
      imageUrl: finalImageUrl,
    };

    // Розділяємо два статуси:
    if (showOnHome !== undefined) {
      updateData.showOnHome = showOnHome === 'true'; // На головній (популярні)
    }
    if (isRecommended !== undefined) {
      updateData.isPromoted = isRecommended === 'true'; // Рекомендовані
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { seller: true, category: true }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Помилка оновлення:", error);
    res.status(500).json({ error: "Помилка при оновленні товару" });
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
    const { name, description, phone, telegram, slug, logoUrl: bodyLogoUrl } = req.body;
    
    // Якщо файл завантажено в Cloudinary, беремо шлях звідти.
    const finalLogoUrl = req.file ? req.file.path : (bodyLogoUrl || null);

    const newSeller = await prisma.seller.create({
      data: {
        name,
        slug: slug || `seller-${Date.now()}`,
        description,
        phone,
        telegram,
        logoUrl: finalLogoUrl,
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
});