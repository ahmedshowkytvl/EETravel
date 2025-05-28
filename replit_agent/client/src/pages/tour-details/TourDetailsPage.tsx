import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  Heart, 
  CheckCircle, 
  Info,
  Map,
  MessageCircle,
  Calendar as CalendarIcon
} from 'lucide-react';

// Mock tour data - in a real app this would come from an API call based on ID
const getTourById = (id: string) => {
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
      notIncludes: ['Flights', 'Lunch & Dinner', 'Personal Expenses', 'Tips'],
      groupSize: '2-15 people',
      tourDates: [
        { date: 'May 15-18, 2025', availability: 'Available', spotsLeft: 8 },
        { date: 'June 10-13, 2025', availability: 'Limited', spotsLeft: 3 },
        { date: 'July 5-8, 2025', availability: 'Available', spotsLeft: 12 }
      ],
      description: 'Explore the wonders of ancient Egypt in this comprehensive tour of Cairo and the Pyramids of Giza. Experience the history and culture of Egypt with expert guides.',
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Cairo',
          description: 'Welcome to Cairo! Upon arrival at Cairo International Airport, you will be met by our representative and transferred to your hotel. Rest of the day at leisure to settle in.',
          meals: ['Dinner']
        },
        {
          day: 2,
          title: 'Pyramids & Sphinx',
          description: 'Full day tour of the Pyramids of Giza, the Sphinx, and the Valley Temple. After lunch, visit to the ancient capital of Memphis and the Step Pyramid at Saqqara.',
          meals: ['Breakfast', 'Lunch']
        },
        {
          day: 3,
          title: 'Egyptian Museum & Old Cairo',
          description: 'Morning visit to the Egyptian Museum featuring artifacts from the Pharaonic period. Afternoon tour of Old Cairo including the Citadel of Saladin, the Alabaster Mosque, and Khan el-Khalili bazaar.',
          meals: ['Breakfast', 'Lunch']
        },
        {
          day: 4,
          title: 'Nile Cruise & Departure',
          description: 'Morning at leisure for last-minute shopping. Afternoon Nile River cruise with dinner and entertainment. Transfer to the airport for departure.',
          meals: ['Breakfast', 'Dinner']
        }
      ],
      galleryImages: [
        'https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=2071&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1470&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590133324192-1df305deeefc?q=80&w=1472&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1470&auto=format&fit=crop'
      ]
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
      notIncludes: ['Flights', 'Lunch & Dinner', 'Personal Expenses', 'Tips'],
      groupSize: '2-12 people',
      tourDates: [
        { date: 'May 20-22, 2025', availability: 'Available', spotsLeft: 10 },
        { date: 'June 15-17, 2025', availability: 'Limited', spotsLeft: 2 },
        { date: 'July 10-12, 2025', availability: 'Available', spotsLeft: 8 }
      ],
      description: 'Discover the ancient wonders of Luxor and the Valley of the Kings in this immersive tour. Explore temples, tombs, and the rich history of ancient Egypt.',
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Luxor',
          description: 'Arrival at Luxor Airport and transfer to your hotel. Evening visit to Luxor Temple illuminated at night.',
          meals: ['Dinner']
        },
        {
          day: 2,
          title: 'West Bank & Valley of the Kings',
          description: 'Full day tour of the West Bank including the Valley of the Kings, Temple of Queen Hatshepsut, and the Colossi of Memnon.',
          meals: ['Breakfast', 'Lunch']
        },
        {
          day: 3,
          title: 'Karnak Temple & Departure',
          description: 'Morning visit to the vast Karnak Temple complex. Afternoon at leisure before transfer to the airport for departure.',
          meals: ['Breakfast']
        }
      ],
      galleryImages: [
        'https://images.unsplash.com/photo-1587975844577-32c3dd6de574?q=80&w=2072&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1623743932725-3c979b11914b?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1552159475-c2fa6d1476a5?q=80&w=1972&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1569331342262-a517855effa9?q=80&w=1974&auto=format&fit=crop'
      ]
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
      notIncludes: ['Flights', 'Personal Expenses', 'Tips', 'Optional Excursions'],
      groupSize: '10-30 people',
      tourDates: [
        { date: 'May 25-29, 2025', availability: 'Limited', spotsLeft: 4 },
        { date: 'June 20-24, 2025', availability: 'Available', spotsLeft: 15 },
        { date: 'July 15-19, 2025', availability: 'Available', spotsLeft: 12 }
      ],
      description: 'Experience the majesty of the Nile River and the grandeur of Abu Simbel on this luxury cruise tour. Enjoy comfortable accommodations, gourmet meals, and expert guides.',
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Aswan',
          description: 'Arrive in Aswan and check in to your Nile cruise ship. Afternoon visit to the Aswan High Dam and the Temple of Philae.',
          meals: ['Lunch', 'Dinner']
        },
        {
          day: 2,
          title: 'Abu Simbel Excursion',
          description: 'Early morning excursion to the magnificent temples of Abu Simbel. Return to the cruise ship for lunch and sail to Kom Ombo.',
          meals: ['Breakfast', 'Lunch', 'Dinner']
        },
        {
          day: 3,
          title: 'Kom Ombo & Edfu',
          description: 'Morning visit to the Temple of Kom Ombo. Sail to Edfu and visit the Temple of Horus, one of the best-preserved temples in Egypt.',
          meals: ['Breakfast', 'Lunch', 'Dinner']
        },
        {
          day: 4,
          title: 'Luxor East Bank',
          description: 'Sail to Luxor and visit the East Bank including Karnak and Luxor Temples.',
          meals: ['Breakfast', 'Lunch', 'Dinner']
        },
        {
          day: 5,
          title: 'Luxor West Bank & Departure',
          description: 'Visit the West Bank of Luxor including the Valley of the Kings, the Temple of Queen Hatshepsut, and the Colossi of Memnon. Transfer to Luxor Airport for departure.',
          meals: ['Breakfast']
        }
      ],
      galleryImages: [
        'https://images.unsplash.com/photo-1566288623394-377af472d81b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1668681105545-48d792fed4c3?q=80&w=2072&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1668787183695-0da0beddff49?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1662416222448-d31d60d487d4?q=80&w=1974&auto=format&fit=crop'
      ]
    }
  ];
  
  return tours.find(tour => tour.id === parseInt(id)) || null;
};

