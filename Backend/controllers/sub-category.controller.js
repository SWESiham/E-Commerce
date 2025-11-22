const SubCategory = require("../models/sub-category.model");
const catchAsync = require('../utilites/catch-async.utils');
const AppError = require('../utilites/error.utils');


exports.createSubCategory = catchAsync(
    async (req, res, next) => {
        const { name, slug,categoryId } = req.body;
        const isExist = await SubCategory.findOne({ slug, isDeleted: false });
        
        if (isExist)
            return next(new AppError("Slug already exists", 400));
        const subCategory = await SubCategory.create({ name, slug,isDeleted:false,categoryId });
        return res.status(201).json({ message: 'SubCategory created', data: subCategory });
    }
)

exports.getSubCategory = catchAsync(
    async (req, res, next) => {
        const subCategory = await SubCategory.find({isDeleted:false}).populate('categoryId', 'name slug');
        if (!subCategory || subCategory.length === 0)
            return next(new AppError("No subCategory found", 404));
    
        return res.status(200).json({ message: 'All SubCategories', data: subCategory });
    }
)

exports.updateSubCategory = catchAsync(
    async (req, res, next) => {
        const { id } = req.params;
        const { name, slug,categoryId } = req.body;

        const subCategory = await SubCategory.findByIdAndUpdate(
            id,
            { name, slug,isDeleted:false,categoryId },
            { new: true}
        );
        if (!subCategory)
            return next(new AppError("subCategory not found", 404));

        return res.status(200).json({ message: 'subCategory updated successfully', data: subCategory });
    }
);


exports.deleteSubCategory = catchAsync(
    async (req, res, next) => {
        const { id } = req.params;
        const subCategory = await SubCategory.findByIdAndUpdate(
            id,
           {isDeleted:true},
          { new: true}
        );
        if (!subCategory)
            return next(new AppError("subCategory not found", 404));
        return res.status(200).json({ message: 'subCategory deleted successfully', data: subCategory });
    }
);




