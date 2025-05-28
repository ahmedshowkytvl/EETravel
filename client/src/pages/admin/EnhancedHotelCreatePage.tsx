import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  Save,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Plus,
  Minus,
  Building,
  Search,
  Car,
  Plane,
  Bus,
  Coffee,
  Utensils,
  PanelLeftClose,
  Bed,
  Check,
  X,
  LifeBuoy,
  ShieldCheck,
  BedDouble,
  FileQuestion,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define schema for nearby landmark
const landmarkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  distance: z.string().optional(),
  placeId: z.string().optional(),
});

// Define schema for restaurant
const restaurantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cuisineType: z.string().optional(),
  breakfastOptions: z.array(z.string()).default([]),
});

// Define schema for FAQ
const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

// Define schema for room type
const roomTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bedType: z.string().optional(),
  size: z.string().optional(),
  view: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  price: z.number().optional(),
});

// Define the schema for hotel form validation
const hotelFormSchema = z.object({
  // Basic Hotel Information
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional().nullable(),
  destinationId: z.coerce.number().positive({ message: "Please select a destination" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  postalCode: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email({ message: "Please enter a valid email" }).optional().nullable(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
  stars: z.coerce.number().min(1).max(5).default(3),
  guestRating: z.coerce.number().min(0).max(10).optional().nullable(),
  
  // Coordinates and additional info
  longitude: z.coerce.number().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  featured: z.boolean().default(false),
  status: z.string().default("active"),
  checkInTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Please enter a valid time in 24-hour format (HH:MM)",
    })
    .optional()
    .nullable(),
  checkOutTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Please enter a valid time in 24-hour format (HH:MM)",
    })
    .optional()
    .nullable(),
    
  // General Highlights, Facilities, and Cleanliness Features (using IDs for Many-to-Many)
  highlightIds: z.array(z.number()).default([]),
  facilityIds: z.array(z.number()).default([]),
  cleanlinessFeatureIds: z.array(z.number()).default([]),
  
  // Transportation (direct fields in hotels table)
  parkingAvailable: z.boolean().default(false),
  airportTransferAvailable: z.boolean().default(false),
  carRentalAvailable: z.boolean().default(false),
  shuttleAvailable: z.boolean().default(false),
  
  // Complex related data (to be processed separately)
  landmarks: z.array(landmarkSchema).default([]),
  restaurants: z.array(restaurantSchema).default([]),
  faqs: z.array(faqSchema).default([]),
  roomTypes: z.array(roomTypeSchema).default([]),
});

type HotelFormValues = z.infer<typeof hotelFormSchema>;

// Breakfast options
const breakfastOptions = [
  { id: "halal", label: "Halal" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "glutenFree", label: "Gluten-Free" },
  { id: "continental", label: "Continental" },
  { id: "american", label: "American" },
  { id: "buffet", label: "Buffet" },
];

// Room view options
const roomViewOptions = [
  "City View",
  "Garden View",
  "Mountain View",
  "Ocean View",
  "Pool View",
  "River View",
  "Landmark View",
  "No View",
];

// Bed type options
const bedTypeOptions = [
  "Single Bed",
  "Twin Beds",
  "Double Bed",
  "Queen Bed",
  "King Bed",
  "Super King Bed",
  "Bunk Bed",
  "Sofa Bed",
];

// Room amenities
const roomAmenityOptions = [
  { id: "airConditioning", label: "Air Conditioning" },
  { id: "minibar", label: "Minibar" },
  { id: "tv", label: "TV" },
  { id: "safe", label: "Safe" },
  { id: "hairDryer", label: "Hair Dryer" },
  { id: "toiletries", label: "Toiletries" },
  { id: "blackoutCurtains", label: "Blackout Curtains" },
  { id: "desk", label: "Desk" },
  { id: "bathtub", label: "Bathtub" },
  { id: "bathrobe", label: "Bathrobe" },
  { id: "slippers", label: "Slippers" },
  { id: "coffeemaker", label: "Coffee Maker" },
  { id: "iron", label: "Iron & Ironing Board" },
  { id: "balcony", label: "Balcony" },
  { id: "soundproofing", label: "Soundproofing" },
];

