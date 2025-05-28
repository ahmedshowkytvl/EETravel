import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { 
  Route as RouteIcon,
  MapPin as MapPinIcon, 
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Users as UsersIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  DollarSign as DollarSignIcon,
  Compass as CompassIcon,
  Utensils as UtensilsIcon,
  BedDouble as BedDoubleIcon,
  Car as CarIcon,
  Info as InfoIcon,
  Search as SearchIcon
} from 'lucide-react';

// Create a CustomGuideIcon since it's not in lucide-react
const CustomGuideIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const ToursSearchResults: React.FC = () => {
  // Fetch tour categories from the database
  const { data: tourCategories = [] } = useQuery<any[]>({
    queryKey: ['/api/tour-categories'],
    select: (data: any[]) => 
      data
        .filter((category: any) => category.active)
        .map((category: any) => ({
          id: category.id,
          name: category.name
        }))
  });
  
  // Mock tour data - in a real app this would come from API
  const tours = [
    {
      id: 1,
      name: 'Cairo & Pyramids Explorer',
      location: 'Cairo, Egypt',
      duration: '4 days, 3 nights',
      rating: 4.8,
      reviewCount: 245,
      price: 450,
      currency: 'USD',
      pricePerPerson: true,
      image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=2069&auto=format&fit=crop',
      highlights: [
        'Guided tour of the Great Pyramids of Giza',
        'Visit to the Egyptian Museum',
        'Nile River dinner cruise',
        'Khan el-Khalili bazaar visit'
      ],
      includes: ['Accommodation', 'Breakfast', 'Transportation', 'Tour Guide', 'Entry Fees'],
      groupSize: '2-15 people',
      tourDates: [
        { date: 'May 15-18, 2025', availability: 'Available', spotsLeft: 8 },
        { date: 'June 10-13, 2025', availability: 'Limited', spotsLeft: 3 },
        { date: 'July 5-8, 2025', availability: 'Available', spotsLeft: 12 }
      ],
      description: 'Explore the wonders of ancient Egypt in this comprehensive tour of Cairo and the Pyramids of Giza. Experience the history and culture of Egypt with expert guides.'
    },
    {
      id: 2,
      name: 'Luxor & Valley of Kings Tour',
      location: 'Luxor, Egypt',
      duration: '3 days, 2 nights',
      rating: 4.7,
      reviewCount: 187,
      price: 380,
      currency: 'USD',
      pricePerPerson: true,
      image: 'https://images.unsplash.com/photo-1587975844577-32c3dd6de574?q=80&w=2072&auto=format&fit=crop',
      highlights: [
        'Valley of the Kings tour',
        'Karnak Temple visit',
        'Luxor Temple night tour',
        'Hatshepsut Temple exploration'
      ],
      includes: ['Accommodation', 'Breakfast', 'Transportation', 'Tour Guide', 'Entry Fees'],
      groupSize: '2-12 people',
      tourDates: [
        { date: 'May 20-22, 2025', availability: 'Available', spotsLeft: 10 },
        { date: 'June 15-17, 2025', availability: 'Limited', spotsLeft: 2 },
        { date: 'July 10-12, 2025', availability: 'Available', spotsLeft: 8 }
      ],
      description: 'Discover the ancient wonders of Luxor and the Valley of the Kings in this immersive tour. Explore temples, tombs, and the rich history of ancient Egypt.'
    },
    {
      id: 3,
      name: 'Nile River Cruise & Abu Simbel',
      location: 'Aswan to Luxor, Egypt',
      duration: '5 days, 4 nights',
      rating: 4.9,
      reviewCount: 312,
      price: 750,
      currency: 'USD',
      pricePerPerson: true,
      image: 'https://images.unsplash.com/photo-1566288623394-377af472d81b?q=80&w=2070&auto=format&fit=crop',
      highlights: [
        'Luxury Nile River cruise',
        'Abu Simbel temples visit',
        'Kom Ombo and Edfu temples tour',
        'Philae Temple exploration'
      ],
      includes: ['Accommodation', 'All Meals', 'Transportation', 'Tour Guide', 'Entry Fees'],
      groupSize: '10-30 people',
      tourDates: [
        { date: 'May 25-29, 2025', availability: 'Limited', spotsLeft: 4 },
        { date: 'June 20-24, 2025', availability: 'Available', spotsLeft: 15 },
        { date: 'July 15-19, 2025', availability: 'Available', spotsLeft: 12 }
      ],
      description: 'Experience the majesty of the Nile River and the grandeur of Abu Simbel on this luxury cruise tour. Enjoy comfortable accommodations, gourmet meals, and expert guides.'
    }
  ];
  
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
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Tour Search Results</h1>
          <p className="text-lg text-muted-foreground">
            Egypt Tours - May 2025, 2 Adults
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
                      max="1000" 
                      className="w-full" 
                      value="600"
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>$0</span>
                    <span>$1000</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Duration</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="1-3days" className="mr-2" checked />
                      <label htmlFor="1-3days">1-3 Days</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="4-7days" className="mr-2" checked />
                      <label htmlFor="4-7days">4-7 Days</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="8-14days" className="mr-2" />
                      <label htmlFor="8-14days">8-14 Days</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="15plus" className="mr-2" />
                      <label htmlFor="15plus">15+ Days</label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Tour Type</h3>
                  <div className="space-y-2">
                    {tourCategories.length > 0 ? (
                      tourCategories.map((category: any) => (
                        <div key={category.id} className="flex items-center">
                          <Checkbox id={`category-${category.id}`} className="mr-2" />
                          <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                            {category.name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">Loading categories...</div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Destinations</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="cairo" className="mr-2" checked />
                      <label htmlFor="cairo">Cairo</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="luxor" className="mr-2" checked />
                      <label htmlFor="luxor">Luxor</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="aswan" className="mr-2" checked />
                      <label htmlFor="aswan">Aswan</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="alexandria" className="mr-2" />
                      <label htmlFor="alexandria">Alexandria</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="hurghada" className="mr-2" />
                      <label htmlFor="hurghada">Hurghada</label>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </CardContent>
            </Card>
            
            {/* Popular Tours Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CompassIcon className="mr-2" size={18} />
                  Popular Tours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1470&auto=format&fit=crop" 
                      alt="Pyramids"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Giza Pyramids Day Tour</h4>
                    <p className="text-muted-foreground text-xs">From $95 per person</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1470&auto=format&fit=crop" 
                      alt="Nile Cruise"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Nile River Dinner Cruise</h4>
                    <p className="text-muted-foreground text-xs">From $70 per person</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1590133324192-1df305deeefc?q=80&w=1472&auto=format&fit=crop" 
                      alt="Cairo Museum"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Egyptian Museum Tour</h4>
                    <p className="text-muted-foreground text-xs">From $55 per person</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-2">
                  <SearchIcon className="mr-2" size={14} />
                  View More Tours
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tour results */}
          <div className="lg:col-span-3 space-y-6">
            {tours.map(tour => (
              <Card key={tour.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  <div className="md:col-span-4 h-[240px] md:h-full">
                    <img 
                      src={tour.image} 
                      alt={tour.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="md:col-span-8">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{tour.name}</CardTitle>
                          <div className="flex items-center mt-1">
                            <MapPinIcon size={14} className="text-muted-foreground mr-1" />
                            <span className="text-sm text-muted-foreground">{tour.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end mb-1">
                            {renderStars(tour.rating)}
                            <span className="ml-2 text-sm font-medium">{tour.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{tour.reviewCount} reviews</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="py-2">
                      <div className="flex flex-wrap gap-3 mb-3">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <ClockIcon size={12} />
                          <span>{tour.duration}</span>
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <UsersIcon size={12} />
                          <span>{tour.groupSize}</span>
                        </Badge>
                        {tour.includes.includes('Tour Guide') && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <CustomGuideIcon width={12} height={12} />
                            <span>Guided</span>
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {tour.description}
                      </p>
                      
                      <div className="mb-3">
                        <h3 className="text-sm font-medium mb-1">Tour Highlights</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                          {tour.highlights.map((highlight, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-center">
                              <span className="mr-1.5 text-primary">•</span>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-xs font-medium">Includes:</span>
                        {tour.includes.map((item, index) => {
                          let icon = null;
                          switch (item) {
                            case 'Accommodation':
                              icon = <BedDoubleIcon size={12} />;
                              break;
                            case 'Breakfast':
                            case 'All Meals':
                              icon = <UtensilsIcon size={12} />;
                              break;
                            case 'Transportation':
                              icon = <CarIcon size={12} />;
                              break;
                            case 'Tour Guide':
                              icon = <CustomGuideIcon width={12} height={12} />;
                              break;
                            default:
                              icon = null;
                          }
                          
                          return (
                            <span key={index} className="text-xs flex items-center gap-1 text-muted-foreground">
                              {icon && icon}
                              {item}
                            </span>
                          );
                        })}
                      </div>
                      
                      <div className="space-y-1 mb-2">
                        <h3 className="text-sm font-medium">Available Dates</h3>
                        {tour.tourDates.slice(0, 2).map((date, index) => (
                          <div key={index} className="flex justify-between items-center text-xs">
                            <span>{date.date}</span>
                            <Badge 
                              variant={date.availability === 'Limited' ? 'default' : 'outline'}
                              className={date.availability === 'Limited' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' : ''}
                            >
                              {date.availability === 'Limited' ? `${date.spotsLeft} spots left` : 'Available'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between items-center pt-2">
                      <div>
                        <div className="text-2xl font-bold">
                          {tour.currency} {tour.price}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {tour.pricePerPerson ? 'per person' : 'total'}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                          <HeartIcon size={16} />
                        </Button>
                        <Button variant="outline" onClick={() => window.location.href = `/tour/${tour.id}`}>
                          View Details
                        </Button>
                        <Button>Book Now</Button>
                      </div>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
            
            <div className="flex justify-center mt-6">
              <Button variant="outline" className="mr-2">Previous</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ToursSearchResults;