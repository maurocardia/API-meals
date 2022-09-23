const { Restaurant } = require('../models/restaurant.models');
const { Review } = require('../models/review.models');

const { catchAsync } = require('../utils/catch.Async.util');

const createRestaurant = catchAsync(async (req, res, next) => {
    const { name, address, rating } = req.body;

    const newRestaurant = await Restaurant.create({ name, address, rating });
    res.status(201).json({
        status: 'success',
        data: { newRestaurant },
    });
});

const getAllRestaurants = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.findAll({
        where: { status: 'active' },
        include: [
            {
                model: Review,
                attributes: ['userId', 'comment', 'rating'],
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { restaurant },
    });
});

const getRestaurantId = catchAsync(async (req, res, next) => {
    const { restaurant } = req;

    res.status(200).json({
        status: 'success',
        data: { restaurant },
    });
});

const restauranUpdate = catchAsync(async (req, res, next) => {
    const { restaurant } = req;
    const { name, address } = req.body;

    await restaurant.update({ name, address });
    res.status(201).json({
        status: 'success',
        data: { restaurant },
    });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
    const { restaurant } = req;
    const { status } = req.body;

    await restaurant.update({ status: 'inactive' });
    res.status(204).json({ status: 'success' });
});

const createReview = catchAsync(async (req, res, next) => {
    const { restaurantReview, sessionUser } = req;
    const { comment, rating } = req.body;

    const newReview = await Review.create({
        comment,
        rating,
        restaurantId: restaurantReview.id,
        userId: sessionUser.id,
    });
    res.status(200).json({
        status: 'success',
        data: { newReview },
    });
});

const reviewUpdate = catchAsync(async (req, res, next) => {
    const { review } = req;
    const { comment, rating } = req.body;

    await review.update({ comment, rating });
    res.status(200).json({
        status: 'succces',
        data: { review },
    });
});

const deleteReview = catchAsync(async (req, res, next) => {
    const { review } = req;

    await review.update({ status: 'deleted' });
    res.status(200).json({
        status: 'succces',
        data: { review },
    });
});

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantId,
    restauranUpdate,
    deleteRestaurant,
    createReview,
    reviewUpdate,
    deleteReview,
};
