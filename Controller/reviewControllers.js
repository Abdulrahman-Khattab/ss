const costumError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const ReviewModel = require('../model/review');
const productModel = require('../model/product');
const checkPermisson = require('../utils/checkPermission');

const getAllReview = async (req, res) => {
  const reviews = await ReviewModel.find({}).populate({
    path: 'product',
    select: 'name price company',
  });

  if (!reviews) {
    throw new costumError.NotFoundError(
      'Something wrong happend please try again later '
    );
  }

  res.status(StatusCodes.OK).json(reviews);
};

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  req.body.user = req.user.id;

  const isValidProduct = await productModel.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new costumError.NotFoundError('Please provide product');
  }

  const isThereSubmittedReview = await ReviewModel.findOne({
    product: productId,
    user: req.user.id,
  });

  if (isThereSubmittedReview) {
    throw new costumError.UNAUTHORIZED(
      'You have already submitted your review '
    );
  }

  const review = await ReviewModel.create(req.body);

  res.status(StatusCodes.CREATED).json(review);
};

const getSingleReview = async (req, res) => {
  const { id } = req.params;
  const review = await ReviewModel.findOne({ _id: id }).populate({
    path: 'product',
    select: 'name price company',
  });

  if (!review) {
    throw new costumError.NotFoundError(
      'Something wrong happend please try again later '
    );
  }

  res.status(StatusCodes.OK).json(review);
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const reviewCheck = await ReviewModel.findOne({ _id: id });
  if (!reviewCheck) {
    throw new costumError.NotFoundError(`There is no such user with id ${id} `);
  }

  const { user: userId } = reviewCheck;

  checkPermisson(req.user, userId);

  const review = await ReviewModel.findOne({ _id: id });

  const { rating, title, comment } = req.body;

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  if (!review) {
    throw new costumError.NotFoundError(
      'Something wrong happend please try again later '
    );
  }

  res.status(StatusCodes.OK).json(review);
};

const deleteReview = async (req, res) => {
  const { id } = req.params;

  const reviewCheck = await ReviewModel.findOne({ _id: id });
  if (!reviewCheck) {
    throw new costumError.NotFoundError(`There is no such user with id ${id} `);
  }

  const { user: userId } = reviewCheck;

  checkPermisson(req.user, userId);

  const review = await ReviewModel.findOneAndDelete({ _id: id });

  if (!review) {
    throw new costumError.NotFoundError(
      'Something wrong happend please try again later '
    );
  }

  res
    .status(StatusCodes.OK)
    .json({ deletedValue: review, msg: 'Message deleted successfuly' });
};

const getSingleProductReviews = async (req, res) => {
  const { id: prodcutId } = req.params;

  const productReviews = await ReviewModel.find({ product: prodcutId });

  res.status(StatusCodes.ACCEPTED).json(productReviews);
};

module.exports = {
  getAllReview,
  createReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
