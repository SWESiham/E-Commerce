const { timeStamp } = require("console");
const mongoose = require("mongoose");
const OrderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 }
    }]
    ,
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    totalPrice: Number,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'declined', 'returned'],
        default: 'pending'
    },
    cancelledBy: {
        type: String,
        enum: ['admin', 'user']
    },createdAt: {
        type: Date,
        default: Date.now
    }
},{timeStamp:true})

module.exports = mongoose.model("Order", OrderSchema);