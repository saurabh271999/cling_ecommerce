"use client";

import Link from "next/link";
// import Image from "next/image";
import SearchComponent from "./Search";
// import ShynoraLogo from "@/assets/logo/Shynora.png";

import { useState } from "react";
import { User, ShoppingBag, X, AlignCenter, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleSearch = () => setIsSearchActive((prev) => !prev);

  return (
    <nav role="navigation" className="fixed w-full top-0 z-50 bg-[#f6ebc9]">
      <div className="flex items-center justify-between px-4 py-4 mx-auto md:px-3 lg:px-12">
        <div className="flex items-center">
          <Link href="/">
            {/* <Image
              src={ShynoraLogo}
              alt="Shynora Logo"
              width={100}
              height={50}
              className="h-auto"
            /> */}
            <h1 className="text-2xl font-bold text-[#d3a212]">Shynora</h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4 lg:space-x-12 text-md font-medium">
          <SearchComponent
            onToggle={toggleSearch}
            isSearchActive={isSearchActive}
          />
          {!isSearchActive && (
            <>
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
              <Link href="/watches" className="hover:underline">
                Watches
              </Link>
            </>
          )}
        </div>

        {/* Desktop right-side content */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/profile">
            <User
              className="w-5 h-5 cursor-pointer hover:text-[#d3a212]"
              aria-label="User Profile"
            />
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingBag
              className="w-5 h-5 cursor-pointer hover:text-[#d3a212]"
              aria-label="Shopping Bag"
            />
            {cartState.totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartState.totalItems}
              </span>
            )}
          </Link>
          <Link href="/wishlist" className="relative">
            <Heart
              className="w-5 h-5 cursor-pointer hover:text-[#d3a212]"
              aria-label="Wishlist"
            />
            {wishlistState.totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistState.totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile-only icons + hamburger */}
        <div className="flex items-center space-x-4 md:hidden">
          {!isMobileMenuOpen && (
            <>
              <SearchComponent
                onToggle={toggleSearch}
                isSearchActive={isSearchActive}
              />
              <Link href="/profile">
                <User
                  className="w-5 h-5 cursor-pointer hover:text-[#d3a212]"
                  aria-label="User Profile"
                />
              </Link>
              <Link href="/cart" className="relative">
                <ShoppingBag
                  className="w-5 h-5 cursor-pointer hover:text-[#d3a212]"
                  aria-label="Shopping Bag"
                />
                {cartState.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartState.totalItems}
                  </span>
                )}
              </Link>
              <Link href="/wishlist" className="relative">
                <Heart
                  className="w-5 h-5 cursor-pointer hover:text-[#d3a212]"
                  aria-label="Wishlist"
                />
                {wishlistState.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistState.totalItems}
                  </span>
                )}
              </Link>
            </>
          )}
          <button
            onClick={toggleMobileMenu}
            className="p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#d1a413] transition ease-in-out delay-150 hover:translate-x-1 hover:scale-110 duration-300" />
            ) : (
              <AlignCenter className="w-6 h-6 text-[#d1a413] transition ease-in-out delay-150 hover:translate-x-1 hover:scale-110 duration-300" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed h-screen top-[72px] left-0 right-0 bg-gradient-to-b from-[#f6ebc9] to-[#d4a315] px-6 py-2 md:hidden z-50 shadow-lg animate-slide-in">
          <div className="flex flex-col items-end space-y-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-poppins text-xl hover:text-gold-400 hover:scale-105 transition-transform duration-200"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-poppins text-xl hover:text-gold-400 hover:scale-105 transition-transform duration-200"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-poppins text-xl hover:text-gold-400 hover:scale-105 transition-transform duration-200"
            >
              Contact Us
            </Link>
            <Link
              href="/watches"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-poppins text-xl hover:text-gold-400 hover:scale-105 transition-transform duration-200"
            >
              Watches
            </Link>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
