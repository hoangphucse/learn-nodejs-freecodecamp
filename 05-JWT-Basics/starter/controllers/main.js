const CustomAPIError = require('../errors/custom-error');
const jwt = require('jsonwebtoken');
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new CustomAPIError('Username or password not provided', 400);
  }
  console.log({ username, password });

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
  res.status(200).json({ msg: 'user created', token });
};

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hello, Anh phuc`,
    secret: `Here is your authorized data, you r lucky number is ${luckyNumber}`,
  });
};

module.exports = {
  login,
  dashboard,
};
