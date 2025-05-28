import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Package as PackageIcon,
  MapPin as MapPinIcon, 
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Utensils as UtensilsIcon,
  BedDouble as BedDoubleIcon,
  Plane as PlaneIcon,
  Car as CarIcon,
  Ticket as TicketIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Sun as SunIcon,
  Moon as MoonIcon
} from 'lucide-react';

// Create a CustomPalmTreeIcon since it's not in lucide-react
const CustomPalmTreeIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    {...props}
  >
    <path d="M12 3v18" />
    <path d="M8 14c2.5-3 3-7 3-9 0 2 .5 6 3 9" />
    <path d="M5 16c1-1 2-3 2-5 0 2 1 4 2 5" />
    <path d="M19 16c-1-1-2-3-2-5 0 2-1 4-2 5" />
  </svg>
);

interface PackageDate {
  date: string;
  availability: string;
  spotsLeft: number;
}

interface PackageData {
  id: number;
  name: string;
  locations: string[];
  mainLocation: string;
  duration: string;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  pricePerPerson: boolean;
  image: string;
  highlights: string[];
  includes: string[];
  accommodationLevel: string;
  packageDates: PackageDate[];
  description: string;
  activities: string[];
  slug?: string; // Add slug for SEO-friendly URLs
}

const PackagesSearchResults: React.FC = () => {
  const [location, setLocation] = useLocation();
  
  // Parse URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const country = searchParams.get('country') || 'Egypt';
  const city = searchParams.get('city') || '';
  const date = searchParams.get('date') || '';
  const duration = searchParams.get('duration') || '';
  const packageType = searchParams.get('type') || '';
  const adults = parseInt(searchParams.get('adults') || '2', 10);
  const children = parseInt(searchParams.get('children') || '0', 10);
  const infants = parseInt(searchParams.get('infants') || '0', 10);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'May 2025'; // Default display if no date
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long'
      });
    } catch {
      return 'May 2025';
    }
  };
  
  // Format search criteria for display
  const searchCriteria = {
    location: city ? `${city}, ${country}` : country,
    date: formatDate(date),
    guests: adults + (children > 0 ? `, ${children} children` : '') + (infants > 0 ? `, ${infants} infants` : '')
  };
  
  // Fetch real packages from the API
  const { data: apiPackages = [], isLoading: isLoadingPackages } = useQuery<any[]>({
    queryKey: ['/api/packages'],
    retry: 1,
  });
  
  // Transform API packages to match the PackageData format needed by this page
  const packages: PackageData[] = useMemo(() => {
    return apiPackages.map(pkg => ({
      id: pkg.id,
      name: pkg.title,
      locations: pkg.destinationId ? [`Destination ${pkg.destinationId}`] : ['Multiple Locations'],
      mainLocation: pkg.destinationId ? `Destination ${pkg.destinationId}` : 'Multiple Locations',
      duration: `${pkg.duration} days`,
      rating: pkg.rating || 4.5,
      reviewCount: pkg.reviewCount || 0,
      price: pkg.price,
      currency: 'USD',
      pricePerPerson: true,
      image: pkg.imageUrl || 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=2069&auto=format&fit=crop',
      highlights: [
        'Guided tours',
        'Luxury accommodations',
        'Cultural experiences',
        'Local cuisine'
      ],
      includes: pkg.inclusions || ['Transportation', 'Accommodation'],
      accommodationLevel: pkg.type || '4-star hotels',
      packageDates: [
        { date: 'May 15-22, 2025', availability: 'Available', spotsLeft: 12 },
        { date: 'June 10-17, 2025', availability: 'Limited', spotsLeft: 4 }
      ],
      description: pkg.description,
      activities: ['Sightseeing', 'Cultural Tours', 'Local Experiences'],
      slug: pkg.slug
    }));
  }, [apiPackages]);
    {
      id: 2,
      name: 'Cairo & Red Sea Adventure',
      locations: ['Cairo', 'Hurghada'],
      mainLocation: 'Cairo & Hurghada, Egypt',
      duration: '7 days, 6 nights',
      rating: 4.6,
      reviewCount: 187,
      price: 950,
      currency: 'USD',
      pricePerPerson: true,
      image: 'https://images.unsplash.com/photo-1581335167266-5662e1958b2f?q=80&w=2070&auto=format&fit=crop',
      highlights: [
        'Cairo city tour and pyramids visit',
        'Red Sea resort stay in Hurghada',
        'Snorkeling and diving excursions',
        'Desert safari adventure'
      ],
      includes: ['Flights', 'Accommodation', 'Some Meals', 'Transportation', 'Some Activities'],
      accommodationLevel: '4-star hotels',
      packageDates: [
        { date: 'May 18-24, 2025', availability: 'Available', spotsLeft: 10 },
        { date: 'June 15-21, 2025', availability: 'Limited', spotsLeft: 3 },
        { date: 'July 10-16, 2025', availability: 'Available', spotsLeft: 14 }
      ],
      description: 'Combine history and relaxation with this perfect blend of Cairo sightseeing and Red Sea beach resort stay in Hurghada.',
      activities: ['Sightseeing', 'Beach Activities', 'Water Sports', 'Desert Safari'],
      slug: 'cairo-red-sea-adventure'
    },
    {
      id: 3,
      name: 'Egypt Full Experience',
      locations: ['Cairo', 'Alexandria', 'Luxor', 'Aswan', 'Hurghada'],
      mainLocation: 'Multiple Cities, Egypt',
      duration: '14 days, 13 nights',
      rating: 4.9,
      reviewCount: 156,
      price: 2100,
      currency: 'USD',
      pricePerPerson: true,
      image: 'https://images.unsplash.com/photo-1552250575-e508473b090f?q=80&w=2070&auto=format&fit=crop',
      highlights: [
        'Comprehensive Egypt tour covering 5 major destinations',
        'Pyramids of Giza and Cairo Museum',
        'Alexandria Library and Qaitbay Citadel',
        'Luxury Nile cruise with all temples',
        'Red Sea resort relaxation'
      ],
      includes: ['Flights', 'Accommodation', 'All Meals', 'Transportation', 'Tour Guide', 'Entry Fees', 'Activities'],
      accommodationLevel: '5-star hotels & cruise',
      packageDates: [
        { date: 'May 20-June 2, 2025', availability: 'Limited', spotsLeft: 5 },
        { date: 'June 18-July 1, 2025', availability: 'Available', spotsLeft: 8 },
        { date: 'July 15-28, 2025', availability: 'Available', spotsLeft: 10 }
      ],
      description: 'The ultimate Egypt experience covering all major sites and experiences from historic Cairo to relaxing beaches of the Red Sea.',
      activities: ['Sightseeing', 'Cultural Tours', 'River Cruise', 'Beach Activities', 'Desert Safari', 'Historical Tours']
    }
  ];
  
  const [filteredPackages, setFilteredPackages] = useState<PackageData[]>([]);
  
  // Filter packages based on search criteria
  useEffect(() => {
    // Define a function to filter packages based on URL parameters
    const filterPackages = (packagesToFilter: PackageData[]) => {
      return packagesToFilter.filter(pkg => {
        // Filter by country
        if (country && pkg.mainLocation.toLowerCase().indexOf(country.toLowerCase()) === -1) {
          return false;
        }
        
        // Filter by city if specified
        if (city && city.length > 0) {
          const cityMatches = pkg.locations.some(
            (loc: string) => loc.toLowerCase() === city.toLowerCase()
          );
          if (!cityMatches) return false;
        }
        
        // Filter by package type if specified
        if (packageType && packageType.length > 0) {
          const typeMatches = pkg.activities.some(
            (activity: string) => activity.toLowerCase().includes(packageType.toLowerCase())
          );
          if (!typeMatches) return false;
        }
        
        // Filter by duration if specified
        if (duration && duration.length > 0) {
          // Extract days from duration string (e.g., "8 days, 7 nights" -> 8)
          const pkgDays = parseInt(pkg.duration.split(' ')[0], 10);
          
          switch(duration) {
            case '1-3days':
              if (pkgDays < 1 || pkgDays > 3) return false;
              break;
            case '4-7days':
              if (pkgDays < 4 || pkgDays > 7) return false;
              break;
            case '8-14days':
              if (pkgDays < 8 || pkgDays > 14) return false;
              break;
            case '15plusdays':
              if (pkgDays < 15) return false;
              break;
          }
        }
        
        return true;
      });
    };
    
    // Apply filters
    setFilteredPackages(filterPackages(packages));
  }, [country, city, duration, packageType]);
  
  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => {
      // For half stars
      if (i < Math.floor(rating) && i + 1 > rating) {
        return <StarIcon key={i} size={16} className="text-yellow-400 fill-yellow-400 stroke-yellow-400" />;
      }
      return (
        <StarIcon
          key={i}
          size={16}
          className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      );
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Travel Package Search Results</h1>
        <p className="text-lg text-muted-foreground">
          {searchCriteria.location} Packages - {searchCriteria.date}, {searchCriteria.guests}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filter Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Price Range (per person)</h3>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="3000" 
                    className="w-full" 
                    defaultValue="1500"
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span>$0</span>
                  <span>$3000</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Duration</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="4-7days-pkg" className="mr-2" defaultChecked />
                    <label htmlFor="4-7days-pkg">4-7 Days</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="8-14days-pkg" className="mr-2" defaultChecked />
                    <label htmlFor="8-14days-pkg">8-14 Days</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="15plus-pkg" className="mr-2" />
                    <label htmlFor="15plus-pkg">15+ Days</label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Destinations</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="cairo-pkg" className="mr-2" defaultChecked />
                    <label htmlFor="cairo-pkg">Cairo</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="luxor-pkg" className="mr-2" defaultChecked />
                    <label htmlFor="luxor-pkg">Luxor</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="aswan-pkg" className="mr-2" defaultChecked />
                    <label htmlFor="aswan-pkg">Aswan</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="hurghada-pkg" className="mr-2" defaultChecked />
                    <label htmlFor="hurghada-pkg">Hurghada</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="alexandria-pkg" className="mr-2" defaultChecked />
                    <label htmlFor="alexandria-pkg">Alexandria</label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Accommodation Level</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="3star" className="mr-2" />
                    <label htmlFor="3star">3-Star</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="4star-pkg" className="mr-2" defaultChecked />
                    <label htmlFor="4star-pkg">4-Star</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="5star-pkg" className="mr-2" defaultChecked />
                    <label htmlFor="5star-pkg">5-Star</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="luxury" className="mr-2" />
                    <label htmlFor="luxury">Luxury</label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Activities</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="sightseeing" className="mr-2" defaultChecked />
                    <label htmlFor="sightseeing">Sightseeing</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="cruise" className="mr-2" defaultChecked />
                    <label htmlFor="cruise">River Cruise</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="beach" className="mr-2" defaultChecked />
                    <label htmlFor="beach">Beach Activities</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="desert" className="mr-2" defaultChecked />
                    <label htmlFor="desert">Desert Safari</label>
                  </div>
                </div>
              </div>

              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
          
          {/* Package Tips Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <InfoIcon className="h-5 w-5 text-primary" />
                Travel Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <SunIcon className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Best time to visit Egypt is from October to April for cooler temperatures.</span>
                </li>
                <li className="flex gap-2">
                  <MoonIcon className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span>Consider a Nile cruise to see multiple destinations in one trip.</span>
                </li>
                <li className="flex gap-2">
                  <CustomPalmTreeIcon className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Packages with guided tours often let you skip long lines at popular attractions.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Search results */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <span className="text-muted-foreground">
                {filteredPackages.length} packages found
              </span>
            </div>
            <div>
              <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option>Sort: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Duration: Shortest</option>
                <option>Rating: Highest</option>
              </select>
            </div>
          </div>
          
          {filteredPackages.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <PackageIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium mb-2">No packages found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search filters for more results.
              </p>
              <Button onClick={() => window.history.back()} variant="outline">
                Go Back
              </Button>
            </div>
          ) : (
            filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="mb-6 border overflow-hidden">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <div className="h-48 md:h-full w-full relative">
                      <img 
                        src={pkg.image}
                        alt={pkg.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-0 left-0 bg-primary text-white px-2 py-1 text-xs">
                        {pkg.rating} ★ ({pkg.reviewCount} reviews)
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 flex flex-col">
                    <div className="flex-grow">
                      <CardHeader className="pb-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h2 className="text-xl font-bold">{pkg.name}</h2>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <MapPinIcon size={14} className="mr-1" />
                              <span>{pkg.mainLocation}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="py-2">
                        <div className="flex flex-wrap gap-3 mb-3">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <ClockIcon size={12} />
                            <span>{pkg.duration}</span>
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <BedDoubleIcon size={12} />
                            <span>{pkg.accommodationLevel}</span>
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {pkg.description}
                        </p>
                        
                        <div className="mb-3">
                          <h3 className="text-sm font-medium mb-1">Package Highlights</h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                            {pkg.highlights.map((highlight, index) => (
                              <li key={index} className="text-xs text-muted-foreground flex items-center">
                                <span className="mr-1.5 text-primary">•</span>
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mb-3">
                          <h3 className="text-sm font-medium mb-1">Package Includes</h3>
                          <div className="flex flex-wrap gap-2">
                            {pkg.includes.map((item, index) => {
                              let icon = null;
                              switch (item) {
                                case 'Flights':
                                  icon = <PlaneIcon size={12} />;
                                  break;
                                case 'Accommodation':
                                  icon = <BedDoubleIcon size={12} />;
                                  break;
                                case 'All Meals':
                                case 'Some Meals':
                                  icon = <UtensilsIcon size={12} />;
                                  break;
                                case 'Transportation':
                                  icon = <CarIcon size={12} />;
                                  break;
                                case 'Entry Fees':
                                  icon = <TicketIcon size={12} />;
                                  break;
                                case 'Activities':
                                  icon = <CustomPalmTreeIcon width={12} height={12} />;
                                  break;
                                default:
                                  icon = null;
                              }
                              
                              return (
                                <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs py-0.5">
                                  {icon && <span className="mr-1">{icon}</span>}
                                  {item}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <h3 className="text-sm font-medium mb-1">Available Dates</h3>
                          <div className="flex flex-wrap gap-2">
                            {pkg.packageDates.map((dateItem, index) => (
                              <div key={index} className="flex flex-col text-center">
                                <Badge variant={dateItem.availability === 'Limited' ? "secondary" : "outline"} className="whitespace-nowrap">
                                  {dateItem.date}
                                  <span className="ml-1.5">•</span>
                                  {dateItem.availability === 'Limited' ? `${dateItem.spotsLeft} spots left` : 'Available'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between items-center pt-2">
                        <div>
                          <div className="text-2xl font-bold">
                            {pkg.currency} {pkg.price}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {pkg.pricePerPerson ? 'per person' : 'total'}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              // Navigate using the package slug from the database
                              const packageSlug = pkg.slug || pkg.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                              setLocation(`/packages/${packageSlug}`);
                            }}
                          >
                            View Details
                          </Button>
                          <Button>Book Package</Button>
                        </div>
                      </CardFooter>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="mr-2">Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesSearchResults;