// Існуючі імпорти
import cupImg from '../src/assets/images/cup.svg';
import scarfImg from '../src/assets/images/scarf.svg';
import boardImg from '../src/assets/images/cutting board.svg';
import walletImg from '../src/assets/images/wallet.svg';
import earringsImg from '../src/assets/images/earrings.svg';
import candlesImg from '../src/assets/images/candles.svg';
import macrameImg from '../src/assets/images/macrame.svg';
import plateImg from '../src/assets/images/plates.svg';
import chairImg from '../src/assets/images/woodchair.svg';
import glassSImg from '../src/assets/images/glass.svg';
import ceramicVaseImg from '../src/assets/images/ceramic-vase.svg';
import silverNecklaceImg from '../src/assets/images/silver.svg';
import woolScarfImg from '../src/assets/images/wool-scarf.svg';
import soapImg from '../src/assets/images/soap.svg';
import leatherBagImg from '../src/assets/images/leather-bag.svg';
import glassVaseImg from '../src/assets/images/glass-vase.svg';
import woodenSculptureImg from '../src/assets/images/wooden-sculpture.svg';
import bowlImg from '../src/assets/images/bowl.svg';
import necklaceImg from '../src/assets/images/necklace.svg';

// Нові імпорти
import silverEaringsImg from '../src/assets/images/silver-earings.svg';
import ceramicVaseHandmadeImg from '../src/assets/images/ceramic-vase-handmade.svg';
import woodenBoardImg from '../src/assets/images/wooden-board.svg';
import earingsNaturalRockImg from '../src/assets/images/earings-naturalrock.svg';
import linenBagImg from '../src/assets/images/Linen-bag-with-embroidery.svg';
import aromaCandlesImg from '../src/assets/images/aroma-candles.svg';
import leatherWalletImg from '../src/assets/images/leather-wallet.svg';
import paintingImg from '../src/assets/images/painting.svg';
import naturalSoapImg from '../src/assets/images/natural-soap.svg';
import wickerBasketImg from '../src/assets/images/wicker-basket.svg';
import ceramicPotImg from '../src/assets/images/Ceramic-pot-for-plants.svg';

