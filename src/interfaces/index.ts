export interface SubTitlesProps {
  title: string;
  description: string;
}

export interface CategoryCardProps {
  id: number;
  image: string;
  title: string;
  discountedPrice?: number;
  price?: number;
  description?: string;
  stars?: number;
}

export interface TestimonialProps {
  id: number;
  name: string;
  avatar: string;
  designation: string;
  review: string;
  stars: string;
}

export interface CategoryItemProps {
  id: number;
  name: string;
  image: string;
  route: string;
}

export interface FAQItem {
  text: string;
  supportingText: string;
}

export interface ProductDetailProps {
  title: string;
  moreDetails: string[];
}

export interface ProductDataProps {
  id: number;
  productName: string;
  productDescription: string;
  stars: number;
  reviews: number;
  itemsSold: number;
  price: number;
  discountedPrice: number;
  discount: number;
  inStock: boolean;
  isLike: boolean;
  images: string[];
  description: ProductDetailProps;
  review: string[];
}
