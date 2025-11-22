const Product = require('../models/product.model');
const memoryCache = require('../utilites/memory-cache.utils');
const catchAsync = require('../utilites/catch-async.utils');
const AppError = require('../utilites/error.utils');
const {Category} = require('../models/category.model')
const {SubCategory} = require('../models/sub-category.model')
exports.createProduct = async (req, res) => {
  try {
    const { title, price, description, slug, stock, categoryId, subCategoryId } = req.body;
    const image = req.file.filename ; 

    const isExist = await Product.findOne({ slug });
    if (isExist) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    const product = await Product.create({
      title,
      price,
      description,
      slug,
      stock,
      categoryId,
      subCategoryId,
      image,
      isDeleted: false,
    });

    // memoryCache.del('products');

    return res.status(201).json({ message: 'Product created', data: product });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

exports.getPaginateProducts = (req, res) => {
  res.status(200).json({ message: 'Product list', data: res.paginateResult });
};

exports.getProducts = async (req, res) => {
  // const cacheKey = 'products';
  // const cached = memoryCache.get(cacheKey);

  // if (cached) {
  //   return res.status(200).json({ message: 'Products list from cache', data: cached });
  // }

  const products = await Product.find({ isDeleted: false }).populate('categoryId','name').populate('subCategoryId', 'name');


  // memoryCache.set(cacheKey, products);

  res.status(200).json({ message: 'Products list from DB', data: products });
};

exports.getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  const product = await Product.findOne({ slug, isDeleted: false })
    .populate('categoryId', 'name')
    .populate('subCategoryId', 'name');

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json({ message: `Get product by slug "${slug}"`, data: product });
};

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { title, price, description, slug, stock, categoryId, subCategoryId } = req.body;
  const image = req.file.filename;
  const { id } = req.params;

  const existingProduct = await Product.findOne({ _id: id, isDeleted: false });
  if (!existingProduct) return next(new AppError('Product not found', 404));

  const product = await Product.findByIdAndUpdate(
    id,
    { title, price, description, slug, stock, categoryId, subCategoryId, image },
    { new: true }
  );

  res.status(200).json({
    message: 'Product updated successfully',
    data: product,
  });
});


exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!product) return next(new AppError('Product not found', 404));

  memoryCache.del('products');

  res.status(200).json({
    message: 'Product deleted successfully',
    data: product,
  });
});


exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const { categoryId, subCategoryId } = req.query; 

  let filter = { isDeleted: false };

  if (categoryId) 
    filter.categoryId = categoryId;

  if (subCategoryId) 
    filter.subCategoryId = subCategoryId;
  
  const products = await Product.find(filter)
    .populate('categoryId', 'name')
    .populate('subCategoryId', 'name');

  if (!products || products.length === 0)
    return next(new AppError('No products found', 404));

  console.log('Filter used:', filter);

  return res.status(200).json({
    message: 'Filtered products',
    data: products
  });
});

exports.getRelatedProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const currentProduct = await Product.findById(id).select('categoryId');
  if (!currentProduct) {
    return next(new AppError("Product not found", 404));
  }

  const products = await Product.find({
    _id: { $ne: id },           
    isDeleted: false,         
    categoryId: currentProduct.categoryId,
     stock: { $gte: 5 }  
  })
    .populate('subCategoryId', '_id name')
    .limit(4);

  res.status(200).json({ message: "Related Products", data: products });
});



