"use client";

import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import ctaBanner from "@/assets/banners/ctaBanner.png";

const TestCartPage = () => {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();

  // Sample product for testing
  const sampleProduct = {
    id: 999,
    productName: "Test Product",
    productDescription: "This is a test product for cart functionality",
    stars: 4.5,
    reviews: 100,
    itemsSold: 50,
    price: 1000,
    discountedPrice: 800,
    discount: 20,
    inStock: true,
    isLike: false,
    images: [ctaBanner.src],
    description: {
      title: "Test product description",
      moreDetails: ["Feature 1", "Feature 2"]
    },
    review: ["Great product", "Good quality"]
  };

  const handleAddToCart = () => {
    cartDispatch({ type: 'ADD_TO_CART', payload: sampleProduct });
  };

  const handleAddToWishlist = () => {
    wishlistDispatch({ type: 'ADD_TO_WISHLIST', payload: sampleProduct });
  };

  const handleClearCart = () => {
    cartDispatch({ type: 'CLEAR_CART' });
  };

  const handleClearWishlist = () => {
    wishlistDispatch({ type: 'CLEAR_WISHLIST' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cart & Wishlist Test Page</h1>
        
        {/* Test Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleAddToCart} className="bg-[#d5a51a] hover:bg-[#b8941a]">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button onClick={handleAddToWishlist} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                <Heart className="w-4 h-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button onClick={handleClearCart} variant="outline" className="border-gray-300">
                Clear Cart
              </Button>
              <Button onClick={handleClearWishlist} variant="outline" className="border-gray-300">
                Clear Wishlist
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cart Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart Status
              </h2>
              <div className="space-y-2">
                <p><strong>Total Items:</strong> {cartState.totalItems}</p>
                <p><strong>Total Price:</strong> ₹{cartState.totalPrice.toLocaleString()}</p>
                <p><strong>Items in Cart:</strong> {cartState.items.length}</p>
                {cartState.items.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Cart Items:</h3>
                    <div className="space-y-3">
                      {cartState.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.productName}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product.productName}
                            </p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × ₹{item.product.discountedPrice.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-sm font-semibold text-[#d5a51a]">
                            ₹{(item.product.discountedPrice * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Wishlist Status
              </h2>
              <div className="space-y-2">
                <p><strong>Total Items:</strong> {wishlistState.totalItems}</p>
                <p><strong>Items in Wishlist:</strong> {wishlistState.items.length}</p>
                {wishlistState.items.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Wishlist Items:</h3>
                    <div className="space-y-3">
                      {wishlistState.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={item.images[0]}
                              alt={item.productName}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-600">
                              ₹{item.discountedPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">How to Test</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click &quot;Add to Cart&quot; to add the test product to your cart</li>
              <li>Click &quot;Add to Wishlist&quot; to add the test product to your wishlist</li>
              <li>Check the status cards to see the updated counts and items</li>
              <li>Use &quot;Clear Cart&quot; and &quot;Clear Wishlist&quot; to reset the state</li>
              <li>Navigate to other pages to see the cart/wishlist icons in the navbar</li>
              <li>Click on the cart/wishlist icons in the navbar to open the respective panels</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestCartPage;
