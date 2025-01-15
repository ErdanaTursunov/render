const winston = require('winston');

const logger = winston.createLogger({
    level: 'info', // Минимальный уровень логирования
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // Логи в формате JSON
    ),
    transports: [
        new winston.transports.Console(), // Логи в консоль
        new winston.transports.File({ filename: 'error.log', level: 'error' }), // Ошибки в файл
        new winston.transports.File({ filename: 'combined.log' }), // Все логи в файл
    ],
});

module.exports = logger;
