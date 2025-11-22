const Category = require("../models/category.model");
const catchAsync = require('../utilites/catch-async.utils');
const AppError = require('../utilites/error.utils');


exports.createCategory = catchAsync(
    async (req, res, next) => {
        const { name, slug } = req.body;
        const isExist = await Category.findOne({ slug,isDeleted:false });
        if (isExist)
            return next(new AppError("Slug already exists", 400));
        const category = await Category.create({ name, slug,isDeleted:false });
        return res.status(201).json({ message: 'category created', data: category });
    }
)

exports.getCategory = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ isDeleted: false })
      .populate({
        path:'subcategories',
          match: { isDeleted: false },
        select:'name _id'
    });

    
  if (!categories || categories.length === 0) {
    return next(new AppError('categories not found', 404));
  }
console.log(categories);

  res.status(200).json({
    message: 'Categories fetched successfully',
    data: categories
  });
});

exports.updateCategory = catchAsync(
    async (req, res, next) => {
        const { id } = req.params;
        const { name, slug } = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            { name, slug,isDeleted:false },
            { new: true, runValidators: true }
        );

        if (!category)
            return next(new AppError("Category not found", 404));

        return res.status(200).json({ message: 'Category updated successfully', data: category });
    }
);


exports.deleteCategory = catchAsync(
    async (req, res, next) => {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(
            id,
           {isDeleted:true},
          { new: true}
        );
        if (!category)
            return next(new AppError("Category not found", 404));
        return res.status(200).json({ message: 'Category deleted successfully', data: category });
    }
);



// exports.getAllCategoriesWithSubs = catchAsync(async (req, res, next) => {
//     const categories = await Category.find({ isDeleted: false }).lean().populate({
//         path: 'subcategories',
//         match: { isDeleted: false },
//         select: 'name slug',
//     });

// if (!categories || categories.length === 0)
//     return next(new AppError('No categories found', 404));

//   res.status(200).json({
//     message: 'All categories with subcategories',
//     data: categories,
//   });
// });