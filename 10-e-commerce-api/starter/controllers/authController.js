const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse } = require('../utils');

const login = async (req, res) => {};
const logout = async (req, res) => {
  res.send('logout');
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
