import Choose from "@/components/about/Choose";
import Service from "@/components/about/Service";
import Story from "@/components/about/Story";
import AboutUsBanner from "@/components/banners/AboutUsBanner";
import SubTitles from "@/components/subTitles/SubTitles";
import Testimonial from "@/components/testimonial/Testimonial";

const About = () => {
  return (
    <>
      <AboutUsBanner />
      <Story />
      <SubTitles title={"Why choose us"} description="" />
      <Choose />
      <SubTitles title={"Our services"} description="" />
      <Service />
      <SubTitles
        title={"Our testimonial"}
        description="Discover our top collections of unique, stylish, and high-quality products curated just for you."
      />
      <Testimonial />
    </>
  );
};

export default About;
