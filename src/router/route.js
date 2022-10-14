const multer = require('../utils/multer');
const express = require('express');
const route = express();
const { updateCategory, listCategory, registerCategory, deleteCategory } = require('../controller/ category');
const { registerProduct, updateProduct, listProduct, deleteProduct } = require('../controller/product');
const { login, registerUser, listUsers, updateUser, deleteUser, welcome } = require('../controller/user');
const authenticateLogin = require('../filter/authenticateLogin');
const { listAvatar, deleteAvatar, sendAvatar } = require('../controller/uploadFiles');


route.get('/', welcome);
route.post('/user', registerUser);
route.post('/login', login);
route.use(authenticateLogin);
route.get('/user', listUsers);
route.put('/user', updateUser);
route.post('/user/avatar', multer.single('image'), sendAvatar);
route.get('/user/avatar', listAvatar);
route.delete('/user/avatar', deleteAvatar);

route.delete('/user/:id', deleteUser);
route.post('/category', registerCategory);
route.put('/category', updateCategory);
route.get('/category', listCategory);
route.delete('/category/:id', deleteCategory);
route.post('/product', multer.single('imagem'), registerProduct);

route.get('/product', listProduct);
route.put('/product', updateProduct);
route.delete('/product/:id', deleteProduct);

module.exports = route; 