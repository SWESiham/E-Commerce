const { authenticate } = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');
const express = require('express');
const router = express.Router();
const { createSubCategory, getSubCategory,updateSubCategory,deleteSubCategory} = require('../controllers/sub-category.controller');


router.put('/:id', authenticate, authorize('admin'), updateSubCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteSubCategory);
router.post('/', authenticate, authorize('admin'), createSubCategory);
router.get('/', getSubCategory);

module.exports = router;