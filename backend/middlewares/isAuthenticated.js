const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).render("unauthorized", {
        message: "Please log in to access this page.",
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).render("unauthorized", {
        message: "Invalid or expired token. Please log in again.",
      });
    }

    req.id = decode.userId;
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).render("unauthorized", {
        message: "User not found. Please sign up again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(401).render("unauthorized", {
      message: "Something went wrong. Please try again.",
    });
  }
};

module.exports = isAuthenticated;
