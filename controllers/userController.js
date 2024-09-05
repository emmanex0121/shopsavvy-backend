// controllers/userController.js
import user from "../models/user.js";
import User from "../models/user.js";
import { apiResponseCode } from "../routes/helper.js";
import { registration } from "./authController.js";

// Update user profile
const updateProfile = async (req, res) => {
  const { profilePicture, bio } = req.body; // Expecting profilePicture URL and bio from frontend
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // Assuming you have middleware that sets req.user from JWT
      { profilePicture, bio },
      { new: true }
    );

    res.status(200).json({
      response: apiResponseCode.SUCCESSFUL,
      responseMessage: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      response: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

// Fetch all users
const getUsers = async (req, res) => {
  try {
    // Fetch all users from the User collection
    const users = await User.find({}, "firstName lastName email userName"); // Specify the fields you want to return

    console.log(users);

    res.status(200).json({
      response: apiResponseCode.SUCCESSFUL,
      responseMessage: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      response: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

// Add user
const addUser = async (req, res) => {
  try {
    // Call the registration function and pass req and res
    await registration(req, res);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({
      response: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

export { updateProfile, getUsers, addUser };
