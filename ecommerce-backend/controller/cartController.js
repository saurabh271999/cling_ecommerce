import User from "../modules/auth/auth.js";
import Product from "../modules/product.js";
import Cart from "../modules/cart.js";
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

// Helper function to get or create user's cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  
  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
    });
    await cart.save();
    
    // Add cart reference to user
    const user = await User.findById(userId);
    if (user && !user.cart.includes(cart._id)) {
      user.cart.push(cart._id);
      await user.save();
    }
  }
  
  return cart;
};

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { user, error, status } = await getUserFromToken(req);
    if (error) {
      return res.status(status).json({
        success: false,
        message: error,
      });
    }

    const { productId, quantity = 1 } = req.body;

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

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
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

    // Get or create cart
    const cart = await getOrCreateCart(user._id);

    // Check if product is already in cart
    const productIdStr = productId.toString();
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productIdStr
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity: quantity,
      });
    }

    await cart.save();

    // Populate cart items with product details
    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: {
        cart: cart.items,
      },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { user, error, status } = await getUserFromToken(req);
    if (error) {
      return res.status(status).json({
        success: false,
        message: error,
      });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    // Validate if productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format. Product must exist in the database.",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Get user's cart
    const cart = await getOrCreateCart(user._id);

    // Find and update cart item
    const productIdStr = productId.toString();
    const cartItem = cart.items.find(
      (item) => item.product.toString() === productIdStr
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cartItem.quantity = quantity;
    await cart.save();

    // Populate cart items with product details
    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: {
        cart: cart.items,
      },
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: error.message,
    });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
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

    // Get user's cart
    const cart = await getOrCreateCart(user._id);

    // Remove from cart
    const productIdStr = productId.toString();
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productIdStr
    );
    await cart.save();

    // Populate cart items with product details
    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: {
        cart: cart.items,
      },
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error.message,
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const { user, error, status } = await getUserFromToken(req);
    if (error) {
      return res.status(status).json({
        success: false,
        message: error,
      });
    }

    // Get user's cart
    const cart = await getOrCreateCart(user._id);
    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: {
        cart: [],
      },
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message,
    });
  }
};

// Get user cart
export const getCart = async (req, res) => {
  try {
    const { user, error, status } = await getUserFromToken(req);
    if (error) {
      return res.status(status).json({
        success: false,
        message: error,
      });
    }

    // Get or create cart
    const cart = await getOrCreateCart(user._id);

    // Populate cart items with product details
    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      data: {
        cart: cart.items || [],
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};
