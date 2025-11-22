const mongoose = require('mongoose');
const bycrpt= require('bcrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        trim: true,
        match: /^[a-zA-Z0-9]+$/,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
            },
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    phoneNumber: {
        type: String,
        require: true,
        validate: {
            validator: value => /^\+?\d{10,15}$/.test(value),
            message: 'Invalid phone number format',
        },
    }, addresses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Address'
        }
      ],
    isDeleted: {
        type: Boolean,
        required: false,
    }, 
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, { timestamps: true });

userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bycrpt.hash(this.password,12);
    next();
});

userSchema.methods.correctPassword = async function (inputPassword){
 return await  bycrpt.compare(inputPassword,this.password);
}


module.exports = mongoose.model('User', userSchema);
// saturday tasks 
/**
 *
 * user route
 * user and auth and role controllers
 *  
 * 
 * 
 * additions : address w 
 *  */ 