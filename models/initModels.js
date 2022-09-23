const { Meals } = require('./meals.models');
const { Order } = require('./order.models');
const { Restaurant } = require('./restaurant.models');
const { Review } = require('./review.models');
const { User } = require('./user.models');

const initModels = () => {
    User.hasMany(Order, { foreignKey: 'userId' });
    Order.belongsTo(User);

    Meals.hasOne(Order, { foreignKey: 'mealId' });
    Order.belongsTo(Meals);

    Restaurant.hasMany(Meals, { foreignKey: 'restaurantId' });
    Meals.belongsTo(Restaurant);

    Restaurant.hasMany(Review, { foreignKey: 'restaurantId' });
    Review.belongsTo(Restaurant);
};

module.exports = { initModels };
