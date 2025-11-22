const express = require('express');
const route = express.Router();
const { placeOrder, getUserOrders, getSingleOrder, cancelOrder,getAllOrders,updateOrderStatus } = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
route.post('/', authenticate, placeOrder);
route.get('/user', authenticate, getUserOrders);
route.get('/:orderId', authenticate, getSingleOrder);
route.patch('/:orderId/cancel', authenticate, cancelOrder);
route.get('/', authenticate, authorize('admin'), getAllOrders);
route.patch('/:orderId/status', authenticate, authorize('admin'), updateOrderStatus);

module.exports = route;