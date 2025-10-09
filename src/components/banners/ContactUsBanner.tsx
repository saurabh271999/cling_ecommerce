"use client";

import Image from "next/image";
import Gradient from "@/assets/banners/Gradient.png";
import contactUsBanner from "@/assets/banners/ContactUsBanner.png";

const ContactUsBanner = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="w-full overflow-hidden">
        <Image
          src={contactUsBanner}
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center p-2 sm:p-4 w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-1 sm:mb-2 md:mb-4">
          Contact us
        </h1>
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 md:mb-4 pt-4">
          &quot;Have questions or need assistance? Contact us—we’re always here
          to help!&quot;
        </h3>
      </div>
    </div>
  );
};

export default ContactUsBanner;
