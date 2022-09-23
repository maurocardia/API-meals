const express = require('express');

const { userExists } = require('../middlewares/user.middlewares');

const {
    getAllUsers,
    createUSer,
    updateUser,
    deleteUser,
    loginUser,
    userOrders,
} = require('../contollers/users.controllers');

const { protectSession } = require('../middlewares/auth.middleware');
const { orderExists } = require('../middlewares/order.middleware');
const { createUserValidators } = require('../middlewares/validator.middleware');

const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createUSer);
usersRouter.post('/login', loginUser);

usersRouter.use(protectSession);

usersRouter.get('/orders', getAllUsers);
usersRouter.get('/orders/:id', orderExists, userOrders);
usersRouter.patch('/:id', userExists, updateUser);
usersRouter.delete('/:id', userExists, deleteUser);

module.exports = { usersRouter };
