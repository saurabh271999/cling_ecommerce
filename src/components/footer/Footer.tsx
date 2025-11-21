import Link from "next/link";
import Image from "next/image";

import ytLogo from "@/assets/logo/ytLogo.png";
import mailLogo from "@/assets/logo/mailLogo.png";
import playLogo from "@/assets/logo/GooglePlayLogo.png";
import appleLogo from "@/assets/logo/AppleStoreLogo.png";
import facebookLogo from "@/assets/logo/facebookLogo.png";

const Footer = () => {
  const getYear = new Date().getFullYear();

  return (
    <footer className="bg-[#D3A212] py-8 sm:py-16 px-4 md:px-8 lg:px-16 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-white text-4xl font-bold">Shynora</h2>
            <p className="text-white text-sm">
              We create unique, sustainable, and stylish fashion, blending
              tradition with innovation. From luxury apparel to exclusive
              accessories, every piece is crafted for those who value quality
              and individuality.
            </p>

            <div className="pt-4">
              <h3 className="text-white text-2xl font-bold mb-4">
                Download Our App
              </h3>
              <div className="flex space-x-3">
                <Link href="#" className="block">
                  <Image
                    src={appleLogo}
                    alt="App Store"
                    width={135}
                    height={40}
                    className="h-10 w-auto"
                  />
                </Link>
                <Link href="#" className="block">
                  <Image
                    src={playLogo}
                    alt="Google Play"
                    width={135}
                    height={40}
                    className="h-10 w-auto"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="md:ml-auto">
            <h3 className="text-white text-2xl font-bold mb-4">SHOP NOW</h3>
            <ul className="space-y-2 text-white">
              <li className="hover:underline">
                <Link href="/new-arrivals">New Arrivals</Link>
              </li>
              <li className="hover:underline">
                <Link href="/best-sellers">Best Sellers</Link>
              </li>
              <li className="hover:underline">
                <Link href="/shipping-returns">Shipping & Returns Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-2xl font-bold mb-4">ABOUT US</h3>
            <ul className="space-y-2 text-white">
              <li className="hover:underline">
                <Link href="/about">About</Link>
              </li>
              <li className="hover:underline">
                <Link href="/contact">Contact Us</Link>
              </li>
              <li className="hover:underline">
                <Link href="/faqs">FAQ</Link>
              </li>
              <li className="hover:underline">
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li className="hover:underline">
                <Link href="/terms">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-2xl font-bold mb-4">CONTACT US</h3>
            <ul className="space-y-2 text-white">
              <li>Pune, Maharashtra</li>
              <li>+91 8767070762</li>
              <li>info@shynoramultisolutions.org</li>
            </ul>

            <div className="mt-6">
              <h3 className="text-white text-2xl font-bold mb-4">
                FOLLOW US ON
              </h3>
              <div className="flex space-x-3">
                <Link
                  href="#"
                  className="bg-white rounded-full p-2 flex items-center justify-center w-10 h-10"
                >
                  <Image
                    src={facebookLogo}
                    alt="Facebook"
                    width={10}
                    height={10}
                  />
                </Link>
                <Link
                  href="#"
                  className="bg-white rounded-full p-2 flex items-center justify-center w-10 h-10"
                >
                  <Image src={ytLogo} alt="YouTube" width={24} height={24} />
                </Link>
                <Link
                  href="#"
                  className="bg-white rounded-full p-2 flex items-center justify-center w-10 h-10"
                >
                  <Image src={mailLogo} alt="Email" width={24} height={24} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 mb-6 border-t border-white/20"></div>

        <div className="text-center text-white">
          <p>
            Copyright © {getYear} Shynora Multi Solutions All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
