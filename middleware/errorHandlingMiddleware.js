const ApiError = require('../error/apiError');
const logger = require('../logger');

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        logger.warn(`API Error: ${err.message}`, { status: err.status, stack: err.stack });
        return res.status(err.status).json({ message: err.message });
    }

    // Логирование непредвиденных ошибок
    logger.error('Unexpected Error:', { message: err.message, stack: err.stack });

    return res.status(500).json({ message: 'Непредвиденная ошибка!' });
};