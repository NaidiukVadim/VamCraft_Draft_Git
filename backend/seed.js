import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Починаємо заповнювати базу...');

  // 1. Створюємо тестову категорію
  const category = await prisma.category.create({
    data: {
      name: 'Еко Декор',
      slug: 'eco-decor',
    },
  });

  // 2. Створюємо тестового продавця (твого кузена, наприклад 😉)
  const seller = await prisma.seller.create({
    data: {
      name: 'WoodCraft Studio',
      slug: 'woodcraft-studio',
      description: 'Авторські вироби з натурального дерева. Тільки ручна робота.',
      phone: '+380991234567',
      telegram: 'https://t.me/woodcraft_ua',
      isActive: true,
    },
  });

  // 3. Створюємо тестовий товар і прив'язуємо його до категорії та продавця
  await prisma.product.create({
    data: {
      name: 'Набір дубових дощок',
      slug: 'nabir-dubovykh-doshchok',
      description: 'Куплено 120 раз.',
      price: 850.00,
      imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&q=80', // Тимчасове фото з інтернету
      inStock: true,
      isActive: true,
      showOnHome: true,
      categoryId: category.id,
      sellerId: seller.id,
    },
  });

  console.log('✅ Базу успішно заповнено тестовими даними!');
}

main()
  .catch((e) => {
    console.error('Помилка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });