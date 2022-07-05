const { StatusCodes } = require('http-status-codes');
const { BadRequest } = require('../errors');
const jwt = require('jsonwebtoken');
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequest('Username or password not provided');
  }

  const id = new Date().getTime();

  const token = jwt.sign(
    {
      id,
      username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
  res.status(StatusCodes.OK).json({ msg: 'user created', token });
};

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(StatusCodes.OK).json({
    msg: `Hello, ${req.user.username}`,
    secret: `Here is your authorized data, you're lucky number is ${luckyNumber}`,
  });
};

module.exports = {
  login,
  dashboard,
};