export const mockProducts = [
  // --- Існуючі товари ---
  {
    id: 'prod_1',
    sellerId: 'seller_1',
    owner: 'Майстерня "Затишок"',
    name: 'Керамічна чашка з квітковим орнаментом',
    description: 'Куплено 127 разів',
    price: 450,
    category: 'Кераміка',
    imageUrl: cupImg,
    inStock: true,
    salesCount: 127
  },
  {
    id: 'prod_2',
    sellerId: 'seller_3', 
    owner: 'Handmade by Anna',
    name: 'В\'язаний шарф з геометричним візерунком',
    description: 'Куплено 97 разів',
    price: 680,
    category: 'Текстиль',
    imageUrl: scarfImg,
    inStock: true,
    salesCount: 97,
  },
  {
    id: 'prod_3',
    sellerId: 'seller_4',
    owner: 'Дерев\'яні дива',
    name: 'Дошка для нарізки з натурального дерева',
    description: 'Куплено 76 разів',
    price: 890,
    category: 'Дерево',
    imageUrl: boardImg,
    inStock: true,
    salesCount: 76
  },
  {
    id: 'prod_4',
    sellerId: 'seller_5',
    owner: 'Шкіряна майстерня',
    name: 'Шкіряний гаманець з гравіюванням',
    description: 'Куплено 110 разів',
    price: 1450,
    category: 'Шкіра',
    imageUrl: walletImg,
    inStock: true,
    salesCount: 110,
    isRecommended: true
  },
  {
    id: 'prod_5',
    sellerId: 'seller_6',
    owner: 'Jewelry Art',
    name: 'Сережки з полімерної глини',
    description: 'Куплено 85 разів',
    price: 320,
    category: 'Прикраси',
    imageUrl: earringsImg,
    inStock: true,
    salesCount: 85
  },
  {
    id: 'prod_6',
    sellerId: 'seller_1',
    owner: 'Аромат дому',
    name: 'Ароматичні свічки набір 3 шт',
    description: 'Куплено 150 разів',
    price: 580,
    category: 'Дім',
    imageUrl: candlesImg,
    inStock: true,
    salesCount: 150
  },
  {
    id: 'prod_7',
    sellerId: 'seller_7',
    owner: 'Творча майстерня',
    name: 'Макраме панно на стіну',
    description: 'Куплено 63 разів',
    price: 1250,
    category: 'Текстиль',
    imageUrl: macrameImg,
    inStock: true,
    salesCount: 63,
    isRecommended: true
  },
  {
    id: 'prod_8',
    sellerId: 'seller_2',
    owner: 'Глина та Вогонь',
    name: 'Набір керамічних тарілок ручної роботи',
    description: 'Куплено 42 рази',
    price: 1800,
    category: 'Кераміка',
    imageUrl: plateImg,
    inStock: true,
    salesCount: 42
  },
  {
    id: 'prod_9',
    sellerId: 'seller_4',
    owner: 'Дерев\'яні дива',
    name: 'Дизайнерський дерев\'яний стілець',
    description: 'Куплено 15 разів',
    price: 4500,
    category: 'Дерево',
    imageUrl: chairImg,
    inStock: false,
    salesCount: 15,
    isRecommended: true
  },
  {
    id: 'prod_10',
    sellerId: 'seller_8',
    owner: 'Склодув',
    name: 'Дизайнерська скляна ваза ручної роботи',
    description: 'Куплено 58 разів',
    price: 2100,
    category: 'Скло',
    imageUrl: glassSImg,
    inStock: true,
    salesCount: 58
  },
  {
    id: 'prod_11',
    sellerId: 'seller_2',
    owner: 'Глина та Вогонь',
    name: 'Висока керамічна ваза',
    description: 'Куплено 34 рази',
    price: 1100,
    category: 'Кераміка',
    imageUrl: ceramicVaseImg,
    inStock: true,
    salesCount: 34
  },
  {
    id: 'prod_12',
    sellerId: 'seller_9',
    owner: 'Срібна нитка',
    name: 'Срібний кулон індивідуального виготовлення',
    description: 'Куплено 89 разів',
    price: 1350,
    category: 'Прикраси',
    imageUrl: silverNecklaceImg,
    inStock: true,
    salesCount: 89,

  },
  {
    id: 'prod_13',
    sellerId: 'seller_3',
    owner: 'Handmade by Anna',
    name: 'Теплий вовняний шарф',
    description: 'Куплено 115 разів',
    price: 950, 
    category: 'Текстиль',
    imageUrl: woolScarfImg,
    inStock: true,
    salesCount: 115
  },
  {
    id: 'prod_14',
    sellerId: 'seller_10',
    owner: 'Еко Косметика',
    name: 'Набір крафтового мила',
    description: 'Куплено 210 разів',
    price: 450,
    category: 'Дім',
    imageUrl: soapImg,
    inStock: true,
    salesCount: 210,
  },
  {
    id: 'prod_15',
    sellerId: 'seller_5',
    owner: 'Шкіряна майстерня',
    name: 'Сумка-шопер з натуральної шкіри',
    description: 'Куплено 28 разів',
    price: 3800,
    category: 'Шкіра',
    imageUrl: leatherBagImg,
    inStock: true,
    salesCount: 28
  },
  {
    id: 'prod_16',
    sellerId: 'seller_8',
    owner: 'Склодув',
    name: 'Скляна ваза з градієнтом',
    description: 'Куплено 45 разів',
    price: 1600,
    category: 'Скло',
    imageUrl: glassVaseImg,
    inStock: true,
    salesCount: 45
  },
  {
    id: 'prod_17',
    sellerId: 'seller_4',
    owner: 'Дерев\'яні дива',
    name: 'Абстрактна скульптура з дуба',
    description: 'Куплено 8 разів',
    price: 5200,
    category: 'Дерево',
    imageUrl: woodenSculptureImg,
    inStock: true,
    salesCount: 8,
  },
  {
    id: 'prod_18',
    sellerId: 'seller_2',
    owner: 'Глина та Вогонь',
    name: 'Глибока керамічна миска для рамену',
    description: 'Куплено 142 рази',
    price: 650,
    category: 'Кераміка',
    imageUrl: bowlImg,
    inStock: true,
    salesCount: 142
  },
  {
    id: 'prod_19',
    sellerId: 'seller_9',
    owner: 'Срібна нитка',
    name: 'Мінімалістичне намисто',
    description: 'Куплено 77 разів',
    price: 850,
    category: 'Прикраси',
    imageUrl: necklaceImg,
    inStock: true,
    salesCount: 77
  },

  {
    id: 'prod_20',
    sellerId: 'seller_9',
    owner: 'Срібна нитка',
    name: 'Срібні сережки ручної роботи',
    description: 'Куплено 54 рази',
    price: 1200,
    category: 'Прикраси',
    imageUrl: silverEaringsImg,
    inStock: true,
    salesCount: 54
  },
  {
    id: 'prod_21',
    sellerId: 'seller_2',
    owner: 'Глина та Вогонь',
    name: 'Авторська керамічна ваза',
    description: 'Куплено 18 разів',
    price: 2500,
    category: 'Кераміка',
    imageUrl: ceramicVaseHandmadeImg,
    inStock: true,
    salesCount: 18,
  },
  {
    id: 'prod_22',
    sellerId: 'seller_4',
    owner: 'Дерев\'яні дива',
    name: 'Масивна дубова дошка для подачі',
    description: 'Куплено 132 рази',
    price: 750,
    category: 'Дерево',
    imageUrl: woodenBoardImg,
    inStock: true,
    salesCount: 132
  },
  {
    id: 'prod_23',
    sellerId: 'seller_6',
    owner: 'Jewelry Art',
    name: 'Сережки з натуральним каменем',
    description: 'Куплено 65 разів',
    price: 950,
    category: 'Прикраси',
    imageUrl: earingsNaturalRockImg,
    inStock: true,
    salesCount: 65,
  },
  {
    id: 'prod_24',
    sellerId: 'seller_3',
    owner: 'Handmade by Anna',
    name: 'Лляна еко-сумка з вишивкою',
    description: 'Куплено 94 рази',
    price: 600,
    category: 'Текстиль',
    imageUrl: linenBagImg,
    inStock: true,
    salesCount: 94
  },
  {
    id: 'prod_25',
    sellerId: 'seller_1',
    owner: 'Аромат дому',
    name: 'Подарунковий набір аромасвічок',
    description: 'Куплено 215 разів',
    price: 850,
    category: 'Дім',
    imageUrl: aromaCandlesImg,
    inStock: true,
    salesCount: 215,
  },
  {
    id: 'prod_26',
    sellerId: 'seller_5',
    owner: 'Шкіряна майстерня',
    name: 'Класичний шкіряний гаманець',
    description: 'Куплено 88 разів',
    price: 1600,
    category: 'Шкіра',
    imageUrl: leatherWalletImg,
    inStock: true,
    salesCount: 88
  },
  {
    id: 'prod_27',
    sellerId: 'seller_11',
    owner: 'Art Studio',
    name: 'Інтер\'єрна картина акрилом',
    description: 'Куплено 7 разів',
    price: 3500,
    category: 'Мистецтво',
    imageUrl: paintingImg,
    inStock: true,
    salesCount: 7,
    isRecommended: true
  },
  {
    id: 'prod_28',
    sellerId: 'seller_10',
    owner: 'Еко Косметика',
    name: 'Органічне мило з лавандою',
    description: 'Куплено 340 разів',
    price: 150,
    category: 'Дім',
    imageUrl: naturalSoapImg,
    inStock: true,
    salesCount: 340
  },
  {
    id: 'prod_29',
    sellerId: 'seller_12',
    owner: 'Лоза та Майстер',
    name: 'Плетений кошик з лози',
    description: 'Куплено 45 разів',
    price: 800,
    category: 'Дім',
    imageUrl: wickerBasketImg,
    inStock: true,
    salesCount: 45
  },
  {
    id: 'prod_30',
    sellerId: 'seller_2',
    owner: 'Глина та Вогонь',
    name: 'Керамічний горщик для рослин',
    description: 'Куплено 112 разів',
    price: 450,
    category: 'Кераміка',
    imageUrl: ceramicPotImg,
    inStock: true,
    salesCount: 112
  }
];