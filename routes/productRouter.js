const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  uploadImage,
  updateProducts,
  deleteProduct,
} = require('../Controller/productController');

const { getSingleProductReviews } = require('../Controller/reviewControllers');

const {
  authentication,
  authorizePermissions,
} = require('../middleware/authentication');

const express = require('express');

const router = express.Router();

router
  .route('/')
  .post(authentication, authorizePermissions('admin'), createProduct)
  .get(getAllProducts);

router
  .route('/:id')
  .get(getSingleProduct)
  .delete(authentication, authorizePermissions('admin'), deleteProduct)
  .patch(authentication, authorizePermissions('admin'), updateProducts);

router
  .route('/uploadImage')
  .post(authentication, authorizePermissions('admin'), uploadImage);

router.route('/:id/reviews').get(authentication, getSingleProductReviews);

module.exports = router;
