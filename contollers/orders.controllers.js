const { Order } = require('../models/order.models');
const { Meals } = require('../models/meals.models');

const { catchAsync } = require('../utils/catch.Async.util');
const { AppError } = require('../utils/appError.util');
const { Restaurant } = require('../models/restaurant.models');

const createOrder = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { quantity, mealId } = req.body;
    const mealOrder = await Meals.findOne({ where: { id: mealId } });

    if (!mealOrder) {
        return next(new AppError('The meal no found'));
    }

    const newOrder = await Order.create({
        quantity,
        mealId,
        totalPrice: mealOrder.price * quantity,
        userId: sessionUser.id,
    });
    res.status(201).json({
        status: 'success',
        data: { newOrder },
    });
});

const getUserOrder = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const orderUser = await Order.findAll({
        where: { userId: sessionUser.id },
        include: [
            {
                model: Meals,
                attributes: ['name', 'price'],

                include: {
                    model: Restaurant,
                    attributes: ['name', 'address', 'rating'],
                },
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { orderUser },
    });
});

const completedOrder = catchAsync(async (req, res, next) => {
    const { order } = req;

    if (order.status != 'active') {
        return next(new AppError('the order has already been executed'));
    }

    await order.update({ status: 'completed' });

    res.status(204).json({ status: 'success' });
});

const deleteOrder = catchAsync(async (req, res, next) => {
    const { order } = req;

    if (order.status != 'active') {
        return next(new AppError('the order has already been executed'));
    }

    await order.update({ status: 'cancelled' });

    res.status(204).json({ status: 'success' });
});

module.exports = {
    createOrder,
    getUserOrder,
    completedOrder,
    deleteOrder,
};
