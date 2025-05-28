import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fallbackImageUrl } from "@/lib/image-utils";
import useLanguage from "@/hooks/use-language";

const HeroSection: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>(
    "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
  );

  useEffect(() => {
    // Test if image can be loaded correctly
    const img = new Image();
    img.onerror = () => {
      // If it fails, use fallback image
      setBackgroundImage(fallbackImageUrl);
    };
    img.src = backgroundImage;
  }, []);

  const { t } = useLanguage();

  return (
    <section
      className="hero-section relative text-white min-h-[500px] md:min-h-[600px] bg-cover bg-center"
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
      <div className="container mx-auto px-4 py-24 pb-40 md:py-32 md:pb-48 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("home.title", "Discover the Magic of the Middle East")}
          </h1>
          <p className="text-xl mb-8 text-neutral-100">
            Explore ancient civilizations, breathtaking landscapes, and rich
            culture with our curated travel experiences.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md shadow-lg font-medium transition-colors">
              Explore Destinations
            </Button>
            <Button
              variant="outline"
              className="bg-white hover:bg-neutral-100 text-primary px-6 py-3 rounded-md shadow-lg font-medium transition-colors"
            >
              View Special Offers
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-0"></div>
    </section>
  );
};

export default HeroSection;
