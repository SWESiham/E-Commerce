const mongoose = require('mongoose');
const purchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    price: Number,
    purchaseAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports= mongoose.model('Purchase',purchaseSchema);