import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../controller/wishlistController.js";

const router = express.Router();

// Get user wishlist
router.get("/", getWishlist);

// Add product to wishlist
router.post("/", addToWishlist);

// Remove product from wishlist
router.delete("/:productId", removeFromWishlist);

export default router;

