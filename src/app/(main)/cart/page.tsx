"use client";

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ctaBanner from '@/assets/banners/ctaBanner.png';

const CartPage = () => {
  const { state, dispatch } = useCart();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
    }
  };

  const handleRemoveItem = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
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
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {state.totalItems} {state.totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {state.items.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to get started</p>
            <Link href="/">
              <Button className="bg-[#d5a51a] hover:bg-[#b8941a] text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {state.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.product.images[0] || ctaBanner.src}
                            alt={item.product.productName}
                            fill
                            className="object-cover rounded-md"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = ctaBanner.src;
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.product.productName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {item.product.productDescription}
                          </p>
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-[#d5a51a]">
                              ₹{item.product.discountedPrice.toLocaleString()}
                            </span>
                            {item.product.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.product.price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-2 h-10 w-10 hover:bg-gray-100"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center border-x border-gray-300">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-2 h-10 w-10 hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                ₹{(item.product.discountedPrice * item.quantity).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                ₹{item.product.discountedPrice.toLocaleString()} each
                              </div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({state.totalItems} items)</span>
                      <span className="font-medium">₹{state.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₹0</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-[#d5a51a]">₹{state.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href="/checkout">
                      <Button className="w-full bg-[#d5a51a] hover:bg-[#b8941a] text-white h-12 text-lg">
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Link href="/" className="block">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

