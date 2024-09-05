// routes/user.js
import express from "express";
import { addUser, getUsers, updateProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // Ensure user is authenticated

const userRouter = express.Router();

// endpoint to get all users
// does not require authnetication since its fetching all
userRouter.get("/", authMiddleware, getUsers); // Endpoint to update profile

// Endpoint to update profile
userRouter.put("/profile", authMiddleware, updateProfile);


userRouter.post("/add", authMiddleware, addUser); // Endpoint to update profile

export default userRouter;
