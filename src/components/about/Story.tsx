import Image from "next/image";
import profile from "@/assets/banners/AboutUsStoryImage.png";

interface StoryProps {
  className?: string;
}

const Story: React.FC<StoryProps> = ({ className }) => {
  return (
    <div className={`w-full py-16 px-4 md:px-8 lg:px-16 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        <div className="w-full lg:w-3/5">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What is the story behind our{" "}
            <span className="text-[#d4a017]">brand&apos;s journey?</span>
          </h2>
          <p className="text-base text-slate-600 md:text-lg leading-relaxed pt-5">
            Our brand&apos;s journey is one of passion, perseverance, and
            growth. From our humble beginnings, we&apos;ve evolved by staying
            true to our core values while embracing innovation and change. Every
            milestone we&apos;ve reached has shaped who we are today, and each
            challenge we&apos;ve overcome has strengthened our commitment to
            providing exceptional products and services. This journey is more
            than just about business; it&apos;s about the impact we want to make
            in the world and the legacy we hope to leave behind. Join us as we
            continue to build a future fueled by creativity, purpose, and
            authenticity.
          </p>
        </div>
        <div className="w-full lg:w-2/5 flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute w-[320px] h-[320px] md:w-[360px] md:h-[360px] bg-[#d4a017] rounded-full -right-4 -top-4"></div>
            <div className="relative w-[300px] h-[300px] md:w-[340px] md:h-[340px] rounded-full overflow-hidden border-4 border-[#d4a017] z-10">
              <Image
                src={profile || "/placeholder.svg"}
                alt="Team members collaborating"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 300px, 340px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
