"use client";

import testimonialBG from "@/assets/banners/testimonialBG.png";

import { TestimonialProps } from "@/interfaces";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const data: TestimonialProps[] = [
  {
    id: 1,
    name: "Angela H.",
    avatar:
      "https://res.cloudinary.com/shobhit-test/image/upload/v1725349999/memoir/avatar/gqukiqcko0guyfiwgj4o.jpg",
    designation: "Hospitality Manager",
    review:
      "⭐Discover our top collections of unique, stylish, and high-quality products curated just for you.",
    stars: "3",
  },
  {
    id: 2,
    name: "Saul Goodman",
    avatar:
      "https://res.cloudinary.com/shobhit-test/image/upload/v1726744531/memoir/avatar/fii7qkao2d16tyykqtz6.png",
    designation: "Hospitality Manager",
    review:
      "⭐Discover our top collections of unique, stylish, and high-quality products curated just for you.",
    stars: "4",
  },
  {
    id: 3,
    name: "Lalo Salamanca",
    avatar:
      "https://res.cloudinary.com/shobhit-test/image/upload/v1726561841/memoir/avatar/jivwvdsdthduutdqb8wq.webp",
    designation: "Cartel",
    review:
      "⭐Discover our top collections of unique, stylish, and high-quality products curated just for you.",
    stars: "5",
  },
  {
    id: 4,
    name: "Angela Yu",
    avatar:
      "https://res.cloudinary.com/shobhit-test/image/upload/v1726487720/memoir/avatar/k2yvav9ysurivarp3lxz.jpg",
    designation: "Instructor",
    review:
      "⭐Discover our top collections of unique, stylish, and high-quality products curated just for you.",
    stars: "5",
  },
  {
    id: 6,
    name: "Angela H.",
    avatar:
      "https://res.cloudinary.com/shobhit-test/image/upload/v1725349999/memoir/avatar/gqukiqcko0guyfiwgj4o.jpg",
    designation: "Hospitality Manager",
    review:
      "⭐Discover our top collections of unique, stylish, and high-quality products curated just for you.",
    stars: "3",
  },
  {
    id: 5,
    name: "Saul Goodman",
    avatar:
      "https://res.cloudinary.com/shobhit-test/image/upload/v1726744531/memoir/avatar/fii7qkao2d16tyykqtz6.png",
    designation: "Hospitality Manager",
    review:
      "⭐Discover our top collections of unique, stylish, and high-quality products curated just for you.",
    stars: "4",
  },
  {
    id: 7,
    name: "Lalo Salamanca",
    avatar:
      "https://res.cloudinary.com/shobhit-test/image/upload/v1726561841/memoir/avatar/jivwvdsdthduutdqb8wq.webp",
    designation: "Cartel",
    review:
      "⭐Discover our top collections of unique, stylish, and high-quality products curated just for you.",
    stars: "5",
  },
  {
    id: 8,
    name: "Angela Yu",
    avatar:
      "https://res.cloudinary.com/shobhit-test/image/upload/v1726487720/memoir/avatar/k2yvav9ysurivarp3lxz.jpg",
    designation: "Instructor",
    review:
      "⭐Discover our top collections of unique, stylish, and high-quality products curated just for you.",
    stars: "5",
  },
];

const Testimonial: React.FC = () => {
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
    <div className="relative w-8/9 md:w-4/5 mx-auto py-6 md:py-10 px-4 md:px-6">
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#D3A212] to-[#F4C430] rounded-lg opacity-90"
        style={{ backgroundImage: `url(${testimonialBG.src})` }}
      />
      <div className="absolute inset-0 rounded-lg bg-cover bg-center opacity-20" />
      <Carousel
        opts={{ align: "start", loop: true }}
        setApi={setApi}
        className="w-full pl-6 pr-6 md:pl-10 md:pr-10"
      >
        <CarouselContent className="px-6">
          {data.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-full md:basis-1/2 lg:basis-1/3 py-2"
            >
              <Card className="border-none rounded-xl bg-white m-2 md:m-6">
                <CardContent className="p-3 md:p-6">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#f4c430] overflow-hidden">
                        <Avatar className="w-full h-full">
                          <AvatarImage src={item.avatar} alt={item.name} />
                          <AvatarFallback>
                            {item.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    <div className="ml-3 md:ml-4 flex flex-col justify-center overflow-hidden">
                      <p className="text-base md:text-lg font-semibold">
                        {item.name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-700">
                        {item.designation}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <p className="text-xs md:text-sm text-gray-800 leading-relaxed">
                      {item.review}
                    </p>
                  </div>

                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4 md:w-5 md:h-5 mr-1"
                        fill={
                          star <= parseInt(item.stars) ? "#f4c430" : "#d1d5db"
                        }
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="-left-2" />
        <CarouselNext className="-right-2" />
      </Carousel>
    </div>
  );
};

export default Testimonial;
