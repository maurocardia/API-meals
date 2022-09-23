const { Meals } = require('../models/meals.models');
const { Restaurant } = require('../models/restaurant.models');

const { catchAsync } = require('../utils/catch.Async.util');

const createMeal = catchAsync(async (req, res, next) => {
    const { restaurant } = req;
    const { name, price } = req.body;

    const newMeal = await Meals.create({
        name,
        price,
        restaurantId: restaurant.id,
    });
    res.status(201).json({
        status: 'success',
        data: { newMeal },
    });
});

const getAllMeals = catchAsync(async (req, res, next) => {
    const meals = await Meals.findAll({
        where: { status: 'active' },
        include: [
            {
                model: Restaurant,
                attributes: ['name', 'address', 'rating'],
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { meals },
    });
});

const getMealId = catchAsync(async (req, res, next) => {
    const { meal } = req;

    res.status(200).json({
        status: 'success',
        data: { meal },
    });
});

const updateMeal = catchAsync(async (req, res, next) => {
    const { meal } = req;
    const { name, price } = req.body;

    await meal.update({ name, price });
    res.status(200).json({
        status: 'success',
        data: { meal },
    });
});

const deleteMeal = catchAsync(async (req, res, next) => {
    const { meal } = req;
    const { status } = req.body;

    await meal.update({ status: 'inactive' });
    res.status(204).json({
        status: 'success',
    });
});

module.exports = {
    createMeal,
    getAllMeals,
    getMealId,
    updateMeal,
    deleteMeal,
};
