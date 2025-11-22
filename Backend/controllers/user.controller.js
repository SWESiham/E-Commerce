const User = require('../models/user.model');
const Address = require('../models/address.model');
const { signToken } = require("../utilites/auth.utils")
const catchAsync = require('../utilites/catch-async.utils');
const AppError = require('../utilites/error.utils');

exports.createUser = (role) => {
    return catchAsync(
        async (req, res, next) => {
            const { name, email, phoneNumber, password,city,street,buildingNumber,addressType } = req.body;
            if (!['admin', 'user'].includes(role)) {
                // return res.status(400).json({ Error: 'Invalid role' });
                return next(new AppError(`Invalid role ${role}`, 400));
            }
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                // return res.status(400).json({ Error: 'Email is Exists' });
                return next(new AppError(`Email is Exists`, 400));
            }

            const user = await User.create({ name, email, password, phoneNumber, role, isDeleted: false });
            //

            const address = await Address.create({ city, street, buildingNumber, addressType, isDefault: true, isDeleted: false });
            
            user.addresses.push(address._id);
            await user.save();

            const token = signToken(user);
            console.log(token);
            
            return res.status(201).json({
                message: `${role} created successfully with default address`, data: token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    address:address,
                    role: user.role,
                }
            });
        })
}
exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('addresses', 'city street buildingNumber addressType');

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    message: "User profile retrieved successfully",
    data: user,
  });
});


exports.getUsers =async (req, res) => {
        const users = await User.find({isDeleted:false}).select("-password").populate('addresses','city street buildingNumber addressType');
        return res.status(200).json({ message: "Users: ", data: users });
    }

// controllers/user.controller.js
exports.updateUser = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { name, email, addresses, phoneNumber } = req.body;

  const user = await User.findById(userId);
  if (!user) return next(new AppError("User not found", 404));

  // Update basic profile fields
  if (name) user.name = name;
  if (email && email !== user.email) {
    const isExistEmail = await User.findOne({ email });
    if (isExistEmail) {
      return next(new AppError("Email Already Exists", 400));
    }
    user.email = email;
  }
  if (phoneNumber) user.phoneNumber = phoneNumber;

  // Handle addresses update
  if (addresses && Array.isArray(addresses)) {
    // First, soft delete all existing addresses
    await Address.updateMany(
      { _id: { $in: user.addresses } },
      { isDeleted: true }
    );

    // Create new addresses
    const newAddresses = [];
    for (const addrData of addresses) {
      const address = await Address.create({
        city: addrData.city,
        street: addrData.street,
        buildingNumber: addrData.buildingNumber,
        addressType: addrData.addressType,
        isDefault: addrData.isDefault || false,
        isDeleted: false
      });
      newAddresses.push(address._id);
    }

    // Update user's addresses array
    user.addresses = newAddresses;
  }

  await user.save();
  
  // Populate and return updated user
  const updatedUser = await User.findById(userId)
    .select('-password')
    .populate('addresses', 'city street buildingNumber addressType isDefault');

  res.status(200).json({
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

exports.deleteUser = catchAsync(
    async (req,res,next) => {
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if(!user)
            return next(new AppError("User not found", 404));
        res.status(200).json({
            message: "User deleted (soft delete)",
            data: user
          });
    }
)
