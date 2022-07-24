const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  getAllOrders,
  getSingleOrders,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require('../controllers/orderController');

router
  .route('/')
  .get(authenticateUser, authorizePermissions('ADMIN'), getAllOrders)
  .post(authenticateUser, createOrder);
router.route('/current-order').get(authenticateUser, getCurrentUserOrders);
router
  .route('/:id')
  .get(authenticateUser, getSingleOrders)
  .patch(authenticateUser, updateOrder);

module.exports = router;
