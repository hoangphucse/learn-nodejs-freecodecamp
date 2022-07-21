const CustomError = require('../errors');

const checkPermission = (reqUser, resourceUserId) => {
  if (reqUser.role === 'ADMIN') return;

  if (reqUser.userId === resourceUserId.toString()) return;

  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route'
  );
};

module.exports = checkPermission;
