import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Choose = () => {
  return (
    <div className="flex flex-col md:flex-row mx-4 md:mx-24 gap-6 md:gap-4 mb-3">
      <Card className="w-full md:w-1/2 bg-[#fbf7ed] border-[#deb94d]">
        <CardHeader>
          <CardTitle className="text-2xl">1. Short & Impactful</CardTitle>
          <CardDescription className="pt-4 text-base space-y-2 leading-relaxed">
            <p>
              We offer exclusive, high-quality products that blend innovation
              with timeless craftsmanship.
            </p>
            <p>Experience uniqueness, luxury, and unmatched excellence.</p>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="w-full md:w-1/2 bg-[#fbf7ed] border-[#deb94d]">
        <CardHeader>
          <CardTitle className="text-2xl">
            2. Customer-Centric & Trust-Building
          </CardTitle>
          <CardDescription className="pt-4 text-base space-y-2 leading-relaxed">
            <p>
              At Cling Multi Solution Ltd, we handpick rare and premium products
              to elevate your lifestyle.
            </p>
            <p>
              With a commitment to quality, innovation, and exclusivity, we
              bring you only the best.
            </p>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Choose;
