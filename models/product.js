// ./models/product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true, // Assuming price is a required field
    },
    images: [
      {
        type: String, // URLs or file paths for images
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field to populate createdBy with the user's full name
productSchema.virtual("createdBy").get(function () {
  // Assuming that `user` is populated with the user's information
  return this.user ? `${this.user.firstName} ${this.user.lastName}` : "Unknown";
});

// Ensure virtuals are serialized
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default mongoose.model("Product", productSchema);
