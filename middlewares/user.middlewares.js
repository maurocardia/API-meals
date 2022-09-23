const { User } = require('../models/user.models');

const { catchAsync } = require('../utils/catch.Async.util');

const userExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });

    if (!user) {
        return res.status(404).json({
            status: 'error',
            msg: 'user no fund',
        });
    }
    req.user = user;
    next();
});

module.exports = { userExists };
