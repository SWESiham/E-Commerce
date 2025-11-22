const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required: true,
       
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'SubCategory',
        required: true,
      
    }, isDeleted:{
        type: Boolean,
        default: false
    },
},{timestamps:true});


module.exports = mongoose.model('Product', productSchema);