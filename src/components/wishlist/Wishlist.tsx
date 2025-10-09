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

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({ isOpen, onClose }) => {
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = (product: ProductDataProps) => {
    cartDispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleRemoveFromWishlist = (id: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
      setIsAnimating(false);
    }, 200);
  };

  const handleClearWishlist = () => {
    wishlistDispatch({ type: 'CLEAR_WISHLIST' });
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
