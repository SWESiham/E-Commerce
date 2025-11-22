const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const {
  createTestimonial,
  getTestimonials,
  approveTestimonial,
  rejectTestimonial
  ,getAllTestimonials
} = require('../controllers/testimonial.controller');

router.post('/', authenticate, createTestimonial);

router.get('/', getTestimonials);

router.patch('/:id/approve', authenticate, authorize('admin'), approveTestimonial);

router.patch('/:id/reject', authenticate, authorize('admin'), rejectTestimonial);
router.get('/all', authenticate, authorize('admin'), getAllTestimonials);

module.exports = router;
