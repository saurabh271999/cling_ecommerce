import { SubTitlesProps } from "@/interfaces";

import Image from "next/image";
import LeftArrow from "@/assets/extras/LeftArrow.png";
import RightArrow from "@/assets/extras/RightArrow.png";

const SubTitles: React.FC<SubTitlesProps> = ({ title, description }) => {
  const words = title.split(" ");
  const lastWord = words.pop();
  const firstPart = words.join(" ");

  return (
    <div className="text-center py-8 px-4">
      <div className="flex items-center justify-center gap-4">
        {/* Left Arrow */}
        <Image
          src={LeftArrow}
          alt="Left Arrow"
          width={150}
          height={150}
          className="hidden sm:block pb-2"
        />

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 flex items-center">
          {firstPart}&nbsp;<span className="text-[#d5a51a]">{lastWord}</span>
        </h2>

        {/* Right Arrow */}
        <Image
          src={RightArrow}
          alt="Right Arrow"
          width={150}
          height={150}
          className="hidden sm:block pb-2"
        />
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base md:text-lg text-gray-700">
        {description}
      </p>
    </div>
  );
};

export default SubTitles;
