"use client";

import Image from "next/image";

export default function Home() {
  const handleDownload = () => {
    window.location.href = "/downloads/shynora-astro.apk";
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#e53935] to-[#b71c1c] py-16 px-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="max-w-3xl z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            Shynora Astro
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-600 tracking-wide">
            MAKING YOUR ASTRO SHOPPING HAPPEN!
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 font-medium">
            Your personal astrological shopping companion. Discover products
            that align with your Rashi and enhance your cosmic energy.
          </p>
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition-all duration-300"
          >
            Download App
          </button>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-2 w-[320px] h-[640px] flex items-center justify-center border-4 border-red-100">
            <Image
              src="/assets/dashboard.jpeg"
              alt="App Preview"
              width={300}
              height={600}
              className="rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            title: "Rashi Analysis",
            description:
              "Get personalized product recommendations based on your birth details and Rashi alignment.",
            image: "/assets/first-step.jpeg",
            icon: "🔮",
          },
          {
            title: "Color Harmony",
            description:
              "Discover products in colors that enhance your positive energies and bring balance to your life.",
            image: "/assets/landing.jpeg",
            icon: "🎨",
          },
          {
            title: "Fabric Selection",
            description:
              "Find fabrics that resonate with your Rashi's elemental nature for maximum comfort and energy flow.",
            image: "/assets/loading-2.jpeg",
            icon: "🧵",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border-t-4 border-blue-600 hover:scale-105 transition-transform duration-300"
          >
            <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-red-100 to-blue-100 flex items-center justify-center text-3xl">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-red-700 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-700 mb-4">{feature.description}</p>
            <div className="w-full h-32 rounded-xl overflow-hidden shadow-md">
              <Image
                src={feature.image}
                alt={feature.title}
                width={200}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Download Section */}
      <section className="w-full bg-gradient-to-r from-[#e53935] to-[#b71c1c] py-16 px-4 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Begin Your Journey?
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl">
          Download Shynora Astro now and discover products that resonate with your
          cosmic energy.
        </p>
        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition-all duration-300"
        >
          Download Now
        </button>
        <div className="mt-4 text-white/80">Version 1.0.0 • Android 6.0+</div>
      </section>
    </main>
  );
}
