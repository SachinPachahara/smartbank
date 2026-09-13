const jwt = require("jsonwebtoken");

const generateUsersToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

module.exports = {
  generateUsersToken,
};
