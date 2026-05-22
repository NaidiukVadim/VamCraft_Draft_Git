import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Починаємо повне заповнення бази даних крафтовими даними...');

  // ==========================================
  // 1. СТВОРЕННЯ КАТЕГОРІЙ
  // ==========================================
  const categoriesData = [
    { name: 'Кераміка', slug: 'keramika' },
    { name: 'Текстиль', slug: 'tekstyl' },
    { name: 'Дерево', slug: 'derevo' },
    { name: 'Шкіра', slug: 'shkira' },
    { name: 'Прикраси', slug: 'prykrasy' },
    { name: 'Дім', slug: 'dim' },
    { name: 'Скло', slug: 'sklo' },
    { name: 'Мистецтво', slug: 'mystetstvo' },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.name] = createdCat.id;
  }
  console.log('✅ Категорії успішно підготовлено.');

  // ==========================================
  // 2. СТВОРЕННЯ ПРОДАВЦІВ (12 МАЙСТЕРЕНЬ)
  // ==========================================
  const sellersData = [
    { mockId: 'seller_1', name: 'Аромат дому & Затишок', slug: 'aromat-domu-zatyshok', description: 'Створюємо атмосферу затишку у вашому домі: від ароматичних крафтових свічок до естетичної кераміки.', logoUrl: 'https://kaktus.ua/upload/iblock/0a4/svechi-v-interere.jpg', phone: '+380501112233', telegram: 'https://t.me/aroma_dim' },
    { mockId: 'seller_2', name: 'Глина та Вогонь', slug: 'hlyna-ta-vohon', description: 'Авторська кераміка ручної роботи. Виготовляємо посуд, вази та декор, що зберігає тепло рук майстра.', logoUrl: 'https://gydzuk.com/wp-content/uploads/2023/01/IMG_4964.jpeg', phone: '+380671234567', telegram: 'https://t.me/clay_fire' },
    { mockId: 'seller_3', name: 'Handmade by Anna', slug: 'handmade-by-anna', description: 'Теплі в\'язані речі та еко-текстиль з любов\'ю. Зігріваємо у холоди та додаємо стилю.', logoUrl: 'https://images.unsplash.com/photo-1584992231904-ee1662991665?w=500&q=80', phone: '+380639998877', telegram: 'https://t.me/anna_handmade' },
    { mockId: 'seller_4', name: 'Дерев\'яні дива', slug: 'derevyani-dyva', description: 'Ексклюзивні вироби з натурального дерева: від надійних кухонних дошок до масивних дизайнерських меблів.', logoUrl: 'https://logomaster.com.ua/works/terrawood_4.jpg', phone: '+380970001122', telegram: 'https://t.me/wood_wonders' },
    { mockId: 'seller_5', name: 'Шкіряна майстерня', slug: 'shkiryana-maisternya', description: 'Якісні шкіряні вироби на роки. Гаманці, сумки та аксесуари ручної роботи з преміальної шкіри.', logoUrl: 'https://st2.depositphotos.com/1000970/10145/i/450/depositphotos_101458968-stock-photo-man-working-with-leather.jpg', phone: '+380665554433', telegram: 'https://t.me/leather_craft' },
    { mockId: 'seller_6', name: 'Jewelry Art', slug: 'jewelry-art', description: 'Унікальні яскраві прикраси з полімерної глини та натурального каміння, які підкреслять вашу індивідуальність.', logoUrl: 'https://cdn.britannica.com/16/47016-050-750238DA/brooch-emeralds-Stomacher-flowers-enamel-treasure-gold.jpg', phone: '+380931231212', telegram: 'https://t.me/jewelry_art_ua' },
    { mockId: 'seller_7', name: 'Творча майстерня', slug: 'tvorcha-maisternya', description: 'Затишний текстиль та макраме для вашого інтер\'єру. Додаємо бохо-нотки у кожну оселю.', logoUrl: 'https://beit-grand.odessa.ua/wp-content/uploads/2021/01/wecan_main.jpg', phone: '+380507778899', telegram: 'https://t.me/creative_workshop' },
    { mockId: 'seller_8', name: 'Склодув', slug: 'skloduv', description: 'Дизайнерські вироби зі скла ручної роботи. Гра кольору, світла та градієнтів у кожній вазі.', logoUrl: 'https://www.decor.ua/img_all/canby-glass/photo_2022-11-16_20-29-10.jpg', phone: '+380674445566', telegram: 'https://t.me/glass_master' },
    { mockId: 'seller_9', name: 'Срібна нитка', slug: 'sribna-nytka', description: 'Мінімалістичні та вишукані прикраси зі срібла індивідуального виготовлення.', logoUrl: 'https://zslombard.com.ua/site_data/s89/2.1%20(sriblo).jpg', phone: '+380993332211', telegram: 'https://t.me/silver_thread' },
    { mockId: 'seller_10', name: 'Еко Косметика', slug: 'eco-kosmetyka', description: 'Натуральне крафтове мило та органічна косметика для дбайливого догляду за вашим тілом.', logoUrl: 'https://meest.shopping/uploads/images/4cfe4232c19b4f80040d1978cc6bc9ca.webp', phone: '+380731112233', telegram: 'https://t.me/eco_cosmetics' },
    { mockId: 'seller_11', name: 'Art Studio', slug: 'art-studio', description: 'Інтер\'єрні картини та сучасне мистецтво, що стануть головним акцентом вашого простору.', logoUrl: 'https://realismtoday.com/wp-content/uploads/2021/06/William-Schneider-art-studio-DSC_3562-scaled.jpg', phone: '+380689990011', telegram: 'https://t.me/art_studio_ua' },
    { mockId: 'seller_12', name: 'Лоза та Майстер', slug: 'loza-ta-maister', description: 'Плетені кошики та декор з екологічно чистої лози. Традиції лозоплетіння в сучасному дизайні.', logoUrl: 'https://karpat-telehraf.net/wp-content/uploads/2025/04/karpat-18-2-1024x683.jpg', phone: '+380502223344', telegram: 'https://t.me/loza_master' }
  ];

  const sellerMap = {};
  for (const s of sellersData) {
    const createdSeller = await prisma.seller.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        description: s.description,
        phone: s.phone,
        telegram: s.telegram,
        logoUrl: s.logoUrl,
      },
      create: {
        name: s.name,
        slug: s.slug,
        description: s.description,
        phone: s.phone,
        telegram: s.telegram,
        logoUrl: s.logoUrl,
        isActive: true,
      },
    });
    sellerMap[s.mockId] = createdSeller.id;
  }
  console.log('✅ Продавців успішно додано/оновлено.');

  // ==========================================
  // 3. СТВОРЕННЯ ТОВАРІВ (30 ОДИНИЦЬ)
  // ==========================================
  const productsData = [
    { mockId: 'p1', sellerId: 'seller_1', name: 'Керамічна чашка з квітковим орнаментом', description: 'Куплено 127 разів. Повністю ручна робота, покрита безпечною глазур\'ю.', price: 450, category: 'Кераміка', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80', inStock: true },
    { mockId: 'p2', sellerId: 'seller_3', name: 'В\'язаний шарф з геометричним візерунком', description: 'Куплено 97 разів. Теплий, м\'який шарф, котрий зігріє взимку.', price: 680, category: 'Текстиль', imageUrl: 'https://images.unsplash.com/photo-1520903928273-0f44b7a28431?w=500&q=80', inStock: true },
    { mockId: 'p3', sellerId: 'seller_4', name: 'Дошка для нарізки з натурального дерева', description: 'Куплено 76 разів. Виготовлено з міцного дуба, оброблено еко-олією.', price: 890, category: 'Дерево', imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&q=80', inStock: true },
    { mockId: 'p4', sellerId: 'seller_5', name: 'Шкіряний гаманець з гравіюванням', description: 'Куплено 110 разів. Натуральна шкіра Crazy Horse, надійний ручний шов.', price: 1450, category: 'Шкіра', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80', inStock: true, isRecommended: true },
    { mockId: 'p5', sellerId: 'seller_6', name: 'Сережки з полімерної глини', description: 'Куплено 85 разів. Легкі, стильні та унікальні сережки для вашого образу.', price: 320, category: 'Прикраси', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80', inStock: true },
    { mockId: 'p6', sellerId: 'seller_1', name: 'Ароматичні свічки набір 3 шт', description: 'Куплено 150 разів. Натуральний соєвий віск з ароматом ванілі та лаванди.', price: 580, category: 'Дім', imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80', inStock: true },
    { mockId: 'p7', sellerId: 'seller_7', name: 'Макраме панно на стіну', description: 'Куплено 63 разів. Естетичний бохо-декор з натуральної бавовняної нитки.', price: 1250, category: 'Текстиль', imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&q=80', inStock: true, isRecommended: true },
    { mockId: 'p8', sellerId: 'seller_2', name: 'Набір керамічних тарілок ручної роботи', description: 'Куплено 42 рази. Складається з двох обідніх та однієї глибокої тарілки.', price: 1800, category: 'Кераміка', imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861afaa?w=500&q=80', inStock: true },
    { mockId: 'p9', sellerId: 'seller_4', name: 'Дизайнерський дерев\'яний стілець', description: 'Куплено 15 разів. Ергономічний стілець з масиву ясеня.', price: 4500, category: 'Дерево', imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80', inStock: false, isRecommended: true },
    { mockId: 'p10', sellerId: 'seller_8', name: 'Дизайнерська скляна ваза ручної роботи', description: 'Куплено 58 разів. Склодувна майстерність, неповторні бульбашки повітря всередині.', price: 2100, category: 'Скло', imageUrl: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80', inStock: true },
    { mockId: 'p11', sellerId: 'seller_2', name: 'Висока керамічна ваза', description: 'Куплено 34 рази. Ідеально підходить для сухоцвітів та великих букетів.', price: 1100, category: 'Кераміка', imageUrl: 'https://images.unsplash.com/photo-1581781870027-04212e231e96?w=500&q=80', inStock: true },
    { mockId: 'p12', sellerId: 'seller_9', name: 'Срібний кулон індивідуального виготовлення', description: 'Куплено 89 разів. Срібло 925 проби з унікальною фактурою дерева.', price: 1350, category: 'Прикраси', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80', inStock: true },
    { mockId: 'p13', sellerId: 'seller_3', name: 'Теплий вовняний шарф', description: 'Куплено 115 разів. 100% мериносова вовна, дуже ніжна до шкіри.', price: 950, category: 'Текстиль', imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&q=80', inStock: true },
    { mockId: 'p14', sellerId: 'seller_10', name: 'Набір крафтового мила', description: 'Куплено 210 разів. Органічні компоненти, зволожуючі ефірні олії.', price: 450, category: 'Дім', imageUrl: 'https://images.unsplash.com/photo-1607006342456-ba2755506a7a?w=500&q=80', inStock: true },
    { mockId: 'p15', sellerId: 'seller_5', name: 'Сумка-шопер з натуральної шкіри', description: 'Куплено 28 разів. Містка сумка з внутрішньою кишенею.', price: 3800, category: 'Шкіра', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80', inStock: true },
    { mockId: 'p16', sellerId: 'seller_8', name: 'Скляна ваза з градієнтом', description: 'Куплено 45 разів. Вишуканий перехід від глибокого синього до прозорого.', price: 1600, category: 'Скло', imageUrl: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=500&q=80', inStock: true },
    { mockId: 'p17', sellerId: 'seller_4', name: 'Абстрактна скульптура з дуба', description: 'Куплено 8 разів. Стильний акцент для сучасного інтер\'єру чи офісу.', price: 5200, category: 'Дерево', imageUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=500&q=80', inStock: true },
    { mockId: 'p18', sellerId: 'seller_2', name: 'Глибока керамічна миска для рамену', description: 'Куплено 142 рази. Автентична глина, стійка до гарячих страв.', price: 650, category: 'Кераміка', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80', inStock: true },
    { mockId: 'p19', sellerId: 'seller_9', name: 'Мінімалістичне намисто', description: 'Куплено 77 разів. Тонкий срібний ланцюжок з маленькою перлиною.', price: 850, category: 'Прикраси', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80', inStock: true },
    { mockId: 'p20', sellerId: 'seller_9', name: 'Срібні сережки ручної роботи', description: 'Куплено 54 рази. Геометрична форма з матовим покриттям.', price: 1200, category: 'Прикраси', imageUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80', inStock: true },
    { mockId: 'p21', sellerId: 'seller_2', name: 'Авторська керамічна ваза', description: 'Куплено 18 разів. Покрита рідкісною ефектною кракле-глазур\'ю.', price: 2500, category: 'Кераміка', imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=500&q=80', inStock: true },
    { mockId: 'p22', sellerId: 'seller_4', name: 'Масивна дубова дошка для подачі', description: 'Куплено 132 рази. Велика дошка з "живим" краєм дерева кори.', price: 750, category: 'Дерево', imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861afaa?w=500&q=80', inStock: true },
    { mockId: 'p23', sellerId: 'seller_6', name: 'Сережки з натуральним каменем', description: 'Куплено 65 разів. Натуральний необроблений кварц у срібній оправі.', price: 950, category: 'Прикраси', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80', inStock: true },
    { mockId: 'p24', sellerId: 'seller_3', name: 'Лляна еко-сумка з вишивкою', description: 'Куплено 94 рази. Натуральний льон, якісна машинна вишивка гладдю.', price: 600, category: 'Текстиль', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80', inStock: true },
    { mockId: 'p25', sellerId: 'seller_1', name: 'Подарунковий набір аромасвічок', description: 'Куплено 215 разів. Чотири різні затишні зимові аромати у коробці.', price: 850, category: 'Дім', imageUrl: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=500&q=80', inStock: true },
    { mockId: 'p26', sellerId: 'seller_5', name: 'Класичний шкіряний гаманець', description: 'Куплено 88 разів. Містить відділення для купюр та 6 слотів для карток.', price: 1600, category: 'Шкіра', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80', inStock: true },
    { mockId: 'p27', sellerId: 'seller_11', name: 'Інтер\'єрна картина акрилом', description: 'Куплено 7 разів. Сучасна абстракція на великому полотні з підрамником.', price: 3500, category: 'Мистецтво', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80', inStock: true, isRecommended: true },
    { mockId: 'p28', sellerId: 'seller_10', name: 'Органічне мило з лавандою', description: 'Куплено 340 разів. З додаванням сухих квітів лаванди для м\'якого скрабування.', price: 150, category: 'Дім', imageUrl: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=500&q=80', inStock: true },
    { mockId: 'p29', sellerId: 'seller_12', name: 'Плетений кошик з лози', description: 'Куплено 45 разів. Зручний міцний кошик для грибів, пікніка або фруктів.', price: 800, category: 'Дім', imageUrl: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=500&q=80', inStock: true },
    { mockId: 'p30', sellerId: 'seller_2', name: 'Керамічний горщик для рослин', description: 'Куплено 112 разів. Має дренажний отвір, дихаюча теракотова глина.', price: 450, category: 'Кераміка', imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80', inStock: true }
  ];

  for (const p of productsData) {
    // Формуємо красивий унікальний латинський slug із назви товару
    const baseSlug = p.name
      .toLowerCase()
      .replace(/[^a-z0-9а-яіїєґ]+/g, '-')
      .replace(/^-|-$/g, '');
    const productSlug = `${baseSlug || 'product'}-${p.mockId}`;

    await prisma.product.upsert({
      where: { slug: productSlug },
      update: {
        name: p.name,
        description: p.description,
        price: parseFloat(p.price),
        imageUrl: p.imageUrl,
        inStock: p.inStock,
        showOnHome: p.isRecommended || false,
        categoryId: categoryMap[p.category],
        sellerId: sellerMap[p.sellerId],
      },
      create: {
        name: p.name,
        slug: productSlug,
        description: p.description,
        price: parseFloat(p.price),
        imageUrl: p.imageUrl,
        inStock: p.inStock,
        isActive: true,
        showOnHome: p.isRecommended || false,
        categoryId: categoryMap[p.category],
        sellerId: sellerMap[p.sellerId],
      }
    });
  }

  console.log('✅ Базу даних успішно заповнено всіма 12 продавцями та 30 товарами!');
}

main()
  .catch((e) => {
    console.error('❌ Помилка під час сідування:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });