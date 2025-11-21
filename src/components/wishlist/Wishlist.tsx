"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { ProductDataProps } from '@/interfaces';
import ctaBanner from '@/assets/banners/ctaBanner.png';
import { authApi, isLoggedIn } from '@/lib/api';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id: string | number): boolean => {
  if (typeof id === 'number') return false;
  // MongoDB ObjectId is 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const Wishlist: React.FC<WishlistProps> = ({ isOpen, onClose }) => {
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = async (product: ProductDataProps) => {
    const productId = (product.id || product._id || '').toString();
    
    // If user is logged in and productId is a valid MongoDB ObjectId, call API
    if (isLoggedIn() && productId && isValidObjectId(productId)) {
      try {
        const response = await authApi.addToCart(productId, 1);
        if (response.success) {
          console.log('Product added to cart on backend');
          // Add to local cart after successful API call
          cartDispatch({ type: 'ADD_TO_CART', payload: product });
        } else {
          console.error('Failed to add to cart:', response.message);
          // Still add to local cart
          cartDispatch({ type: 'ADD_TO_CART', payload: product });
          alert(`Added to cart locally. ${response.message || 'Could not sync with server.'}`);
        }
      } catch (error) {
        console.error('Error adding to cart on backend:', error);
        // Still add to local cart
        cartDispatch({ type: 'ADD_TO_CART', payload: product });
        alert('Added to cart locally. Could not sync with server.');
      }
    } else {
      // User not logged in or productId is not a valid ObjectId, just add to local cart
      if (!isLoggedIn()) {
        console.log('User not logged in, cart item saved locally only');
      } else if (!productId || !isValidObjectId(productId)) {
        console.log('Product ID is not a valid MongoDB ObjectId, saving locally only');
      }
      cartDispatch({ type: 'ADD_TO_CART', payload: product });
    }
  };

  const handleRemoveFromWishlist = async (id: number) => {
    setIsAnimating(true);
    const productId = id.toString();
    
    // If user is logged in and productId is a valid MongoDB ObjectId, call API
    if (isLoggedIn() && isValidObjectId(productId)) {
      try {
        const response = await authApi.removeFromWishlist(productId);
        if (response.success) {
          console.log('Product removed from wishlist on backend');
          // Remove from local wishlist after successful API call
          wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
        } else {
          console.error('Failed to remove from wishlist:', response.message);
          // Still remove from local wishlist
          wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
          alert(`Removed from wishlist locally. ${response.message || 'Could not sync with server.'}`);
        }
      } catch (error) {
        console.error('Error removing from wishlist on backend:', error);
        // Still remove from local wishlist
        wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
        alert('Removed from wishlist locally. Could not sync with server.');
      }
    } else {
      // User not logged in or productId is not a valid ObjectId, just remove from local wishlist
      if (!isLoggedIn()) {
        console.log('User not logged in, wishlist item removed locally only');
      } else {
        console.log('Product ID is not a valid MongoDB ObjectId, removing locally only');
      }
      wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 200);
  };

  const handleClearWishlist = async () => {
    wishlistDispatch({ type: 'CLEAR_WISHLIST' });
    
    // Sync with backend if logged in - remove each item
    if (isLoggedIn()) {
      try {
        // Get current wishlist items before clearing
        const currentItems = wishlistState.items;
        // Remove each item from backend
        for (const item of currentItems) {
          try {
            const productId = (item.id || item._id || '').toString();
            if (productId) {
              await authApi.removeFromWishlist(productId);
            }
          } catch (error) {
            console.error('Error removing item from wishlist:', error);
          }
        }
        console.log('Wishlist cleared on backend');
      } catch (error) {
        console.error('Error clearing wishlist on backend:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Wishlist Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Wishlist ({wishlistState.totalItems})
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {wishlistState.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Heart className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500">Add some items to your wishlist</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistState.items.map((item) => (
                  <Card key={item.id} className={`transition-all duration-200 ${isAnimating ? 'opacity-50 scale-95' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.images[0] || ctaBanner.src}
                            alt={item.productName}
                            fill
                            className="object-cover rounded-md"
                            onError={(e) => {
                              // Fallback to ctaBanner if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.src = ctaBanner.src;
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {item.productDescription}
                          </p>
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-semibold text-[#d5a51a]">
                              ₹{item.discountedPrice.toLocaleString()}
                            </span>
                            {item.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Stock Status */}
                          <div className="mt-2">
                            {item.inStock ? (
                              <span className="text-sm text-green-600 font-medium">In Stock</span>
                            ) : (
                              <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              className="flex-1 bg-[#d5a51a] hover:bg-[#b8941a] text-white"
                              onClick={() => handleAddToCart(item)}
                              disabled={!item.inStock}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromWishlist(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlistState.items.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <Button
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleClearWishlist}
              >
                Clear Wishlist
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
