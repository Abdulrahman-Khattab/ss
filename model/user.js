const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please provide name'],
    minLength: 3,
    maxLength: 50,
  },

  email: {
    type: String,
    require: [true, 'Please provide email'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },

  password: {
    type: String,
    require: [true, 'Please provide password'],
    minLength: 10,
    maxLength: 50,
  },

  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candiate) {
  const isMatch = await bcrypt.compare(candiate, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', userSchema);
