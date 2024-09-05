import jwt from "jsonwebtoken";
import config from "../config.js";
import User from "../models/user.js";
import { apiResponseCode } from "../routes/helper.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // console.log("helloo", token)
  if (!token) {
    return res.status(401).json({
      response: apiResponseCode.UNAUTHORIZED,
      responseMessage: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log("Decoded JWT:", decoded); // Debug line

    // Find user associated with the token
    const user = await User.findById(decoded.id);
    console.log("Found user:", user); // Debug line

    if (!user) {
      return res.status(404).json({
        response: apiResponseCode.NOT_FOUND,
        responseMessage: "User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Middleware Error:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        response: apiResponseCode.BAD_REQUEST,
        responseMessage: "Invalid token format.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        response: apiResponseCode.UNAUTHORIZED,
        responseMessage: `Token expired at ${error.expiredAt}. Please log in again.`,
      });
    }

    return res.status(500).json({
      response: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error.",
    });
  }
};

export { authMiddleware };
