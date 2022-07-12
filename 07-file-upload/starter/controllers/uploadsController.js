const Product = require('../models/Product');
const path = require('path');
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors');
const cloudinary = require('cloudinary').v2;

const uploadProductImageLocal = async (req, res) => {
  // check if file exists
  if (!req.files) {
    throw new CustomAPIError.BadRequestError('No file Uploaded');
  }

  const productImage = req.files.image;
  // check format
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomAPIError.BadRequestError('Please Upload Image');
  }

  // check size
  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomAPIError.BadRequestError(
      'Please Upload Image Smaller than 1MB'
    );
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  await productImage.mv(imagePath);

  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

const uploadProductImage = async () => {
  
  const result = await cloudinary.uploader.upload()
};

module.exports = {
  uploadProductImage,
  uploadProductImageLocal,
};
