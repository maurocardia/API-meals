const express = require('express');

const {
    createMeal,
    getAllMeals,
    getMealId,
    updateMeal,
    deleteMeal,
} = require('../contollers/meals.controllers');
const { mealsExists } = require('../middlewares/meals.middleware');
const { restaurantExists } = require('../middlewares/restaurant.middleware');
const {
    protectSession,
    protectAdmin,
} = require('../middlewares/auth.middleware');
const {
    createMealsValidators,
} = require('../middlewares/validator.middleware');

const mealsRouter = express.Router();

mealsRouter.get('/', getAllMeals);
mealsRouter.get('/:id', mealsExists, getMealId);

mealsRouter.use(protectSession);

mealsRouter.post('/:id', createMealsValidators, restaurantExists, createMeal);
mealsRouter.patch('/:id', protectAdmin, mealsExists, updateMeal);
mealsRouter.delete('/:id', protectAdmin, mealsExists, deleteMeal);

module.exports = { mealsRouter };
