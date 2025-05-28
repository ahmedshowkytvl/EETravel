
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import CruiseLayout from "@/components/CruiseLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";
import {
  MapPin,
  Calendar,
  Globe,
  Users,
  DollarSign,
  Check,
  X,
  Coffee,
  Car,
  Mountain,
  Plane,
  Utensils,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const quickInfoItems = [
  {
    icon: <Calendar className="h-8 w-8 mb-2 text-primary" />,
    title: "Duration",
    desc: "7 Days",
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
    desc: "$1,299",
  },
  {
    icon: <MapPin className="h-8 w-8 mb-2 text-primary" />,
    title: "Location",
    desc: "Cairo to Aswan",
  },
];

// Define the cruise destinations with coordinates for the map
const cruiseDestinations = [
  {
    name: "Cairo",
    position: { lat: 30.0444, lng: 31.2357 },
    description: "Starting point: Pyramids & Egyptian Museum",
  },
  {
    name: "Luxor",
    position: { lat: 25.6872, lng: 32.6396 },
    description: "Temples of Luxor & Karnak",
  },
  {
    name: "Valley of Kings",
    position: { lat: 25.7402, lng: 32.6014 },
    description: "Ancient royal tombs",
  },
  {
    name: "Edfu",
    position: { lat: 24.9776, lng: 32.8731 },
    description: "Temple of Horus",
  },
  {
    name: "Kom Ombo",
    position: { lat: 24.4522, lng: 32.9283 },
    description: "Unique double temple",
  },
  {
    name: "Aswan",
    position: { lat: 24.0889, lng: 32.8998 },
    description: "High Dam & Philae Temple",
  },
  {
    name: "Abu Simbel",
    position: { lat: 22.3372, lng: 31.6255 },
    description: "Massive rock temples",
  },
];

// Map Component with Google Maps
const MapComponent = () => {
  // Get API key from server instead of directly using environment variable
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    // Fetch API key from server endpoint
    fetch("/api/maps-key")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.key) {
          setApiKey(data.key);
        }
      })
      .catch((err) => console.error("Failed to load Maps API key:", err));
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const mapCenter = useMemo(() => ({ lat: 25.6872, lng: 32.0 }), []);
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: true,
      scrollwheel: false,
      styles: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#b9d6f2" }],
        },
        {
          featureType: "administrative.country",
          elementType: "geometry.stroke",
          stylers: [{ color: "#a5a5a5" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ color: "#f5f5dc" }],
        },
      ],
    }),
    [],
  );

  // Create the polyline path from the destinations
  const pathCoordinates = useMemo(
    () => cruiseDestinations.map((dest) => dest.position),
    [],
  );

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      // Fit the map to show all destinations
      const bounds = new google.maps.LatLngBounds();
      pathCoordinates.forEach((position) => {
        bounds.extend(position);
      });
      map.fitBounds(bounds);
    },
    [pathCoordinates],
  );

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-100">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full rounded-lg"
      center={mapCenter}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {/* Draw the route line */}
      <Polyline
        path={pathCoordinates}
        options={{
          strokeColor: "#ff6b6b",
          strokeOpacity: 0.8,
          strokeWeight: 4,
          icons: [
            {
              icon: {
                path: google.maps.SymbolPath
                  ? google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                  : 0,
                scale: 3,
              },
              offset: "50%",
              repeat: "150px",
            },
          ],
        }}
      />

      {/* Place markers for each destination */}
      {cruiseDestinations.map((destination, index) => (
        <Marker
          key={index}
          position={destination.position}
          onClick={() => setSelectedLocation(index)}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: google.maps.Size
              ? new google.maps.Size(40, 40)
              : undefined,
          }}
          animation={
            google.maps.Animation ? google.maps.Animation.DROP : undefined
          }
          title={destination.name}
        />
      ))}

      {/* Show infowindow for selected location */}
      {selectedLocation !== null && (
        <InfoWindow
          position={cruiseDestinations[selectedLocation].position}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div className="p-2">
            <h3 className="font-bold text-base">
              {cruiseDestinations[selectedLocation].name}
            </h3>
            <p className="text-sm">
              {cruiseDestinations[selectedLocation].description}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

const SailingCruise: React.FC = () => {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [roomDistribution, setRoomDistribution] = useState("double");
  const [hotelPackage, setHotelPackage] = useState("standard");

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
  const scrollContainer = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 250;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  return (
    <CruiseLayout>
      <div>
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] flex items-center">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1568322445389-f64ac2515099?q=80&w=2070&auto=format&fit=crop')",
            }}
          ></div>
          <div className="container relative z-20 text-white px-4 sm:px-10">
            {/* Content in semi-transparent gray box */}
            <div className="bg-gray-800/75 rounded-xl p-4 sm:p-8 max-w-2xl backdrop-blur-sm">
              {/* Breadcrumbs */}
              <div className="mb-4 sm:mb-6 flex items-center text-xs sm:text-sm">
                <a
                  href="/"
                  className="hover:text-primary-foreground/90 transition-colors"
                >
                  Home
                </a>
                <span className="mx-2">/</span>
                <a
                  href="/destinations"
                  className="hover:text-primary-foreground/90 transition-colors"
                >
                  Packages
                </a>
                <span className="mx-2">/</span>
                <span className="font-medium">Egypt Sailing Cruise</span>
              </div>

              {/* Hero content - left aligned */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                  Egypt Sailing Cruise
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                  Experience the magic of Egypt from the comfort of a luxury
                  sailing cruise on the Nile
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
                    Experience the wonder and majesty of ancient Egypt on our
                    premier 7-day Nile Sailing Cruise. This carefully crafted
                    journey combines the iconic landmarks of Cairo with a
                    luxurious cruise along the legendary Nile River, offering
                    the perfect balance of adventure, relaxation, and cultural
                    immersion.
                  </p>
                  <p className="text-neutral-700 mb-4">
                    Our expert Egyptologist guides will bring history to life as
                    you visit the breathtaking Pyramids of Giza, explore the
                    treasures of the Egyptian Museum, and discover the
                    magnificent temples along the Nile. Sailing aboard our
                    deluxe cruise ship, you'll enjoy premium accommodations,
                    gourmet Egyptian cuisine, and evening entertainment
                    featuring traditional music and dance.
                  </p>
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

              {/* Itinerary Breakdown */}
              <section className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Journey Itinerary</h2>
                  <Tabs defaultValue="day1">
                    <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
                      <TabsTrigger value="day1">Day 1-2</TabsTrigger>
                      <TabsTrigger value="day3">Day 3-5</TabsTrigger>
                      <TabsTrigger value="day6">Day 6-7</TabsTrigger>
                    </TabsList>
                    <TabsContent value="day1" className="p-3 sm:p-4">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                        Cairo Exploration
                      </h3>
                      <p className="text-sm sm:text-base mb-3 sm:mb-4">
                        Your Egyptian adventure begins in Cairo. After airport
                        pickup and check-in at your hotel, enjoy a welcome
                        dinner overlooking the Nile. The next day features
                        guided tours of the Great Pyramids of Giza, the
                        enigmatic Sphinx, and the Egyptian Museum housing
                        treasures of Tutankhamun.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                        <img
                          src="https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2070&auto=format&fit=crop"
                          alt="Pyramids of Giza"
                          className="rounded-lg h-36 sm:h-48 w-full object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1580934738416-ad531f27bf0c?q=80&w=2074&auto=format&fit=crop"
                          alt="Egyptian Museum"
                          className="rounded-lg h-36 sm:h-48 w-full object-cover"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="day3" className="p-3 sm:p-4">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                        Nile Cruise Experience
                      </h3>
                      <p className="text-sm sm:text-base mb-3 sm:mb-4">
                        Board your luxury sailing vessel and begin cruising the
                        legendary Nile River. Visit the temples of Luxor and
                        Karnak, Valley of the Kings, and Queen Hatshepsut's
                        Temple. Enjoy onboard entertainment including
                        traditional Nubian music and dance performances as you
                        sail through picturesque landscapes.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                        <img
                          src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=2070&auto=format&fit=crop"
                          alt="Nile Cruise"
                          className="rounded-lg h-36 sm:h-48 w-full object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1560359614-870d1a7ea91d?q=80&w=2071&auto=format&fit=crop"
                          alt="Karnak Temple"
                          className="rounded-lg h-36 sm:h-48 w-full object-cover"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="day6" className="p-3 sm:p-4">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                        Aswan & Return to Cairo
                      </h3>
                      <p className="text-sm sm:text-base mb-3 sm:mb-4">
                        Reach Aswan and visit the magnificent Abu Simbel
                        temples. Optional excursion to a traditional Nubian
                        village. On the final day, fly back to Cairo for a
                        farewell dinner and evening entertainment before your
                        departure the next day with unforgettable memories of
                        Egypt's wonders.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                        <img
                          src="https://images.unsplash.com/photo-1554203576-3b6d2b2ce0d1?q=80&w=2071&auto=format&fit=crop"
                          alt="Abu Simbel"
                          className="rounded-lg h-36 sm:h-48 w-full object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=2070&auto=format&fit=crop"
                          alt="Nubian Village"
                          className="rounded-lg h-36 sm:h-48 w-full object-cover"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </section>

              {/* What's Included/Excluded */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1.5 sm:mr-2" />
                      What's Included
                    </h3>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className="flex items-start">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">
                          6 nights accommodation (3 in hotels, 3 on cruise ship)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">Daily breakfast, 5 lunches, and 4 dinners</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">
                          All land transportation in air-conditioned vehicles
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">Domestic flight (Aswan to Cairo)</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">English-speaking Egyptologist guide</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">
                          All entrance fees to sites mentioned in itinerary
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">Airport transfers on arrival and departure</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center">
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-1.5 sm:mr-2" />
                      What's Excluded
                    </h3>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className="flex items-start">
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">International airfare to/from Egypt</span>
                      </li>
                      <li className="flex items-start">
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">
                          Egypt entry visa fees (available on arrival)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">Travel insurance (mandatory)</span>
                      </li>
                      <li className="flex items-start">
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">Optional activities not in the itinerary</span>
                      </li>
                      <li className="flex items-start">
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">Beverages during meals unless specified</span>
                      </li>
                      <li className="flex items-start">
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">
                          Gratuities for guides, drivers, and cruise staff
                        </span>
                      </li>
                      <li className="flex items-start">
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 shrink-0" />
                        <span className="text-xs sm:text-sm">Personal expenses and souvenirs</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Map Section */}
              <section className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Travel Route</h2>
                  <div className="aspect-video bg-neutral-100 rounded-lg relative">
                    <MapComponent />
                  </div>
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-neutral-600 text-center font-medium">
                      Cairo → Luxor → Valley of Kings → Edfu → Kom Ombo → Aswan
                      → Abu Simbel → Cairo
                    </p>
                  </div>
                </div>
              </section>

              {/* Property Highlights */}
              <section className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Accommodation Highlights
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 text-center">
                    <div className="flex flex-col items-center p-2 sm:p-4 bg-white border border-[#e0e0e0] rounded-lg shadow-inner shadow-[inset_0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] transition-all duration-200">
                      <Coffee className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2 text-primary" />
                      <h3 className="text-xs sm:text-sm font-medium">Breakfast</h3>
                      <p className="text-xs text-neutral-600">Daily buffet</p>
                    </div>
                    <div className="flex flex-col items-center p-2 sm:p-4 bg-white border border-[#e0e0e0] rounded-lg shadow-inner shadow-[inset_0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] transition-all duration-200">
                      <Car className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2 text-primary" />
                      <h3 className="text-xs sm:text-sm font-medium">Airport Shuttle</h3>
                      <p className="text-xs text-neutral-600">Included</p>
                    </div>
                    <div className="flex flex-col items-center p-2 sm:p-4 bg-white border border-[#e0e0e0] rounded-lg shadow-inner shadow-[inset_0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] transition-all duration-200">
                      <Mountain className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2 text-primary" />
                      <h3 className="text-xs sm:text-sm font-medium">Scenic Views</h3>
                      <p className="text-xs text-neutral-600">
                        Nile & monuments
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-2 sm:p-4 bg-white border border-[#e0e0e0] rounded-lg shadow-inner shadow-[inset_0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] transition-all duration-200">
                      <Plane className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2 text-primary" />
                      <h3 className="text-xs sm:text-sm font-medium">Domestic Flight</h3>
                      <p className="text-xs text-neutral-600">Aswan to Cairo</p>
                    </div>
                    <div className="flex flex-col items-center p-2 sm:p-4 bg-white border border-[#e0e0e0] rounded-lg shadow-inner shadow-[inset_0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] transition-all duration-200">
                      <Utensils className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2 text-primary" />
                      <h3 className="text-xs sm:text-sm font-medium">Dining</h3>
                      <p className="text-xs text-neutral-600">
                        Multiple options
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {/* Book Your Trip Section */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Book Your Trip</h2>

                  <div className="space-y-4 sm:space-y-6">
                    {/* Room Selection */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                        Select Room Type
                      </h3>
                      <RadioGroup
                        defaultValue="standard"
                        value={roomDistribution}
                        onValueChange={setRoomDistribution}
                        className="space-y-2 sm:space-y-3"
                      >
                        <div className="flex items-center justify-between border rounded-lg p-2 sm:p-3">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <RadioGroupItem value="double" id="double" />
                            <Label htmlFor="double" className="text-sm sm:text-base font-medium">
                              Double Room
                            </Label>
                          </div>
                          <span className="text-sm sm:text-base font-semibold">$1,299</span>
                        </div>
                        <div className="flex items-center justify-between border rounded-lg p-2 sm:p-3">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <RadioGroupItem value="triple" id="triple" />
                            <Label htmlFor="triple" className="text-sm sm:text-base font-medium">
                              Triple Room
                            </Label>
                          </div>
                          <span className="text-sm sm:text-base font-semibold">$1,199</span>
                        </div>
                        <div className="flex items-center justify-between border rounded-lg p-2 sm:p-3">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <RadioGroupItem value="single" id="single" />
                            <Label htmlFor="single" className="text-sm sm:text-base font-medium">
                              Single Room
                            </Label>
                          </div>
                          <span className="text-sm sm:text-base font-semibold">$1,599</span>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    {/* Person Count */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Travelers</h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base">Adults</span>
                          <div className="flex items-center border rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDecrement(setAdults, adults)}
                              disabled={adults <= 1}
                              className="h-8 w-8 sm:h-9 sm:w-9"
                            >
                              -
                            </Button>
                            <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{adults}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleIncrement(setAdults, adults)}
                              className="h-8 w-8 sm:h-9 sm:w-9"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base">Children (2-11)</span>
                          <div className="flex items-center border rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDecrement(setChildren, children)
                              }
                              disabled={children <= 0}
                              className="h-8 w-8 sm:h-9 sm:w-9"
                            >
                              -
                            </Button>
                            <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{children}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleIncrement(setChildren, children)
                              }
                              className="h-8 w-8 sm:h-9 sm:w-9"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base">Infants (0-2)</span>
                          <div className="flex items-center border rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDecrement(setInfants, infants)
                              }
                              disabled={infants <= 0}
                              className="h-8 w-8 sm:h-9 sm:w-9"
                            >
                              -
                            </Button>
                            <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{infants}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleIncrement(setInfants, infants)
                              }
                              className="h-8 w-8 sm:h-9 sm:w-9"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Hotel Package Selector */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                        Hotel Package
                      </h3>
                      <Select
                        defaultValue="standard"
                        onValueChange={setHotelPackage}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select package" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">
                            Standard (4-star hotels)
                          </SelectItem>
                          <SelectItem value="comfort">
                            Comfort (5-star hotels)
                          </SelectItem>
                          <SelectItem value="luxury">
                            Luxury (5-star deluxe hotels)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="mt-3 sm:mt-4">
                        {hotelPackage === "standard" && (
                          <div className="text-xs sm:text-sm text-neutral-600 bg-neutral-50 p-2 sm:p-3 rounded">
                            <p>
                              <strong>Cairo:</strong> Oasis Hotel or similar
                            </p>
                            <p>
                              <strong>Cruise:</strong> M/S Nile Dolphin or
                              similar
                            </p>
                          </div>
                        )}
                        {hotelPackage === "comfort" && (
                          <div className="text-xs sm:text-sm text-neutral-600 bg-neutral-50 p-2 sm:p-3 rounded">
                            <p>
                              <strong>Cairo:</strong> Steigenberger Hotel or
                              similar
                            </p>
                            <p>
                              <strong>Cruise:</strong> M/S Royal Ruby or similar
                            </p>
                            <p className="mt-1 sm:mt-2 font-medium">+$200 per person</p>
                          </div>
                        )}
                        {hotelPackage === "luxury" && (
                          <div className="text-xs sm:text-sm text-neutral-600 bg-neutral-50 p-2 sm:p-3 rounded">
                            <p>
                              <strong>Cairo:</strong> Four Seasons Nile Plaza or
                              similar
                            </p>
                            <p>
                              <strong>Cruise:</strong> M/S Oberoi Philae or
                              similar
                            </p>
                            <p className="mt-1 sm:mt-2 font-medium">+$500 per person</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-neutral-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex justify-between text-sm sm:text-base font-medium">
                        <span>Base Price:</span>
                        <span>$1,299 x {adults} adults</span>
                      </div>
                      {children > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>Children:</span>
                          <span>$649 x {children}</span>
                        </div>
                      )}
                      {infants > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>Infants:</span>
                          <span>$100 x {infants}</span>
                        </div>
                      )}
                      {hotelPackage === "comfort" && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>Comfort Package Upgrade:</span>
                          <span>+$200 x {adults + children}</span>
                        </div>
                      )}
                      {hotelPackage === "luxury" && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>Luxury Package Upgrade:</span>
                          <span>+$500 x {adults + children}</span>
                        </div>
                      )}
                      <Separator className="my-2 sm:my-3" />
                      <div className="flex justify-between font-semibold text-base sm:text-lg">
                        <span>Total:</span>
                        <span>${calculateTotal()}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 text-base sm:text-lg py-4 sm:py-6">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>

              {/* What's Included/Excluded - Separate box */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Trip Details</h2>
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                        What's Included:
                      </h4>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex items-start">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                          <span>
                            7 nights accommodation in selected hotels and cruise
                            ship
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                          <span>
                            All breakfasts and 4 dinners including welcome and
                            farewell dinners
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                          <span>
                            Airport transfers and transportation in
                            air-conditioned vehicles
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                          <span>
                            Professional English-speaking Egyptologist guide
                            throughout the trip
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                          <span>
                            Entrance fees to all sites mentioned in the
                            itinerary
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                          <span>Domestic flight from Aswan to Cairo</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                        What's Excluded:
                      </h4>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex items-start">
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                          <span>International flights to and from Egypt</span>
                        </div>
                        <div className="flex items-start">
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                          <span>
                            Travel insurance (mandatory for all travelers)
                          </span>
                        </div>
                        <div className="flex items-start">
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                          <span>
                            Egyptian visa (available on arrival for most
                            nationalities)
                          </span>
                        </div>
                        <div className="flex items-start">
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                          <span>
                            Optional activities and excursions not mentioned in
                            the itinerary
                          </span>
                        </div>
                        <div className="flex items-start">
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                          <span>
                            Personal expenses (laundry, telephone calls,
                            beverages, etc.)
                          </span>
                        </div>
                        <div className="flex items-start">
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 mr-1.5 sm:mr-2 shrink-0" />
                          <span>
                            Tips and gratuities for guides, drivers, and cruise
                            staff
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CruiseLayout>
  );

  function calculateTotal() {
    let total = adults * 1299;

    // Add children and infants costs
    total += children * 649;
    total += infants * 100;

    // Add hotel package upgrades
    if (hotelPackage === "comfort") {
      total += (adults + children) * 200;
    } else if (hotelPackage === "luxury") {
      total += (adults + children) * 500;
    }

    return total.toLocaleString();
  }
};

export default SailingCruise;
