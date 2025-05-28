import React from "react";
import HeroSection from "@/components/HeroSection";
import BookingTabs from "@/components/BookingTabs";
import FeaturedOffers from "@/components/FeaturedOffers";
import ExploreSection from "@/components/ExploreSection";
import RecommendedDestinations from "@/components/RecommendedDestinations";
import PopularPackages from "@/components/PopularPackages";
import SocialMediaBox from "@/components/SocialMediaBox";
import { useLanguage } from "@/hooks/use-language";

const Home: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <HeroSection />
      <BookingTabs />
      <FeaturedOffers />
      <ExploreSection />
      <RecommendedDestinations />
      <PopularPackages />
      <div className="container mx-auto px-4">
        <div className="my-12">
          <h2 className="text-2xl font-bold text-center mb-10">
            {t('home.social.title', 'Connect With Us')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-4">
              <div className="bg-neutral-100 rounded-xl p-8 h-full">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">
                    {t('home.social.subtitle', 'Follow Our Adventures')}
                  </h3>
                  <p className="text-neutral-600">
                    {t('home.social.description', 'Join us on social media for travel tips, exclusive offers and stunning destinations')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
