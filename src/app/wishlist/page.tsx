"use client";

import React from 'react';
import Image from 'next/image';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ctaBanner from '@/assets/banners/ctaBanner.png';

const WishlistPage = () => {
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();

  const handleAddToCart = (product: any) => {
    cartDispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleRemoveFromWishlist = (id: number) => {
    wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
  };

  const handleClearWishlist = () => {
    wishlistDispatch({ type: 'CLEAR_WISHLIST' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {wishlistState.totalItems} {wishlistState.totalItems === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        {wishlistState.items.length === 0 ? (
          /* Empty Wishlist */
          <div className="flex flex-col items-center justify-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to your wishlist</p>
            <Link href="/">
              <Button className="bg-[#d5a51a] hover:bg-[#b8941a] text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistState.items.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={item.images[0] || ctaBanner.src}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = ctaBanner.src;
                      }}
                    />
                    {/* Remove from Wishlist Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.productDescription}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-[#d5a51a]">
                        ₹{item.discountedPrice.toLocaleString()}
                      </span>
                      {item.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="mb-4">
                      {item.inStock ? (
                        <span className="text-sm text-green-600 font-medium">In Stock</span>
                      ) : (
                        <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-[#d5a51a] hover:bg-[#b8941a] text-white"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Clear Wishlist Button */}
            <div className="flex justify-center pt-6">
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleClearWishlist}
              >
                Clear Wishlist
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
