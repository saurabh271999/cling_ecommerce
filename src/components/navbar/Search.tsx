"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchComponent = ({
  onToggle,
  isSearchActive,
}: {
  onToggle: () => void;
  isSearchActive: boolean;
}) => {
  return (
    <>
      <Search
        className="w-5 h-5 cursor-pointer hover:text-[#d3a212] transition-transform duration-300 ease-in-out"
        aria-label="Toggle Search"
        onClick={onToggle}
      />
      {isSearchActive && (
        <div className="md:hidden fixed left-1/2 transform -translate-x-1/2 w-full bg-[#f6ebc9] z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out animate-slide-in">
          <div className="flex items-center space-x-2">
            <Search
              size={30}
              aria-label="Toggle Search"
              onClick={onToggle}
              className="cursor-pointer hover:text-[#d3a212] transition-transform duration-300 ease-in-out"
            />
            <Input
              placeholder="Search..."
              className="w-full focus:outline-none focus:ring-2 focus:ring-[#d3a212] border-[#d3a212] placeholder:text-black"
            />
            <Button
              className="bg-[var(--golden-sand)] border-[#d3a212] hover:bg-[#d3a312e8]"
              onClick={onToggle}
            >
              Search
            </Button>
          </div>
        </div>
      )}
      {isSearchActive && (
        <div className="hidden md:flex items-center space-x-2">
          <Input
            placeholder="Search..."
            className="md:w-60 lg:w-96 focus:outline-none focus:ring-2 focus:ring-[#d3a212] border-[#d3a212] placeholder:text-black"
          />
          <Button
            className="bg-[var(--golden-sand)] border-[#d3a212] hover:bg-[#d3a312e8]"
            onClick={onToggle}
          >
            Search
          </Button>
        </div>
      )}
    </>
  );
};

export default SearchComponent;
