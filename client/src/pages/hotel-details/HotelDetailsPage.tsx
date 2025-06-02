import React, { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Star,
  Calendar,
  Clock,
  Users,
  BedDouble,
  User,
  Heart,
  CheckCircle,
  Info,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";

// Custom swimming pool icon
const SwimmingPoolIcon = ({ width = 24, height = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12.5h20"></path>
    <path d="M5 9v7.5"></path>
    <path d="M9 9v7.5"></path>
    <path d="M13 9v7.5"></path>
    <path d="M17 9v7.5"></path>
    <path d="M19 6l.5.5"></path>
    <path d="M17 7l2-2"></path>
    <path d="M22 5l-2 2"></path>
    <path d="M19 10.5c-1.333-1-2.667-1-4-1"></path>
    <path d="M12 9.5c-1.333 0-2.667 0-4 1"></path>
    <path d="M5 9.5c-1.333-1-2.667-1-4-1"></path>
    <path d="M12 14.5c-1.333-1-2.667-1-4-1"></path>
    <path d="M19 14.5c-1.333-1-2.667-1-4-1"></path>
  </svg>
);

// Custom parking icon
const ParkingIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <path d="M9 17V7h4a3 3 0 0 1 0 6H9"></path>
  </svg>
);

// Helper function to render rating stars
const renderStars = (rating: number) => {
  return Array(5)
    .fill(0)
    .map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }
      />
    ));
};

// Helper function to render amenity icons
const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case "free wifi":
    case "wifi":
      return <Star size={16} />;
    case "swimming pool":
    case "pool":
      return <SwimmingPoolIcon width={16} height={16} />;
    case "restaurant":
      return <Info size={16} />;
    case "fitness center":
    case "gym":
      return <Info size={16} />;
    case "free parking":
    case "parking":
      return <ParkingIcon size={16} />;
    default:
      return <CheckCircle size={16} />;
  }
};

