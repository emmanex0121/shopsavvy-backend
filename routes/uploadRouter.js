import express, { response } from "express";
import multer from "multer";
import axios from "axios";
import path from "path"; // Import path module
import { apiResponseCode } from "./helper.js";

const uploadRouter = express.Router();

// Define the storage engine
// const storage = multer.memoryStorage(); // Or use diskStorage as needed
// Alternatively, use diskStorage if you want to save files to disk
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename
  },
});

// Initialize multer with the defined storage
const upload = multer({ storage });

uploadRouter.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      response: apiResponseCode.BAD_REQUEST,
      responseMessage: "No file uploaded",
      data: null,
    });
  }

  try {
    // Return the path of the uploaded image
    res.status(200).json({
      response: apiResponseCode.SUCCESSFUL,
      responseMessage: "Image Uploaded Successfully",
      data: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    res.status(500).json({
      response: apiResponseCode.INTERNAL_SERVER_ERR,
      resopnsMessage: "Image upload failed",
      data: null,
    });
  }
});

export default uploadRouter;
