const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      slug: {
        type: String,
        required: true,
        unique: true
  },
  isDeleted: {
        type: Boolean,
        default:false,
        required:true
      }

}, { timestamps: true })
categorySchema.virtual('subcategories', {
  ref: 'SubCategory',
  foreignField: 'categoryId',
  localField: '_id'
});
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });
module.exports = mongoose.model('Category', categorySchema);