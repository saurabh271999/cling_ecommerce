"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ProductDataProps } from '@/interfaces';
import { authApi, isLoggedIn } from '@/lib/api';

interface WishlistState {
  items: ProductDataProps[];
  totalItems: number;
}

type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: ProductDataProps }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: number }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: ProductDataProps[] };

const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
} | null>(null);

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
      const isAlreadyInWishlist = state.items.some(item => item.id === action.payload.id);
      
      if (isAlreadyInWishlist) {
        return state;
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
        totalItems: state.totalItems + 1
      };
    }
    
    case 'REMOVE_FROM_WISHLIST': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.length
      };
    }
    
    case 'CLEAR_WISHLIST':
      return {
        items: [],
        totalItems: 0
      };
    
    case 'LOAD_WISHLIST':
      return {
        items: action.payload,
        totalItems: action.payload.length
      };
    
    default:
      return state;
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    totalItems: 0
  });

  // Load wishlist from backend or localStorage on mount
  useEffect(() => {
    const loadWishlist = async () => {
      // If user is logged in, try to load from backend first
      if (isLoggedIn()) {
        try {
          const response = await authApi.getWishlist();
          if (response.success && response.data?.wishlist) {
            // Convert backend wishlist format to local format
            const wishlistItems = response.data.wishlist.map((product: any) => ({
              id: product._id || product.id,
              productName: product.name || product.productName || 'Product',
              productDescription: product.description || product.productDescription || '',
              stars: product.rating || 4.5,
              reviews: product.reviews?.length || 0,
              itemsSold: 0,
              price: product.originalPrice || product.price || 0,
              discountedPrice: product.price || product.discountedPrice || 0,
              discount: product.originalPrice && product.price ? 
                Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
              inStock: product.inStock !== false,
              isLike: false,
              images: product.images || [product.image] || [],
              description: {
                title: product.description || '',
                moreDetails: []
              },
              review: []
            }));
            dispatch({ type: 'LOAD_WISHLIST', payload: wishlistItems });
            return;
          }
        } catch (error) {
          console.error('Error loading wishlist from backend:', error);
          // Fall through to localStorage
        }
      }
      
      // Fallback to localStorage
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const wishlistData = JSON.parse(savedWishlist);
          dispatch({ type: 'LOAD_WISHLIST', payload: wishlistData });
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
        }
      }
    };

    loadWishlist();
  }, []);

  // Save wishlist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.items));
  }, [state.items]);

  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
