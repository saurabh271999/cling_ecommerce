import express from "express";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCart,
} from "../controller/cartController.js";

const router = express.Router();

// Get user cart
router.get("/", getCart);

// Add product to cart
router.post("/", addToCart);

// Update cart item quantity
router.put("/:productId", updateCartItem);

// Remove product from cart
router.delete("/:productId", removeFromCart);

// Clear entire cart
router.delete("/", clearCart);

export default router;

