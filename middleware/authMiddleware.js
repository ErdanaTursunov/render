const jwt = require('jsonwebtoken');
const { User } = require('../models/models'); // Если нужно получить информацию о пользователе из базы данных
const logger = require('../logger');
require('dotenv').config()

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка

        if (!token) {
            logger.error('')
            return res.status(401).json({ message: 'Токен не предоставлен' });
        }

        const secretKey = process.env.SECRET_KEY; // Получаем секретный ключ из переменной окружения

        if (!secretKey) {
            return res.status(500).json({ message: 'Секретный ключ не задан' });
        }
        // Проверяем токен и извлекаем данные
        const decoded = jwt.verify(token, secretKey); // Используйте ваш секретный ключ для проверки
        // console.log(decoded)
        // Здесь можно добавить дополнительные данные о пользователе, если нужно (например, его информацию из базы)
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        req.user = user; // Добавляем пользователя в запрос
        next(); // Переходим к следующему middleware или обработчику
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Неавторизованный доступ' });
    }
};

module.exports = authMiddleware;
