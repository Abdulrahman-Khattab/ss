const getUserToken = (user) => {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

module.exports = getUserToken;
