const {
  getAllUser,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../Controller/userController');

const {
  authentication,
  authorizePermissions,
} = require('../middleware/authentication');

const express = require('express');

const Router = express.Router();

Router.route('/').get(
  authentication,
  authorizePermissions('ower', 'admin'),
  getAllUser
);
Router.route('/showMe').get(authentication, showCurrentUser);
Router.route('/updateUserPassword').patch(authentication, updateUserPassword);
Router.route('/updateUser').patch(authentication, updateUser);

Router.route('/:id').get(authentication, getSingleUser);

module.exports = Router;
