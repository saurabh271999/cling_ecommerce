"use client";
import "yet-another-react-lightbox/styles.css";

import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import productData from "@/constants/productData";
import SubTitles from "@/components/subTitles/SubTitles";
import newProductsData from "@/constants/newProductsData";
import ProductsCard from "@/components/cards/ProductsCard";

import { use } from "react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, Heart, Share2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PageProps {
  params: Promise<{ id: string }>; // Update type to reflect params as a Promise
}

const ProductPage = ({ params }: PageProps) => {
  // NOTE: use is a React API that lets you read the value of a resource like a Promise or context.
  const { id } = use(params); // Unwrap params with use()

  // Find the product based on the id parameter
  const product =
    productData.find((item) => item.id === parseInt(id)) || productData[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");
  const [showMore, setShowMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Create slides array for lightbox
  const slides = product.images.map((img) => ({
    src: img,
  }));

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };
  const handleImageSelect = (index: number) => setSelectedImage(index);

  return (
    <>
      <div className="max-w-7xl mx-auto h-full p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div className="rounded-md p-4 flex items-center justify-center">
              <Image
                src={product.images[selectedImage]}
                alt={product.productName}
                width={400}
                height={400}
                className="object-cover w-full h-[400px] rounded-md cursor-zoom-in"
                onClick={() => setIsOpen(true)}
              />
            </div>

            <Lightbox
              open={isOpen}
              close={() => setIsOpen(false)}
              slides={slides}
              index={selectedImage}
            />

            <Carousel className="w-full">
              <CarouselContent className="-ml-2">
                {product.images.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 basis-1/4 md:basis-1/5"
                  >
                    <div
                      className={cn(
                        "cursor-pointer overflow-hidden rounded border-2",
                        selectedImage === index
                          ? "border-[#d3a212]"
                          : "border-transparent"
                      )}
                      onClick={() => handleImageSelect(index)}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-[80px]"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 btn-primary" />
              <CarouselNext className="right-0 btn-primary" />
            </Carousel>
            {/* Indicator Dots */}
            <div className="flex justify-center gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full",
                    selectedImage === index ? "bg-[#d3a212]" : "bg-gray-300"
                  )}
                  onClick={() => handleImageSelect(index)}
                />
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <div className="mt-4">
              <h1 className="text-3xl font-medium">{product.productName}</h1>
              <p className="text-gray-600 mt-2">{product.productDescription}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(Math.floor(product.stars))].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#d3a212] text-[#d3a212]"
                  />
                ))}
                {product.stars % 1 !== 0 && (
                  <StarHalf className="w-5 h-5 fill-[#d3a212] text-[#d3a212]" />
                )}
                {[...Array(5 - Math.ceil(product.stars))].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#d3a212]" />
                ))}
              </div>
              <span className="text-gray-500">
                ({product.stars.toFixed(1)})
              </span>
              <span className="text-[#d3a212] font-medium">
                {product.reviews} reviews
              </span>
              <span className="text-gray-500">{product.itemsSold} sold</span>
            </div>
            <div className="flex items-center gap-3 border-t border-b py-4">
              <span className="text-xl font-bold">
                Rs. {product.discountedPrice}
              </span>
              <span className="text-gray-500 line-through">
                ₹ {product.price.toFixed(2)}
              </span>
              <span className="text-[#d3a212] font-medium">
                {product.discount}%off
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {product.inStock
                ? "In Stock | Dispatch in 3 working days"
                : "Out of Stock"}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Quantity</span>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  onClick={decrementQuantity}
                  disabled={!product.inStock}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  onClick={incrementQuantity}
                  disabled={!product.inStock}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 btn-outline"
                disabled={!product.inStock}
              >
                Add to Cart
              </Button>
              <Button
                className="flex-1 btn-primary"
                disabled={!product.inStock}
              >
                Buy Now
              </Button>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <button className="flex items-center gap-1">
                <Heart
                  className={cn(
                    "w-4 h-4",
                    product.isLike && "fill-red-500 text-red-500"
                  )}
                />
                Add Wishlist
              </button>
              <button className="flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                Find alternate products
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b overflow-x-auto">
            {["Description", "Overview", "Review", "Best seller"].map((tab) => (
              <button
                key={tab}
                className={cn(
                  "px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer",
                  activeTab === tab
                    ? "border-b-2 border-[#d3a212] text-[#d3a212]"
                    : "text-gray-600 hover:text-[#d3a212]"
                )}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === "Description" && (
              <div className="space-y-4">
                <p className="text-gray-700">{product.description.title}</p>
                <ul className="space-y-2">
                  {product.description.moreDetails
                    .slice(0, showMore ? undefined : 2)
                    .map((detail, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="min-w-4 mt-1">
                          <div className="w-4 h-4 bg-green-500 flex items-center justify-center rounded-md">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                </ul>
                {!showMore && product.description.moreDetails.length > 2 && (
                  <button
                    className="text-sm text-[#d3a212] cursor-pointer"
                    onClick={() => setShowMore(true)}
                  >
                    View more...
                  </button>
                )}
              </div>
            )}

            {activeTab === "Overview" && (
              <div className="py-4">
                <p className="text-gray-500 italic">
                  Over view information will be displayed here.
                </p>
              </div>
            )}

            {activeTab === "Review" && (
              <div className="space-y-4">
                <ol className="space-y-2 list-decimal list-inside">
                  {product.review.map((item, i) => (
                    <li key={i} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === "Best seller" && (
              <div className="py-4">
                <p className="text-gray-500 italic">
                  Best seller information will be displayed here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <SubTitles
          title="Suggested"
          description="Discover our top collections of unique, stylish, and high-quality products curated just for you."
        />
      </div>

      <ProductsCard data={newProductsData} />
    </>
  );
};

export default ProductPage;
