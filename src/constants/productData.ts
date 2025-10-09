import { ProductDataProps } from "@/interfaces";

import image1 from "@/assets/popularCategoriesDataImages/popular1.png";
import image2 from "@/assets/popularCategoriesDataImages/popular2.png";
import image3 from "@/assets/popularCategoriesDataImages/popular3.png";
import image4 from "@/assets/popularCategoriesDataImages/popular4.png";

const productData: ProductDataProps[] = [
  {
    id: 1,
    productName: "Kitchen ware",
    productDescription:
      "Premium, stylish, and functional essentials for a refined kitchen experience.",
    stars: 3.5,
    reviews: 600,
    itemsSold: 1298,
    price: 2000,
    discountedPrice: 1200,
    discount: 23,
    inStock: true,
    isLike: false,
    images: [
      image1.src,
      image2.src,
      image3.src,
      image4.src,
      image1.src,
      image2.src,
      image3.src,
      image4.src,
    ],
    description: {
      title:
        "Elevate your kitchen with this premium kitchenware set, featuring finely crafted wooden utensils, gold-accented cutlery, and elegant ceramic bowls and mugs. Designed for durability and style, it's perfect for everyday use or special occasions.",
      moreDetails: [
        "High-quality ceramic with intricate detailing",
        "Durable wooden utensils for effortless cooking",
        "Gold accents for a touch of luxury",
        "Perfect for gifting or enhancing your kitchen",
      ],
    },
    review: ["Good Quality", "Value for money"],
  },
];

export default productData;
