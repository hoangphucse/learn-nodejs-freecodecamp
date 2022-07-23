const Review = require('../model/Review');
const Product = require('../model/Products');

const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors');
const Products = require('../model/Products');
const { checkPermission } = require('../utils');
const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomAPIError.NotFoundError(
      `Not found product with id ${productId}`
    );
  }

  const alreadySubmited = await Review.findOne({
    user: req.user.userId,
    product: productId,
  });

  console.log(alreadySubmited);

  if (alreadySubmited) {
    throw new CustomAPIError.BadRequestError(
      'Already submitted review for product'
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({
    review,
  });
};
const getAllReviews = async (req, res) => {
  let result = Review.find({});

  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  const reviews = await result;
  const totalItem = await Review.count();

  res.status(StatusCodes.OK).json({
    page,
    limit,
    totalPage: Math.ceil(totalItem / limit),
    reviews,
  });
};

const getSingleReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new CustomAPIError.NotFoundError(
      `Not found review with id ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({
    review,
  });
};

const updateReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new CustomAPIError.NotFoundError(
      `Not found review with id ${req.params.id}`
    );
  }

  checkPermission(req.user, review.user);

  const { title, rating, comment } = req.body;
  review.title = title;
  review.rating = rating;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({
    review,
  });
};

const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new CustomAPIError.NotFoundError(
      `Not found review with id ${req.params.id}`
    );
  }

  checkPermission(req.user, review.user);

  await review.remove();
  res.status(StatusCodes.OK).json({ msg: 'Review has been removed' });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
