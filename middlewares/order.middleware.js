const { Order } = require('../models/order.models');

const { catchAsync } = require('../utils/catch.Async.util');
const { AppError } = require('../utils/appError.util.js');

const orderExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findOne({ where: { id } });

    if (!order) {
        return res.status(404).json({
            status: 'error',
            msg: 'order no found',
        });
    }
    req.order = order;
    next();
});

const protectOrderUser = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { id } = req.params;
    const order = await Order.findOne({ where: { id } });

    if (sessionUser.id !== order.userId) {
        return next(new AppError('You are not the owner of this order.', 403));
    }

    next();
});

module.exports = {
    orderExists,
    protectOrderUser,
};
