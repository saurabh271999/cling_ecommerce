"use client";

import Image from "next/image";
import Gradient from "@/assets/banners/Gradient.png";
import ctaBanner from "@/assets/banners/ctaBanner.png";
import lighterBanner from "@/assets/banners/lighterBanner.png";
import kitchenwareBanner from "@/assets/banners/kitchenwareBanner.png";
import rareUtensilBanner from "@/assets/banners/rareUtensilBanner.png";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const bannerImages = [
  {
    id: 1,
    image: ctaBanner,
    title: "Discover the rare. Own the unique.",
    alt: "Luxury items banner",
  },
  {
    id: 2,
    image: kitchenwareBanner,
    title: "Discover the rare. Own the unique.",
    alt: "Luxury items banner",
  },
  {
    id: 3,
    image: rareUtensilBanner,
    title: "Discover the rare. Own the unique.",
    alt: "Luxury items banner",
  },
  {
    id: 4,
    image: lighterBanner,
    title: "Discover the rare. Own the unique.",
    alt: "Luxury items banner",
  },
];

const CtaBanner = ({ startIndex = 1 }: { startIndex?: number }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex - 1);
  const [api, setApi] = useState<CarouselApi>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!api) return;

    const onChange = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", onChange);

    return () => {
      api.off("select", onChange);
    };
  }, [api]);

  useEffect(() => {
    if (api) {
      api.scrollTo(startIndex - 1);
    }
  }, [api, startIndex]);

  useEffect(() => {
    if (!api) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api]);

  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent>
          {bannerImages.map((banner) => (
            <CarouselItem key={banner.id} className="w-full">
              <div className="relative w-full overflow-hidden">
                <Image
                  src={banner.image}
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-auto object-cover animate-scaleContinuous"
                  alt={banner.alt}
                  priority
                />
                <Image
                  src={Gradient}
                  className="absolute top-0 left-0 w-full h-full"
                  alt="overlay"
                  priority
                />
                <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-16 text-white p-4 md:p-0">
                  <h1 className="text-4xl md:text-5xl lg:text-7xl pb-14 md:py-8 font-bold mb-2 md:mb-4">
                    {banner.title}
                  </h1>
                  <div className="flex gap-2 md:gap-4 pt-4 md:pt-12">
                    <Button
                      size="lg"
                      className="btn-primary text-sm md:text-base"
                    >
                      Shop Now
                    </Button>
                    <Button
                      size="lg"
                      className="btn-white text-sm md:text-base"
                    >
                      Get in Touch
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Indicator dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-1.5 md:gap-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-white scale-110" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CtaBanner;
