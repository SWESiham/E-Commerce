const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    street: {
        type: String,
        required: [true, 'Street is required'],
        trim: true
    },
    buildingNumber: {
        type: String,
        required: [true, 'Building number is required'],
        trim: true
    },
    addressType: {
        type: String,
        enum: ['home', 'work', 'other'],
        default: 'home',
        required: [true, 'Address type is required']
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Address', addressSchema);