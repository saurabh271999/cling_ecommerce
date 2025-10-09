import Cards from "@/components/cards/Cards";
import CircleCard from "@/components/cards/CircleCard";
import bannerImg from "@/assets/circleCardImages/circle2.jpeg";
import KitchenwareBanner from "@/components/banners/CtaBanner";

import type { CategoryCardProps } from "@/interfaces";

const data: CategoryCardProps[] = [
  {
    id: 1,
    image: bannerImg.src,
    title: "kitchen ware",
    stars: 3,
    description:
      "Discover rare, stylish, and expertly crafted watches designed for true individuality.",
    price: 1200,
    discountedPrice: 2000,
  },
  {
    id: 2,
    image: bannerImg.src,
    title: "kitchen ware",
    stars: 5,
    description:
      "Discover rare, stylish, and expertly crafted watches designed for true individuality.",
    price: 1200,
    discountedPrice: 2000,
  },
  {
    id: 3,
    image: bannerImg.src,
    title: "kitchen ware",
    stars: 7,
    description:
      "Discover rare, stylish, and expertly crafted watches designed for true individuality.",
    price: 1200,
    discountedPrice: 2000,
  },
  {
    id: 4,
    image: bannerImg.src,
    title: "kitchen ware",
    stars: 4.5,
    description:
      "Discover rare, stylish, and expertly crafted watches designed for true individuality.",
    price: 1200,
    discountedPrice: 2000,
  },
  {
    id: 5,
    image: bannerImg.src,
    title: "kitchen ware",
    stars: 4.5,
    description:
      "Discover rare, stylish, and expertly crafted watches designed for true individuality.",
    price: 1200,
    discountedPrice: 2000,
  },
  {
    id: 6,
    image: bannerImg.src,
    title: "kitchen ware",
    stars: 4.5,
    description:
      "Discover rare, stylish, and expertly crafted watches designed for true individuality.",
    price: 1200,
    discountedPrice: 2000,
  },
  {
    id: 7,
    image: bannerImg.src,
    title: "kitchen ware",
    stars: 4.5,
    description:
      "Discover rare, stylish, and expertly crafted watches designed for true individuality.",
    price: 1200,
    discountedPrice: 2000,
  },
  {
    id: 81,
    image: bannerImg.src,
    title: "kitchen ware",
    stars: 4.5,
    description:
      "Discover rare, stylish, and expertly crafted watches designed for true individuality.",
    price: 1200,
    discountedPrice: 2000,
  },
  {
    id: 9,
    image: bannerImg.src,
    title: "kitchen ware",
    stars: 4.5,
    description:
      "Discover rare, stylish, and expertly crafted watches designed for true individuality.",
    price: 1200,
    discountedPrice: 2000,
  },
];

const Kitchenware = () => {
  return (
    <>
      <KitchenwareBanner startIndex={2} />
      <CircleCard />
      <div className="mt-8 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <h1 className="text-2xl sm:text-3xl font-semibold">Kitchen ware</h1>
        <p className="pt-2 text-base sm:text-lg text-gray-600 max-w-2xl">
          Discover our top collections of unique, stylish, and high-quality
          products curated just for you.
        </p>
      </div>

      <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 mt-6 mb-10">
        <Cards data={data} />
      </div>
    </>
  );
};

export default Kitchenware;