// Component to display room details in a card
const RoomCard = ({
  room,
  onSelect,
}: {
  room: any;
  onSelect: (room: any) => void;
}) => {
  const amenities = Array.isArray(room.amenities)
    ? room.amenities
    : typeof room.amenities === "string"
      ? room.amenities.startsWith("[")
        ? JSON.parse(room.amenities)
        : room.amenities.split(",")
      : [];

  const displayedAmenities = Array.isArray(amenities)
    ? amenities.slice(0, 5)
    : [];
  const hasMoreAmenities = Array.isArray(amenities) && amenities.length > 5;

  return (
    <Card className="overflow-hidden mb-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        <div className="md:col-span-4 h-[200px] md:h-full">
          <img
            src={
              room.imageUrl ||
              "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop"
            }
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:col-span-8">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {room.type || "Standard"}
                </Badge>
                <CardTitle className="text-xl">{room.name}</CardTitle>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="mr-2">
                    <BedDouble size={14} className="mr-1" />
                    {room.bedType || "Queen"}
                  </Badge>
                  <Badge variant="outline" className="mr-2">
                    <User size={14} className="mr-1" />
                    {room.maxAdults} Adults
                  </Badge>
                  {room.maxChildren > 0 && (
                    <Badge variant="outline" className="mr-2">
                      {room.maxChildren} Children
                    </Badge>
                  )}
                  {room.size && <Badge variant="outline">{room.size}</Badge>}
                </div>
              </div>
              <div className="text-right">
                {room.discountedPrice && room.discountedPrice < room.price ? (
                  <>
                    <div className="text-sm line-through text-muted-foreground">
                      ${room.price} / night
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      ${room.discountedPrice} / night
                    </div>
                  </>
                ) : (
                  <div className="text-2xl font-bold">
                    ${room.price} / night
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-2">
            {room.description && (
              <p className="text-sm mb-3 text-muted-foreground">
                {room.description}
              </p>
            )}

            {displayedAmenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {displayedAmenities.map((amenity: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </Badge>
                ))}
                {hasMoreAmenities && (
                  <Badge variant="outline">+{amenities.length - 5} more</Badge>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end items-center pt-2">
            <Button onClick={() => onSelect(room)}>Book Now</Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

const HotelDetailsPage: React.FC = () => {
  const params = useParams();
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [checkInDate, setCheckInDate] = useState<string>("2025-05-15");
  const [checkOutDate, setCheckOutDate] = useState<string>("2025-05-17");
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });

  // Query to fetch hotel data
  const {
    data: hotel,
    isLoading: isLoadingHotel,
    error: hotelError,
  } = useQuery({
    queryKey: ["/api/hotels", params?.id],
    queryFn: () => {
      return fetch(`/api/hotels/${params?.id}`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch hotel data");
        return res.json();
      });
    },
    enabled: !!params?.id,
  });

  // Query to fetch rooms related to this hotel
  const {
    data: rooms = [],
    isLoading: isLoadingRooms,
    error: roomsError,
  } = useQuery({
    queryKey: ["/api/hotels", params?.id, "rooms"],
    queryFn: () => {
      return fetch(`/api/hotels/${params?.id}/rooms`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch rooms data");
        return res.json();
      });
    },
    enabled: !!params?.id,
    // If no API data returns, use these mocks for display
    placeholderData: [
      {
        id: 1,
        name: "Deluxe King Room",
        type: "Deluxe",
        bedType: "King",
        maxAdults: 2,
        maxChildren: 1,
        price: 180,
        discountedPrice: null,
        size: "32 m²",
        imageUrl:
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop",
        description:
          "Spacious room with king bed and city view. Includes free WiFi, flat-screen TV, and mini-bar.",
        amenities: [
          "Free WiFi",
          "Flat-screen TV",
          "Air conditioning",
          "Mini-bar",
          "Safe",
          "Hair dryer",
        ],
      },
      {
        id: 2,
        name: "Premium Suite",
        type: "Suite",
        bedType: "King",
        maxAdults: 2,
        maxChildren: 2,
        price: 280,
        discountedPrice: 250,
        size: "48 m²",
        imageUrl:
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop",
        description:
          "Luxury suite with separate living area, king bed, and panoramic city views. Includes premium amenities and daily housekeeping.",
        amenities: [
          "Free WiFi",
          "Flat-screen TV",
          "Air conditioning",
          "Mini-bar",
          "Safe",
          "Hair dryer",
          "Separate living area",
          "Coffee maker",
          "Premium toiletries",
        ],
      },
      {
        id: 3,
        name: "Family Room",
        type: "Family",
        bedType: "Queen + Twin",
        maxAdults: 3,
        maxChildren: 2,
        price: 220,
        discountedPrice: null,
        size: "40 m²",
        imageUrl:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop",
        description:
          "Spacious room ideal for families with one queen and one twin bed. Features child-friendly amenities and extra space.",
        amenities: [
          "Free WiFi",
          "Flat-screen TV",
          "Air conditioning",
          "Mini-bar",
          "Safe",
          "Hair dryer",
          "Child-friendly amenities",
        ],
      },
    ],
  });

  // Handle room selection
  const handleRoomSelect = (room: any) => {
    setSelectedRoom(room);
    // Scroll to booking section
    document
      .getElementById("booking-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoadingHotel || isLoadingRooms) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <p>Loading hotel details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (hotelError || !hotel) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Hotel Not Found</h1>
            <p>
              The hotel you're looking for doesn't exist or has been removed.
            </p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Sample hotel data for display if API data is incomplete
  const hotelDisplay = {
    id: hotel.id || params?.id,
    name: hotel.name || "Luxury Hotel & Spa",
    description:
      hotel.description ||
      "Experience luxury and comfort in the heart of the city. Our hotel offers elegant rooms, exceptional dining, and world-class amenities for both business and leisure travelers.",
    address: hotel.address || "123 Main Street",
    city: hotel.city || "Cairo",
    country: hotel.country || "Egypt",
    stars: hotel.stars || 4,
    rating: hotel.rating || 4.5,
    imageUrl:
      hotel.imageUrl ||
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2073&auto=format&fit=crop",
    amenities: hotel.amenities || [
      "Free WiFi",
      "Swimming Pool",
      "Restaurant",
      "Fitness Center",
      "Spa",
      "Room Service",
      "Conference Rooms",
      "Parking",
    ],
    checkInTime: hotel.checkInTime || "14:00",
    checkOutTime: hotel.checkOutTime || "12:00",
    phone: hotel.phone || "+20 123 456 7890",
    email: hotel.email || "info@luxuryhotel.com",
    website: hotel.website || "https://www.luxuryhotel.com",
    parkingAvailable: hotel.parkingAvailable || true,
    airportTransferAvailable: hotel.airportTransferAvailable || true,
    shuttleAvailable: hotel.shuttleAvailable || true,
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-8 h-[400px]">
          <img
            src={hotelDisplay.imageUrl}
            alt={hotelDisplay.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {hotelDisplay.name}
            </h1>
            <div className="flex items-center mb-2">
              <MapPin size={16} className="mr-1" />
              <span>
                {hotelDisplay.address ||
                  `${hotelDisplay.city}, ${hotelDisplay.country}`}
              </span>
            </div>
            <div className="flex items-center">
              <div className="flex mr-3">
                {renderStars(hotelDisplay.stars || 0)}
              </div>
              {hotelDisplay.rating && (
                <span className="text-sm">{hotelDisplay.rating} rating</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="rooms">
              <TabsList>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="overview">Hotel Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Rooms Tab */}
              <TabsContent value="rooms" className="pt-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-3">Available Rooms</h2>
                  <p className="text-muted-foreground">
                    Choose from our selection of {rooms.length} room types.
                    Prices shown are per night.
                  </p>
                </div>

                {rooms.length > 0 ? (
                  <div className="space-y-4">
                    {rooms.map((room: any) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        onSelect={handleRoomSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="text-3xl mb-2">🏨</div>
                    <h3 className="text-xl font-medium mb-2">
                      No rooms available
                    </h3>
                    <p className="text-muted-foreground">
                      There are currently no rooms available for this hotel.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Hotel Overview Tab */}
              <TabsContent value="overview" className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-3">
                      About this Hotel
                    </h2>
                    <p className="text-muted-foreground">
                      {hotelDisplay.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h2 className="text-2xl font-bold mb-3">
                      Contact Information
                    </h2>
                    {hotelDisplay.phone && (
                      <div className="flex items-start mb-2">
                        <Phone
                          size={18}
                          className="text-primary mr-2 flex-shrink-0 mt-1"
                        />
                        <span>{hotelDisplay.phone}</span>
                      </div>
                    )}
                    {hotelDisplay.email && (
                      <div className="flex items-start mb-2">
                        <Mail
                          size={18}
                          className="text-primary mr-2 flex-shrink-0 mt-1"
                        />
                        <span>{hotelDisplay.email}</span>
                      </div>
                    )}
                    {hotelDisplay.website && (
                      <div className="flex items-start">
                        <Globe
                          size={18}
                          className="text-primary mr-2 flex-shrink-0 mt-1"
                        />
                        <a
                          href={hotelDisplay.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {hotelDisplay.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Check-in/Check-out
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div>
                            <span className="font-medium">Check-in:</span>
                            <div className="ml-2 text-muted-foreground">
                              {hotelDisplay.checkInTime}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Check-out:</span>
                            <div className="ml-2 text-muted-foreground">
                              {hotelDisplay.checkOutTime}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Address:</span>
                            <div className="ml-2 text-muted-foreground">
                              {hotelDisplay.address ||
                                `${hotelDisplay.city}, ${hotelDisplay.country}`}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Hotel Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {hotelDisplay.stars && (
                            <li className="flex items-center">
                              <Star
                                size={16}
                                className="text-yellow-400 mr-2"
                              />
                              <span>{hotelDisplay.stars}-Star Hotel</span>
                            </li>
                          )}
                          {hotelDisplay.parkingAvailable && (
                            <li className="flex items-center">
                              <ParkingIcon
                                size={16}
                                className="text-primary mr-2"
                              />
                              <span>Parking Available</span>
                            </li>
                          )}
                          {hotelDisplay.airportTransferAvailable && (
                            <li className="flex items-center">
                              <MapPin size={16} className="text-primary mr-2" />
                              <span>Airport Transfer Available</span>
                            </li>
                          )}
                          {hotelDisplay.shuttleAvailable && (
                            <li className="flex items-center">
                              <MapPin size={16} className="text-primary mr-2" />
                              <span>Shuttle Service</span>
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Amenities Tab */}
              <TabsContent value="amenities" className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Hotel Amenities</h2>

                {hotelDisplay.amenities ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(Array.isArray(hotelDisplay.amenities)
                      ? hotelDisplay.amenities
                      : typeof hotelDisplay.amenities === "string"
                        ? hotelDisplay.amenities.split(",")
                        : []
                    ).map((amenity: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <div className="mr-2 text-primary">
                          {getAmenityIcon(amenity.trim())}
                        </div>
                        <span>{amenity.trim()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Information about hotel amenities is not available.
                  </p>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Guest Reviews</h2>
                  <Button>Write a Review</Button>
                </div>

                <div className="bg-muted p-6 rounded-lg mb-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4">
                      JD
                    </div>
                    <div>
                      <h3 className="font-medium">John Doe</h3>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className="fill-yellow-400 text-yellow-400"
                              />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          May 10, 2024
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Great hotel with excellent amenities. The staff was friendly
                    and attentive. Room was clean and comfortable. I would
                    definitely stay here again.
                  </p>
                </div>

                <div className="bg-muted p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4">
                      SM
                    </div>
                    <div>
                      <h3 className="font-medium">Sarah Miller</h3>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {Array(4)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className="fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          <Star size={14} className="text-gray-300" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          April 22, 2024
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Nice hotel in a great location. The room was a bit smaller
                    than expected, but everything was clean and well-maintained.
                    Breakfast was delicious with many options.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div id="booking-section">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-2xl">Make a Reservation</CardTitle>
                <CardDescription>
                  <div className="flex items-center mb-1">
                    <Calendar size={16} className="mr-1" />
                    <span>May 15 - May 17, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    <span>
                      {guests.adults} Adults, {guests.children} Children
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Check-in / Check-out
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs mb-1">
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded-md"
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded-md"
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Guests</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs mb-1">Adults</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={guests.adults}
                          onChange={(e) =>
                            setGuests({
                              ...guests,
                              adults: parseInt(e.target.value),
                            })
                          }
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Children</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={guests.children}
                          onChange={(e) =>
                            setGuests({
                              ...guests,
                              children: parseInt(e.target.value),
                            })
                          }
                        >
                          {[0, 1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Infants</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={guests.infants}
                          onChange={(e) =>
                            setGuests({
                              ...guests,
                              infants: parseInt(e.target.value),
                            })
                          }
                        >
                          {[0, 1, 2, 3].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {selectedRoom ? (
                    <div className="mt-4 p-4 border rounded-md bg-muted">
                      <h3 className="font-medium mb-2">Selected Room</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span>{selectedRoom.name}</span>
                        <Badge>{selectedRoom.type}</Badge>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-sm text-muted-foreground">
                          {selectedRoom.maxAdults} Adults,{" "}
                          {selectedRoom.maxChildren} Children
                        </span>
                        <span className="font-bold">
                          ${selectedRoom.discountedPrice || selectedRoom.price}{" "}
                          / night
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        onClick={() => setSelectedRoom(null)}
                      >
                        Change Room
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 border rounded-md bg-muted text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Please select a room from the list to continue with your
                        booking.
                      </p>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() =>
                          document
                            .querySelector('[data-value="rooms"]')
                            ?.scrollIntoView()
                        }
                      >
                        See Available Rooms
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex-col space-y-3">
                <Button className="w-full" disabled={!selectedRoom}>
                  Book Now
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart size={16} className="mr-2" /> Save to Wishlist
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Free cancellation up to 24 hours before check-in
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HotelDetailsPage;
