import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";

const router = express.Router();

// Create a new product
router.post("/", createProduct);

// Get all products
router.get("/", getAllProducts);

// Get single product by ID
router.get("/:id", getProductById);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;

