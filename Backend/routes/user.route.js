const express = require('express');
const route = express.Router();
const { createUser,getUserProfile,getUsers,deleteUser,updateUser } = require("../controllers/user.controller");
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');

route.get('/', authenticate, authorize('admin'), getUsers);

route.post('/create-admin', authenticate, authorize('admin'), createUser('admin'));
route.post('/register',createUser('user'));

route.patch('/profile', authenticate, updateUser);
route.get('/profile', authenticate, getUserProfile);
route.delete('/:id', authenticate, authorize('admin','user'), deleteUser);

module.exports = route;
