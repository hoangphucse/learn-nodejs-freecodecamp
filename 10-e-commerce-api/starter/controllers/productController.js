const Product = require('../model/Products');
const CustomAPIError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  let result = Product.find({});

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  const products = await result;
  const totalProduct = await Product.count();
  const totalPage = Math.ceil(totalProduct / limit);

  res.status(StatusCodes.OK).json({ page, limit, totalPage, products });
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews');

  if (!product) {
    throw new CustomAPIError.NotFoundError(
      `Not found product with id ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomAPIError.NotFoundError(
      `Not found product with id ${req.params.id}`
    );
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success ! Product removed' });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    throw new CustomAPIError.NotFoundError(
      `Not found product with id ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const uploadImage = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  // Check product exist
  if (!product) {
    throw new CustomAPIError.NotFoundError(
      `Not found product with id ${productId}`
    );
  }

  // check file upload exist
  if (!req.files) {
    throw new CustomAPIError.BadRequestError('No file uploaded');
  }
  const productImage = req.files.image;

  // check type of file upload
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomAPIError.BadRequestError('Please upload image');
  }

  // check size file upload
  const maxSize = 1024 * 1024 * 2;
  if (productImage.size > maxSize) {
    throw new CustomAPIError.BadRequestError(
      'Please upload image small than 2MB'
    );
  }

  // upload to cloudinary
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      folder: 'file-upload',
      public_id: productImage.name,
    }
  );
  // remove temp file
  fs.unlinkSync(req.files.image.tempFilePath);

  product.image = result.secure_url;

  await product.save();
  res.status(StatusCodes.OK).json({ image: result.secure_url });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
};
