const express = require('express');

const { usersRouter } = require('./routes/users.routes');
const { restaurantsRouter } = require('./routes/restaurants.routes');
const { mealsRouter } = require('./routes/meals.routes');
const { ordersRouter } = require('./routes/order.routes');
const { reviewsRouter } = require('./routes/reviews.routes');

const app = express();

app.use(express.json());

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/restaurants', restaurantsRouter);
app.use('/api/v1/meals', mealsRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/reviews', reviewsRouter);

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'fail';

    res.status(statusCode).json({
        status,
        message: error.message,
        error,
        stack: error.stack,
    });
});

app.all('*', (req, res) => {
    res.status(400).json({
        status: 'error',
        message: `${req.method} ${req.url} does not exists in our server`,
    });
});

module.exports = { app };
