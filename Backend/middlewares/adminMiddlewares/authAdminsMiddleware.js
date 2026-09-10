const jwt = require("jsonwebtoken");

const Admin = require("../../models/adminModel");

const authAdminProtect = async (req, res, next) => {
  let token;
  let admin;
  let decoded;
  if (
    req.headers.authorization &&
    req.headers.authorization.trim().startsWith("Bearer")
  ) {
    try {
      //Get Token from header
      token = req.headers.authorization.split(" ")[1];
      //verify token
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      //Get Admin from Token once
      admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        return res.status(401).send("Not Authorized with invalid token");
      }
      //pass admin object to next middleware
      req.admin = admin;
      next();
    } catch (error) {
      return res.status(401).send("Not Authorized with invalid token");
    }
  }
  if (!token) return res.status(401).send("Not Authorized without token");
};

module.exports = {
  authAdminProtect,
};