export default function EnhancedHotelCreatePage() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for selections
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
  const [selectedHighlights, setSelectedHighlights] = useState<number[]>([]);
  const [selectedCleanlinessFeatures, setSelectedCleanlinessFeatures] = useState<number[]>([]);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [isSearchingLandmarks, setIsSearchingLandmarks] = useState(false);
  const [suggestedLandmarks, setSuggestedLandmarks] = useState<any[]>([]);
  
  // Google Maps integration
  const [apiKey, setApiKey] = useState<string>("");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey || "",
  });
  
  // Load Google Maps API key
  useEffect(() => {
    // In a real implementation, this would fetch from your backend
    // For demo purposes, we'll use a placeholder
    // Replace this with an actual API call
    const fetchApiKey = async () => {
      try {
        const response = await fetch("/api/maps-key");
        const data = await response.json();
        if (data && data.key) {
          setApiKey(data.key);
        }
      } catch (error) {
        console.error("Failed to load Maps API key:", error);
      }
    };
    
    fetchApiKey();
  }, []);

  // Form setup with default values
  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: "",
      description: "",
      destinationId: undefined,
      address: "",
      city: "",
      country: "",
      postalCode: "",
      phone: "",
      email: "",
      website: "",
      imageUrl: "",
      stars: 3,
      guestRating: undefined,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      longitude: undefined,
      latitude: undefined,
      featured: false,
      status: "active",
      highlightIds: [],
      facilityIds: [],
      cleanlinessFeatureIds: [],
      parkingAvailable: false,
      airportTransferAvailable: false,
      carRentalAvailable: false,
      shuttleAvailable: false,
      landmarks: [],
      restaurants: [],
      faqs: [],
      roomTypes: [],
    },
  });
  
  // Setup field arrays for related items
  const landmarksFieldArray = useFieldArray({
    control: form.control,
    name: "landmarks",
  });
  
  const restaurantsFieldArray = useFieldArray({
    control: form.control,
    name: "restaurants",
  });
  
  const faqsFieldArray = useFieldArray({
    control: form.control,
    name: "faqs",
  });
  
  const roomTypesFieldArray = useFieldArray({
    control: form.control,
    name: "roomTypes",
  });
  
  // Fetch destinations
  const { data: destinations = [], isLoading: isLoadingDestinations } = useQuery({
    queryKey: ["/api/destinations"],
    queryFn: getQueryFn(),
  });
  
  // Fetch facilities
  const { data: facilities = [], isLoading: isLoadingFacilities } = useQuery({
    queryKey: ["/api/admin/hotel-facilities"],
    queryFn: getQueryFn(),
  });
  
  // Fetch highlights
  const { data: highlights = [], isLoading: isLoadingHighlights } = useQuery({
    queryKey: ["/api/admin/hotel-highlights"],
    queryFn: getQueryFn(),
  });
  
  // Fetch cleanliness features
  const { data: cleanlinessFeatures = [], isLoading: isLoadingCleanlinessFeatures } = useQuery({
    queryKey: ["/api/admin/cleanliness-features"],
    queryFn: getQueryFn(),
  });
  
  // Effect to update form when selections change
  useEffect(() => {
    form.setValue("facilityIds", selectedFacilities);
  }, [selectedFacilities, form]);
  
  useEffect(() => {
    form.setValue("highlightIds", selectedHighlights);
  }, [selectedHighlights, form]);
  
  useEffect(() => {
    form.setValue("cleanlinessFeatureIds", selectedCleanlinessFeatures);
  }, [selectedCleanlinessFeatures, form]);
  
  // Function to search nearby landmarks with Google Places API
  const searchNearbyLandmarks = () => {
    setIsSearchingLandmarks(true);
    
    // This would typically call the Google Places API
    // For this implementation, we're simulating results
    setTimeout(() => {
      const mockLandmarks = [
        { name: "Great Pyramid of Giza", description: "Ancient Egyptian pyramid", distance: "1.2 km", placeId: "ChIJN8F_47w7WBQRUJGUzM6Fsks" },
        { name: "Egyptian Museum", description: "History museum", distance: "3.4 km", placeId: "ChIJ5y7_47R7WBQRuLZMSJXnDzs" },
        { name: "Khan el-Khalili", description: "Historic bazaar", distance: "5.8 km", placeId: "ChIJ9dSaz6s_WBQRam44QaRRdWQ" },
        { name: "Tahrir Square", description: "Public square", distance: "2.9 km", placeId: "ChIJLR2Vc8c_WBQRftgykvDG_PY" },
      ];
      
      setSuggestedLandmarks(mockLandmarks);
      setIsSearchingLandmarks(false);
    }, 1000);
  };
  
  // Handle adding a landmark from suggestions
  const addLandmarkFromSuggestion = (landmark: any) => {
    landmarksFieldArray.append({
      name: landmark.name,
      description: landmark.description,
      distance: landmark.distance,
      placeId: landmark.placeId,
    });
  };
  
  // Create hotel mutation
  const createHotelMutation = useMutation({
    mutationFn: async (data: HotelFormValues) => {
      return await fetch("/api/admin/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      }).then(res => {
        if (!res.ok) throw new Error("Failed to create hotel");
        return res.json();
      });
    },
    onSuccess: () => {
      // Show success message
      toast({
        title: "Hotel Created",
        description: "The hotel was created successfully",
        duration: 5000,
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hotels"] });
      
      // Navigate back to hotels list
      navigate("/admin/hotels");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create hotel",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
  
  // Form submission handler
  const onSubmit = (data: HotelFormValues) => {
    createHotelMutation.mutate(data);
  };
  
  // Toggle facility selection
  const toggleFacility = (facilityId: number) => {
    if (selectedFacilities.includes(facilityId)) {
      setSelectedFacilities(selectedFacilities.filter(id => id !== facilityId));
    } else {
      setSelectedFacilities([...selectedFacilities, facilityId]);
    }
  };
  
  // Toggle highlight selection
  const toggleHighlight = (highlightId: number) => {
    if (selectedHighlights.includes(highlightId)) {
      setSelectedHighlights(selectedHighlights.filter(id => id !== highlightId));
    } else {
      setSelectedHighlights([...selectedHighlights, highlightId]);
    }
  };
  
  // Toggle cleanliness feature selection
  const toggleCleanlinessFeature = (featureId: number) => {
    if (selectedCleanlinessFeatures.includes(featureId)) {
      setSelectedCleanlinessFeatures(selectedCleanlinessFeatures.filter(id => id !== featureId));
    } else {
      setSelectedCleanlinessFeatures([...selectedCleanlinessFeatures, featureId]);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Button variant="link" onClick={() => navigate("/admin")}>Dashboard</Button>
            <ChevronRight className="h-4 w-4" />
            <Button variant="link" onClick={() => navigate("/admin/hotels")}>Hotels</Button>
            <ChevronRight className="h-4 w-4" />
            <span>Create Hotel</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Hotel</CardTitle>
            <CardDescription>Enter comprehensive details to create a new hotel listing</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="transportation">Transportation</TabsTrigger>
                    <TabsTrigger value="dining">Dining</TabsTrigger>
                    <TabsTrigger value="rooms-faqs">Rooms & FAQs</TabsTrigger>
                  </TabsList>
                  
                  {/* Basic Information Tab */}
                  <TabsContent value="basic" className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Basic Hotel Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Hotel Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hotel Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="Grand Hotel" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Destination */}
                      <FormField
                        control={form.control}
                        name="destinationId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination*</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a destination" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {!isLoadingDestinations && Array.isArray(destinations) && destinations.map((destination: any) => (
                                  <SelectItem key={destination.id} value={destination.id.toString()}>
                                    {destination.name}, {destination.country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the hotel and its unique features"
                              className="min-h-[120px]"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Address */}
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address*</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="123 Hotel Street"
                                  {...field}
                                  className="pl-10"
                                />
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* City */}
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="City Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Country */}
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Country Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Postal Code */}
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="12345"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Star Rating */}
                      <FormField
                        control={form.control}
                        name="stars"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Star Rating*</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  defaultValue={field.value?.toString() || "3"}
                                >
                                  <SelectTrigger className="pl-10">
                                    <SelectValue placeholder="Select stars" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5].map((stars) => (
                                      <SelectItem key={stars} value={stars.toString()}>
                                        {stars} {stars === 1 ? "Star" : "Stars"}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Guest Rating */}
                      <FormField
                        control={form.control}
                        name="guestRating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guest Rating</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder="8.5"
                                  min="0"
                                  max="10"
                                  step="0.1"
                                  {...field}
                                  value={field.value === undefined || field.value === null ? "" : field.value}
                                  onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>Rating out of 10</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Phone */}
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="+1 (123) 456-7890"
                                  {...field}
                                  value={field.value || ""}
                                  className="pl-10"
                                />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="info@hotelname.com"
                                  {...field}
                                  value={field.value || ""}
                                  className="pl-10"
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Website */}
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="https://www.hotelname.com"
                                  {...field}
                                  value={field.value || ""}
                                  className="pl-10"
                                />
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Image URL */}
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/hotel-image.jpg"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Check-in Time */}
                      <FormField
                        control={form.control}
                        name="checkInTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Check-in Time</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="14:00"
                                  {...field}
                                  value={field.value || ""}
                                  className="pl-10"
                                />
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Check-out Time */}
                      <FormField
                        control={form.control}
                        name="checkOutTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Check-out Time</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="11:00"
                                  {...field}
                                  value={field.value || ""}
                                  className="pl-10"
                                />
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Longitude */}
                      <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Longitude</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0.0000"
                                step="0.000001"
                                {...field}
                                value={field.value === undefined || field.value === null ? "" : field.value}
                                onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Latitude */}
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Latitude</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0.0000"
                                step="0.000001"
                                {...field}
                                value={field.value === undefined || field.value === null ? "" : field.value}
                                onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Nearby Landmarks */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Nearby Landmarks
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Search for nearby landmarks"
                              value={locationSearchQuery}
                              onChange={(e) => setLocationSearchQuery(e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              type="button" 
                              onClick={searchNearbyLandmarks}
                              disabled={isSearchingLandmarks || !locationSearchQuery.trim()}
                            >
                              {isSearchingLandmarks ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                              {isSearchingLandmarks ? "Searching..." : "Search"}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="md:col-span-1">
                          <FormDescription>
                            Search for landmarks near this hotel to help guests know what's nearby.
                          </FormDescription>
                        </div>
                      </div>
                      
                      {suggestedLandmarks.length > 0 && (
                        <Card className="mt-4">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Suggested Landmarks</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-48">
                              <div className="space-y-2">
                                {suggestedLandmarks.map((landmark, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                                    <div>
                                      <p className="font-medium">{landmark.name}</p>
                                      <p className="text-sm text-muted-foreground">{landmark.description} • {landmark.distance}</p>
                                    </div>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => addLandmarkFromSuggestion(landmark)}
                                    >
                                      <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      )}
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Added Landmarks</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => landmarksFieldArray.append({ name: "", description: "", distance: "", placeId: "" })}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Manually
                          </Button>
                        </div>
                        
                        {landmarksFieldArray.fields.length > 0 ? (
                          <div className="border rounded-md divide-y">
                            {landmarksFieldArray.fields.map((field, index) => (
                              <div key={field.id} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-medium">Landmark #{index + 1}</h5>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => landmarksFieldArray.remove(index)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name={`landmarks.${index}.name`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Name*</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Landmark name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`landmarks.${index}.distance`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Distance</FormLabel>
                                        <FormControl>
                                          <Input placeholder="e.g. 1.2 km" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="md:col-span-2">
                                    <FormField
                                      control={form.control}
                                      name={`landmarks.${index}.description`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Description</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Brief description" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border rounded-md p-6 text-center">
                            <MapPin className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">No landmarks added yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Featured */}
                    <div className="flex justify-between items-center">
                      <div>
                        <FormLabel className="text-base">Featured Hotel</FormLabel>
                        <FormDescription>Feature this hotel on the homepage and search results</FormDescription>
                      </div>
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                  
                  {/* Features Tab */}
                  <TabsContent value="features" className="space-y-6">
                    {/* General Highlights */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        General Highlights
                      </h3>
                      <FormDescription>
                        Select the highlights that best describe this hotel.
                      </FormDescription>
                      
                      {isLoadingHighlights ? (
                        <div className="p-4 text-center">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground">Loading highlights...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {Array.isArray(highlights) && highlights.map((highlight: any) => (
                            <div 
                              key={highlight.id}
                              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                                selectedHighlights.includes(highlight.id) 
                                  ? "border-primary bg-primary/5" 
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => toggleHighlight(highlight.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  checked={selectedHighlights.includes(highlight.id)}
                                  onCheckedChange={() => {}}
                                />
                                <div>
                                  <p className="font-medium">{highlight.name}</p>
                                  {highlight.description && (
                                    <p className="text-xs text-muted-foreground">{highlight.description}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => navigate("/admin/hotels/highlights")}
                        >
                          Manage Highlights
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Facilities and Services */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Facilities and Services
                      </h3>
                      <FormDescription>
                        Select the facilities and services available at this hotel.
                      </FormDescription>
                      
                      {isLoadingFacilities ? (
                        <div className="p-4 text-center">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground">Loading facilities...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {Array.isArray(facilities) && facilities.map((facility: any) => (
                            <div 
                              key={facility.id}
                              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                                selectedFacilities.includes(facility.id) 
                                  ? "border-primary bg-primary/5" 
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => toggleFacility(facility.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  checked={selectedFacilities.includes(facility.id)}
                                  onCheckedChange={() => {}}
                                />
                                <div>
                                  <p className="font-medium">{facility.name}</p>
                                  {facility.description && (
                                    <p className="text-xs text-muted-foreground">{facility.description}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => navigate("/admin/hotels/facilities")}
                        >
                          Manage Facilities
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Cleanliness and Safety */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        Cleanliness and Safety
                      </h3>
                      <FormDescription>
                        Select the cleanliness and safety measures implemented by this hotel.
                      </FormDescription>
                      
                      {isLoadingCleanlinessFeatures ? (
                        <div className="p-4 text-center">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground">Loading cleanliness features...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Array.isArray(cleanlinessFeatures) && cleanlinessFeatures.map((feature: any) => (
                            <div 
                              key={feature.id}
                              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                                selectedCleanlinessFeatures.includes(feature.id) 
                                  ? "border-primary bg-primary/5" 
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => toggleCleanlinessFeature(feature.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  checked={selectedCleanlinessFeatures.includes(feature.id)}
                                  onCheckedChange={() => {}}
                                />
                                <div>
                                  <p className="font-medium">{feature.name}</p>
                                  {feature.description && (
                                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => navigate("/admin/hotels/cleanliness-features")}
                        >
                          Manage Cleanliness Features
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Transportation Tab */}
                  <TabsContent value="transportation" className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Transportation Options
                    </h3>
                    <FormDescription>
                      Configure the transportation options available at this hotel.
                    </FormDescription>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Airport Transfer */}
                      <div className="flex justify-between items-center p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                            <Plane className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Airport Transfer</p>
                            <p className="text-sm text-muted-foreground">Hotel offers airport transfer service</p>
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="airportTransferAvailable"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Car Rental */}
                      <div className="flex justify-between items-center p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Car Rental</p>
                            <p className="text-sm text-muted-foreground">Hotel provides car rental services</p>
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="carRentalAvailable"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Shuttle Service */}
                      <div className="flex justify-between items-center p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                            <Bus className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Shuttle Service</p>
                            <p className="text-sm text-muted-foreground">Hotel offers shuttle or taxi services</p>
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="shuttleAvailable"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Parking */}
                      <div className="flex justify-between items-center p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Parking</p>
                            <p className="text-sm text-muted-foreground">Hotel has parking facilities</p>
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="parkingAvailable"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Dining Tab */}
                  <TabsContent value="dining" className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Utensils className="h-5 w-5" />
                      Food and Dining
                    </h3>
                    <FormDescription>
                      Add information about restaurants and dining options at this hotel.
                    </FormDescription>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Hotel Restaurants</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => restaurantsFieldArray.append({ name: "", cuisineType: "", breakfastOptions: [] })}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Restaurant
                        </Button>
                      </div>
                      
                      {restaurantsFieldArray.fields.length > 0 ? (
                        <div className="border rounded-md divide-y">
                          {restaurantsFieldArray.fields.map((field, index) => (
                            <div key={field.id} className="p-4">
                              <div className="flex justify-between items-start mb-4">
                                <h5 className="font-medium">Restaurant #{index + 1}</h5>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => restaurantsFieldArray.remove(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`restaurants.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Restaurant Name*</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Restaurant name" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`restaurants.${index}.cuisineType`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Cuisine Type</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. Italian, Middle Eastern" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="md:col-span-2">
                                  <FormField
                                    control={form.control}
                                    name={`restaurants.${index}.breakfastOptions`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Breakfast Options</FormLabel>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                          {breakfastOptions.map((option) => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                              <Checkbox
                                                id={`breakfast-${index}-${option.id}`}
                                                checked={field.value.includes(option.id)}
                                                onCheckedChange={(checked) => {
                                                  if (checked) {
                                                    field.onChange([...field.value, option.id]);
                                                  } else {
                                                    field.onChange(field.value.filter((val: string) => val !== option.id));
                                                  }
                                                }}
                                              />
                                              <label
                                                htmlFor={`breakfast-${index}-${option.id}`}
                                                className="text-sm cursor-pointer"
                                              >
                                                {option.label}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border rounded-md p-6 text-center">
                          <Utensils className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No restaurants added yet</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Rooms & FAQs Tab */}
                  <TabsContent value="rooms-faqs" className="space-y-6">
                    {/* Room Types */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <BedDouble className="h-5 w-5" />
                        Room Types
                      </h3>
                      <FormDescription>
                        Add information about room types available at this hotel. You can add more detailed information after creating the hotel.
                      </FormDescription>
                      
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Room Types</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => roomTypesFieldArray.append({ name: "", bedType: "", size: "", view: "", amenities: [], price: undefined })}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Room Type
                        </Button>
                      </div>
                      
                      {roomTypesFieldArray.fields.length > 0 ? (
                        <div className="border rounded-md divide-y">
                          {roomTypesFieldArray.fields.map((field, index) => (
                            <div key={field.id} className="p-4">
                              <div className="flex justify-between items-start mb-4">
                                <h5 className="font-medium">Room Type #{index + 1}</h5>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => roomTypesFieldArray.remove(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`roomTypes.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Room Name*</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. Deluxe Double Room" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`roomTypes.${index}.bedType`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Bed Type</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select bed type" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {bedTypeOptions.map((type) => (
                                            <SelectItem key={type} value={type}>
                                              {type}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`roomTypes.${index}.size`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Room Size</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. 30 m²" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`roomTypes.${index}.view`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>View</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select view type" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {roomViewOptions.map((view) => (
                                            <SelectItem key={view} value={view}>
                                              {view}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`roomTypes.${index}.price`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Price per Night</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          placeholder="e.g. 150" 
                                          {...field}
                                          value={field.value === undefined ? "" : field.value}
                                          onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="md:col-span-2">
                                  <FormField
                                    control={form.control}
                                    name={`roomTypes.${index}.amenities`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Room Amenities</FormLabel>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                          {roomAmenityOptions.map((option) => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                              <Checkbox
                                                id={`room-amenity-${index}-${option.id}`}
                                                checked={field.value.includes(option.id)}
                                                onCheckedChange={(checked) => {
                                                  if (checked) {
                                                    field.onChange([...field.value, option.id]);
                                                  } else {
                                                    field.onChange(field.value.filter((val: string) => val !== option.id));
                                                  }
                                                }}
                                              />
                                              <label
                                                htmlFor={`room-amenity-${index}-${option.id}`}
                                                className="text-sm cursor-pointer"
                                              >
                                                {option.label}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border rounded-md p-6 text-center">
                          <BedDouble className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No room types added yet</p>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* FAQs */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileQuestion className="h-5 w-5" />
                        Frequently Asked Questions
                      </h3>
                      <FormDescription>
                        Add frequently asked questions about this hotel.
                      </FormDescription>
                      
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">FAQ Items</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => faqsFieldArray.append({ question: "", answer: "" })}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add FAQ
                        </Button>
                      </div>
                      
                      {faqsFieldArray.fields.length > 0 ? (
                        <div className="border rounded-md divide-y">
                          {faqsFieldArray.fields.map((field, index) => (
                            <div key={field.id} className="p-4">
                              <div className="flex justify-between items-start mb-4">
                                <h5 className="font-medium">FAQ #{index + 1}</h5>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => faqsFieldArray.remove(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                              <div className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name={`faqs.${index}.question`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Question*</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. What are the check-in and check-out times?" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`faqs.${index}.answer`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Answer*</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="Provide an answer to the question" 
                                          className="min-h-[100px]"
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border rounded-md p-6 text-center">
                          <FileQuestion className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No FAQs added yet</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Google Map */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Map Location</h3>
                  
                  <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center border">
                    {isLoaded && 
                     form.watch('latitude') !== undefined && 
                     form.watch('latitude') !== null && 
                     form.watch('longitude') !== undefined && 
                     form.watch('longitude') !== null ? (
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={{ 
                          lat: Number(form.watch('latitude')), 
                          lng: Number(form.watch('longitude')) 
                        }}
                        zoom={15}
                      >
                        <Marker 
                          position={{ 
                            lat: Number(form.watch('latitude')), 
                            lng: Number(form.watch('longitude')) 
                          }} 
                        />
                      </GoogleMap>
                    ) : (
                      <div className="text-center p-4">
                        <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <h3 className="text-lg font-medium mb-1">Map Integration</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Enter latitude and longitude coordinates to see the hotel location on the map.
                          {!apiKey && " (Google Maps API key required)"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/hotels")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      // Get current form values without validation
                      const currentValues = form.getValues();
                      // Set status to draft
                      currentValues.status = "draft";
                      
                      // Create mutation for saving draft without validation
                      const saveDraft = async () => {
                        try {
                          const response = await fetch("/api/admin/hotel-drafts", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(currentValues),
                            credentials: "include"
                          });
                          
                          if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || "Failed to save draft");
                          }
                          
                          toast({
                            title: "Draft saved",
                            description: "Hotel has been saved as a draft",
                          });
                          
                          // Refresh hotel list
                          queryClient.invalidateQueries({ queryKey: ['/api/admin/hotels'] });
                          
                          // Navigate back to hotel list
                          navigate("/admin/hotels");
                        } catch (error) {
                          toast({
                            title: "Error saving draft",
                            description: error instanceof Error ? error.message : "There was a problem saving your draft",
                            variant: "destructive",
                          });
                          console.error("Error saving draft:", error);
                        }
                      };
                      
                      // Execute the draft save
                      saveDraft();
                    }}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    disabled={createHotelMutation.isPending}
                    className="gap-1"
                  >
                    {createHotelMutation.isPending && (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    )}
                    <Save className="h-4 w-4 mr-1" />
                    Save Hotel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}