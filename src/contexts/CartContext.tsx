"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ProductDataProps } from '@/interfaces';
import { authApi, isLoggedIn } from '@/lib/api';

export interface CartItem {
  id: number;
  product: ProductDataProps;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: ProductDataProps }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.discountedPrice
        };
      } else {
        const newItem: CartItem = {
          id: action.payload.id,
          product: action.payload,
          quantity: 1
        };
        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.discountedPrice
        };
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (!itemToRemove) return state;
      
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.product.discountedPrice * itemToRemove.quantity)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const itemToUpdate = state.items.find(item => item.id === action.payload.id);
      if (!itemToUpdate) return state;
      
      const quantityDiff = action.payload.quantity - itemToUpdate.quantity;
      const priceDiff = itemToUpdate.product.discountedPrice * quantityDiff;
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalPrice: state.totalPrice + priceDiff
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    
    case 'LOAD_CART': {
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = action.payload.reduce((sum, item) => sum + (item.product.discountedPrice * item.quantity), 0);
      
      return {
        items: action.payload,
        totalItems,
        totalPrice
      };
    }
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0
  });

  // Load cart from backend or localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      // If user is logged in, try to load from backend first
      if (isLoggedIn()) {
        try {
          const response = await authApi.getCart();
          if (response.success && response.data?.cart) {
            // Convert backend cart format to local format
            const cartItems = response.data.cart.map((item: any) => ({
              id: item.product?._id || item.product?.id || item.product,
              product: {
                id: item.product?._id || item.product?.id || item.product,
                productName: item.product?.name || item.product?.productName || 'Product',
                productDescription: item.product?.description || item.product?.productDescription || '',
                stars: item.product?.rating || 4.5,
                reviews: item.product?.reviews?.length || 0,
                itemsSold: 0,
                price: item.product?.originalPrice || item.product?.price || 0,
                discountedPrice: item.product?.price || item.product?.discountedPrice || 0,
                discount: item.product?.originalPrice && item.product?.price ? 
                  Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100) : 0,
                inStock: item.product?.inStock !== false,
                isLike: false,
                images: item.product?.images || [item.product?.image] || [],
                description: {
                  title: item.product?.description || '',
                  moreDetails: []
                },
                review: []
              },
              quantity: item.quantity || 1
            }));
            dispatch({ type: 'LOAD_CART', payload: cartItems });
            return;
          }
        } catch (error) {
          console.error('Error loading cart from backend:', error);
          // Fall through to localStorage
        }
      }
      
      // Fallback to localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: cartData });
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
