const User = require('../model/user');
const costumError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const {
  createJWT,
  verifyToken,
  attachCookiesToResponse,
} = require('../utils/jwt');

const getUserToken = require('../utils/userToken');

const register = async (req, res) => {
  const { email, password, name } = req.body;
  let { role } = req.body;

  //Make first user admin

  const firstUser = (await User.countDocuments()) === 0;

  role = firstUser ? 'admin' : 'user';
  // Make abdulrahman Admin
  if (name === 'sereen') {
    role = 'admin';
  }

  const emailAlreadyExisted = await User.findOne({ email });
  console.log(emailAlreadyExisted);
  if (emailAlreadyExisted) {
    throw new costumError.BadRequestError('This user is already exist');
  }

  const user = await User.create({ email, password, name, role });

  const tokenValue =
    getUserToken(user); /*{ name: user.name, role: user.role, id: user._id };*/

  attachCookiesToResponse({ res, user: tokenValue });

  res.status(StatusCodes.CREATED).json({
    user: {
      tokenValue,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new costumError.BadRequestError('Please provide email or password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new costumError.BadRequestError('invalid user ');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new costumError.UnauthenticatedError('Wrong password');
  }

  const tokenValue =
    getUserToken(user); /*{ name: user.name, role: user.role, id: user._id };*/
  console.log(tokenValue);
  attachCookiesToResponse({ res, user: tokenValue });

  res.status(StatusCodes.CREATED).json({
    user: {
      tokenValue,
    },
  });
};

const logout = async (req, res) => {
  res.cookie('userCookie', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).send('You logged out sucessfully');
};

module.exports = { register, login, logout };
