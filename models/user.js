// user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String, // URL or file path
      default: "", // Optional default value
    },
    bio: {
      type: String,
      default: "", // Optional default value
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
