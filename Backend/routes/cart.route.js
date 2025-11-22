const express = require('express');
const route = express.Router();
const { addToCart, updateQuantity,deleteProduct, removeProduct, getUserCart, clearCart } = require("../controllers/cart.controller");
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');

route.post('/:id',authenticate, addToCart);
route.get('/',authenticate,getUserCart);
route.patch('/:id',authenticate, updateQuantity);
route.delete('/:id',authenticate, deleteProduct);
route.delete('/clear/:id',authenticate, clearCart);
module.exports = route;
