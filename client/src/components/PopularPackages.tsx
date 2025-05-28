import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarIcon, StarHalfIcon, MapPinIcon, UsersIcon, UtensilsIcon, Loader2 } from 'lucide-react';
import { handleImageError } from '@/lib/image-utils';
import { useQuery } from "@tanstack/react-query";

// Package interface matching the database schema
interface Package {
  id: number;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  imageUrl?: string;
  duration?: number;
  rating?: number;
  reviewCount?: number;
  featured: boolean;
  type?: string;
  inclusions?: string[];
  slug?: string;
}

const PopularPackages: React.FC = () => {
  // Fetch packages from API
  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
  });

  // Filter for featured/popular packages
  const popularPackages = packages.filter(pkg => pkg.featured).slice(0, 6);

  // Fallback image for packages without images
  const fallbackImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Popular Travel Packages</h2>
          <a href="#" className="text-primary hover:text-primary/90 font-medium flex items-center">
            View All Packages <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {/* No packages found */}
        {!isLoading && popularPackages.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No popular packages found. Add featured packages in the admin panel to display them here.
          </div>
        )}

        {/* Packages grid */}
        {!isLoading && popularPackages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 [&>*:last-child]:odd:xl:col-span-3">
            {popularPackages.map((pkg) => (
              <Card key={pkg.id} className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={pkg.imageUrl || fallbackImage}
                    alt={pkg.title}
                    className="w-full h-56 object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {pkg.duration || "Multi-day"}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold">{pkg.title}</h3>
                    <div className="text-2xl font-bold text-primary">${pkg.price}</div>
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="text-amber-400 flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} fill="currentColor" size={16} />
                      ))}
                    </div>
                    <span className="ml-2 text-neutral-600 text-sm">5.0 (New package)</span>
                  </div>

                  <p className="text-neutral-600 mb-4">{pkg.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="flex items-center text-xs text-neutral-700">
                      <MapPinIcon className="text-primary mr-1" size={12} />
                      {pkg.type || "Multiple destinations"}
                    </span>
                    <span className="flex items-center text-xs text-neutral-700">
                      <UsersIcon className="text-primary mr-1" size={12} />
                      {pkg.duration || 5} days
                    </span>
                    <span className="flex items-center text-xs text-neutral-700">
                      <UtensilsIcon className="text-primary mr-1" size={12} />
                      {pkg.inclusions?.join(", ") || "Inclusions available"}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
                    <a href={`/packages/${pkg.slug || pkg.id}`} className="text-primary hover:text-primary/90 font-medium text-sm">View Details</a>
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => window.location.href = `/packages/${pkg.slug || pkg.id}`}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularPackages;