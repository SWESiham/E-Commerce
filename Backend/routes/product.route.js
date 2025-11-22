const { createProduct,getRelatedProduct,getProductsByCategory, getPaginateProducts, getProducts, getProductBySlug, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const {authorize} = require('../middlewares/role.middleware');
const express = require('express');
const router = express.Router();


router.get('/', getProducts);
router.get('/filter', getProductsByCategory);
// router.get('/',paginate(Product),getPaginateProducts)
router.get('/:slug',getProductBySlug);
router.post('/',authenticate,authorize('admin'),upload.single('image'),createProduct);
router.get('/related/:id',getRelatedProduct);
router.put('/:id',authenticate,authorize('admin'),upload.single('image'),updateProduct);
router.delete('/:id',authenticate,authorize('admin'),upload.single('image'),deleteProduct);
module.exports = router;