// Helper function to render rating stars
const renderStars = (rating: number) => {
  return Array(5).fill(0).map((_, i) => (
    <Star 
      key={i} 
      size={16} 
      className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
    />
  ));
};

const TourDetailsPage: React.FC = () => {
  const params = useParams();
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (params && params.id) {
      // In a real app, you would fetch tour data from an API
      const tourData = getTourById(params.id);
      setTour(tourData);
      setLoading(false);
    }
  }, [params]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <p>Loading tour details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!tour) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tour Not Found</h1>
            <p>The tour you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-8 h-[400px]">
          <img 
            src={tour.image} 
            alt={tour.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{tour.name}</h1>
            <div className="flex items-center mb-2">
              <MapPin size={16} className="mr-1" />
              <span>{tour.location}</span>
            </div>
            <div className="flex items-center">
              <div className="flex mr-3">
                {renderStars(tour.rating)}
                <span className="ml-2">{tour.rating}</span>
              </div>
              <span className="text-sm">({tour.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Tour Highlights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tour.highlights.map((highlight: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle size={18} className="text-primary mr-2 flex-shrink-0 mt-1" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Description</h2>
                    <p className="text-muted-foreground">{tour.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">What's Included</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {tour.includes.map((item: string, index: number) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle size={16} className="text-green-500 mr-2" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Not Included</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {tour.notIncludes.map((item: string, index: number) => (
                            <li key={index} className="flex items-center">
                              <Info size={16} className="text-red-500 mr-2" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="itinerary" className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Tour Itinerary</h2>
                <div className="space-y-6">
                  {tour.itinerary.map((day: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            {day.day}
                          </span>
                          <span>{day.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{day.description}</p>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Meals:</span>
                          <div className="flex gap-2">
                            {day.meals.map((meal: string, i: number) => (
                              <Badge key={i} variant="outline">{meal}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="gallery" className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Tour Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.galleryImages.map((image: string, index: number) => (
                    <div key={index} className="rounded-lg overflow-hidden h-64">
                      <img 
                        src={image} 
                        alt={`Gallery image ${index+1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Customer Reviews</h2>
                  <Button>Write a Review</Button>
                </div>
                <div className="bg-muted p-6 rounded-lg mb-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4">JD</div>
                    <div>
                      <h3 className="font-medium">John Doe</h3>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className="fill-yellow-400 text-yellow-400" 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">May 10, 2024</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Absolutely amazing tour! The guide was knowledgeable and friendly. The itinerary was well-planned with enough free time to explore on our own. I learned so much about Egyptian history and culture. Highly recommend!
                  </p>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4">SM</div>
                    <div>
                      <h3 className="font-medium">Sarah Miller</h3>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {Array(4).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className="fill-yellow-400 text-yellow-400" 
                            />
                          ))}
                          <Star size={14} className="text-gray-300" />
                        </div>
                        <span className="text-sm text-muted-foreground">April 22, 2024</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Great experience overall. The accommodations were comfortable and the food was delicious. The only reason I'm giving 4 stars instead of 5 is because our flight was delayed and we had to rush through some of the sites. Would definitely book with this company again.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {tour.currency} {tour.price}
                  <span className="text-sm font-normal ml-1">
                    {tour.pricePerPerson ? 'per person' : 'total'}
                  </span>
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center mb-1">
                    <Clock size={16} className="mr-1" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    <span>Group size: {tour.groupSize}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <select className="w-full p-2 border rounded-md">
                    {tour.tourDates.map((date: any, index: number) => (
                      <option key={index} value={date.date}>
                        {date.date} ({date.availability}, {date.spotsLeft} spots left)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Travelers</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs mb-1">Adults</label>
                      <select className="w-full p-2 border rounded-md">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Children</label>
                      <select className="w-full p-2 border rounded-md">
                        {[0, 1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex-col space-y-3">
                <Button className="w-full">Book Now</Button>
                <Button variant="outline" className="w-full">
                  <Heart size={16} className="mr-2" /> Add to Wishlist
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Free cancellation up to 24 hours before the tour
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TourDetailsPage;