// middleware/checkAdminOrTeacher.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Токен должен передаваться в заголовке
    const secretKey = process.env.SECRET_KEY;

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secretKey); // Проверка токена с секретным ключом
        // console.log(decoded)

        // Проверяем роль: admin или teacher
        if (decoded.role !== 'admin' && decoded.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Admins or Teachers only' });
        }

        req.user = decoded; // Сохраняем информацию о пользователе
        next(); // Разрешаем выполнение следующего middleware
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
