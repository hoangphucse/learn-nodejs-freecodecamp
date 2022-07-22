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
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

router
  .route('/')
  .get(getAllProducts)
  .post([authenticateUser, authorizePermissions('ADMIN'), createProduct]);
router
  .route('/:id')
  .get(getProduct)
  .patch([authenticateUser, authorizePermissions('ADMIN'), updateProduct])
  .delete([authenticateUser, authorizePermissions('ADMIN'), deleteProduct]);
router
  .route('/upload-images')
  .post([authenticateUser, authorizePermissions('ADMIN'), uploadImage]);

module.exports = router;
 