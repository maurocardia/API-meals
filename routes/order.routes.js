const express = require('express');

const {
    createOrder,
    getUserOrder,
    completedOrder,
    deleteOrder,
} = require('../contollers/orders.controllers');

const { protectSession } = require('../middlewares/auth.middleware');
const {
    orderExists,
    protectOrderUser,
} = require('../middlewares/order.middleware');

const ordersRouter = express.Router();

ordersRouter.use(protectSession);

ordersRouter.post('/', createOrder);
ordersRouter.get('/me', getUserOrder);
ordersRouter.patch('/:id', orderExists, protectOrderUser, completedOrder);
ordersRouter.delete('/:id', orderExists, protectOrderUser, deleteOrder);

module.exports = { ordersRouter };
