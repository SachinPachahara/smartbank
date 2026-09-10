const jwt = require("jsonwebtoken");

const User = require("../../models/userModel");

const authUserProtect = async (req, res, next) => {
  let token;
  let user;
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
      //Get User from Token once
      user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).send("Not Authorized with invalid token");
      }
      //pass user object to next middleware
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).send("Not Authorized with invalid token");
    }
  }
  if (!token) return res.status(401).send("Not Authorized without token");
};

module.exports = {
  authUserProtect,
};
