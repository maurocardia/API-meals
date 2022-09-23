const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/user.models');

const { catchAsync } = require('../utils/catch.Async.util');
const { AppError } = require('../utils/appError.util');
const { Restaurant } = require('../models/restaurant.models');
const { Order } = require('../models/order.models');

dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const allOrders = await Order.findAll({
        where: { userId: sessionUser.id },
    });

    res.status(200).json({
        status: 'succes',
        data: { allOrders },
    });
});

const userOrders = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const orderId = await Order.findOne({ where: { id: id } });

    res.status(200).json({
        status: 'succes',
        data: { orderId },
    });
});

const createUSer = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    newUser.password = undefined;

    res.status(201).json({
        status: 'success',
        data: { newUser },
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { name, email } = req.body;
    const { user, sessionUser } = req;

    if (user.id === sessionUser.id) {
        await user.update({ name, email });
        res.status(204).json({ status: 'success' });
    } else {
        return next(new AppError('you are not the owner of this account', 400));
    }
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    const { user, sessionUser } = req;

    if (user.id === sessionUser.id) {
        await user.update({ status: 'inactive' });
        res.status(204).json({
            status: 'success',
        });
    } else {
        return next(new AppError('you are not the owner of this account', 400));
    }
});

const loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email, status: 'active' },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('wron credential', 400));
    }
    user.password = undefined;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(200).json({
        status: 'success',
        data: { user, token },
    });
});

module.exports = {
    getAllUsers,
    createUSer,
    updateUser,
    deleteUser,
    loginUser,
    userOrders,
};
