const catchAsync = require('../utilites/catch-async.utils');
const AppError = require('../utilites/error.utils');

exports.authorize = (...allowedRoles) => {
    return catchAsync(
        (req, res, next) => {
            const userRole = req.user.role;
            console.log(userRole);
            
            if (allowedRoles.includes(userRole)) {
                return next();
            }
                //403 forbidden
            next(new AppError("Acess Denied",403));
        }
    )
}
    