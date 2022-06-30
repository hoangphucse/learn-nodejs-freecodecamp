const { CustomAPIError } = require('../errors/custom-error');
const errorHandlerMiddlware = (err, req, res, next) => {
  console.log({ err });
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(500)
    .json({ msg: 'Something went wrong, please try again ' });
};

module.exports = errorHandlerMiddlware;
