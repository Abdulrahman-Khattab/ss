const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
  const jwtToken = jwt.sign(payload, process.env.jwt_Secret, {
    expiresIn: process.env.jwt_expire_time,
  });

  return jwtToken;
};

const verifyToken = ({ token }) => {
  return jwt.verify(token, process.env.jwt_Secret);
};

const attachCookiesToResponse = ({ res, user }) => {
  const jwtToken = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('userCookie', jwtToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_VALUE === 'production',
    signed: true,
  });
};

module.exports = { createJWT, verifyToken, attachCookiesToResponse };
