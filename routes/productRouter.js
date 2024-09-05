// ./routes/product.js
import express from "express";
import multer from "multer";
import {
  addProduct,
  getProducts,
  deleteProduct,
} from "../controllers/productController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // Ensure user is authenticated

const productRouter = express.Router();

// const upload = multer({ storage });

// POST route to add a product
productRouter.post("/add", authMiddleware, addProduct);

// GET route to fetch all products
productRouter.get("/", authMiddleware, getProducts); // Protect this route with authMiddleware

// DELETE route to delete products
productRouter.delete("/:id", authMiddleware, deleteProduct);

export default productRouter;
