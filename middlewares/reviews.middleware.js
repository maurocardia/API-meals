const { Review } = require('../models/review.models');

const { catchAsync } = require('../utils/catch.Async.util');

const reviewsExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const review = await Review.findOne({ where: { id } });

    if (!review) {
        return res.status(404).json({
            status: 'error',
            msg: 'review no fund',
        });
    }
    req.review = review;
    next();
});

module.exports = { reviewsExists };
