import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { handleImageError } from "@/lib/image-utils";

// Destination types with categories for filtering
type Category = "Popular" | "Adventure" | "Honeymoon" | "Cultural" | "Relaxation" | "Nature";

// API destination interface
interface ApiDestination {
  id: number;
  name: string;
  country: string;
  imageUrl?: string;
  featured: boolean;
  description?: string;
}

// Enhanced destination interface with categories for frontend display
interface EnhancedDestination {
  id: number;
  name: string;
  country: string;
  image: string;
  rating: number;
  categories: Category[];
}

// Fallback image if a destination has no image
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

// Default categories based on country - this can be expanded or modified
const COUNTRY_CATEGORIES: Record<string, Category[]> = {
  "Egypt": ["Popular", "Adventure", "Cultural"],
  "UAE": ["Popular", "Honeymoon", "Relaxation"],
  "Jordan": ["Adventure", "Cultural"],
  "Morocco": ["Popular", "Adventure", "Cultural"],
  "Israel": ["Adventure", "Cultural"],
  "Turkey": ["Popular", "Cultural"],
  "Greece": ["Honeymoon", "Relaxation"],
  "Japan": ["Cultural", "Adventure"],
  "South Africa": ["Adventure", "Nature"],
  "France": ["Popular", "Honeymoon", "Cultural"],
  "USA": ["Popular", "Adventure"],
  // Default categories for any other country
  "default": ["Popular", "Adventure"]
};

// Destination Card component matching the provided design
type DestinationCardProps = {
  image: string;
  title: string;
  location: string;
  rating: number;
};

const DestinationCard = ({
  image,
  title,
  location,
  rating,
}: DestinationCardProps) => {
  return (
    <div className="w-[220px] rounded-[20px] shadow-md bg-white overflow-hidden relative flex-shrink-0">
      {/* Image */}
      <div className="relative p-2">
        <img
          src={image}
          alt={title}
          className="w-full h-[140px] object-cover rounded-[20px] p-[5px] transition-transform duration-300 scale-100 hover:scale-105"
          onError={handleImageError}
        />
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center text-sm shadow-sm">
          <FaStar className="text-yellow-400 text-xs mr-1" />
          <span className="font-medium">{rating}</span>
        </div>
      </div>

      {/* Text Content */}
      <div className="p-3">
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="text-sm text-gray-500 flex items-center mt-1">
          <FaMapMarkerAlt className="text-red-400 mr-1 text-xs" />
          {location}
        </div>
      </div>
    </div>
  );
};

const RecommendedDestinations: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Category>("Adventure");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch destinations from API
  const { data: apiDestinations = [], isLoading } = useQuery<ApiDestination[]>({
    queryKey: ['/api/destinations'],
  });

  // Transform API destinations to enhanced destinations with categories and ratings
  const transformedDestinations: EnhancedDestination[] = apiDestinations.map(dest => {
    const countryCategories = COUNTRY_CATEGORIES[dest.country] || COUNTRY_CATEGORIES.default;

    // Add additional categories for featured destinations
    let categories = [...countryCategories];
    if (dest.featured && !categories.includes("Popular")) {
      categories.push("Popular");
    }

    // Generate a random but consistent rating between 4.5 and 5.0
    // Using destination id to ensure the same destination always gets the same rating
    const baseRating = 4.5;
    const randomOffset = (dest.id % 6) / 10; // Value between 0 and 0.5
    const rating = baseRating + randomOffset;

    return {
      id: dest.id,
      name: dest.name,
      country: dest.country,
      image: dest.imageUrl || FALLBACK_IMAGE,
      rating,
      categories
    };
  });

  // Filter destinations based on active filter
  const filteredDestinations = transformedDestinations.filter((destination: EnhancedDestination) =>
    destination.categories.includes(activeFilter)
  );

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -220,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 220,
        behavior: "smooth",
      });
    }
  };
  
  // Function to check if we can scroll left or right
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Check if we can scroll left (scrollLeft > 0)
    setCanScrollLeft(container.scrollLeft > 0);
    
    // Check if we can scroll right (scrollLeft < scrollWidth - clientWidth)
    const hasRightScroll = container.scrollLeft < (container.scrollWidth - container.clientWidth - 5);
    setCanScrollRight(hasRightScroll);
  };
  
  // Set up scroll event listener - simplified to avoid complex dependencies
  useEffect(() => {
    // Need to wait for the container to be available
    setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      // Check initial scroll state
      checkScrollability();
      
      // Add scroll event listener
      container.addEventListener('scroll', checkScrollability);
      
      // Clean up
      return () => {
        container.removeEventListener('scroll', checkScrollability);
      };
    }, 100);
  }, []);
  
  // Re-check scrollability when data changes or filter changes
  useEffect(() => {
    // Wait for next render cycle
    setTimeout(checkScrollability, 100);
    
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeFilter, apiDestinations]);

  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Recommended Destination
        </h2>

        {/* Filter tags/buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {(["Popular", "Adventure", "Honeymoon"] as Category[]).map(
            (category) => (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                className={
                  activeFilter === category
                    ? "bg-[#2f6088] hover:bg-[#2f6088]/90 text-white"
                    : "border-[#2f6088] text-[#2f6088] hover:bg-[#2f6088]/10"
                }
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </Button>
            ),
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-[#2f6088]" />
          </div>
        )}

        {/* No destinations found */}
        {!isLoading && filteredDestinations.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No destinations found for this category. Try another filter or add destinations in the admin panel.
          </div>
        )}

        {/* Destination cards with scroll buttons */}
        {!isLoading && filteredDestinations.length > 0 && (
          <div className="relative">
            {/* Left scroll button */}
            <Button
              onClick={scrollLeft}
              variant="outline"
              size="icon"
              className={`absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 rounded-full border-[#2f6088] text-[#2f6088] hover:bg-[#2f6088] hover:text-white transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-md ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="sr-only">Scroll left</span>
            </Button>

            {/* Right scroll button */}
            <Button
              onClick={scrollRight}
              variant="outline"
              size="icon"
              className={`absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 rounded-full border-[#2f6088] text-[#2f6088] hover:bg-[#2f6088] hover:text-white transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-md ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span className="sr-only">Scroll right</span>
            </Button>

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-6 gap-4 px-2 scrollbar-hide scroll-smooth"
            >
              {filteredDestinations.map((destination: EnhancedDestination) => (
                <DestinationCard
                  key={destination.id}
                  image={destination.image}
                  title={destination.name}
                  location={destination.country}
                  rating={destination.rating}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedDestinations;