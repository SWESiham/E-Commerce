const { authenticate } = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');
const express = require('express');
const router = express.Router();
const { createCategory,getCategory,updateCategory,deleteCategory } = require('../controllers/category.controller');

router.put('/:id', authenticate, authorize('admin'), updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);
router.post('/', authenticate, authorize('admin'), createCategory);
router.get('/', getCategory);

module.exports = router;