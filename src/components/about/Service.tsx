import Image from "next/image";
import certifiedLogo from "@/assets/extras/certified.png";
import timerLogo from "@/assets/extras/timer.png";
import t47 from "@/assets/extras/24-7.png";

import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Service = () => {
  return (
    <div className="flex flex-col md:flex-row mx-4 md:mx-24 gap-6 md:gap-4 mb-3">
      <Card className="w-full md:w-1/2 bg-[#fbf7ed] border-[#deb94d]">
        <CardHeader>
          <Image
            src={certifiedLogo}
            alt="certifiedLogo"
            className="w-16 h-16"
          />
          <CardTitle className="text-xl pt-4">
            Exclusive Product Curation
          </CardTitle>
          <CardDescription className="pt-4 text-base space-y-2 leading-relaxed">
            <p>
              Learn how to apply makeup for different occasions, skin types, and
              preferences. Our video tutorials are easy to follow, fun to watch,
              and suitable for all levels of experience
            </p>
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex justify-between">
          <Button className="btn-primary">Read More</Button>
        </CardFooter>
      </Card>

      <Card className="w-full md:w-1/2 bg-[#fbf7ed] border-[#deb94d]">
        <CardHeader>
          <Image src={timerLogo} alt="timerLogo" className="w-16 h-16" />
          <CardTitle className="text-xl pt-4">Fast & Secure Delivery</CardTitle>
          <CardDescription className="pt-4 text-base space-y-2 leading-relaxed">
            <p>
              Learn how to apply makeup for different occasions, skin types, and
              preferences. Our video tutorials are easy to follow, fun to watch,
              and suitable for all levels of experience
            </p>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button className="btn-primary">Read More</Button>
        </CardFooter>
      </Card>

      <Card className="w-full md:w-1/2 bg-[#fbf7ed] border-[#deb94d]">
        <CardHeader>
          <Image src={t47} alt="t47" className="w-16 h-16" />
          <CardTitle className="text-xl pt-4">24/7 Customer Support</CardTitle>
          <CardDescription className="pt-4 text-base space-y-2 leading-relaxed">
            <p>
              Learn how to apply makeup for different occasions, skin types, and
              preferences. Our video tutorials are easy to follow, fun to watch,
              and suitable for all levels of experience
            </p>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button className="btn-primary">Read More</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Service;
