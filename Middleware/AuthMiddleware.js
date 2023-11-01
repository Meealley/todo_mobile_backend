const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { response } = require("express");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
        res.status(401);
      throw new Error("Not authorized");
    }
  } else {
    throw new Error("There is  no token attached to the header");
  }
});

module.exports = { authMiddleware };
