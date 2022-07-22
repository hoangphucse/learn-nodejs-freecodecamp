const Product = require('../model/Products');
const CustomAPIError = require('../errors');
const { StatusCodes } = require('http-status-codes');

const createProduct = async (req, res) => {
  res.send('createProdct');
};

const getAllProducts = async (req, res) => {
  res.send('getAllProducts');
};

const getProduct = async (req, res) => {
  res.send('getProduct');
};

const deleteProduct = async (req, res) => {
  res.send('deleteProduct');
};

const updateProduct = async (req, res) => {
  res.send('updateProduct');
};

const uploadImage = async (req, res) => {
  res.send('uploadImage');
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
};
