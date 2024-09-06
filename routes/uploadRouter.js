import express, { response } from "express";
import multer from "multer";
import axios from "axios";
import path from "path"; // Import path module
import { apiResponseCode } from "./helper.js";
import fs from "fs"; // Import the fs module

const uploadRouter = express.Router();

// Define the storage engine
// const storage = multer.memoryStorage(); // Or use diskStorage as needed
// Alternatively, use diskStorage if you want to save files to disk
// Define the uploads folder path
const uploadsFolder = path.join(process.cwd(), "uploads"); 

// Function to create the directory if it doesn't exist
const createUploadsFolder = (folderPath) => {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true }); // Create the folder
      console.log(`Uploads folder created at: ${folderPath}`);
    } else {
      console.log(`Uploads folder already exists at: ${folderPath}`);
    }
  } catch (error) {
    console.error(`Error creating uploads folder: ${error.message}`);
  }
};

// Ensure the uploads folder exists before multer is used
createUploadsFolder(uploadsFolder);

// Define the storage engine for multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Double-check folder existence just in case
    createUploadsFolder(uploadsFolder);
    cb(null, uploadsFolder); // Save files in the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Set filename with timestamp
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
