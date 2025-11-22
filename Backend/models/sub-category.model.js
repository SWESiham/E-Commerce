const mongoose = require("mongoose");
const subCategorySchema = new mongoose.Schema({
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
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('SubCategory', subCategorySchema);