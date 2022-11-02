const express = require('express');
const route = express();
const authenticateLogin = require('../filter/authenticateLogin');
const { welcome, registerUser, login, listUsers, updateUser, deleteUser } = require('../controller/user');

route.get('/', welcome);
route.post('/user', registerUser);
route.post('/login', login);
route.get('/user', listUsers);

route.use(authenticateLogin);
route.put('/user', updateUser);
route.delete('/user/:id', deleteUser);

module.exports = route; 