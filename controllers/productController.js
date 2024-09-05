// controllers/productController.js
import path from "path";
import Product from "../models/product.js";
import { apiResponseCode } from "../routes/helper.js";
import config from "../config.js";

// Add a new product
const addProduct = async (req, res) => {
  const { name, description, price, images } = req.body; // Collect product details from frontend
  try {
    const newProduct = new Product({
      name,
      description,
      images, // Array of image URLs or file paths
      price,
      user: req.user.id, // Link the product to the authenticated user
    });

    await newProduct.save();

    res.status(201).json({
      response: apiResponseCode.SUCCESSFUL,
      responseMessage: "Product added successfully",
      data: newProduct,
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

// Fetch products for the authenticated user
const getProducts = async (req, res) => {
  try {
    // Fetch products where the 'user' field matches the authenticated user's ID
    const products = await Product.find({ user: req.user.id })
      .populate("user", "firstName lastName") // Populate the user field with specific fields
      .exec();

    res.status(200).json({
      response: apiResponseCode.SUCCESSFUL,
      responseMessage: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      response: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      // error: error.message,
      data: null,
    });
  }
};

// DELETE a product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the product by ID
    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        response: apiResponseCode.BAD_REQUEST,
        responseMessage: "Product not found",
        // error: error.message,
        data: null,
      });
    }

    res.status(200).json({
      response: apiResponseCode.SUCCESSFUL,
      responseMessage: "Product deleted successfully",
      data: null,
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

export { addProduct, getProducts, deleteProduct };
