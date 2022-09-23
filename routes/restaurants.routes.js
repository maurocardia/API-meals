const express = require('express');

const {
    createRestaurant,
    getAllRestaurants,
    getRestaurantId,
    restauranUpdate,
    deleteRestaurant,
    createReview,
    reviewUpdate,
    deleteReview,
} = require('../contollers/restaurants.controllers');

const {
    restaurantExists,
    restaurantReviewExists,
} = require('../middlewares/restaurant.middleware');

const {
    protectSession,
    protectReviewUser,
    protectAdmin,
} = require('../middlewares/auth.middleware');
const { reviewsExists } = require('../middlewares/reviews.middleware');

const restaurantsRouter = express.Router();

restaurantsRouter.get('/', getAllRestaurants);
restaurantsRouter.get('/:id', restaurantExists, getRestaurantId);

restaurantsRouter.use(protectSession);
restaurantsRouter.post('/', createRestaurant);
restaurantsRouter.patch(
    '/:id',
    protectAdmin,
    restaurantExists,
    restauranUpdate
);
restaurantsRouter.delete(
    '/:id',
    protectAdmin,
    restaurantExists,
    deleteRestaurant
);
restaurantsRouter.post(
    '/reviews/:restaurantId',
    restaurantReviewExists,
    createReview
);
restaurantsRouter.patch(
    '/reviews/:id',
    reviewsExists,
    protectReviewUser,
    reviewUpdate
);
restaurantsRouter.delete(
    '/reviews/:id',
    reviewsExists,
    protectReviewUser,
    deleteReview
);
module.exports = { restaurantsRouter };
