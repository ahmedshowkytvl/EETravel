import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  MapPin, 
  Calendar,
  Clock,
  Star,
  Heart,
  BedDouble,
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

interface PackageDate {
  date: string;
  availability: string;
  spotsLeft: number;
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

  // Example package dates for display
  const getPackageDates = (pkg: ApiPackage): PackageDate[] => {
    // In a real app, these would come from the database
    return [
      { date: "May 15-22, 2025", availability: "Available", spotsLeft: 15 },
      { date: "June 10-17, 2025", availability: "Limited", spotsLeft: 4 }
    ];
  };

  // Example package highlights
  const getPackageHighlights = (pkg: ApiPackage): string[] => {
    // In a real app, these would come from the database
    if (pkg.title.includes("Nile")) {
      return [
        "Guided tour of the Great Pyramids of Giza",
        "Luxury Nile cruise from Luxor to Aswan", 
        "Visit to Abu Simbel temples",
        "Valley of the Kings exploration"
      ];
    } else if (pkg.title.includes("Dubai")) {
      return [
        "Desert safari adventure", 
        "Visit to Burj Khalifa", 
        "Dubai Mall shopping experience",
        "Traditional dhow cruise dinner"
      ];
    } else {
      return [
        "Guided tours of historical sites",
        "Cultural experiences with locals",
        "Luxury accommodations",
        "All transportation included"
      ];
    }
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
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Filter Results</h3>
                <div>
                  <h4 className="font-medium mb-2">Price Range</h4>
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
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Duration</h4>
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
                <h4 className="font-medium mb-2">Accommodation Level</h4>
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
              <div className="h-12 w-12 mx-auto text-gray-300 mb-3">📦</div>
              <h3 className="text-lg font-medium mb-2">No packages found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search filters for more results.
              </p>
              <Button onClick={() => window.history.back()} variant="outline">
                Go Back
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Left content section (info) */}
                    <div className="p-6 md:w-2/3">
                      {/* Package Header */}
                      <div className="mb-4">
                        <h2 className="text-2xl font-bold">{pkg.title}</h2>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin size={16} className="mr-1" />
                          <span>{getDestinationName(pkg.destinationId)}</span>
                        </div>
                      </div>
                    
                    {/* Key Package Info */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center">
                        <Clock size={16} className="text-blue-600 mr-2" />
                        <span>{pkg.duration} days, {pkg.duration - 1} nights</span>
                      </div>
                      
                      <div className="flex items-center">
                        <BedDouble size={16} className="text-blue-600 mr-2" />
                        <span>{pkg.type || '4-star hotels'}</span>
                      </div>
                    </div>
                    
                    {/* Package Description */}
                    <p className="text-gray-700 mb-4">
                      {pkg.description}
                    </p>
                    
                    {/* Package Highlights */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Package Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                        {getPackageHighlights(pkg).map((highlight, idx) => (
                          <div key={idx} className="flex items-start">
                            <div className="text-green-500 mr-2">•</div>
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Package Includes */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Package Includes</h3>
                      <div className="flex flex-wrap gap-2">
                        {pkg.inclusions?.map((inclusion, idx) => (
                          <Badge key={idx} variant="outline" className="bg-green-50">{inclusion}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Available Dates */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Available Dates</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {getPackageDates(pkg).map((date, idx) => (
                          <div key={idx} className="flex items-center justify-between border rounded-md px-3 py-2">
                            <span>{date.date}</span>
                            <span className={date.availability === 'Limited' ? 'text-orange-500 text-sm' : 'text-green-500 text-sm'}>
                              {date.availability}
                              {date.availability === 'Limited' && ` • ${date.spotsLeft} spots left`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price and Book */}
                    <div className="flex flex-wrap justify-between items-center mt-6 pt-4 border-t">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          ${pkg.discountedPrice || pkg.price}
                          {pkg.discountedPrice && (
                            <span className="text-sm line-through text-gray-400 ml-2">
                              ${pkg.price}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">per person</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            if (pkg.slug) {
                              setLocation(`/packages/${pkg.slug}`);
                            } else {
                              setLocation(`/packages/${pkg.id}`);
                            }
                          }}
                        >
                          View Details
                        </Button>
                        <Button>Book Package</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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