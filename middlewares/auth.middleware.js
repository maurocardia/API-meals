const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/user.models');

const { catchAsync } = require('../utils/catch.Async.util');
const { AppError } = require('../utils/appError.util');
const { Review } = require('../models/review.models');

dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(403).json({
            status: 'error',
            message: 'Invalid session',
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
        where: { id: decoded.id, status: 'active' },
    });

    if (!user) {
        return res.status(403).json({
            status: 'error',
            message: 'The owner of the session is no longer active',
        });
    }

    req.sessionUser = user;
    next();
});

const protectReviewUser = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { id } = req.params;
    const review = await Review.findOne({ where: { id } });

    if (sessionUser.id !== review.userId) {
        return next(new AppError('You are not the owner of this review.', 403));
    }

    next();
});

const protectAdmin = (req, res, next) => {
    const { sessionUser } = req;

    if (sessionUser.role !== 'admin') {
        return next(
            new AppError('You do not have the right access level.', 403)
        );
    }

    next();
};

module.exports = {
    protectSession,
    protectReviewUser,
    protectAdmin,
};
