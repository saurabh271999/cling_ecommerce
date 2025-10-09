"use client";

import Image from "next/image";
import popularCategoriesData from "@/constants/popularCategoriesData";

import { Button } from "@/components/ui/button";
import { CategoryCardProps } from "@/interfaces";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const CategoriesCard: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!api) return;

    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Set interval to auto-scroll every 3 seconds
    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [api]);

  return (
    <div className="py-4 px-16">
      <Carousel
        opts={{ align: "start", loop: true }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {popularCategoriesData.map((category: CategoryCardProps) => (
            <CarouselItem
              key={category.id}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="relative w-full h-[400px] rounded-md overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <Card className="bg-white bg-opacity-30 backdrop-blur-md p-4 rounded-lg">
                    <CardContent className="p-0">
                      <h3 className="text-xl font-bold uppercase mb-1 text-white">
                        {category.title}
                      </h3>
                      <p className="text-sm mb-3 text-white">
                        {category.description}
                      </p>
                      <Button className="btn-primary">Shop Now</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="btn-primary" />
        <CarouselNext className="btn-primary" />
      </Carousel>
    </div>
  );
};

export default CategoriesCard;
