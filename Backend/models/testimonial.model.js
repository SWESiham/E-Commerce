const mongoose = require("mongoose");
const TestimonialSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    message: {
        type:String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    rejectionReason: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model("Testimonial", TestimonialSchema);
