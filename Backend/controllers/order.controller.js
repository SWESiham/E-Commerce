const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const catchAsync = require("../utilites/catch-async.utils");
const AppError = require("../utilites/error.utils");


exports.placeOrder = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userId = req.user._id;
        const { shippingAddress } = req.body;

        const cart = await Cart.findOne({ userId })
            .populate("items.productId", "price image title stock")
            .session(session);

        if (!cart || cart.items.length === 0)
            return next(new AppError("Your cart is empty", 400));

        for (let item of cart.items) {
            if (item.quantity > item.productId.stock)
                return next(new AppError(`Not enough stock for ${item.productId.title}`, 400));
        }

        let totalPrice = 0;
        cart.items.forEach(i => {
            totalPrice += i.quantity * i.productId.price;
        });

        const order = await Order.create(
            [{
                userId,
                shippingAddress,
                products: cart.items.map(i => ({
                    productId: i.productId._id,
                    quantity: i.quantity
                })),
                totalPrice,
                status: "pending",
                paymentStatus: "pending"
            }],
            { session }
        );

        for (let item of cart.items) {
            const product = await Product.findById(item.productId._id).session(session);
            product.stock -= item.quantity;
            await product.save({ session });
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Order placed successfully",
            data: order[0]
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("Failed to place order", 500));
    }
});


exports.getUserOrders = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const orders = await Order.find({ userId })
        .populate("products.productId", "title price image")
        .populate("shippingAddress", "country city street buildingNumber");

    if (!orders.length)
        return next(new AppError("No orders found for this user", 404));

    res.status(200).json({
        message: "User orders retrieved successfully",
        count: orders.length,
        data: orders
    });
});

exports.getSingleOrder = catchAsync(async (req, res, next) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
        .populate("products.productId", "title price image")
        .populate("shippingAddress");

    if (!order)
        return next(new AppError("Order not found", 404));

    res.status(200).json({
        message: "Order details",
        data: order
    });
});


exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    if (req.user.role !== "admin")
        return next(new AppError("Only admin can update order status", 403));

    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "confirmed", "shipped", "delivered", "declined", "returned"];
    if (!allowedStatuses.includes(status))
        return next(new AppError("Invalid status", 400));

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order)
        return next(new AppError("Order not found", 404));

    res.status(200).json({
        message: "Order status updated successfully",
        data: order
    });
});


exports.cancelOrder = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user._id;
        const { orderId } = req.params;

        const order = await Order.findOne({ _id: orderId, userId }).session(session);
        if (!order)
            return next(new AppError("Order not found", 404));

        if (order.status !== "pending")
            return next(new AppError("Cannot cancel this order at current status", 400));

        // Return stock
        for (let item of order.products) {
            const product = await Product.findById(item.productId).session(session);
            product.stock += item.quantity;
            await product.save({ session });
        }

        order.status = "declined";
        order.cancelledBy = "user";
        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "Order cancelled successfully",
            data: order
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("Failed to cancel order", 500));
    }
});


exports.getAllOrders = catchAsync(async (req, res, next) => {
    if (req.user.role !== "admin")
        return next(new AppError("Only admin can access all orders", 403));

    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("userId", "name email")
        .populate("products.productId", "title price");

    const totalOrders = await Order.countDocuments(filter);

    res.status(200).json({
        message: "All orders retrieved successfully",
        page: Number(page),
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        data: orders
    });
});
