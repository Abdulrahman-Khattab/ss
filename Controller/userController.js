const User = require('../model/user');
const costumError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const getUserToken = require('../utils/userToken');
const checkPermisson = require('../utils/checkPermission');

const getAllUser = async (req, res) => {
  const allUsers = await User.find({ role: 'user' });
  if (!allUsers) {
    costumError.NotFoundError('Something went Wrong please try again ');
  }

  const filteredUsers = allUsers.map((user) => {
    const { _id, name, email, role } = user;
    const filteredUser = { _id, name, email, role };

    return filteredUser;
  });

  res.status(StatusCodes.OK).json(filteredUsers);
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;

  const singleUser = await User.findOne({ _id: id });
  if (!singleUser) {
    new costumError.NotFoundError('Something went Wrong please try again ');
  }

  const { _id, name, email, role } = singleUser;
  const filteredUser = { _id, name, email, role };

  checkPermisson(req.user, singleUser._id);
  res.status(StatusCodes.OK).json(singleUser);
};

const showCurrentUser = async (req, res) => {
  res.Status(201).json({ user: req.user });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new costumError.BadRequestError('Please provide all values ');
  }
  const { id } = req.user;

  const user = await User.findOne({ _id: id });
  console.log(user);

  const isOldPassWordCorrect = await user.comparePassword(oldPassword);

  console.log(isOldPassWordCorrect);

  if (!isOldPassWordCorrect) {
    throw new costumError.UnauthenticatedError('Invalid credntial');
  }

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.ACCEPTED).send('Password change successed ! ');
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new costumError.BadRequestError('Please Provide all values ');
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { name, email },
    { new: true, runValidators: true }
  );

  const tokenValue = getUserToken(user);
  res.status(StatusCodes.ACCEPTED).json({ tokenValue });
};

module.exports = {
  getAllUser,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
