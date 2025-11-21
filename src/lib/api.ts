const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface Address {
  _id?: string;
  type: "home" | "work" | "other";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface CartItem {
  product: any; // Product type can be defined later
  quantity: number;
  addedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  isEmailVerified: boolean;
  googleId?: string | null;
  addresses?: Address[];
  orders?: any[]; // Order type can be defined later
  wishlist?: any[]; // Product type can be defined later
  cart?: CartItem[]; // Cart items
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Set token in localStorage and cookie
export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    // Store in localStorage
    localStorage.setItem("token", token);
    
    // Store in cookie (expires in 30 days)
    const expires = new Date();
    expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }
};

// Remove token from localStorage and cookie
export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("shynora_user");
    
    // Remove cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("shynora_user");
    return !!(token && user);
  }
  return false;
};

// Make API request with authentication
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`API Request: ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body) : '');
    
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies in requests
    });

    console.log(`API Response: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    console.log('API Response data:', data);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "An error occurred",
        error: data.error,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Auth API functions
export const authApi = {
  // Signup
  signup: async (name: string, email: string, password: string): Promise<ApiResponse<{ userId: string; email: string }>> => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  // Resend OTP
  resendOTP: async (email: string): Promise<ApiResponse> => {
    return apiRequest("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Login
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    return apiRequest("/auth/current_user");
  },

  // Update user profile
  updateProfile: async (data: { name?: string; phone?: string; addresses?: Address[] }): Promise<ApiResponse<{ user: User }>> => {
    return apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    const result = await apiRequest("/auth/logout", {
      method: "POST",
    });
    if (result.success) {
      removeToken();
    }
    return result;
  },

  // Google OAuth - redirect to backend
  googleLogin: (redirectUrl?: string) => {
    const baseUrl = `${API_BASE_URL}/auth/google`;
    const url = redirectUrl 
      ? `${baseUrl}?redirect=${encodeURIComponent(redirectUrl)}`
      : baseUrl;
    window.location.href = url;
  },

  // Add to wishlist
  addToWishlist: async (productId: string): Promise<ApiResponse<{ wishlist: any[] }>> => {
    return apiRequest("/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  },

  // Remove from wishlist
  removeFromWishlist: async (productId: string): Promise<ApiResponse<{ wishlist: any[] }>> => {
    return apiRequest(`/wishlist/${productId}`, {
      method: "DELETE",
    });
  },

  // Get wishlist
  getWishlist: async (): Promise<ApiResponse<{ wishlist: any[] }>> => {
    return apiRequest("/wishlist", {
      method: "GET",
    });
  },

  // Add to cart
  addToCart: async (productId: string, quantity: number = 1): Promise<ApiResponse<{ cart: CartItem[] }>> => {
    return apiRequest("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  },

  // Update cart item quantity
  updateCartItem: async (productId: string, quantity: number): Promise<ApiResponse<{ cart: CartItem[] }>> => {
    return apiRequest(`/cart/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  },

  // Remove from cart
  removeFromCart: async (productId: string): Promise<ApiResponse<{ cart: CartItem[] }>> => {
    return apiRequest(`/cart/${productId}`, {
      method: "DELETE",
    });
  },

  // Clear cart
  clearCart: async (): Promise<ApiResponse<{ cart: CartItem[] }>> => {
    return apiRequest("/cart", {
      method: "DELETE",
    });
  },

  // Get cart
  getCart: async (): Promise<ApiResponse<{ cart: CartItem[] }>> => {
    return apiRequest("/cart", {
      method: "GET",
    });
  },
};

