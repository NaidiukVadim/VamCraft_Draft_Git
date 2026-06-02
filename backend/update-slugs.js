// backend/update-slugs.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Функція транслітерації
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

async function main() {
  console.log('⏳ Починаємо безпечне оновлення посилань товарів...');

  // 1. Отримуємо всі товари, які зараз є в базі
  const products = await prisma.product.findMany();

  for (const p of products) {
    const baseSlug = generateSlug(p.name);
    // Створюємо новий латинський slug, додаючи ID для унікальності
    const newSlug = `${baseSlug || 'product'}-${p.id}`;

    console.log(`🔄 Оновлюємо: "${p.name}" -> ${newSlug}`);

    // Оновлюємо тільки поле slug для конкретного товару
    await prisma.product.update({
      where: { id: p.id },
      data: { slug: newSlug }
    });
  }

  console.log('✅ Усі посилання успішно змінено на латиницю! Замовлення залишились неушкодженими.');
}

main()
  .catch((e) => {
    console.error('❌ Помилка:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });