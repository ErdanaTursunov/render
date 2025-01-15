require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const router = require('./routes/routes')
const cors = require('cors')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const logger = require('./logger');

const PORT = process.env.PORT || 4000

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

//Логирование запросов
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// app.use((req, res) => {
//     res.status(404).json({ message: 'Route not found' });
// });

app.use('/api', router)

//Обработка ошибок, последний Middleware
app.use(errorHandler)

const start = async () => {
    try {
        sequelize.authenticate()
        await sequelize.sync(
            // { force: true }
        );
        app.listen(PORT, '0.0.0.0', () => logger.info(`Server started on port ${PORT}`));
    } catch (e) {
        logger.error('Error starting server:', e);
    }

}

start()