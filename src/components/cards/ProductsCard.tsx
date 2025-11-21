"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { CategoryCardProps } from "@/interfaces";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { ShoppingCart, Heart } from "lucide-react";
import { authApi, isLoggedIn } from "@/lib/api";

interface ProductsCardProps {
  data: CategoryCardProps[];
}

const highlightLastWord = (text: string) => {
  const words = text.split(" ");
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <span style={{ color: "#d5a51a" }}>{last}</span>
    </>
  );
};

const ProductsCard: React.FC<ProductsCardProps> = ({ data }) => {
  const [api, setApi] = useState<CarouselApi>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { dispatch: cartDispatch } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const [loadingCart, setLoadingCart] = useState<string | number | null>(null);
  const [loadingWishlist, setLoadingWishlist] = useState<string | number | null>(null);

  useEffect(() => {
    if (!api) return;

    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Set interval to auto-scroll every 3 seconds
    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 2500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [api]);

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (api) {
      intervalRef.current = setInterval(() => {
        api.scrollNext();
      }, 2500);
    }
  };

  // Helper function to check if a string is a valid MongoDB ObjectId
  const isValidObjectId = (id: string | number): boolean => {
    if (typeof id === 'number') return false;
    // MongoDB ObjectId is 24 hex characters
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const handleAddToCart = async (product: CategoryCardProps) => {
    setLoadingCart(product.id);
    
    // Convert CategoryCardProps to ProductDataProps format
    const productData = {
      id: product.id,
      productName: product.title,
      productDescription: product.description || "",
      stars: product.stars || 4.5,
      reviews: 0,
      itemsSold: 0,
      price: product.price || 0,
      discountedPrice: product.discountedPrice || product.price || 0,
      discount: product.price && product.discountedPrice ? 
        Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0,
      inStock: true,
      isLike: false,
      images: [product.image],
      description: {
        title: product.description || "",
        moreDetails: []
      },
      review: []
    };
    
    const productId = typeof product.id === 'string' ? product.id : product.id.toString();
    
    // If user is logged in and productId is a valid MongoDB ObjectId, call API
    if (isLoggedIn() && isValidObjectId(productId)) {
      try {
        console.log('Adding to cart via API, productId:', productId);
        const response = await authApi.addToCart(productId, 1);
        
        if (response.success) {
          console.log('Product added to cart successfully on backend');
          // Add to local cart context after successful API call
          cartDispatch({ type: 'ADD_TO_CART', payload: productData });
        } else {
          console.error('Failed to add to cart:', response.message);
          // Still add to local cart even if API fails
          cartDispatch({ type: 'ADD_TO_CART', payload: productData });
          alert(`Added to cart locally. ${response.message || 'Could not sync with server.'}`);
        }
      } catch (error) {
        console.error('Error adding to cart on backend:', error);
        // Add to local cart even if backend fails
        cartDispatch({ type: 'ADD_TO_CART', payload: productData });
        alert('Added to cart locally. Could not sync with server.');
      }
    } else {
      // User not logged in or productId is not a valid ObjectId (static product), just add to local cart
      if (!isLoggedIn()) {
        console.log('User not logged in, cart item saved locally only');
      } else {
        console.log('Product ID is not a valid MongoDB ObjectId, saving locally only');
      }
      cartDispatch({ type: 'ADD_TO_CART', payload: productData });
    }
    
    setLoadingCart(null);
  };

  const handleToggleWishlist = async (product: CategoryCardProps) => {
    const isInWishlist = wishlistState.items.some(item => item.id === product.id);
    const productId = typeof product.id === 'string' ? product.id : product.id.toString();
    setLoadingWishlist(product.id);
    
    if (isInWishlist) {
      // If user is logged in and productId is a valid MongoDB ObjectId, call API
      if (isLoggedIn() && isValidObjectId(productId)) {
        try {
          console.log('Removing from wishlist via API, productId:', productId);
          const response = await authApi.removeFromWishlist(productId);
          if (response.success) {
            console.log('Product removed from wishlist successfully on backend');
            // Remove from local wishlist after successful API call
            wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
          } else {
            console.error('Failed to remove from wishlist:', response.message);
            // Still remove from local wishlist
            wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
            alert(`Removed from wishlist locally. ${response.message || 'Could not sync with server.'}`);
          }
        } catch (error) {
          console.error('Error removing from wishlist on backend:', error);
          // Still remove from local wishlist
          wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
          alert('Removed from wishlist locally. Could not sync with server.');
        }
      } else {
        // User not logged in or productId is not a valid ObjectId, just remove from local wishlist
        if (!isLoggedIn()) {
          console.log('User not logged in, wishlist item removed locally only');
        } else {
          console.log('Product ID is not a valid MongoDB ObjectId, removing locally only');
        }
        wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
      }
    } else {
      // Convert CategoryCardProps to ProductDataProps format
      const productData = {
        id: product.id,
        productName: product.title,
        productDescription: product.description || "",
        stars: product.stars || 4.5,
        reviews: 0,
        itemsSold: 0,
        price: product.price || 0,
        discountedPrice: product.discountedPrice || product.price || 0,
        discount: product.price && product.discountedPrice ? 
          Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0,
        inStock: true,
        isLike: false,
        images: [product.image],
        description: {
          title: product.description || "",
          moreDetails: []
        },
        review: []
      };
      
      // If user is logged in and productId is a valid MongoDB ObjectId, call API
      if (isLoggedIn() && isValidObjectId(productId)) {
        try {
          console.log('Adding to wishlist via API, productId:', productId);
          const response = await authApi.addToWishlist(productId);
          if (response.success) {
            console.log('Product added to wishlist successfully on backend');
            // Add to local wishlist after successful API call
            wishlistDispatch({ type: 'ADD_TO_WISHLIST', payload: productData });
          } else {
            console.error('Failed to add to wishlist:', response.message);
            // Still add to local wishlist
            wishlistDispatch({ type: 'ADD_TO_WISHLIST', payload: productData });
            alert(`Added to wishlist locally. ${response.message || 'Could not sync with server.'}`);
          }
        } catch (error) {
          console.error('Error adding to wishlist on backend:', error);
          // Still add to local wishlist
          wishlistDispatch({ type: 'ADD_TO_WISHLIST', payload: productData });
          alert('Added to wishlist locally. Could not sync with server.');
        }
      } else {
        // User not logged in or productId is not a valid ObjectId, just add to local wishlist
        if (!isLoggedIn()) {
          console.log('User not logged in, wishlist item saved locally only');
        } else {
          console.log('Product ID is not a valid MongoDB ObjectId, saving locally only');
        }
        wishlistDispatch({ type: 'ADD_TO_WISHLIST', payload: productData });
      }
    }
    
    setLoadingWishlist(null);
  };

  return (
    <div className="py-4 px-16">
      <Carousel
        opts={{ align: "start", loop: true }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {data.map((products: CategoryCardProps) => (
            <CarouselItem
              key={products.id}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Card
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="border border-[#f6ebc9] rounded-md overflow-hidden h-full flex flex-col p-2 sm:p-3"
              >
                <div className="relative w-full h-72 sm:h-80">
                  <Image
                    src={products.image}
                    alt={products.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <CardContent className="p-2 sm:p-3 flex flex-col gap-3">
                  <div className="flex flex-row justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm sm:text-base">
                        {highlightLastWord(products.title)}
                      </h4>
                      <p className="text-sm text-slate-400 font-medium mt-1">
                        <span className="text-[#d5a51a]">₹ </span>
                        {products.discountedPrice ? products.discountedPrice.toLocaleString() : products.price ? products.price.toLocaleString() : "N/A"}
                        {products.discountedPrice && products.price && products.discountedPrice < products.price && (
                          <span className="text-xs text-gray-500 line-through ml-2">
                            ₹{products.price.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                    <Button 
                      className="btn-outline w-28 text-sm"
                      onClick={() => handleAddToCart(products)}
                    >
                      Shop now <IoIosArrowForward />
                    </Button>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-[#d5a51a] hover:bg-[#b8941a] text-white"
                      onClick={() => handleAddToCart(products)}
                      disabled={loadingCart === products.id}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {loadingCart === products.id ? 'Adding...' : 'Add to Cart'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleWishlist(products)}
                      disabled={loadingWishlist === products.id}
                      className={`p-2 ${
                        wishlistState.items.some(item => item.id === products.id)
                          ? 'text-red-500 bg-red-50 border-red-200'
                          : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${
                        wishlistState.items.some(item => item.id === products.id) ? 'fill-current' : ''
                      }`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="btn-primary" />
        <CarouselNext className="btn-primary" />
      </Carousel>
    </div>
  );
};

export default ProductsCard;
