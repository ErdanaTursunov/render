const { body } = require('express-validator');

const validateRegistration = [
    body('email').isEmail().withMessage('Некорректный email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
    body('name').notEmpty().withMessage('Имя обязательно'),
    body('role').optional().isIn(['teacher', 'admin', 'student']).withMessage('Роль указана неверно'),
];

module.exports = { validateRegistration };
