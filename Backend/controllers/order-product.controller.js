const mongoose = require("mongoose");
const OrderProduct = require("../models/orderProduct.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const catchAsync = require("../utilites/catch-async.utils");
const AppError = require("../utilites/error.utils");



exports.createOrderProduct = catchAsync(async (req, res, next) => {
    const { orderId, productId, quantity, priceAtPurchase } = req.body;

    const product = await Product.findById(productId);
    if (!product) return next(new AppError("Product not found", 404));

    const order = await Order.findById(orderId);
    if (!order) return next(new AppError("Order not found", 404));

    if (product.stock < quantity)
        return next(new AppError("Not enough stock available", 400));

    const total = priceAtPurchase * quantity;

    const orderProduct = await OrderProduct.create({
        orderId,
        productId,
        quantity,
        priceAtPurchase,
        total
    });

    product.stock -= quantity;
    await product.save();

    res.status(201).json({
        message: "OrderProduct created successfully",
        data: orderProduct
    });
});

exports.getAllOrderProducts = catchAsync(async (req, res, next) => {
    const orderProducts = await OrderProduct.find()
        .populate("orderId", "userId totalPrice status")
        .populate("productId", "title image price");

    res.status(200).json({
        message: "All OrderProducts retrieved successfully",
        count: orderProducts.length,
        data: orderProducts
    });
});


exports.getOrderProductsByOrder = catchAsync(async (req, res, next) => {
    const { orderId } = req.params;
    const orderProducts = await OrderProduct.find({ orderId })
        .populate("productId", "title image price");

    if (!orderProducts.length)
        return next(new AppError("No products found for this order", 404));

    res.status(200).json({
        message: "Order products retrieved successfully",
        count: orderProducts.length,
        data: orderProducts
    });
});

exports.updateOrderProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { quantity } = req.body;

    const orderProduct = await OrderProduct.findById(id);
    if (!orderProduct)
        return next(new AppError("OrderProduct not found", 404));

    const product = await Product.findById(orderProduct.productId);
    if (!product)
        return next(new AppError("Product not found", 404));

    if (quantity > product.stock + orderProduct.quantity)
        return next(new AppError("Not enough stock available", 400));

    product.stock += orderProduct.quantity;
    await product.save();

    orderProduct.quantity = quantity;
    orderProduct.total = quantity * orderProduct.priceAtPurchase;
    await orderProduct.save();

    product.stock -= quantity;
    await product.save();

    res.status(200).json({
        message: "OrderProduct updated successfully",
        data: orderProduct
    });
});

exports.deleteOrderProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const orderProduct = await OrderProduct.findById(id);
    if (!orderProduct)
        return next(new AppError("OrderProduct not found", 404));

    const product = await Product.findById(orderProduct.productId);
    if (product) {
        product.stock += orderProduct.quantity;
        await product.save();
    }

    await orderProduct.deleteOne();

    res.status(200).json({
        message: "OrderProduct deleted successfully"
    });
});