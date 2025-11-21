import Product from "../modules/product.js";
import Category from "../modules/category.js";
import mongoose from "mongoose";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      images,
      category,
      stock,
      inStock,
      tags,
      featured,
    } = req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Product name and price are required",
      });
    }

    // Validate category if provided
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID format",
        });
      }

      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Create product
    const product = new Product({
      name,
      description,
      price,
      originalPrice: originalPrice || price,
      images: images || [],
      category: category || null,
      stock: stock || 0,
      inStock: inStock !== undefined ? inStock : true,
      tags: tags || [],
      featured: featured || false,
    });

    const savedProduct = await product.save();

    // If category is provided, add product to category
    if (category) {
      await Category.findByIdAndUpdate(category, {
        $push: { products: savedProduct._id },
      });
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      featured,
      inStock,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 20,
      sort = "-createdAt",
    } = req.query;

    // Build query
    const query = {};

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      }
    }

    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    if (inStock !== undefined) {
      query.inStock = inStock === "true";
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const products = await Product.find(query)
      .populate("category", "name image")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(id).populate(
      "category",
      "name image description"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      originalPrice,
      images,
      category,
      stock,
      inStock,
      tags,
      featured,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Validate category if provided
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID format",
        });
      }

      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      // Remove product from old category if category changed
      if (product.category && product.category.toString() !== category) {
        await Category.findByIdAndUpdate(product.category, {
          $pull: { products: product._id },
        });
      }

      // Add product to new category
      await Category.findByIdAndUpdate(category, {
        $addToSet: { products: product._id },
      });
    }

    // Update fields
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    if (images !== undefined) product.images = images;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (inStock !== undefined) product.inStock = inStock;
    if (tags !== undefined) product.tags = tags;
    if (featured !== undefined) product.featured = featured;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Remove product from category if it has one
    if (product.category) {
      await Category.findByIdAndUpdate(product.category, {
        $pull: { products: product._id },
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

