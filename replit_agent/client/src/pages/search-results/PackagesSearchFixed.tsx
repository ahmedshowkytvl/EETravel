import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Package as PackageIcon,
  MapPin, 
  Calendar,
  Clock,
  Star,
  Heart,
  Utensils,
  BedDouble,
  Plane,
  Car,
  Ticket,
  Info,
  Check,
  Loader2
} from 'lucide-react';

// Define API package type (matches database schema)
interface ApiPackage {
  id: number;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  duration: number;
  destinationId?: number;
  imageUrl?: string;
  featured?: boolean;
  type?: string;
  inclusions?: string[];
  rating?: number;
  reviewCount?: number;
  slug?: string;
}

// Define destination type (for location mapping)
interface Destination {
  id: number;
  name: string;
  country: string;
  description?: string;
  imageUrl?: string;
}

const PackagesSearchResults: React.FC = () => {
  const [location, setLocation] = useLocation();
  
  // Parse URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const countryParam = searchParams.get('country') || '';
  const cityParam = searchParams.get('city') || '';
  const dateParam = searchParams.get('date') || '';
  const durationParam = searchParams.get('duration') || '';
  const packageTypeParam = searchParams.get('type') || '';
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
    location: cityParam ? `${cityParam}, ${countryParam}` : countryParam || 'All Destinations',
    date: formatDate(dateParam),
    guests: adults + (children > 0 ? `, ${children} children` : '') + (infants > 0 ? `, ${infants} infants` : '')
  };
  
  // Fetch all packages from API
  const { data: packages = [], isLoading: isLoadingPackages } = useQuery<ApiPackage[]>({
    queryKey: ['/api/packages'],
    retry: 1,
  });

  // Fetch destinations for mapping IDs to locations
  const { data: destinations = [] } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
    retry: 1,
  });
  
  // Get destination name helper function
  const getDestinationName = (destinationId?: number) => {
    if (!destinationId) return 'Multiple Locations';
    const destination = destinations.find(d => d.id === destinationId);
    return destination ? `${destination.name}, ${destination.country}` : 'Unknown Location';
  };

  // Filter packages based on search criteria
  const [filteredPackages, setFilteredPackages] = useState<ApiPackage[]>([]);
  
  useEffect(() => {
    // Apply filtering when packages or search params change
    const filtered = packages.filter(pkg => {
      const destination = pkg.destinationId ? 
        destinations.find(d => d.id === pkg.destinationId) : null;
      
      // Filter by country
      if (countryParam && destination) {
        if (!destination.country.toLowerCase().includes(countryParam.toLowerCase())) {
          return false;
        }
      }
      
      // Filter by city
      if (cityParam && destination) {
        if (!destination.name.toLowerCase().includes(cityParam.toLowerCase())) {
          return false;
        }
      }
      
      // Filter by type
      if (packageTypeParam && pkg.type) {
        if (!pkg.type.toLowerCase().includes(packageTypeParam.toLowerCase())) {
          return false;
        }
      }
      
      // Filter by duration
      if (durationParam) {
        const days = pkg.duration;
        
        switch(durationParam) {
          case '1-3days':
            if (days < 1 || days > 3) return false;
            break;
          case '4-7days':
            if (days < 4 || days > 7) return false;
            break;
          case '8-14days':
            if (days < 8 || days > 14) return false;
            break;
          case '15plusdays':
            if (days < 15) return false;
            break;
        }
      }
      
      return true;
    });
    
    setFilteredPackages(filtered);
  }, [packages, destinations, countryParam, cityParam, packageTypeParam, durationParam]);
  
  // Helper function to render stars for ratings
  const renderStars = (rating: number = 5) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
      />
    ));
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
                </div>
              </div>

              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
          
          {/* Package Tips Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Travel Package Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-2">
                <div className="h-5 w-5 text-green-500 shrink-0 flex items-center justify-center">✓</div>
                <p>Book 3-6 months in advance for the best deals.</p>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 text-green-500 shrink-0 flex items-center justify-center">✓</div>
                <p>Consider Apr-May or Sep-Oct for fewer crowds.</p>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 text-green-500 shrink-0 flex items-center justify-center">✓</div>
                <p>Packages include guides who speak English and Arabic.</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Results list */}
        <div className="lg:col-span-3">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
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
          
          {isLoadingPackages ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPackages.length === 0 ? (
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
                        src={pkg.imageUrl || 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=800'}
                        alt={pkg.title}
                        className="h-full w-full object-cover"
                      />
                      <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm">
                        <Heart className="h-5 w-5 text-rose-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 flex flex-col">
                    <CardContent className="pt-6 flex-grow">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <h2 className="text-xl font-bold">{pkg.title}</h2>
                        <div className="flex items-center">
                          {renderStars(pkg.rating || 5)}
                          <span className="ml-1 text-sm text-muted-foreground">
                            ({pkg.reviewCount || 0} reviews)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm mb-3 text-muted-foreground">
                        <MapPin size={14} className="mr-1" />
                        <span>{getDestinationName(pkg.destinationId)}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50">
                          <Clock size={12} />
                          <span>{pkg.duration} days</span>
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50">
                          <BedDouble size={12} />
                          <span>{pkg.type || 'Standard'}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {pkg.description}
                      </p>
                      
                      <div className="mb-3">
                        <h3 className="text-sm font-medium mb-1">Package Includes</h3>
                        <div className="flex flex-wrap gap-2">
                          {pkg.inclusions && pkg.inclusions.map((item, index) => (
                            <Badge key={index} variant="outline" className="bg-green-50">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t bg-muted/50 flex-wrap gap-y-3">
                      <div className="flex items-center mr-auto">
                        <div className="text-2xl font-bold mr-1">
                          ${pkg.discountedPrice || pkg.price}
                        </div>
                        {pkg.discountedPrice && (
                          <div className="text-sm line-through text-muted-foreground mr-1">
                            ${pkg.price}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          per person
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            // Always use the slug from the package database
                            if (pkg.slug) {
                              setLocation(`/packages/${pkg.slug}`);
                            } else {
                              // Fallback to using ID if no slug (should not happen with your database)
                              setLocation(`/packages/${pkg.id}`);
                            }
                          }}
                        >
                          View Details
                        </Button>
                        <Button>Book Package</Button>
                      </div>
                    </CardFooter>
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