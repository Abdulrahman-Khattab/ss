const express = require('express');
const {
  getAllorders,
  getSingleUserOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require('../Controller/orderController');

const {
  authentication,
  authorizePermissions,
} = require('../middleware/authentication');

const Router = express.Router();

Router.route('/')
  .get(authentication, authorizePermissions('admin'), getAllorders)
  .post(authentication, createOrder);

Router.route('/showMyCurrentOrders').get(authentication, getCurrentUserOrders);

Router.route('/:id').get(authentication, getSingleUserOrder).patch(updateOrder);

module.exports = Router;
