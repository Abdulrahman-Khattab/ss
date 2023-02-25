const { StatusCodes } = require('http-status-codes');
const orderSchema = require('../model/order');
const Product = require('../model/product');
const costumError = require('../errors');
const checkPermisson = require('../utils/checkPermission');

const getAllorders = async (req, res) => {
  const orders = await orderSchema.find({});

  if (!orders) {
    throw new costumError.NotFoundError('There is no orders in this db');
  }

  res.status(StatusCodes.OK).json(orders);
};

const getSingleUserOrder = async (req, res) => {
  const order = await orderSchema.findOne({ _id: req.params.id });

  if (!order) {
    throw new costumError.NotFoundError(
      `There is no order with this id: ${order.id}`
    );
  }

  checkPermisson(req.user, order.user);

  res.status(StatusCodes.OK).json(order);
};

const getCurrentUserOrders = async (req, res) => {
  const order = await orderSchema.findOne({ user: req.user.id });

  if (!order) {
    throw new costumError.NotFoundError(
      `There is no order with this id: ${order.id}`
    );
  }

  res.status(StatusCodes.OK).json(order);
};

const createOrder = async (req, res) => {
  const { tax, shippingFee, items: cartItems } = req.body;

  const fakePaymentMethodAPI = async ({ currency, amount }) => {
    const clientSercert = 'Sercert ';
    return { clientSercert, amount };
  };

  if (!tax || !shippingFee) {
    throw new costumError.BadRequestError(
      'Please provide shipping fee or tax '
    );
  }

  let cartTotal = [];
  let subTotal = 0;

  if (!cartItems || cartItems.length < 1) {
    throw new costumError.BadRequestError('Please provide cart Item');
  }

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new costumError.NotFoundError(
        `There is no item with id :${item.product} `
      );
    }

    const { image, name, price, _id } = dbProduct;

    const singleOrder = {
      name,
      price,
      image,
      _id,
      amount: item.amount,
    };

    cartTotal = [...cartTotal, singleOrder];
    subTotal += item.amount * price;
  }

  console.log(cartTotal);
  console.log(subTotal);

  // total price
  const total = subTotal + shippingFee + tax;

  const paymentIntent = await fakePaymentMethodAPI({
    currency: 'usd',
    amount: total,
  });

  const orderValue = await orderSchema.create({
    tax,
    shippingFee,
    subTotal,
    total,
    cartItems,
    clientSecret: paymentIntent.clientSercert,
    user: req.user.id,
  });

  res.status(StatusCodes.ACCEPTED).json(orderValue);
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { paymentIntentId } = req.body;

  const order = await orderSchema.findOne({ _id: id });

  if (!order) {
    throw new costumError.NotFoundError(
      `There is no order with this id: ${order.id}`
    );
  }

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';

  await order.save();

  res.status(StatusCodes.OK).json(order);
};

module.exports = {
  getAllorders,
  getSingleUserOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
