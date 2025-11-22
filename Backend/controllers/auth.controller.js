const User = require('../models/user.model');
const { signToken }= require("../utilites/auth.utils")
const catchAsync = require('../utilites/catch-async.utils');
const AppError = require('../utilites/error.utils');

exports.loginUser = catchAsync(
    async (req, res,next) => {
    // try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return next(new AppError("Invalid email or password", 400));
            // return res.status(400).json({ message: "Invalid email or password" });
        isMatch = await user.correctPassword(password);
        if (!isMatch)
            return next(new AppError("Invalid email or password", 400));
            // return res.status(400).json({ message: "Invalid email or password"});
        const token = signToken(user);
        return res.status(200).json({message:'user login successfully',data:token}); 
})
    //  catch (err) {
        // res.status(500).json({Error:'User login faild'})
    // }
// }

// exports.logout = catchAsync(
//     async (req, res, next) => {
//         const token = req.headers.authization;
//         const { id } = req.params;
//         const user = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
//         if (!user)
//             return next(new AppError("User not found", 404));
//         res.status(200).json({
//             message: "User deleted (soft delete)",
//             data: user
//         });
//     }
// )