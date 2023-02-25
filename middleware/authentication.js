const costumError = require('../errors');
const { verifyToken } = require('../utils/jwt');

const authentication = (req, res, next) => {
  const token = req.signedCookies.userCookie;

  if (!token) {
    throw new costumError.UnauthenticatedError('Authentication invalid');
  }
  try {
    const payload = verifyToken({ token });
    const { name, role, id } = payload;
    console.log(role);
    req.user = { name, role, id };
    next();
  } catch (error) {
    throw new costumError.UnauthenticatedError('Authentication invalid');
  }
};

const authorizePermissions = (...roles) => {
  console.log(roles);

  return (req, res, next) => {
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      throw new costumError.UNAUTHORIZED('Unauthorized user for this router');
    }
    next();
  };
};

module.exports = { authentication, authorizePermissions };

/*console.log(req.user);
  if (req.user.role !== 'admin') {
    throw new costumError.UNAUTHORIZED('Unauthorized router');
  }

  try {
    console.log('admin IS HERE');
    next();
  } catch (error) {
    throw new costumError.UNAUTHORIZED('Unauthorized router');
  }*/
