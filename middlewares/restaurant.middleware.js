const { Restaurant } = require('../models/restaurant.models');
const { Review } = require('../models/review.models');

const { catchAsync } = require('../utils/catch.Async.util');

const restaurantExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({
        where: { id },
        include: [
            {
                model: Review,
                attributes: ['userId', 'comment', 'rating'],
            },
        ],
    });
    if (!restaurant) {
        res.status(404).json({
            status: 'error',
            message: 'restaurant no found',
        });
    }

    req.restaurant = restaurant;

    next();
});

const restaurantReviewExists = catchAsync(async (req, res, next) => {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findOne({
        where: { id: restaurantId },
    });
    if (!restaurant) {
        res.status(404).json({
            status: 'error',
            message: 'restaurant no found',
        });
    }

    req.restaurantReview = restaurant;

    next();
});

module.exports = { restaurantExists, restaurantReviewExists };
