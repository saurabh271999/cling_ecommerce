"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Package, Calendar, CheckCircle, Clock, XCircle, Edit2, Save, Heart, Plus, Trash2, LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi, getToken, isLoggedIn, type User as UserType, type Address } from "@/lib/api";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import ctaBanner from "@/assets/banners/ctaBanner.png";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

interface Order {
  id: string;
  date: string;
  status: "Completed" | "Processing" | "Cancelled" | "Pending";
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    addresses: [],
  });
  const [userData, setUserData] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    type: "home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    isDefault: false,
  });
  const { dispatch: cartDispatch } = useCart();
  const { dispatch: wishlistDispatch } = useWishlist();

  // Load user data from API and localStorage
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError("");

      // First, try to get user from API
      const token = getToken();
      if (token) {
        try {
          const response = await authApi.getCurrentUser();
          if (response.success && response.data?.user) {
            const user = response.data.user;
            setUserData(user);
            setProfile({
              name: user.name || "",
              email: user.email || "",
              phone: user.phone || "",
              addresses: user.addresses || [],
            });
            // Set orders and wishlist from API
            const apiOrders = user.orders || [];
            setOrders(apiOrders);
            setWishlist(user.wishlist || []);
            // Update localStorage with fresh data
            localStorage.setItem("shynora_user", JSON.stringify(user));
            
            // Fallback to localStorage orders if API doesn't have them
            if (apiOrders.length === 0) {
    const ordersData = localStorage.getItem("shynora_orders");
              if (ordersData) {
                try {
                  const localOrders = JSON.parse(ordersData);
                  setOrders(localOrders);
                } catch {
                  // Ignore parse errors
                }
              }
            }
          } else {
            // If API fails, try localStorage
            const userDataStr = localStorage.getItem("shynora_user");
            if (userDataStr) {
              const user = JSON.parse(userDataStr);
              setUserData(user);
              setProfile({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                addresses: user.addresses || [],
              });
              setOrders(user.orders || []);
              setWishlist(user.wishlist || []);
            }
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          // Fallback to localStorage
          const userDataStr = localStorage.getItem("shynora_user");
          if (userDataStr) {
            const user = JSON.parse(userDataStr);
            setUserData(user);
            setProfile({
        name: user.name || "",
        email: user.email || "",
              phone: user.phone || "",
              addresses: user.addresses || [],
            });
            setOrders(user.orders || []);
            setWishlist(user.wishlist || []);
          }
        }
    } else {
        // No token, try localStorage
        const userDataStr = localStorage.getItem("shynora_user");
        if (userDataStr) {
          const user = JSON.parse(userDataStr);
          setUserData(user);
          setProfile({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            addresses: user.addresses || [],
          });
          setOrders(user.orders || []);
          setWishlist(user.wishlist || []);
        }
      }

      setLoading(false);
    };

    loadUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (index: number, field: keyof Address, value: string | boolean) => {
    setProfile((prev) => {
      const newAddresses = [...prev.addresses];
      newAddresses[index] = { ...newAddresses[index], [field]: value };
      
      // If setting as default, unset all other addresses
      if (field === "isDefault" && value === true) {
        newAddresses.forEach((addr, i) => {
          if (i !== index) {
            addr.isDefault = false;
          }
        });
      }
      
      return { ...prev, addresses: newAddresses };
    });
  };

  const handleNewAddressChange = (field: keyof Address, value: string | boolean) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAddress = () => {
    setProfile((prev) => {
      const newAddresses = [...prev.addresses];
      const addressToAdd = { ...newAddress };
      
      // If setting as default, unset all other addresses
      if (addressToAdd.isDefault) {
        newAddresses.forEach((addr) => {
          addr.isDefault = false;
        });
      }
      
      newAddresses.push(addressToAdd);
      return { ...prev, addresses: newAddresses };
    });
    setNewAddress({
      type: "home",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      isDefault: false,
    });
    setShowAddAddress(false);
  };

  const handleRemoveAddress = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }));
  };

  // Handle adding product from wishlist to cart
  const handleAddToCartFromWishlist = async (item: any) => {
    // Convert backend product format to local cart format
    const productData = {
      id: item._id || item.id,
      productName: item.name || item.productName || "Product",
      productDescription: item.description || item.productDescription || "",
      stars: item.rating || 4.5,
      reviews: item.reviews?.length || 0,
      itemsSold: 0,
      price: item.price || item.originalPrice || 0,
      discountedPrice: item.price || item.discountedPrice || 0,
      discount: item.originalPrice && item.price ? 
        Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0,
      inStock: item.inStock !== false,
      isLike: false,
      images: item.images || [item.image] || [],
      description: {
        title: item.description || "",
        moreDetails: []
      },
      review: []
    };
    
    cartDispatch({ type: 'ADD_TO_CART', payload: productData });
    
    // Sync with backend if logged in
    if (isLoggedIn() && (item._id || item.id)) {
      try {
        const productId = (item._id || item.id).toString();
        await authApi.addToCart(productId, 1);
      } catch (error) {
        console.error('Error adding to cart on backend:', error);
      }
    }
  };

  // Handle removing product from wishlist
  const handleRemoveFromWishlist = async (item: any) => {
    const productId = item._id || item.id;
    
    // Remove from local wishlist context
    if (productId) {
      wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    }
    
    // Update local state
    setWishlist((prev) => prev.filter((w) => (w._id || w.id) !== productId));
    
    // Sync with backend if logged in
    if (isLoggedIn() && productId) {
      try {
        await authApi.removeFromWishlist(productId.toString());
        // Reload user data to get updated wishlist
        const response = await authApi.getCurrentUser();
        if (response.success && response.data?.user) {
          setWishlist(response.data.user.wishlist || []);
        }
      } catch (error) {
        console.error('Error removing from wishlist on backend:', error);
      }
    }
  };

  const handleSave = async () => {
    setError("");
    setLoading(true);
    
    try {
      // Ensure only one address is default
      const addressesToSave = profile.addresses.map((addr) => {
        // Find if this is the first default address
        const isFirstDefault = profile.addresses.findIndex(a => a.isDefault) === profile.addresses.indexOf(addr);
        return {
          type: addr.type || "home",
          street: addr.street || "",
          city: addr.city || "",
          state: addr.state || "",
          zipCode: addr.zipCode || "",
          country: addr.country || "India",
          isDefault: addr.isDefault && isFirstDefault,
        };
      });

      console.log("Saving profile with addresses:", addressesToSave);

      const response = await authApi.updateProfile({
        name: profile.name,
        phone: profile.phone,
        addresses: addressesToSave,
      });

      console.log("Update profile response:", response);

      if (response.success && response.data?.user) {
        const updatedUser = response.data.user;
        setUserData(updatedUser);
        setProfile({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          addresses: updatedUser.addresses || [],
        });
        localStorage.setItem("shynora_user", JSON.stringify(updatedUser));
        setIsEditing(false);
        setError("");
        // Show success message
        alert("Profile updated successfully!");
      } else {
        const errorMsg = response.message || response.error || "Failed to update profile";
        setError(errorMsg);
        console.error("Update profile failed:", response);
      }
    } catch (err) {
      setError("An error occurred while saving. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      try {
        await authApi.logout();
        // Clear all user data
        localStorage.removeItem("shynora_user");
        localStorage.removeItem("shynora_profile");
        localStorage.removeItem("shynora_orders");
        // Redirect to home page
        window.location.href = "/";
      } catch (err) {
        console.error("Error logging out:", err);
        // Still clear local data and redirect even if API call fails
        localStorage.removeItem("shynora_user");
        localStorage.removeItem("shynora_profile");
        localStorage.removeItem("shynora_orders");
        window.location.href = "/";
      }
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="text-green-600" size={20} />;
      case "Processing":
        return <Clock className="text-blue-600" size={20} />;
      case "Cancelled":
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Clock className="text-yellow-600" size={20} />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d3a212] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!isLoggedIn() && !profile.email) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <Button
            onClick={() => window.location.href = "/"}
            className="bg-[#d3a212] text-white hover:bg-[#b8900f]"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="text-[#d3a212]" size={24} />
                  Personal Information
                </CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#d3a212] hover:bg-[#b8900f]"
                  >
                    <Save size={16} />
                    {loading ? "Saving..." : "Save"}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.name || "Not set"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      Email
                    </label>
                    <p className="text-gray-900">{profile.email || "Not set"}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      placeholder="+91 1234567890"
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone || "Not set"}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Address Information Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-[#d3a212]" size={24} />
                  Addresses
                </CardTitle>
                {isEditing && (
                  <Button
                    size="sm"
                    onClick={() => setShowAddAddress(true)}
                    className="flex items-center gap-2 bg-[#d3a212] hover:bg-[#b8900f]"
                  >
                    <Plus size={16} />
                    Add Address
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No addresses added yet</p>
                    {isEditing && (
                      <Button
                        onClick={() => setShowAddAddress(true)}
                        className="mt-4 bg-[#d3a212] hover:bg-[#b8900f]"
                      >
                        Add Your First Address
                      </Button>
                    )}
                  </div>
                ) : (
                  profile.addresses.map((address, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-[#d3a212]/10 text-[#d3a212] rounded text-xs font-medium uppercase">
                            {address.type}
                          </span>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAddress(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b">
                            <input
                              type="checkbox"
                              checked={address.isDefault || false}
                              onChange={(e) => handleAddressChange(index, "isDefault", e.target.checked)}
                              className="rounded"
                              id={`default-${index}`}
                            />
                            <label htmlFor={`default-${index}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                              Use this address as default
                            </label>
                          </div>
                <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                    <Input
                              value={address.street || ""}
                              onChange={(e) => handleAddressChange(index, "street", e.target.value)}
                      placeholder="123 Main Street"
                      className="w-full"
                    />
                </div>
                          <div className="grid md:grid-cols-2 gap-3">
                  <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                      <Input
                                value={address.city || ""}
                                onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                        placeholder="Mumbai"
                        className="w-full"
                      />
                  </div>
                  <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                      <Input
                                value={address.state || ""}
                                onChange={(e) => handleAddressChange(index, "state", e.target.value)}
                        placeholder="Maharashtra"
                        className="w-full"
                      />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP Code
                              </label>
                              <Input
                                value={address.zipCode || ""}
                                onChange={(e) => handleAddressChange(index, "zipCode", e.target.value)}
                                placeholder="400001"
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country
                              </label>
                              <Input
                                value={address.country || "India"}
                                onChange={(e) => handleAddressChange(index, "country", e.target.value)}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-700">
                          <p>{address.street || "Not set"}</p>
                          <p>
                            {address.city || ""} {address.state || ""} {address.zipCode || ""}
                          </p>
                          <p>{address.country || "India"}</p>
                        </div>
                    )}
                  </div>
                  ))
                )}

                {/* Add New Address Form */}
                {showAddAddress && isEditing && (
                  <div className="border-2 border-dashed border-[#d3a212] rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-3">Add New Address</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Type
                      </label>
                      <select
                        value={newAddress.type}
                        onChange={(e) => handleNewAddressChange("type", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                    </label>
                      <Input
                        value={newAddress.street}
                        onChange={(e) => handleNewAddressChange("street", e.target.value)}
                        placeholder="123 Main Street"
                        className="w-full"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <Input
                          value={newAddress.city}
                          onChange={(e) => handleNewAddressChange("city", e.target.value)}
                          placeholder="Mumbai"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <Input
                          value={newAddress.state}
                          onChange={(e) => handleNewAddressChange("state", e.target.value)}
                          placeholder="Maharashtra"
                          className="w-full"
                        />
                  </div>
                </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <Input
                          value={newAddress.zipCode}
                          onChange={(e) => handleNewAddressChange("zipCode", e.target.value)}
                          placeholder="400001"
                          className="w-full"
                        />
                      </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <Input
                          value={newAddress.country}
                          onChange={(e) => handleNewAddressChange("country", e.target.value)}
                      className="w-full"
                    />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pb-2 border-b">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) => handleNewAddressChange("isDefault", e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Use this address as default</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddAddress}
                        className="bg-[#d3a212] hover:bg-[#b8900f]"
                      >
                        Add Address
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddAddress(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order History Card */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="text-[#d3a212]" size={24} />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div
                        key={order.id || index}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="font-semibold text-sm">{order.id || `Order ${index + 1}`}</span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Calendar size={14} />
                          <span>{order.date ? new Date(order.date).toLocaleDateString() : "N/A"}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? "s" : ""}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Total:</span>
                          <span className="text-lg font-bold text-[#d3a212]">
                            ₹{order.total?.toLocaleString() || "0"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Wishlist Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-[#d3a212]" size={24} />
                  Wishlist ({wishlist.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wishlist.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your wishlist is empty</p>
                    <p className="text-sm text-gray-400 mt-2">Add products to your wishlist to see them here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item, index) => {
                      // Handle both backend API format (populated product) and local format
                      const productName = item.name || item.productName || "Product";
                      const productDescription = item.description || item.productDescription || "";
                      const productPrice = item.price || item.discountedPrice || 0;
                      const originalPrice = item.originalPrice || item.price || 0;
                      const productImages = item.images || (item.image ? [item.image] : []);
                      const productId = item._id || item.id;
                      const inStock = item.inStock !== false;
                      
                      return (
                        <div
                          key={productId || index}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          {/* Product Image */}
                          <div className="relative w-full h-48 bg-gray-100">
                            <Image
                              src={productImages[0] || ctaBanner.src}
                              alt={productName}
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
                              onClick={() => handleRemoveFromWishlist(item)}
                              className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          
                          {/* Product Details */}
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                              {productName}
                            </h4>
                            {productDescription && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {productDescription}
                              </p>
                            )}
                            
                            {/* Price */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg font-bold text-[#d3a212]">
                                ₹{productPrice.toLocaleString()}
                              </span>
                              {originalPrice > productPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* Stock Status */}
                            <div className="mb-3">
                              {inStock ? (
                                <span className="text-sm text-green-600 font-medium">In Stock</span>
                              ) : (
                                <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                              <Button
                                className="w-full bg-[#d3a212] hover:bg-[#b8900f] text-white"
                                onClick={() => handleAddToCartFromWishlist(item)}
                                disabled={!inStock}
                                size="sm"
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order History Details (Full View) */}
        {orders.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="text-[#d3a212]" size={24} />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Calendar size={14} />
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                        <p className="text-lg font-bold text-[#d3a212] mt-2">
                          ₹{order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Items:</h4>
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded"
                        >
                          <span className="text-gray-700">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

