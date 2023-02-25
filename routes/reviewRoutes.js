const {
  getAllReview,
  createReview,
  getSingleReview,
  updateReview,
  deleteReview,
} = require('../Controller/reviewControllers');

const { authentication } = require('../middleware/authentication');

const express = require('express');

const Router = express.Router();

Router.route('/').get(getAllReview).post(authentication, createReview);
Router.route('/:id')
  .get(getSingleReview)
  .patch(authentication, updateReview)
  .delete(authentication, deleteReview);

module.exports = Router;
