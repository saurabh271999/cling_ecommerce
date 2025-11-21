import User from "../modules/auth/auth.js";
import Product from "../modules/product.js";
import Wishlist from "../modules/wishlist.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Helper function to get user from token
const getUserFromToken = async (req) => {
  const token =
    req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;

  if (!token) {
    return { error: "No token provided", status: 401 };
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    const user = await User.findById(decoded.userId);
    if (!user) {
      return { error: "User not found", status: 404 };
    }

    return { user };
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return { error: "Invalid token", status: 401 };
    }
    return { error: error.message, status: 500 };
  }
};

// Helper function to get or create user's wishlist
const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  
  if (!wishlist) {
    wishlist = new Wishlist({
      user: userId,
      products: [],
    });
    await wishlist.save();
    
    // Add wishlist reference to user
    const user = await User.findById(userId);
    if (user && !user.wishlist.includes(wishlist._id)) {
      user.wishlist.push(wishlist._id);
      await user.save();
    }
  }
  
  return wishlist;
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { user, error, status } = await getUserFromToken(req);
    if (error) {
      return res.status(status).json({
        success: false,
        message: error,
      });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Validate if productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format. Product must exist in the database.",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get or create wishlist
    const wishlist = await getOrCreateWishlist(user._id);

    // Convert productId to string for comparison
    const productIdStr = productId.toString();

    // Check if product is already in wishlist
    const isInWishlist = wishlist.products.some(
      (id) => id.toString() === productIdStr
    );

    if (isInWishlist) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // Add to wishlist
    wishlist.products.push(productId);
    await wishlist.save();

    // Populate wishlist products
    await wishlist.populate("products");

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: {
        wishlist: wishlist.products,
      },
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to wishlist",
      error: error.message,
    });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { user, error, status } = await getUserFromToken(req);
    if (error) {
      return res.status(status).json({
        success: false,
        message: error,
      });
    }

    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Validate if productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format. Product must exist in the database.",
      });
    }

    // Get user's wishlist
    const wishlist = await getOrCreateWishlist(user._id);

    // Remove from wishlist
    const productIdStr = productId.toString();
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productIdStr
    );
    await wishlist.save();

    // Populate wishlist products
    await wishlist.populate("products");

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: {
        wishlist: wishlist.products,
      },
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error removing from wishlist",
      error: error.message,
    });
  }
};

// Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    const { user, error, status } = await getUserFromToken(req);
    if (error) {
      return res.status(status).json({
        success: false,
        message: error,
      });
    }

    // Get or create wishlist
    const wishlist = await getOrCreateWishlist(user._id);

    // Populate wishlist products
    await wishlist.populate("products");

    res.status(200).json({
      success: true,
      data: {
        wishlist: wishlist.products || [],
      },
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wishlist",
      error: error.message,
    });
  }
};
