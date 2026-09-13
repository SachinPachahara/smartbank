const jwt = require("jsonwebtoken");

const generateAdminsToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};

module.exports = {
  generateAdminsToken,
};
