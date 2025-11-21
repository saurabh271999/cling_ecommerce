import CtaBanner from "@/components/banners/CtaBanner";
import SubTitles from "@/components/subTitles/SubTitles";
import CategoriesCard from "@/components/cards/CategoriesCard";
import ProductsCard from "@/components/cards/ProductsCard";
import CutleryBanner from "@/components/banners/CutleryBanner";
import Testimonial from "@/components/testimonial/Testimonial";
import CircleCard from "@/components/cards/CircleCard";
import LoginSignupModal from "@/components/auth/LoginSignupModal";

import newProductsData from "@/constants/newProductsData";
import kitchenwareData from "@/constants/kitchenwareData";
import watchesData from "@/constants/watchesData";

export default function Home() {
  return (
    <>
      <LoginSignupModal />
      <main>
      <CtaBanner />
      <CircleCard />
      <SubTitles
        title={"Popular Categories"}
        description="Discover our top collections of unique, stylish, and high-quality products curated just for you."
      />
      <CategoriesCard />
      <SubTitles
        title={"New Products"}
        description="Discover our top collections of unique, stylish, and high-quality products curated just for you."
      />
      <ProductsCard data={newProductsData} />
      <CutleryBanner />
      <SubTitles
        title={"Our top kitchen ware"}
        description="Discover our top collections of unique, stylish, and high-quality products curated just for you."
      />
      <ProductsCard data={kitchenwareData} />
      <SubTitles
        title={"Our top watches"}
        description="Discover our top collections of unique, stylish, and high-quality products curated just for you."
      />
      <ProductsCard data={watchesData} />
      <SubTitles
        title={"Our testimonial"}
        description="Discover our top collections of unique, stylish, and high-quality products curated just for you."
      />
        <Testimonial />
      </main>
    </>
  );
}
