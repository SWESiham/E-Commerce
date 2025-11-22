const express = require('express');
const route = express.Router();
const { getSalesSummary } = require('../controllers/reports.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

route.get('/sales-summary', authenticate, authorize('admin'), getSalesSummary);

module.exports = route;