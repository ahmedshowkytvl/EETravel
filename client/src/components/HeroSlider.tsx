import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { HeroSlide } from "@shared/schema";

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch active slides
  const { data: slides = [], isLoading } = useQuery<HeroSlide[]>({
    queryKey: ["/api/hero-slides/active"],
  });

  // Auto-advance slides
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading || slides.length === 0) {
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

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Slide Image Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${currentSlideData.imageUrl})` 
        }}
      />

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white border-white/30"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white border-white/30"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Slide Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            {currentSlideData.subtitle && (
              <p className="text-lg md:text-xl text-white/90 mb-4 animate-fade-in">
                {currentSlideData.subtitle}
              </p>
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {currentSlideData.title}
            </h1>
            {currentSlideData.description && (
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in">
                {currentSlideData.description}
              </p>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
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