const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError(
      'Please provide email and password !'
    );
  }
  const user = await User.findOne({
    email,
  });

  console.log(user, email);

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials !');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials !');
  }

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};
const logout = async (_, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'User logged out' });
};
const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exist');
  }

  // first registerd uesr is an admin

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'ADMIN' : 'USER';

  const user = await User.create({ email, name, password, role });
  const tokenUser = { name: user.name, role: user.role, userId: user._id };

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

module.exports = {
  login,
  logout,
  register,
};
