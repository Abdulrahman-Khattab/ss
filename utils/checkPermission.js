const costumError = require('../errors');

const checkPermisson = (reqUser, resourceUserId) => {
  if (reqUser.role === 'admin') return;
  if (reqUser.id === resourceUserId.toString()) return;

  throw new costumError.UNAUTHORIZED('Unauthroized to access this route ');
};

module.exports = checkPermisson;
