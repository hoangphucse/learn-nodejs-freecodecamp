const Review = require('../model/Review');
const Product = require('../model/Products');

const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors');
const { checkPermission } = require('../utils');
const Order = require('../model/Order');

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue';
  return {
    client_secret,
    amount,
  };
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders });
};

const getSingleOrders = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (!order) {
    throw new CustomAPIError.NotFoundError(
      `Not found order with id ${req.params.id}`
    );
  }

  checkPermission(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({
    user: req.user.userId,
  });

  res.status(StatusCodes.OK).json({
    orders,
  });
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomAPIError.BadRequestError('No cart item provided');
  }

  if (!tax || !shippingFee) {
    throw new CustomAPIError.BadRequestError(
      'Please provide tax and shipping fee'
    );
  }
  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomAPIError.NotFoundError(
        `No product with id ${item.product}`
      );
    }

    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems.push(singleOrderItem);
    subtotal += item.amount * price;
  }
  //   calculate total price
  const total = tax + shippingFee + subtotal;
  // get client secret

  const paymentIntent = await fakeStripeApi({
    amount: total,
    currency: 'usd',
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({
    _id: orderId,
  });

  if (!order) {
    throw new CustomAPIError.NotFoundError(
      `Not found order with id ${orderId}`
    );
  }
  checkPermission(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrders,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
