const express = require('express');
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');

router
  .route('/')
  .get(authenticateUser, authorizePermissions('ADMIN'), getAllUsers);
router.route('/update-user').patch(authenticateUser, updateUser);
router
  .route('/update-user-password')
  .patch(authenticateUser, updateUserPassword);
router.route('/show-me').get(authenticateUser, showCurrentUser);
router.route('/:id').get(authenticateUser, getSingleUser);
module.exports = router;
