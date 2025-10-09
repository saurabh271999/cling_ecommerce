import React from "react";
import Link from "next/link";
import Image from "next/image";

import { CategoryItemProps } from "@/interfaces";

import circle1 from "@/assets/circleCardImages/circle1.png";
import circle2 from "@/assets/circleCardImages/circle2.jpeg";
import circle3 from "@/assets/circleCardImages/circle3.png";
import circle4 from "@/assets/circleCardImages/circle4.jpeg";
import circle5 from "@/assets/circleCardImages/circle5.png";
import circle6 from "@/assets/circleCardImages/circle6.png";

const data: CategoryItemProps[] = [
  {
    id: 1,
    name: "Shop all",
    image: circle1.src,
    route: "/",
  },
  {
    id: 2,
    name: "Kitchen ware",
    image: circle2.src,
    route: "/kitchenware",
  },
  {
    id: 3,
    name: "Rare utensils",
    image: circle3.src,
    route: "/rare-utensils",
  },
  {
    id: 4,
    name: "lighters",
    image: circle4.src,
    route: "/lighters",
  },
  {
    id: 5,
    name: "Unique watch",
    image: circle5.src,
    route: "/unique-watch",
  },
  {
    id: 6,
    name: "Home Essentials",
    image: circle6.src,
    route: "/home-essentials",
  },
];

interface CategoryCardProps {
  item: CategoryItemProps;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ item }) => {
  return (
    <Link href={`${item.route}`} className="flex flex-col items-center">
      <div className="bg-[#f9f3e1] rounded-full p-2 mb-2 relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 flex items-center justify-center overflow-hidden">
        <Image
          sizes="24"
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded-full"
        />
      </div>
      <h3 className="text-center text-sm sm:text-base font-medium mt-2">
        {item.name}
      </h3>
    </Link>
  );
};

const CircleCard: React.FC = () => {
  return (
    <div className="w-full py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {data.map((item) => (
            <div key={item.id} className="flex justify-center">
              <CategoryCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CircleCard;
