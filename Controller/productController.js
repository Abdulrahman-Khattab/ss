const costumError = require('../errors');
const Product = require('../model/product');
const { StatusCodes } = require('http-status-codes');
const path = require('path');

const createProduct = async (req, res) => {
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json(product);
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({}).populate('reviews');

  res.status(StatusCodes.OK).json({ products });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const products = await Product.findOne({ _id: productId });

  if (!products) {
    throw new costumError.BadRequestError('Not found ');
  }

  res.status(StatusCodes.OK).json({ products });
};

const updateProducts = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) {
    costumError.BadRequestError('Not found ');
  }

  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    new costumError.BadRequestError('Not found ');
  }

  await product.remove();

  res
    .status(StatusCodes.OK)
    .json({ value: product, msg: 'Product deleted sucessfully' });
};
const uploadImage = async (req, res) => {
  console.log(req.files);
  if (!req.files) {
    throw new costumError.BadRequestError('Please provide file');
  }

  if (!req.files.image.mimetype.startsWith('image')) {
    throw new costumError.BadRequestError('Please provide Image file');
  }

  if (!req.files.image.size > 1024 * 1024) {
    throw new costumError.BadRequestError(
      'Please provide Image file that had size less than 1MB'
    );
  }

  const filePath = path.join(
    __dirname,
    `../public/images/`,
    `${req.files.image.name}`
  );

  console.log(filePath);
  await req.files.image.mv(filePath);

  res.status(StatusCodes.OK).json({ image: `/images/${req.files.image.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  uploadImage,
  updateProducts,
  deleteProduct,
};
