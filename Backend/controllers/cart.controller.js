const Cart = require("../models/cart.model");
const Product = require("../models/product.model")
const catchAsync = require('../utilites/catch-async.utils');
const AppError = require('../utilites/error.utils');

// ANA T3BBBBTTTT ..

const calcCartAggregate = async (userId) => {
    const updatedCart = await Cart.aggregate([
        { $match: { userId: userId } },
        { $unwind: "$items" },
        {
            $lookup: {
                from: "products",
                localField: "items.productId",
                foreignField: "_id",
                as: "product"
            }
        },
        { $unwind: "$product" },
        {
            $group: {
                _id: "$_id",
                items: {
                    $push: {
                        productId: "$product",
                        quantity: "$items.quantity"
                    }
                },
                totalPrice: {
                    $sum: { $multiply: ["$items.quantity", "$product.price"] }
                },
                userId: { $first: "$userId" }
            }
        },
        {
            $project: {
                _id: 1,
                userId: 1,
                items: 1,
                totalPrice: 1
            }
        }
    ]);

    return updatedCart[0];
};


exports.addToCart = catchAsync(
    async (req, res, next) => {
        const userId = req.user._id;
        const { id: productId } = req.params;
        const { quantity } = req.body;
        console.log(productId);
        const product = await Product.findById(productId);
        console.log("PRPRPRPRPRPRP" + product);
        if (!product)
            return next(new AppError("Product Not Found", 404));
        // el m5zon mafeho4 el kmaya de 
        if (product.stock < quantity)
            return next(new AppError('Not enough stock available', 400));

        const cart = await Cart.findOne({ userId });
        // ml2a4 cart
        if (!cart) {
            const NewCart = await Cart.create({
                userId, items: [{ productId, quantity }], totalPrice: quantity * product.price
            });
            const updatedCart = await calcCartAggregate(userId);
            return res.status(200).json({
                message: "Cart created successfully",
                data: updatedCart,
            });
            // l2a cart
        } else {
            // 3ndy cart feha prods 
            // 1. 3wzay azawed new prod
            // aw 
            // 2. 3ndy nfs el prod hazwed el quantity bs 
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (itemIndex > -1)
                cart.items[itemIndex].quantity += quantity;
            else {
                cart.items.push({ productId, quantity });
            }
            await cart.save();


        }
        // cause lose of performance
        // let totalPri = 0;
        // for (const i of cart.items) {
        //     const prod = await Product.findById(i.productId);
        //     totalPri += i.quantity * prod.price;
        // }
        // cart.totalPrice = totalPri;

        const updatedCart = await calcCartAggregate(userId);
        if (!updatedCart)
            return next(new AppError("Failed to calculate cart total.", 500));

        res.status(200).json({
            message: "Product added to cart successfully",
            data: updatedCart,
        });
    }
);


exports.updateQuantity = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const { id: productId } = req.params; // productId
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId }).populate('items.productId', 'title price image stock');
    if (!cart) return next(new AppError('Cart Not Found', 404));

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
        (item) => item.productId._id?.toString() === productId || item.productId?.toString() === productId
    );

    if (itemIndex === -1) return next(new AppError('Product not found in cart', 404));

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Recalculate total price
    const updatedCart = await calcCartAggregate(userId);

    res.status(200).json({
        message: 'Quantity updated successfully',
        data: updatedCart,
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { id: productId } = req.params;
  const cart = await Cart.findOne({ userId }).populate("items.productId", "title price image stock");
  if (!cart) return next(new AppError("Cart Not Found", 404));

  cart.items = cart.items.filter(item =>
    item.productId._id?.toString() !== productId && item.productId?.toString() !== productId
  );

  cart.totalPrice = cart.items.reduce((sum, item) => {
    const price = item.productId.price || 0;
    return sum + price * item.quantity;
  }, 0);

  await cart.save();

  await cart.populate("items.productId", "title price image stock");

  res.status(200).json({
    message: "Product removed successfully",
    data: cart,
  });
});

// get user cart
exports.getUserCart = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId })
        .populate("items.productId", "title price image stock");

    if (!cart) return next(new AppError("Cart Not Found", 404));

    res.status(200).json({
        status: "User Cart",
        data: cart,
    });
});


// clear cart 
exports.clearCart = catchAsync(
    async (req, res, next) => {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate("items.productId", "title price image stock");
        if (!cart)
            return next(new AppError("Cart Not Found", 404));

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({
            status: 'Cart is Cleared',
            data: cart,
        });
    });

