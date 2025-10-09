"use client";

import Image from "next/image";
import cutleryBanner from "@/assets/banners/cutleryBanner.png";

import { Button } from "@/components/ui/button";

const CutleryBanner = () => {
  return (
    <div className="relative overflow-hidden mt-8">
      <div className="w-full overflow-hidden">
        <Image
          src={cutleryBanner}
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover animate-scaleContinuous"
          alt="banner"
          priority
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, #3F310680 50%, transparent)",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center p-2 sm:p-4 w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-1 sm:mb-2 md:mb-4">
          unique kitchen ware
        </h1>
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 md:mb-4">
          Get Discount Off 50%
        </h3>
        <div className="flex justify-center gap-1 sm:gap-2 md:gap-4 pt-2 sm:pt-4 md:pt-6">
          <Button size="lg" className="btn-primary text-sm md:text-base">
            Find Out More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CutleryBanner;
