import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Building as BuildingIcon, 
  MapPin as MapPinIcon, 
  Star as StarIcon,
  Wifi as WifiIcon,
  Utensils as UtensilsIcon,
  Dumbbell as DumbbellIcon,
  Car as ParkingIcon,
  Calendar as CalendarIcon,
  BedDouble as BedDoubleIcon,
  Users as UsersIcon,
  Filter as FilterIcon
} from 'lucide-react';
import { hotelsData, Hotel, HotelsFilterState, defaultHotelsFilter, filterHotels, popularAmenities, hotelTypes } from '@/data/hotels';

// Create a custom SwimmingPoolIcon since it's not in lucide-react
const CustomSwimmingPoolIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M2 12h20M2 20h20M16 12s0-10-8-8c0 0-8 2-8 8h16Z" />
    <path d="M7 13v3M12 17v1M17 16v2" />
  </svg>
);

const HotelsSearchResults: React.FC = () => {
  const [filters, setFilters] = useState<HotelsFilterState>({...defaultHotelsFilter});
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(hotelsData);
  const [selectedStarRatings, setSelectedStarRatings] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([defaultHotelsFilter.minPrice, defaultHotelsFilter.maxPrice]);
  const [distanceFromCenter, setDistanceFromCenter] = useState<number>(defaultHotelsFilter.distanceFromCenter);
  const [reviewScore, setReviewScore] = useState<number>(defaultHotelsFilter.reviewScore);

  // Initial filtering when component mounts
  useEffect(() => {
    setFilteredHotels(hotelsData);
  }, []);

  // Apply filters
  const applyFilters = () => {
    const newFilters: HotelsFilterState = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      starRating: selectedStarRatings,
      amenities: selectedAmenities,
      distanceFromCenter: distanceFromCenter,
      hotelType: selectedHotelTypes,
      reviewScore: reviewScore
    };
    
    setFilters(newFilters);
    const filtered = filterHotels(hotelsData, newFilters);
    setFilteredHotels(filtered);
  };

  // Handle star rating selection
  const handleStarRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setSelectedStarRatings(prev => [...prev, rating]);
    } else {
      setSelectedStarRatings(prev => prev.filter(r => r !== rating));
    }
  };

  // Handle amenity selection
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities(prev => [...prev, amenity]);
    } else {
      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
    }
  };

  // Handle hotel type selection
  const handleHotelTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedHotelTypes(prev => [...prev, type]);
    } else {
      setSelectedHotelTypes(prev => prev.filter(t => t !== type));
    }
  };
  
  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };
  
  // Helper function to render amenity icons
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi':
        return <WifiIcon size={16} />;
      case 'swimming pool':
        return <CustomSwimmingPoolIcon width={16} height={16} />;
      case 'restaurant':
        return <UtensilsIcon size={16} />;
      case 'fitness center':
        return <DumbbellIcon size={16} />;
      case 'free parking':
      case 'parking':
        return <ParkingIcon size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Hotel Search Results</h1>
        <p className="text-lg text-muted-foreground">
          Cairo, Egypt - May 15-17, 2025 - 2 Nights, 2 Adults
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FilterIcon className="mr-2" size={18} />
                Filter Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Price Range (per night)</h3>
                <div className="flex items-center gap-2">
                  <Slider
                    defaultValue={[priceRange[0], priceRange[1]]}
                    max={300}
                    min={40}
                    step={10}
                    onValueChange={(value) => setPriceRange([value[0], value[1]])}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Star Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2].map(rating => (
                    <div key={rating} className="flex items-center">
                      <Checkbox 
                        id={`star-${rating}`} 
                        className="mr-2"
                        onCheckedChange={(checked) => 
                          handleStarRatingChange(rating, checked === true)
                        }
                      />
                      <Label htmlFor={`star-${rating}`} className="flex">
                        {renderStars(rating)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Amenities</h3>
                <div className="space-y-2">
                  {popularAmenities.slice(0, 6).map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Checkbox 
                        id={`amenity-${index}`} 
                        className="mr-2"
                        onCheckedChange={(checked) => 
                          handleAmenityChange(amenity, checked === true)
                        }
                      />
                      <Label htmlFor={`amenity-${index}`} className="flex items-center">
                        {getAmenityIcon(amenity)}
                        <span className="ml-1">{amenity}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Property Type</h3>
                <div className="space-y-2">
                  {hotelTypes.map((type, index) => (
                    <div key={index} className="flex items-center">
                      <Checkbox 
                        id={`type-${index}`} 
                        className="mr-2"
                        onCheckedChange={(checked) => 
                          handleHotelTypeChange(type, checked === true)
                        }
                      />
                      <Label htmlFor={`type-${index}`}>{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Distance from City Center</h3>
                <div className="flex items-center gap-2">
                  <Slider
                    defaultValue={[distanceFromCenter]}
                    max={10}
                    min={0}
                    step={1}
                    onValueChange={(value) => setDistanceFromCenter(value[0])}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span>0 km</span>
                  <span>{distanceFromCenter} km</span>
                </div>
              </div>

              <Button className="w-full" onClick={applyFilters}>
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Hotel results */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground">
                {filteredHotels.length} hotels found
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <select className="p-2 border rounded-md text-sm">
                <option value="recommended">Recommended</option>
                <option value="price">Price (lowest first)</option>
                <option value="rating">Rating (highest first)</option>
                <option value="distance">Distance (closest first)</option>
              </select>
            </div>
          </div>

          {filteredHotels.length > 0 ? (
            <div className="space-y-4">
              {filteredHotels.map(hotel => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                    <div className="md:col-span-4 h-[200px] md:h-full">
                      <img 
                        src={hotel.image} 
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="md:col-span-8">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{hotel.name}</CardTitle>
                            <div className="flex items-center mt-1">
                              <MapPinIcon size={16} className="text-muted-foreground mr-1" />
                              <span className="text-sm text-muted-foreground">{hotel.city}, {hotel.country}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">
                                {hotel.distance}
                              </span>
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                                {hotel.hotelType}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end mb-1">
                              {renderStars(hotel.starRating)}
                            </div>
                            <span className="text-sm text-muted-foreground">{hotel.reviewCount} reviews</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="py-2">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {hotel.amenities.slice(0, 5).map((amenity, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </Badge>
                          ))}
                          {hotel.amenities.length > 5 && (
                            <Badge variant="outline">+{hotel.amenities.length - 5} more</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <CalendarIcon size={14} className="mr-1" />
                          <span>{hotel.checkIn} to {hotel.checkOut}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <BedDoubleIcon size={14} className="mr-1" />
                          <span>{hotel.availableRooms} rooms left at this price</span>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between items-center pt-2">
                        <div>
                          <div className="text-2xl font-bold">
                            {hotel.currency} {hotel.price}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {hotel.pricePerNight ? 'per night' : 'total'}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" onClick={() => window.location.href = `/hotel/${hotel.id}`}>
                            View Details
                          </Button>
                          <Button onClick={() => window.location.href = `/hotel/${hotel.id}`}>
                            Select Room
                          </Button>
                        </div>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredHotels.length > 10 && (
                <div className="flex justify-center mt-6">
                  <Button variant="outline" className="mr-2">Previous</Button>
                  <Button variant="outline">Next</Button>
                </div>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="text-3xl mb-2">🏨</div>
              <h3 className="text-xl font-medium mb-2">No hotels found</h3>
              <p className="text-muted-foreground mb-4">
                No hotels match your current filter criteria. Try adjusting your filters.
              </p>
              <Button onClick={() => {
                setFilters({...defaultHotelsFilter});
                setPriceRange([defaultHotelsFilter.minPrice, defaultHotelsFilter.maxPrice]);
                setSelectedStarRatings([]);
                setSelectedAmenities([]);
                setSelectedHotelTypes([]);
                setDistanceFromCenter(defaultHotelsFilter.distanceFromCenter);
                setReviewScore(defaultHotelsFilter.reviewScore);
                setFilteredHotels(hotelsData);
              }}>
                Reset Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelsSearchResults;