"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CategoryCardProps } from "@/interfaces";
import { Card, CardContent } from "@/components/ui/card";

interface ProductsCardProps {
  data: CategoryCardProps[];
}

const Cards: React.FC<ProductsCardProps> = ({ data }) => {
  const [likedItems, setLikedItems] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.map((product: CategoryCardProps) => {
        const isLiked = likedItems.includes(product.id);

        return (
          <Card
            key={product.id}
            className="rounded-xl overflow-hidden h-full flex flex-col border shadow-md hover:shadow-lg transition-shadow p-0"
          >
            <div className="relative w-full h-52 sm:h-56 md:h-60">
              <Link href={`/product/${product.id}`}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </Link>

              <div
                className="absolute top-2 right-2 rounded-full p-1 cursor-pointer transition-colors"
                onClick={() => toggleLike(product.id)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isLiked ? "fill-[#907373] text-[#907373]" : "text-[#907373]"
                  }`}
                />
              </div>

              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-[#FFF8E1] px-2 py-1 rounded-full">
                <Star className="h-4 w-4 fill-[#FFB800] text-[#FFB800]" />
                <span className="text-xs sm:text-sm font-medium">
                  {product.stars} | 10
                </span>
              </div>
            </div>

            <CardContent className="px-4 flex flex-col gap-2 flex-grow pb-4 pt-3">
              <h3 className="font-medium text-base sm:text-lg">
                <Link href={`/product/${product.id}`}>{product.title}</Link>
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mt-auto pt-2">
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  ₹ {product.discountedPrice?.toLocaleString()}
                </span>
                <span className="text-sm sm:text-base font-semibold">
                  Rs. {product.price?.toLocaleString()}
                </span>
              </div>

              <Button className="w-full mt-2 btn-primary text-xs sm:text-sm">
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Cards;
