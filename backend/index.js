// backend/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Дозволяє запити з вашого React-фронтенду
app.use(express.json()); // Дозволяє серверу читати JSON-дані

// Ваш перший тестовий маршрут (API endpoint)
app.get('/api/products', (req, res) => {
    // Це фіктивні дані, пізніше вони будуть братися з бази даних
    const mockProducts = [
        { id: 1, name: 'В\'язаний шарф', price: 500, seller: 'Майстерня А' },
        { id: 2, name: 'Керамічна чашка', price: 350, seller: 'Майстерня Б' },
        { id: 3, name: 'Керамічна чашка', price: 350, seller: 'Майстерня Б' }
    ];
    
    res.json(mockProducts);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер успішно запущено на порту ${PORT}`);
});