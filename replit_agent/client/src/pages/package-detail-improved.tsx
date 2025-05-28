import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Calendar,
  Star,
  Plane,
  BedDouble,
  Utensils,
  ShieldCheck,
  Navigation,
  Ticket
} from "lucide-react";

type Package = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  duration: number;
  destinationId?: number;
  imageUrl?: string;
  galleryUrls?: string[] | null;
  featured?: boolean;
  type?: string;
  inclusions?: string[] | null;
  rating?: number;
  reviewCount?: number;
  slug?: string;
};

type Destination = {
  id: number;
  name: string;
  country: string;
  description?: string;
  imageUrl?: string;
};

type User = {
  id: number;
  email: string;
  role: string;
};

export default function PackageDetail() {
  const params = useParams();
  const packageId = params?.id; // This can be either slug or ID
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get package ID from URL search params if using query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const packageIdFromQuery = urlParams.get('id');
  const finalPackageId = packageIdFromQuery || packageId;
  
  // Fetch all packages
  const { data: allPackages = [], isLoading: isLoadingPackages } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
    retry: 1,
  });
  
  // Find the package matching either slug or ID
  const packageData = allPackages.find(p => 
    p.slug === finalPackageId || p.id.toString() === finalPackageId
  );

  // Redirect to slug URL if accessed via ID
  React.useEffect(() => {
    if (packageData && packageData.slug && finalPackageId === packageData.id.toString()) {
      // User accessed via ID, redirect to slug URL
      setLocation(`/packages/${packageData.slug}`, { replace: true });
    }
  }, [packageData, finalPackageId, setLocation]);

  // Fetch destinations to get destination info
  const { data: destinations = [], isLoading: isLoadingDestinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
    retry: 1,
  });

  // Find the destination for this package
  const destination = packageData?.destinationId 
    ? destinations.find(d => d.id === packageData.destinationId) 
    : null;
  
  // Check if user is authenticated and is an admin
  const { data: userData } = useQuery<User | null>({
    queryKey: ['/api/user'],
    retry: 0, // Don't retry on 401
  });

  const isAdmin = userData?.role === 'admin';

  // Example package highlights (these would ideally come from the database)
  const packageHighlights = [
    "Guided tour of the Great Pyramids of Giza",
    "Valley of the Kings exploration",
    "Luxury Nile cruise from Luxor to Aswan",
    "Visit to Abu Simbel temples"
  ];

  // Example available dates (would be from database in real implementation)
  const availableDates = [
    { date: "May 15-22, 2025", availability: "Available", spotsLeft: 15 },
    { date: "June 10-17, 2025", availability: "Limited", spotsLeft: 4 },
    { date: "July 5-12, 2025", availability: "Available", spotsLeft: 12 }
  ];
  
  // Loading state
  if (isLoadingPackages || isLoadingDestinations) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-72 w-full mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Package not found state
  if (!packageData) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
          <p className="text-gray-600 mb-6">
            The package with ID/slug '{finalPackageId}' doesn't exist or may have been removed.
          </p>
          <Button onClick={() => setLocation('/search/packages')}>
            Browse All Packages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Package Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{packageData.title}</h1>
        <div className="flex items-center text-gray-600">
          <MapPin size={16} className="mr-1" />
          <span>{destination ? `${destination.name}, ${destination.country}` : 'Multiple Destinations'}</span>
        </div>
      </div>

      {/* Key Package Info */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
          <Clock size={18} className="text-blue-600 mr-2" />
          <span>{packageData.duration} days, {packageData.duration - 1} nights</span>
        </div>
        
        <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
          <BedDouble size={18} className="text-blue-600 mr-2" />
          <span>{packageData.type || '4-star hotels & 5-star cruise'}</span>
        </div>
      </div>

      {/* Package Description */}
      <p className="text-gray-700 mb-6">
        {packageData.description}
      </p>

      {/* Highlights and Inclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Package Highlights */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Package Highlights</h2>
          <ul className="space-y-3">
            {packageHighlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <div className="text-green-500 mr-2">•</div>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Package Includes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Package Includes</h2>
          <div className="flex flex-wrap gap-2">
            {packageData.inclusions?.map((inclusion, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1 py-2 px-3">
                {inclusion === 'Flights' && <Plane size={14} />}
                {inclusion === 'Accommodation' && <BedDouble size={14} />}
                {inclusion === 'All Meals' && <Utensils size={14} />}
                {inclusion === 'Transportation' && <Navigation size={14} />}
                {inclusion === 'Entry Fees' && <Ticket size={14} />}
                {inclusion === 'Hotels' && <BedDouble size={14} />}
                {inclusion === 'Tours' && <Navigation size={14} />}
                {inclusion === 'Guide' && <ShieldCheck size={14} />}
                <span>{inclusion}</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Available Dates */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Available Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableDates.map((date, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="font-bold mb-1">{date.date}</div>
              <div className="flex justify-between">
                <div className={`text-sm ${date.availability === 'Limited' ? 'text-orange-500' : 'text-green-500'}`}>
                  {date.availability}
                </div>
                {date.availability === 'Limited' && (
                  <div className="text-sm text-orange-500">{date.spotsLeft} spots left</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Panel */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <div className="text-3xl font-bold text-primary">
              ${packageData.discountedPrice || packageData.price}
              {packageData.discountedPrice && (
                <span className="text-lg text-gray-400 line-through ml-2">
                  ${packageData.price}
                </span>
              )}
            </div>
            <div className="text-gray-500">per person</div>
          </div>
          <div className="mt-4 md:mt-0">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              Book This Package
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Edit Link */}
      {isAdmin && (
        <div className="mt-4 mb-8 flex justify-end">
          <Button 
            variant="outline"
            onClick={() => setLocation(`/admin/packages/edit/${packageData.id}`)}
          >
            Edit Package
          </Button>
        </div>
      )}
    </div>
  );
}