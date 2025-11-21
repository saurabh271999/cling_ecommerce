"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import ctaBanner from '@/assets/banners/ctaBanner.png';
import { authApi, isLoggedIn } from '@/lib/api';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id: string | number): boolean => {
  if (typeof id === 'number') return false;
  // MongoDB ObjectId is 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItem(id);
    } else {
      const productId = id.toString();
      
      // If user is logged in and productId is a valid MongoDB ObjectId, call API
      if (isLoggedIn() && isValidObjectId(productId)) {
        try {
          const response = await authApi.updateCartItem(productId, newQuantity);
          if (response.success) {
            console.log('Cart updated on backend');
            // Update local cart after successful API call
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
          } else {
            console.error('Failed to update cart:', response.message);
            // Still update local cart
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
            alert(`Cart updated locally. ${response.message || 'Could not sync with server.'}`);
          }
        } catch (error) {
          console.error('Error updating cart on backend:', error);
          // Still update local cart
          dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
          alert('Cart updated locally. Could not sync with server.');
        }
      } else {
        // User not logged in or productId is not a valid ObjectId, just update local cart
        if (!isLoggedIn()) {
          console.log('User not logged in, cart updated locally only');
        } else {
          console.log('Product ID is not a valid MongoDB ObjectId, updating locally only');
        }
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
      }
    }
  };

  const handleRemoveItem = async (id: number) => {
    setIsAnimating(true);
    const productId = id.toString();
    
    // If user is logged in and productId is a valid MongoDB ObjectId, call API
    if (isLoggedIn() && isValidObjectId(productId)) {
      try {
        const response = await authApi.removeFromCart(productId);
        if (response.success) {
          console.log('Item removed from cart on backend');
          // Remove from local cart after successful API call
          dispatch({ type: 'REMOVE_FROM_CART', payload: id });
        } else {
          console.error('Failed to remove from cart:', response.message);
          // Still remove from local cart
          dispatch({ type: 'REMOVE_FROM_CART', payload: id });
          alert(`Item removed locally. ${response.message || 'Could not sync with server.'}`);
        }
      } catch (error) {
        console.error('Error removing from cart on backend:', error);
        // Still remove from local cart
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
        alert('Item removed locally. Could not sync with server.');
      }
    } else {
      // User not logged in or productId is not a valid ObjectId, just remove from local cart
      if (!isLoggedIn()) {
        console.log('User not logged in, item removed locally only');
      } else {
        console.log('Product ID is not a valid MongoDB ObjectId, removing locally only');
      }
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 200);
  };

  const handleClearCart = async () => {
    // If user is logged in, call API first
    if (isLoggedIn()) {
      try {
        const response = await authApi.clearCart();
        if (response.success) {
          console.log('Cart cleared on backend');
          // Clear local cart after successful API call
          dispatch({ type: 'CLEAR_CART' });
        } else {
          console.error('Failed to clear cart:', response.message);
          // Still clear local cart
          dispatch({ type: 'CLEAR_CART' });
          alert(`Cart cleared locally. ${response.message || 'Could not sync with server.'}`);
        }
      } catch (error) {
        console.error('Error clearing cart on backend:', error);
        // Still clear local cart
        dispatch({ type: 'CLEAR_CART' });
        alert('Cart cleared locally. Could not sync with server.');
      }
    } else {
      // User not logged in, just clear local cart
      dispatch({ type: 'CLEAR_CART' });
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
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Shopping Cart ({state.totalItems})
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

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Add some items to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <Card key={item.id} className={`transition-all duration-200 ${isAnimating ? 'opacity-50 scale-95' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.product.images[0] || ctaBanner.src}
                            alt={item.product.productName}
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
                            {item.product.productName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.product.productDescription}
                          </p>
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-semibold text-[#d5a51a]">
                              ₹{item.product.discountedPrice.toLocaleString()}
                            </span>
                            {item.product.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.product.price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-1 h-8 w-8 hover:bg-gray-100"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-1 h-8 w-8 hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
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
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-[#d5a51a]">₹{state.totalPrice.toLocaleString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link href="/checkout" onClick={onClose}>
                  <Button className="w-full bg-[#d5a51a] hover:bg-[#b8941a] text-white">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
