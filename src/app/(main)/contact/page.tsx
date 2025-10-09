import ContactUsBanner from "@/components/banners/ContactUsBanner";
import ContactForm from "@/components/contact/ContactForm";
import SubTitles from "@/components/subTitles/SubTitles";
import FAQAccordion from "@/components/accordion/FAQAccordion";

const Contact = () => {
  return (
    <>
      <ContactUsBanner />
      <ContactForm />
      <SubTitles title={"Need Help? We're Here for You!"} description="" />
      <FAQAccordion />
    </>
  );
};

export default Contact;
