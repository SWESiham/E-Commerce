const orderProductSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: { 
        type: Number,
        default:1,
        min: 1
      },
      priceAtPurchase: {  // el s3r nfso 2bl
        type: Number,
        required: true
      },
      total: {  // price * quantity
        type: Number,
        required: true
      }
},{ timestamps: true });

module.exports = mongoose.model('OrderProduct', orderProductSchema);
    