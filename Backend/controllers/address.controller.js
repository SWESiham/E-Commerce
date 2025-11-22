const Address = require('../models/address.model');
const catchAsync = require('../utilites/catchAsync.utils');
const AppError = require('../utilites/appError.utils');


exports.createAddress = catchAsync(
    async (req, res, next) => {
        const userId = req.user._id;
        const {  city, street, buildingNumber, addressType, isDefault } = req.body;
        const existingAddr = await Address.find({ userId, isDeleted: false });
        const finalIsDefault = isDefault || existingAddr.length === 0;
        if (finalIsDefault)
            await Address.updateMany({ userId }, { isDefault: false });
        const address = await Address.create({  city, street, buildingNumber, addressType, isDefault:finalIsDefault, userId, isDeleted: false });
        if (!address)
            return next(new AppError('Address not found', 404));
        res.status(201).json({ message: "Address added successfully!" });

    });

exports.getAddresses = catchAsync(
    async (req, res, next) => {
        const userId = req.user._id;
        const addresses = await Address.find({ userId, isDeleted: false });
        if (addresses.length === 0)
            return next(new AppError('Address not found', 404));
        res.status(200).json({ message: "All Address:", data: addresses });
    });

exports.updateAddress = catchAsync(
    async (req, res, next) => {
        const userId = req.user._id;
        const {  city, street, buildingNumber, addressType} = req.body;
        const address = await Address.findOneAndUpdate({_id:req.params.id, userId, isDeleted: false },{ city, street, buildingNumber, addressType},{new:true});
        if (!address)
            return next(new AppError("Address Not found", 404));
        
        res.status(200).json({ message: "Address updated successfully", data: address });
    });


exports.deleteAddress = catchAsync(
    async (req, res, next) => {
        const { id } = req.params;
        const userId = req.user._id;
        const address = await Address.findOneAndUpdate({ _id: id, userId }, { isDeleted: true }, { new: true });
        if (!address)
            return next(new AppError('Address not found', 404));
        res.status(200).json({ message: "Address deleted", data: address });
    });

exports.setDefault = catchAsync(
    async (req, res, next) => {
        const userId = req.user._id;
        const { id } = req.params;
        await Address.updateMany({ userId }, { isDefault: false });
        const address = await Address.findOneAndUpdate(
            { _id: id, userId, isDeleted: false },
            { isDefault: true },
            { new: true }
        );
        if (!address)
            return next(new AppError('Address not found', 404));
        res.status(200).json({ message: "this address is default ", data: address });
    });