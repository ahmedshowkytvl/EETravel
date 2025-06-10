import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { HeroSlide } from "@shared/schema";

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch active slides with error handling and fallback
  const { data: slides = [], isLoading, error } = useQuery<HeroSlide[]>({
    queryKey: ["/api/hero-slides/active"],
    retry: 2,
    retryDelay: 1000,
  });

  // Use fallback slides if API fails or returns empty data
  const fallbackSlides = [
    {
      id: 1,
      title: "Discover the Magic of the Middle East",
      subtitle: "Premium Travel Experiences",
      description: "Explore ancient civilizations, breathtaking landscapes, and rich culture with our curated travel experiences.",
      imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Explore Destinations",
      buttonLink: "/destinations",
      secondaryButtonText: "View Special Offers",
      secondaryButtonLink: "/packages",
      order: 1,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const activeSlides = slides.length > 0 ? slides : (error || !isLoading ? fallbackSlides : []);

  // Auto-advance slides
  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading && activeSlides.length === 0) {
    return (
      <div className="relative h-[600px] bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (activeSlides.length === 0) {
    return (
      <div className="relative h-[600px] bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Discover the Magic of the Middle East
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore ancient civilizations, breathtaking landscapes, and rich culture with our curated travel experiences.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/destinations">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Explore Destinations
              </Button>
            </Link>
            <Link href="/packages">
              <Button size="lg" variant="outline">
                View Special Offers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentSlideData = activeSlides[currentSlide];

  return (
    <div className="relative h-[600px] overflow-hidden group">
      {/* Slide Images with Animation */}
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-8'
          }`}
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.imageUrl})`,
            transitionProperty: 'opacity, transform'
          }}
        />
      ))}

      {/* Navigation Arrows - Show on Hover */}
      {activeSlides.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0"
            onClick={prevSlide}
            type="button"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-x-[10px] group-hover:translate-x-0"
            onClick={nextSlide}
            type="button"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Slide Content with Animation */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div 
            key={currentSlide}
            className="max-w-4xl mx-auto text-center text-white transform transition-all duration-1000 ease-out animate-slide-up"
          >
            {currentSlideData.subtitle && (
              <p className="text-lg md:text-xl text-white/90 mb-4 opacity-0 animate-slide-up-delayed-1">
                {currentSlideData.subtitle}
              </p>
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 opacity-0 animate-slide-up-delayed-2">
              {currentSlideData.title}
            </h1>
            {currentSlideData.description && (
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto opacity-0 animate-slide-up-delayed-3">
                {currentSlideData.description}
              </p>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center opacity-0 animate-slide-up-delayed-4">
              {currentSlideData.buttonText && currentSlideData.buttonLink && (
                <Link href={currentSlideData.buttonLink}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    {currentSlideData.buttonText}
                  </Button>
                </Link>
              )}
              {currentSlideData.secondaryButtonText && currentSlideData.secondaryButtonLink && (
                <Link href={currentSlideData.secondaryButtonLink}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                    {currentSlideData.secondaryButtonText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-white scale-110" 
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}