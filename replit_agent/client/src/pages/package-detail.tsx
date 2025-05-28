import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import PackageLayout from "@/components/PackageLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  Globe, 
  Users,
  MapPin, 
  Star, 
  Check, 
  X,
  ArrowLeft, 
  Share2, 
  Heart,
  ChevronLeft, 
  ChevronRight,
  DollarSign,
  Coffee,
  Car,
  Mountain,
  Plane,
  Utensils,
  Edit,
  ShieldCheck
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
  username: string;
  email: string;
  fullName?: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
};

export default function PackageDetail() {
  const params = useParams();
  const packageSlug = params?.id; // This is actually the slug, not an ID
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // For quick info scroll functionality
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // For traveler selection in the booking form
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [roomDistribution, setRoomDistribution] = useState("double");
  const [hotelPackage, setHotelPackage] = useState("standard");
  
  // Check if user is authenticated and is an admin
  const { data: userData } = useQuery<User | null>({
    queryKey: ['/api/user'],
    retry: 0, // Don't retry on 401
  });

  // Fetch all packages
  const { data: allPackages = [], isLoading: isLoadingPackages } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
    retry: 1,
  });
  
  // Find the package matching the slug
  const packageData = allPackages.find(p => p.slug === packageSlug);

  // Fetch destinations to get destination info
  const { data: destinations = [], isLoading: isLoadingDestinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
    retry: 1,
  });

  // Find the destination for this package
  const destination = packageData?.destinationId 
    ? destinations.find(d => d.id === packageData.destinationId) 
    : null;
    
  // Handler functions for traveler counts
  const handleIncrement = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
  ) => {
    setter(value + 1);
  };

  const handleDecrement = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
  ) => {
    if (value > 0) {
      setter(value - 1);
    }
  };
  
  // Scroll container for quick info items
  const scrollContainer = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 250;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };
  
  // Update scroll buttons visibility
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  // Add debugging to identify what's happening with package loading
  console.log('Package Slug:', packageSlug);
  console.log('All Packages:', allPackages);
  console.log('Package Data:', packageData);
  console.log('Is Loading Packages:', isLoadingPackages);
  
  // Handle if package is not found
  if (!isLoadingPackages && !packageData) {
    return (
      <PackageLayout>
        <div className="container py-12 px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Package Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The package with slug "{packageSlug}" doesn't exist or has been removed.
              </p>
            <Button onClick={() => setLocation("/packages")} className="mr-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Packages
            </Button>
            <Button onClick={() => setLocation("/")} className="mr-2">
              Return Home
            </Button>
          </div>
        </div>
      </PackageLayout>
    );
  }
  
  // Define quick info items based on package data
  const quickInfoItems = packageData ? [
    {
      icon: <Calendar className="h-8 w-8 mb-2 text-primary" />,
      title: "Duration",
      desc: `${packageData.duration} Days`,
    },
    {
      icon: <Globe className="h-8 w-8 mb-2 text-primary" />,
      title: "Language",
      desc: "English, Arabic",
    },
    {
      icon: <Users className="h-8 w-8 mb-2 text-primary" />,
      title: "Group Size",
      desc: "Max 20 People",
    },
    {
      icon: <DollarSign className="h-8 w-8 mb-2 text-primary" />,
      title: "Starting Price",
      desc: `$${packageData.discountedPrice || packageData.price}`,
    },
    {
      icon: <MapPin className="h-8 w-8 mb-2 text-primary" />,
      title: "Location",
      desc: destination ? `${destination.name}, ${destination.country}` : "Multiple Locations",
    },
  ] : [];

  return (
    <PackageLayout>
      {isLoadingPackages ? (
        <div className="animate-pulse container py-8 px-4">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-8 w-3/4"></div>
            </div>
            <div>
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      ) : packageData ? (
        <div>
          {/* Hero Section */}
          <section className="relative h-[50vh] md:h-[60vh] flex items-center">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: packageData.imageUrl 
                  ? `url('${packageData.imageUrl}')`
                  : "url('https://images.unsplash.com/photo-1568322445389-f64ac2515099?q=80&w=2070&auto=format&fit=crop')",
              }}
            ></div>
            <div className="container relative z-20 text-white px-4 sm:px-10">
              {/* Content in semi-transparent gray box */}
              <div className="bg-gray-800/75 rounded-xl p-4 sm:p-8 max-w-2xl backdrop-blur-sm">
                {/* Breadcrumbs */}
                <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <a
                        href="/"
                        className="hover:text-primary-foreground/90 transition-colors"
                      >
                        Home
                      </a>
                      <span className="mx-2">/</span>
                      <a
                        href="/packages"
                        className="hover:text-primary-foreground/90 transition-colors"
                      >
                        Packages
                      </a>
                      <span className="mx-2">/</span>
                      <span className="font-medium">{packageData.title}</span>
                    </div>
                    {userData?.role === 'admin' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex items-center gap-1.5"
                          onClick={() => {
                            const slugUrl = prompt("Enter a friendly URL for this package:", 
                              packageData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '');
                            
                            if (slugUrl) {
                              // This would typically send a request to update the package's slug/URL
                              toast({
                                title: "URL updated",
                                description: `Package URL would be set to: ${slugUrl}`,
                              });
                            }
                          }}
                        >
                          <Globe className="h-3.5 w-3.5" />
                          <span className="text-xs">Friendly URL</span>
                        </Button>
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex items-center gap-1.5"
                          onClick={() => window.open(`/packages/${packageData.slug}`, '_blank')}
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span className="text-xs">View</span>
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Admin Edit Button - Only visible to admins */}
                  {userData?.role === 'admin' && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="gap-1.5"
                      onClick={() => setLocation(`/admin/packages/edit/${packageData.id}`)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit Package</span>
                    </Button>
                  )}
                </div>

                {/* Hero content - left aligned */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-0 sm:mb-2">
                      {packageData.title}
                    </h1>
                    {userData?.role === 'admin' && (
                      <Badge variant="outline" className="text-white border-white bg-black/30 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        <span className="text-xs">Admin View</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                    {destination ? `Experience ${destination.name} with our exclusive package` : "Experience the beauty of this destination with our exclusive package"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Info Bar */}
          <section className="relative bg-white mx-auto py-4 sm:py-6">
            {/* Arrows */}
            <ChevronLeft
              onClick={() => scrollContainer("left")}
              className={`absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 p-1 sm:p-2 rounded-full bg-white border shadow-md hover:bg-gray-100 cursor-pointer transition-opacity duration-300 ease-in-out ${
                canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />

            <ChevronRight
              onClick={() => scrollContainer("right")}
              className={`absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 p-1 sm:p-2 rounded-full bg-white border shadow-md hover:bg-gray-100 cursor-pointer transition-opacity duration-300 ease-in-out ${
                canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />

            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth"
            >
              <div className="flex gap-2 sm:gap-4 px-8 sm:px-12 min-w-fit">
                {quickInfoItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-36 sm:w-48 flex flex-col items-center p-3 sm:p-4 bg-white border border-[#F1F1F1] rounded-lg shadow-inner shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] transition-all duration-200 text-center"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2">{item.icon}</div>
                    <h3 className="text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">{item.title}</h3>
                    <p className="text-xs sm:text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="container py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Tour Overview */}
                <section className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Tour Overview</h2>
                    <p className="text-neutral-700 mb-4">
                      {packageData.description}
                    </p>
                    {destination && destination.description && (
                      <p className="text-neutral-700 mb-4">
                        {destination.description}
                      </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-white border border-[#F1F1F1] p-4 rounded-lg flex flex-col items-center text-center shadow-inner shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] transition-all duration-200">
                        <Calendar className="h-6 w-6 text-primary mb-2" />
                        <h3 className="font-medium text-sm mb-1">
                          Best Time to Visit
                        </h3>
                        <p className="text-xs text-neutral-600">
                          October to April, when temperatures are mild
                        </p>
                      </div>
                      <div className="bg-white border border-[#F1F1F1] p-4 rounded-lg flex flex-col items-center text-center shadow-inner shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] transition-all duration-200">
                        <Users className="h-6 w-6 text-primary mb-2" />
                        <h3 className="font-medium text-sm mb-1">Ideal For</h3>
                        <p className="text-xs text-neutral-600">
                          Couples, families, history enthusiasts, photographers
                        </p>
                      </div>
                      <div className="bg-white border border-[#F1F1F1] p-4 rounded-lg flex flex-col items-center text-center shadow-inner shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] transition-all duration-200">
                        <Globe className="h-6 w-6 text-primary mb-2" />
                        <h3 className="font-medium text-sm mb-1">What to Pack</h3>
                        <p className="text-xs text-neutral-600">
                          Light clothing, sun protection, comfortable walking
                          shoes
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Itinerary Section with Tabs */}
                <section className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Package Itinerary</h2>
                    <Tabs defaultValue="day1">
                      <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
                        <TabsTrigger value="day1">Day 1-2</TabsTrigger>
                        <TabsTrigger value="day3">Day 3-5</TabsTrigger>
                        <TabsTrigger value="day6">Day 6-7</TabsTrigger>
                      </TabsList>
                      <TabsContent value="day1" className="p-3 sm:p-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold text-lg">Day 1: Arrival</h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Arrive at your destination and transfer to your hotel</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Welcome dinner and orientation</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Overnight at hotel</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">Day 2: City Tour</h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Breakfast at hotel</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Full day guided tour of main attractions</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Lunch at local restaurant</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Evening leisure time</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Overnight at hotel</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="day3" className="p-3 sm:p-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold text-lg">Day 3-4: Exploration</h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Visit to historical sites and monuments</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Cultural experiences and workshops</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Meals included as per itinerary</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">Day 5: Adventure Day</h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Outdoor activities based on destination</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Scenic views and photo opportunities</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Special dinner experience</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="day6" className="p-3 sm:p-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold text-lg">Day 6: Leisure Day</h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Free time to explore or relax</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Optional activities available</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Farewell dinner</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">Day 7: Departure</h3>
                            <ul className="mt-2 space-y-2">
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Breakfast at hotel</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Transfer to airport</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary font-bold mr-2">•</span>
                                <span>Departure with fond memories</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </section>

                {/* What's Included/Excluded */}
                <section className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h2 className="text-xl font-bold mb-4">
                          What's Included
                        </h2>
                        <ul className="space-y-3">
                          {packageData.inclusions && packageData.inclusions.length > 0 ? (
                            packageData.inclusions.map((inclusion, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{inclusion}</span>
                              </li>
                            ))
                          ) : (
                            <>
                              <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>Accommodation as per itinerary</span>
                              </li>
                              <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>Meals mentioned in the itinerary</span>
                              </li>
                              <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>Professional English-speaking guide</span>
                              </li>
                              <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>Transportation in an air-conditioned vehicle</span>
                              </li>
                              <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>Entrance fees to attractions</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold mb-4">What's Excluded</h2>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>International/domestic flights</span>
                          </li>
                          <li className="flex items-start">
                            <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Travel insurance</span>
                          </li>
                          <li className="flex items-start">
                            <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Personal expenses</span>
                          </li>
                          <li className="flex items-start">
                            <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Optional activities</span>
                          </li>
                          <li className="flex items-start">
                            <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Gratuities for guides and drivers</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Photos placeholder - would be replaced with actual gallery */}
                <section className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Package Photos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {packageData.galleryUrls && packageData.galleryUrls.length > 0 ? (
                        packageData.galleryUrls.map((url, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={url}
                              alt={`${packageData.title} - ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full bg-gray-100 rounded-lg p-8 text-center">
                          <p className="text-muted-foreground">Gallery images coming soon</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              {/* Booking Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  {/* Booking Form Card */}
                  <Card className="mb-6 shadow-lg border-t-4 border-t-primary">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Book This Package</h3>
                        
                        {/* Admin Edit Button in card */}
                        {userData?.role === 'admin' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1.5"
                            onClick={() => setLocation(`/admin/packages/edit/${packageData.id}`)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Select Date</label>
                          <div className="relative">
                            <input
                              type="date"
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        </div>
                        
                        {/* Travelers */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium block">Travelers</label>
                          
                          {/* Adults */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Adults</span>
                            <div className="flex items-center">
                              <button
                                className="w-8 h-8 rounded-full border border-input flex items-center justify-center hover:bg-muted"
                                onClick={() => handleDecrement(setAdults, adults)}
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{adults}</span>
                              <button
                                className="w-8 h-8 rounded-full border border-input flex items-center justify-center hover:bg-muted"
                                onClick={() => handleIncrement(setAdults, adults)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {/* Children */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Children (2-12 yrs)</span>
                            <div className="flex items-center">
                              <button
                                className="w-8 h-8 rounded-full border border-input flex items-center justify-center hover:bg-muted"
                                onClick={() => handleDecrement(setChildren, children)}
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{children}</span>
                              <button
                                className="w-8 h-8 rounded-full border border-input flex items-center justify-center hover:bg-muted"
                                onClick={() => handleIncrement(setChildren, children)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {/* Infants */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Infants (0-2 yrs)</span>
                            <div className="flex items-center">
                              <button
                                className="w-8 h-8 rounded-full border border-input flex items-center justify-center hover:bg-muted"
                                onClick={() => handleDecrement(setInfants, infants)}
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{infants}</span>
                              <button
                                className="w-8 h-8 rounded-full border border-input flex items-center justify-center hover:bg-muted"
                                onClick={() => handleIncrement(setInfants, infants)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Room Distribution */}
                        <div>
                          <label className="text-sm font-medium mb-1 block">Room Distribution</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div
                              className={`border rounded-md p-2 cursor-pointer transition-colors ${
                                roomDistribution === "single"
                                  ? "border-primary bg-primary/10"
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => setRoomDistribution("single")}
                            >
                              <p className="text-sm font-medium">Single Room</p>
                              <p className="text-xs text-muted-foreground">1 person per room</p>
                            </div>
                            <div
                              className={`border rounded-md p-2 cursor-pointer transition-colors ${
                                roomDistribution === "double"
                                  ? "border-primary bg-primary/10"
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => setRoomDistribution("double")}
                            >
                              <p className="text-sm font-medium">Double Room</p>
                              <p className="text-xs text-muted-foreground">2 people per room</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Hotel Package */}
                        <div>
                          <label className="text-sm font-medium mb-1 block">Hotel Package</label>
                          <div className="space-y-2">
                            <div
                              className={`border rounded-md p-2 cursor-pointer transition-colors ${
                                hotelPackage === "standard"
                                  ? "border-primary bg-primary/10"
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => setHotelPackage("standard")}
                            >
                              <div className="flex justify-between">
                                <p className="text-sm font-medium">Standard</p>
                                <p className="text-sm font-medium">${packageData.price}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">4-star accommodation</p>
                            </div>
                            <div
                              className={`border rounded-md p-2 cursor-pointer transition-colors ${
                                hotelPackage === "deluxe"
                                  ? "border-primary bg-primary/10"
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => setHotelPackage("deluxe")}
                            >
                              <div className="flex justify-between">
                                <p className="text-sm font-medium">Deluxe</p>
                                <p className="text-sm font-medium">${Math.round(packageData.price * 1.3)}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">5-star accommodation</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Price Calculation */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Base price ({adults + children} travelers)</span>
                            <span className="text-sm">
                              ${
                                hotelPackage === "standard" 
                                  ? packageData.price * (adults + children)
                                  : Math.round(packageData.price * 1.3) * (adults + children)
                              }
                            </span>
                          </div>
                          
                          {roomDistribution === "single" && adults > 1 && (
                            <div className="flex justify-between">
                              <span className="text-sm">Single room supplement</span>
                              <span className="text-sm">+$200</span>
                            </div>
                          )}
                          
                          {packageData.discountedPrice && packageData.discountedPrice < packageData.price && (
                            <div className="flex justify-between">
                              <span className="text-sm text-green-600">Discount</span>
                              <span className="text-sm text-green-600">
                                -${(packageData.price - packageData.discountedPrice) * (adults + children)}
                              </span>
                            </div>
                          )}
                          
                          <Separator />
                          
                          <div className="flex justify-between font-bold">
                            <span>Total price</span>
                            <span>
                              ${
                                packageData.discountedPrice && packageData.discountedPrice < packageData.price
                                  ? packageData.discountedPrice * (adults + children) + (roomDistribution === "single" && adults > 1 ? 200 : 0)
                                  : (hotelPackage === "standard" ? packageData.price : Math.round(packageData.price * 1.3)) * (adults + children) + (roomDistribution === "single" && adults > 1 ? 200 : 0)
                              }
                            </span>
                          </div>
                        </div>
                        
                        <Button className="w-full">Book Now</Button>
                        
                        <p className="text-xs text-center text-muted-foreground">
                          No payment required to book. You'll only pay when finalizing your reservation.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* What's Included/Excluded - Separate box */}
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-4">Package Summary</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">
                            What's Included:
                          </h4>
                          <ul className="space-y-1.5">
                            {packageData.inclusions && packageData.inclusions.length > 0 ? (
                              packageData.inclusions.slice(0, 5).map((inclusion, index) => (
                                <li key={index} className="flex items-start text-sm">
                                  <Check className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                                  <span>{inclusion}</span>
                                </li>
                              ))
                            ) : (
                              <>
                                <li className="flex items-start text-sm">
                                  <Check className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                                  <span>Accommodation</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <Check className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                                  <span>Meals as per itinerary</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <Check className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                                  <span>Transportation</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <Check className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                                  <span>English-speaking guide</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <Check className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                                  <span>Entrance fees</span>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold mb-2">
                            Highlights:
                          </h4>
                          <ul className="space-y-1.5">
                            <li className="flex items-start text-sm">
                              <span className="text-primary font-bold mr-2">•</span>
                              <span>Professional guides and quality service</span>
                            </li>
                            <li className="flex items-start text-sm">
                              <span className="text-primary font-bold mr-2">•</span>
                              <span>Authentic local experiences</span>
                            </li>
                            <li className="flex items-start text-sm">
                              <span className="text-primary font-bold mr-2">•</span>
                              <span>Comfortable accommodations</span>
                            </li>
                            <li className="flex items-start text-sm">
                              <span className="text-primary font-bold mr-2">•</span>
                              <span>Well-planned itinerary</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Travel Tips */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-4">Destination Tips</h3>
                      
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Best Time to Visit</p>
                            <p className="text-xs text-muted-foreground">October to April offers the most pleasant weather.</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Coffee className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Local Cuisine</p>
                            <p className="text-xs text-muted-foreground">Try the traditional dishes for an authentic experience.</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Car className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Getting Around</p>
                            <p className="text-xs text-muted-foreground">Transportation is included in your package.</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Mountain className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Must-See Attractions</p>
                            <p className="text-xs text-muted-foreground">All the major attractions are covered in your itinerary.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PackageLayout>
  );
}