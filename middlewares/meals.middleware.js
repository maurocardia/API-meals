const { Meals } = require('../models/meals.models');
const { Restaurant } = require('../models/restaurant.models');

const { catchAsync } = require('../utils/catch.Async.util');

const mealsExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const meal = await Meals.findOne({
        where: { id },

        include: [
            {
                model: Restaurant,
                attributes: ['name', 'address', 'rating'],
            },
        ],
    });

    if (!meal) {
        res.status(404).json({
            status: 'error',
            message: 'meal is no found',
        });
    }

    req.meal = meal;
    next();
});

module.exports = {
    mealsExists,
};
