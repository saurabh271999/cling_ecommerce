import User from "../../modules/auth/auth.js";
import Cart from "../../modules/cart.js";
import Wishlist from "../../modules/wishlist.js";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../../utils/emailService.js";

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};

// Helper function to get cart and wishlist items for a user
const getUserCartAndWishlist = async (userId) => {
  let cartItems = [];
  let wishlistProducts = [];

  try {
    // Get user's cart
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      await cart.populate("items.product");
      cartItems = cart.items || [];
    }

    // Get user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      await wishlist.populate("products");
      wishlistProducts = wishlist.products || [];
    }
  } catch (error) {
    console.warn("Could not fetch cart/wishlist:", error.message);
  }

  return { cartItems, wishlistProducts };
};

// User Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = new User({
      name,
      email,
      password,
      otp: {
        code: otpCode,
        expiresAt: otpExpiresAt,
      },
      isEmailVerified: false,
    });

    await user.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otpCode);
    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      // Still return success but warn about email
      return res.status(201).json({
        success: true,
        message:
          "User created successfully, but OTP email failed to send. Please use resend OTP.",
        data: {
          userId: user._id,
          email: user.email,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "User created successfully. OTP sent to your email.",
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and OTP",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // Check if OTP exists and is valid
    if (!user.otp.code || !user.otp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    // Check if OTP is expired
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Verify OTP
    if (user.otp.code !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Update user
    user.isEmailVerified = true;
    user.otp.code = null;
    user.otp.expiresAt = null;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Get cart and wishlist
    const { cartItems, wishlistProducts } = await getUserCartAndWishlist(user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || null,
          avatar: user.avatar || null,
          isEmailVerified: user.isEmailVerified,
          googleId: user.googleId || null,
          addresses: user.addresses || [],
          orders: user.orders || [],
          wishlist: wishlistProducts,
          cart: cartItems,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user OTP
    user.otp.code = otpCode;
    user.otp.expiresAt = otpExpiresAt;
    await user.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otpCode);
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: emailResult.error,
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP resent successfully to your email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resending OTP",
      error: error.message,
    });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Get cart and wishlist
    const { cartItems, wishlistProducts } = await getUserCartAndWishlist(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || null,
          avatar: user.avatar || null,
          isEmailVerified: user.isEmailVerified,
          googleId: user.googleId || null,
          addresses: user.addresses || [],
          orders: user.orders || [],
          wishlist: wishlistProducts,
          cart: cartItems,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// Google OAuth - Initiate authentication
export const googleAuth = (req, res, next) => {
  // Store the redirect URL in session if provided
  if (req.query.redirect) {
    req.session.redirectUrl = req.query.redirect;
  }
  next();
};

// Google OAuth - Callback handler
export const googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Google authentication failed",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect to frontend or return token
    let redirectUrl = req.session.redirectUrl || process.env.FRONTEND_URL || "http://localhost:3000";
    delete req.session.redirectUrl;

    // Clean redirect URL - remove any existing token parameters
    try {
      const url = new URL(redirectUrl);
      url.searchParams.delete("token"); // Remove any existing token
      url.searchParams.set("token", token); // Add new token
      redirectUrl = url.toString();
    } catch {
      // If URL parsing fails, append token manually
      const separator = redirectUrl.includes("?") ? "&" : "?";
      redirectUrl = `${redirectUrl}${separator}token=${token}`;
    }

    // If request is from API, return JSON, otherwise redirect
    if (req.headers.accept?.includes("application/json")) {
      // Get cart and wishlist
      const { cartItems, wishlistProducts } = await getUserCartAndWishlist(req.user._id);

      return res.status(200).json({
        success: true,
        message: "Google authentication successful",
        data: {
          token,
          user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone || null,
            avatar: req.user.avatar || null,
            isEmailVerified: req.user.isEmailVerified,
            googleId: req.user.googleId || null,
            addresses: req.user.addresses || [],
            orders: req.user.orders || [],
            wishlist: wishlistProducts,
            cart: cartItems,
          },
        },
      });
    }

    // Redirect to frontend with token
    res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Google OAuth callback",
      error: error.message,
    });
  }
};

// Logout
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error in passport logout:", err);
      // Continue with logout even if there's an error
    }

    // Clear token cookie
    res.clearCookie("token");
    res.clearCookie("connect.sid");
    res.clearCookie("session");

    // Clear session data
    if (req.session) {
      req.session = null;
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    // Check for token in header or cookie
    const token =
      req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Find user and try to populate orders
    let user;
    try {
      user = await User.findById(decoded.userId)
        .populate({
          path: "orders",
          strictPopulate: false, // Don't throw error if model doesn't exist
        });
    } catch (populateError) {
      // If populate fails, fetch user without populate
      console.warn("Could not populate orders:", populateError.message);
      user = await User.findById(decoded.userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get cart and wishlist from separate models
    const { cartItems, wishlistProducts } = await getUserCartAndWishlist(user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || null,
          avatar: user.avatar || null,
          isEmailVerified: user.isEmailVerified,
          googleId: user.googleId || null,
          addresses: user.addresses || [],
          orders: user.orders || [],
          wishlist: wishlistProducts,
          cart: cartItems,
        },
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error fetching current user",
      error: error.message,
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    // Check for token in header or cookie
    const token =
      req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update allowed fields
    const { name, phone, addresses } = req.body;

    console.log("Update profile request:", { name, phone, addressesCount: addresses?.length });

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (addresses !== undefined) {
      // Handle empty array
      if (Array.isArray(addresses) && addresses.length === 0) {
        user.addresses = [];
        console.log("Cleared all addresses");
      } else if (Array.isArray(addresses) && addresses.length > 0) {
        // Ensure only one address is set as default
        const addressesWithDefault = addresses.map((addr) => ({
          type: addr.type || "home",
          street: addr.street || "",
          city: addr.city || "",
          state: addr.state || "",
          zipCode: addr.zipCode || "",
          country: addr.country || "India",
          isDefault: addr.isDefault === true,
        }));

        // If multiple addresses are marked as default, keep only the first one
        let foundDefault = false;
        addressesWithDefault.forEach((addr) => {
          if (addr.isDefault && foundDefault) {
            addr.isDefault = false;
          } else if (addr.isDefault) {
            foundDefault = true;
          }
        });

        user.addresses = addressesWithDefault;
        console.log("Updated addresses:", JSON.stringify(user.addresses, null, 2));
      } else {
        console.warn("Invalid addresses format:", addresses);
      }
    }

    await user.save();
    console.log("User saved successfully");

    // Get cart and wishlist
    const { cartItems, wishlistProducts } = await getUserCartAndWishlist(user._id);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || null,
          avatar: user.avatar || null,
          isEmailVerified: user.isEmailVerified,
          googleId: user.googleId || null,
          addresses: user.addresses || [],
          orders: user.orders || [],
          wishlist: wishlistProducts,
          cart: cartItems,
        },
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

