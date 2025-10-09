"use client";

import Image from "next/image";
import Gradient from "@/assets/banners/Gradient.png";
import aboutUsBanner from "@/assets/banners/AboutUsBanner.png";

import { Button } from "@/components/ui/button";

const AboutUsBanner = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="w-full overflow-hidden">
        <Image
          src={aboutUsBanner}
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-auto object-cover animate-scaleContinuous"
          alt="banner"
          priority
        />
      </div>
      <Image
        src={Gradient}
        className="absolute top-0 left-0 w-full h-full"
        alt="overlay"
        priority
      />
      <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-16 text-white p-4 md:p-0">
        <h1 className="text-4xl md:text-5xl lg:text-7xl pb-14 md:py-8 font-bold mb-2 md:mb-4">
          About Us
        </h1>
        <h3 className="text-lg text-slate-200 sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 md:mb-4">
          Designed for Those Who Appreciate the Finer Things
        </h3>
        <div className="flex gap-2 md:gap-4 pt-4 md:pt-12">
          <Button size="lg" className="btn-primary text-sm md:text-base">
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsBanner;
