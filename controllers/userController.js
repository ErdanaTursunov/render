const ApiError = require('../error/apiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Group} = require('../models/models')
const { validationResult } = require('express-validator');


const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id: id, email, role}, 
        process.env.SECRET_KEY,
        {expiresIn: '1h'}
    )
}


class UserController {
    async home(req, res) {
        return res.json({"home": "Hello world"})
    }
// ********************************************************************************************************

    async registration(req, res, next) {
        try {
            // Проверка на наличие ошибок валидации
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                
                return next(ApiError.badRequest('Некорректные данные', errors.array()));
            }

            const { email, password, role, name, groupId } = req.body;

            // Проверка существующего пользователя
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }

            // Хеширование пароля
            const hashPassword = await bcrypt.hash(password, 5);

            // Создание пользователя
            const user = await User.create({
                name,
                email,
                role,
                password: hashPassword,
                groupId,
            });

            // Генерация токена
            const token = generateJwt(user.id, user.email, user.role);

            return res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
        } catch (err) {
            // Логирование ошибок и передача на middleware
            console.error('Ошибка регистрации:', err);
            return next(ApiError.internal('Ошибка на сервере'));
        }
    }

// ********************************************************************************************************
    async   login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest('Email и пароль обязательны'));
            }

            // Поиск пользователя с группой
            const user = await User.findOne({ 
                where: { email }, 
                include: [{ model: Group }] 
            });

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            // Проверка пароля
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return next(ApiError.badRequest('Неверный пароль'));
            }

            // Генерация токена
            const token = generateJwt(user.id, user.email, user.role);

            // Возврат данных
            return res.status(200).json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    group: user.Group ? user.Group.name : null, // Имя группы, если есть
                }
            });
        } catch (err) {
            // Логирование ошибки и передача на middleware
            console.error('Ошибка авторизации:', err);
            return next(ApiError.internal('Ошибка сервера при авторизации'));
        }
    }

// ********************************************************************************************************
    async signout(req, res, next) {

        return res.json({"token": "signout"})  
    }
// ********************************************************************************************************
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()