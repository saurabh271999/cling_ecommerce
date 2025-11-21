"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi, setToken, isLoggedIn } from "@/lib/api";

export default function LoginSignupModal() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  // OTP verification state
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [resendingOTP, setResendingOTP] = useState(false);
  const tokenProcessedRef = useRef(false);

  // Check for token in URL (from Google OAuth callback)
  useEffect(() => {
    if (typeof window !== "undefined" && !tokenProcessedRef.current) {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (token) {
        // Mark as processed to prevent multiple executions
        tokenProcessedRef.current = true;
        
        // Clean URL immediately to prevent multiple processing
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        // Store token (in both localStorage and cookie)
        setToken(token);
        // Fetch user data and store
        authApi.getCurrentUser().then((response) => {
          if (response.success && response.data?.user) {
            localStorage.setItem("shynora_user", JSON.stringify(response.data.user));
            setShowModal(false);
            // Trigger a custom event to notify other components
            window.dispatchEvent(new Event("userLoggedIn"));
            // Small delay before reload to ensure state is saved
            setTimeout(() => {
              window.location.reload();
            }, 100);
          } else {
            // If API call fails but we have token, still close modal
            console.error("Failed to fetch user data:", response.message);
            setShowModal(false);
            // Reload to update UI
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }
        }).catch((error) => {
          // If API call fails, still clean URL and close modal
          console.error("Error fetching user data:", error);
          setShowModal(false);
          // Reload to update UI
          setTimeout(() => {
            window.location.reload();
          }, 100);
        });
      }
    }
  }, []);

  // Check if user is already logged in on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Don't show modal if user is already logged in
      if (isLoggedIn()) {
        setShowModal(false);
      } else {
        setShowModal(true);
      }
    }
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!loginEmail || !loginPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.login(loginEmail, loginPassword);
      
      if (response.success && response.data) {
        // Store token (in both localStorage and cookie)
        setToken(response.data.token);
        // Store user data
        localStorage.setItem("shynora_user", JSON.stringify(response.data.user));
        setShowModal(false);
        // Trigger a custom event to notify other components
        window.dispatchEvent(new Event("userLoggedIn"));
        // Small delay before reload to ensure state is saved
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setError(response.message || "Login failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.signup(signupName, signupEmail, signupPassword);
      
      if (response.success) {
        // Show OTP verification
        setOtpEmail(signupEmail);
        setShowOTPVerification(true);
        setError("");
      } else {
        setError(response.message || "Signup failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.verifyOTP(otpEmail, otp);
      
      if (response.success && response.data) {
        // Store token (in both localStorage and cookie)
        setToken(response.data.token);
        // Store user data
        localStorage.setItem("shynora_user", JSON.stringify(response.data.user));
        setShowModal(false);
        // Trigger a custom event to notify other components
        window.dispatchEvent(new Event("userLoggedIn"));
        // Small delay before reload to ensure state is saved
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setError(response.message || "OTP verification failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setResendingOTP(true);

    try {
      const response = await authApi.resendOTP(otpEmail);
      
      if (response.success) {
        setError("");
        alert("OTP has been resent to your email");
      } else {
        setError(response.message || "Failed to resend OTP");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setResendingOTP(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    setGoogleLoading(true);
    // Redirect to Google OAuth
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    authApi.googleLogin(currentUrl);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setShowOTPVerification(false);
    setOtp("");
    setLoginEmail("");
    setLoginPassword("");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button with Glass Background */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/30 transition-all cursor-pointer shadow-lg"
          aria-label="Close modal"
          title="Close"
        >
          <X size={20} className="text-white drop-shadow-sm" />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              isLogin
                ? "text-[#d3a212] border-b-2 border-[#d3a212] bg-[#f6ebc9]/20"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              !isLogin
                ? "text-[#d3a212] border-b-2 border-[#d3a212] bg-[#f6ebc9]/20"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Google Login Button */}
          <div className="mb-4">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-3 py-2.5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* OTP Verification Form */}
          {showOTPVerification ? (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Email</h3>
                <p className="text-sm text-gray-600">
                  We&apos;ve sent a 6-digit OTP to <strong>{otpEmail}</strong>
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#d3a212] text-white hover:bg-[#b8900f] py-2"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendingOTP}
                  className="text-sm text-[#d3a212] hover:underline font-medium"
                >
                  {resendingOTP ? "Sending..." : "Resend OTP"}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowOTPVerification(false);
                    setOtp("");
                    setError("");
                  }}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Back to signup
                </button>
              </div>
            </form>
          ) : isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d3a212] text-white hover:bg-[#b8900f] py-2"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-[#d3a212] hover:underline font-medium"
                >
                  Sign Up
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="signup-name"
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d3a212] text-white hover:bg-[#b8900f] py-2"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-[#d3a212] hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

