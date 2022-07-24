const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require('../controllers/productController');
const { getSingleProductReview } = require('../controllers/reviewController');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

router
  .route('/')
  .get(getAllProducts)
  .post([authenticateUser, authorizePermissions('ADMIN'), createProduct]);

router
  .route('/upload-images/:id')
  .post([authenticateUser, authorizePermissions('ADMIN'), uploadImage]);

router
  .route('/:id')
  .get(getProduct)
  .patch([authenticateUser, authorizePermissions('ADMIN'), updateProduct])
  .delete([authenticateUser, authorizePermissions('ADMIN'), deleteProduct]);

router.route('/:id/reviews').get(getSingleProductReview);

module.exports = router;
