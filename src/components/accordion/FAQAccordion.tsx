import { FAQItem } from "@/interfaces";
import {
  Accordion as UIAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const data: FAQItem[] = [
  {
    text: "When does the workshop start and what are the timings?",
    supportingText:
      "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
  },
  {
    text: "Product Information – Learn more about our exclusive and unique products.",
    supportingText:
      "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
  },
  {
    text: "Returns & Exchanges – Understand our easy return and exchange policy.",
    supportingText:
      "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
  },
  {
    text: "Collaborations & Partnerships – Want to work with us? Let’s connect!",
    supportingText:
      "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
  },
  {
    text: "How does billing work?",
    supportingText:
      "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
  },
  {
    text: "How do I change my account email?",
    supportingText:
      "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
  },
];

const FAQAccordion = () => {
  return (
    <UIAccordion
      type="single"
      collapsible
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {data.map((item, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger className="text-left cursor-pointer text-lg font-normal">
            {item.text}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 text-base font-semibold">
            {item.supportingText}
          </AccordionContent>
        </AccordionItem>
      ))}
    </UIAccordion>
  );
};

export default FAQAccordion;
