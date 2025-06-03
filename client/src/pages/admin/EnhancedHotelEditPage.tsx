import React, { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm, Controller } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { 
  Hotel, 
  Building, 
  ChevronRight, 
  Star, 
  Map as MapIcon, 
  Check, 
  Home, 
  PencilLine, 
  ListPlus, 
  Wifi, 
  Utensils, 
  Dumbbell, 
  Car,
  Tag,
  Sparkles,
  BedDouble,
  Plus,
  RefreshCw,
  Loader2,
  Pencil
} from "lucide-react";

// Define the form schema
const hotelFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional().nullable(),
  destinationId: z.coerce.number().positive({ message: "Please select a destination" }),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email({ message: "Please enter a valid email" }).optional().nullable(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
  stars: z.coerce.number().min(1).max(5).default(3),
  amenities: z.array(z.string()).default([]),
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
  longitude: z.coerce.number().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  featured: z.boolean().default(false),
  status: z.string().default("active"),
  parkingAvailable: z.boolean().default(false),
  airportTransferAvailable: z.boolean().default(false),
  carRentalAvailable: z.boolean().default(false),
  shuttleAvailable: z.boolean().default(false),
});

// Types
type HotelFormValues = z.infer<typeof hotelFormSchema>;

// Common hotel amenities
const hotelAmenitiesOptions = [
  { id: "wifi", label: "Wi-Fi" },
  { id: "parking", label: "Parking" },
  { id: "pool", label: "Swimming Pool" },
  { id: "spa", label: "Spa & Wellness" },
  { id: "restaurant", label: "Restaurant" },
  { id: "bar", label: "Bar/Lounge" },
  { id: "gym", label: "Fitness Center" },
  { id: "roomService", label: "Room Service" },
  { id: "airportShuttle", label: "Airport Shuttle" },
  { id: "businessCenter", label: "Business Center" },
  { id: "conferenceRoom", label: "Conference Room" },
  { id: "childcare", label: "Childcare Services" },
  { id: "laundry", label: "Laundry Service" },
  { id: "wheelchairAccessible", label: "Wheelchair Accessible" },
  { id: "petFriendly", label: "Pet Friendly" },
];

// Room amenities for displaying in the room section
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

export default function EnhancedHotelEditPage() {
  const [_, navigate] = useLocation();
  const [match, params] = useRoute("/admin/hotels/edit/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 30.0444, lng: 31.2357 }); // Cairo default
  const [formInitialized, setFormInitialized] = useState(false);
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");

  const hotelId = params?.id ? parseInt(params.id) : null;

  // Google Maps integration
  const { isLoaded: isMapLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  // Query to fetch hotel data
  const {
    data: hotel,
    isLoading: isLoadingHotel,
    error: hotelError
  } = useQuery({
    queryKey: ["/api/admin/hotels", hotelId],
    queryFn: () => {
      return fetch(`/api/admin/hotels/${hotelId}`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch hotel data');
        return res.json();
      });
    },
    enabled: !!hotelId,
  });

  // Query to fetch destinations data for the dropdown
  const { data: destinations = [] } = useQuery({
    queryKey: ["/api/admin/destinations"],
    queryFn: () => {
      return fetch('/api/admin/destinations').then(res => {
        if (!res.ok) throw new Error('Failed to fetch destinations data');
        return res.json();
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Query to fetch hotel categories for dropdown
  const { data: hotelCategories = [] } = useQuery({
    queryKey: ["/api/admin/hotel-categories"],
    queryFn: () => {
      return fetch('/api/admin/hotel-categories').then(res => {
        if (!res.ok) throw new Error('Failed to fetch hotel categories data');
        return res.json();
      });
    },
  });
  
  // Query to fetch rooms related to this hotel
  const {
    data: hotelRooms = [],
    isLoading: isLoadingRooms,
    error: roomsError,
    refetch: refetchRooms
  } = useQuery({
    queryKey: ["/api/admin/rooms/hotel", hotelId],
    queryFn: () => {
      return fetch(`/api/admin/rooms/hotel/${hotelId}`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch rooms data');
        return res.json();
      });
    },
    enabled: !!hotelId,
  });

  // Creating a form with react-hook-form
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
      amenities: [],
      checkInTime: "14:00",
      checkOutTime: "11:00",
      longitude: undefined,
      latitude: undefined,
      featured: false,
      status: "active",
      parkingAvailable: false,
      airportTransferAvailable: false,
      carRentalAvailable: false,
      shuttleAvailable: false,
    },
  });
  
  const formIsDirty = form.formState.isDirty;
  
  // Track unsaved changes
  useUnsavedChanges(formIsDirty, () => {
    if (formIsDirty) {
      setShowUnsavedChangesAlert(true);
      return false;
    }
    return true;
  });

  // Load hotel data into form when it's available
  useEffect(() => {
    if (hotel && !formInitialized) {
      let amenities = hotel.amenities || [];
      
      // Convert amenities to array if it's stored as a JSON string
      if (typeof amenities === 'string') {
        try {
          amenities = JSON.parse(amenities);
        } catch (e) {
          amenities = amenities.split(',').map((item: string) => item.trim());
        }
      }
      
      setSelectedAmenities(Array.isArray(amenities) ? amenities : []);
      
      // Update map center if hotel has coordinates
      if (hotel.latitude && hotel.longitude) {
        setMapCenter({
          lat: parseFloat(hotel.latitude),
          lng: parseFloat(hotel.longitude),
        });
      }
      
      form.reset({
        name: hotel.name || "",
        description: hotel.description || "",
        destinationId: hotel.destinationId,
        address: hotel.address || "",
        city: hotel.city || "",
        country: hotel.country || "",
        postalCode: hotel.postalCode || "",
        phone: hotel.phone || "",
        email: hotel.email || "",
        website: hotel.website || "",
        imageUrl: hotel.imageUrl || "",
        stars: hotel.stars || 3,
        amenities: Array.isArray(amenities) ? amenities : [],
        checkInTime: hotel.checkInTime || "",
        checkOutTime: hotel.checkOutTime || "",
        longitude: hotel.longitude,
        latitude: hotel.latitude,
        featured: hotel.featured || false,
        status: hotel.status || "active",
        parkingAvailable: hotel.parkingAvailable || false,
        airportTransferAvailable: hotel.airportTransferAvailable || false,
        carRentalAvailable: hotel.carRentalAvailable || false,
        shuttleAvailable: hotel.shuttleAvailable || false,
      });
      
      setFormInitialized(true);
    }
  }, [hotel, form, formInitialized]);

  // Handle map click to set coordinates
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      form.setValue("latitude", lat);
      form.setValue("longitude", lng);
      setMapCenter({ lat, lng });
    }
  };

  // Handle navigation with unsaved changes warning
  const handleNavigateAway = (path: string) => {
    if (formIsDirty) {
      setRedirectPath(path);
      setShowUnsavedChangesAlert(true);
    } else {
      navigate(path);
    }
  };

  // Update amenities when selection changes
  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    let updatedAmenities: string[];
    
    if (checked) {
      updatedAmenities = [...selectedAmenities, amenity];
    } else {
      updatedAmenities = selectedAmenities.filter(item => item !== amenity);
    }
    
    setSelectedAmenities(updatedAmenities);
    form.setValue("amenities", updatedAmenities);
  };

  // Function to handle room price update
  const handleRoomPriceUpdate = async (roomId: number, price: number, discountedPrice: number | null) => {
    try {
      await fetch(`/api/admin/rooms/${roomId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price, discountedPrice }),
      });
      
      toast({
        title: "Success",
        description: "Room price updated successfully",
      });
      
      // Refetch rooms
      refetchRooms();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update room price: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Update hotel mutation
  const updateHotelMutation = useMutation({
    mutationFn: async (data: HotelFormValues) => {
      const response = await fetch(`/api/admin/hotels/${hotelId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update hotel: ${response.statusText}`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Hotel updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hotels"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hotels", hotelId] });
      navigate("/admin/hotels");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update hotel: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: HotelFormValues) => {
    updateHotelMutation.mutate(values);
  };

  return (
    <DashboardLayout>
      <AlertDialog open={showUnsavedChangesAlert} onOpenChange={setShowUnsavedChangesAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUnsavedChangesAlert(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              navigate(redirectPath);
            }}>Discard Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="link" onClick={() => handleNavigateAway("/admin")}>
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <ChevronRight className="h-4 w-4" />
            <Button variant="link" onClick={() => handleNavigateAway("/admin/hotels")}>
              <Hotel className="h-4 w-4 mr-2" />
              Hotels
            </Button>
            <ChevronRight className="h-4 w-4" />
            <span className="flex items-center">
              <PencilLine className="h-4 w-4 mr-2" />
              Edit Hotel
            </span>
          </div>
          <h1 className="text-3xl font-bold">Edit Hotel</h1>
          <p className="text-muted-foreground">
            Update hotel information and manage associated rooms.
          </p>
        </div>

        {isLoadingHotel ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading hotel data...</span>
          </div>
        ) : hotelError ? (
          <div className="text-center p-8 text-red-500">
            <p>Error loading hotel data. Please try again.</p>
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/hotels", hotelId] })}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Hotel Details</TabsTrigger>
                    <TabsTrigger value="rooms">Rooms ({hotelRooms?.length || 0})</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                  </TabsList>
                  
                  {/* Hotel Details Tab */}
                  <TabsContent value="details">
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                          Enter the basic details about the hotel.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hotel Name*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter hotel name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="destinationId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Destination*</FormLabel>
                                <FormControl>
                                  <Select
                                    value={field.value?.toString() || ""}
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a destination" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {destinations.map((destination: any) => (
                                        <SelectItem key={destination.id} value={destination.id.toString()}>
                                          {destination.name}, {destination.country}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter hotel description"
                                  className="min-h-32"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com/image.jpg"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter a URL for the main hotel image
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stars"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Star Rating</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value?.toString() || "3"}
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select star rating" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5].map((stars) => (
                                      <SelectItem key={stars} value={stars.toString()}>
                                        {stars} {stars === 1 ? "Star" : "Stars"}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="checkInTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Check-in Time</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="14:00"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Format: 24-hour time (HH:MM)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="checkOutTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Check-out Time</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="11:00"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Format: 24-hour time (HH:MM)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Featured Hotel</FormLabel>
                                <FormDescription>
                                  Featured hotels appear on the homepage and are highlighted in search results
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value || "active"}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>
                          Enter contact details for the hotel.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="+20 123 456 7890"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="hotel@example.com"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://www.example.com"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Rooms Tab */}
                  <TabsContent value="rooms">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Hotel Rooms</CardTitle>
                            <CardDescription>
                              Manage rooms associated with this hotel.
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleNavigateAway(`/admin/rooms/create?hotelId=${hotelId}`)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add New Room
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => refetchRooms()} 
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Refresh
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isLoadingRooms ? (
                          <div className="text-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                            <p>Loading room data...</p>
                          </div>
                        ) : roomsError ? (
                          <div className="text-center p-8 text-red-500">
                            <p>Error loading room data. Please try again.</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => refetchRooms()}
                              className="mt-2"
                            >
                              Retry
                            </Button>
                          </div>
                        ) : hotelRooms && hotelRooms.length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Room Name</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Capacity</TableHead>
                                  <TableHead>Base Price</TableHead>
                                  <TableHead>Discounted Price</TableHead>
                                  <TableHead>Available</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {hotelRooms.map((room: any) => (
                                  <TableRow key={room.id}>
                                    <TableCell>
                                      <div className="font-medium">{room.name}</div>
                                    </TableCell>
                                    <TableCell>{room.type}</TableCell>
                                    <TableCell>
                                      {room.maxAdults} Adults, {room.maxChildren} Children
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center space-x-2">
                                        <Input 
                                          type="number" 
                                          className="w-20 text-right"
                                          defaultValue={room.price}
                                          onBlur={(e) => {
                                            const newPrice = parseInt(e.target.value);
                                            if (newPrice !== room.price && !isNaN(newPrice)) {
                                              handleRoomPriceUpdate(
                                                room.id, 
                                                newPrice, 
                                                room.discountedPrice
                                              );
                                            }
                                          }}
                                        />
                                        <span>$</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center space-x-2">
                                        <Input 
                                          type="number" 
                                          className="w-20 text-right"
                                          defaultValue={room.discountedPrice || ''}
                                          placeholder="-"
                                          onBlur={(e) => {
                                            const newPrice = e.target.value ? parseInt(e.target.value) : null;
                                            if (newPrice !== room.discountedPrice) {
                                              handleRoomPriceUpdate(
                                                room.id, 
                                                room.price, 
                                                newPrice
                                              );
                                            }
                                          }}
                                        />
                                        <span>$</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge 
                                        variant={room.available ? "default" : "secondary"}
                                        className={room.available ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                                      >
                                        {room.available ? 'Available' : 'Unavailable'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end space-x-2">
                                        <Button 
                                          variant="ghost" 
                                          size="icon"
                                          onClick={() => handleNavigateAway(`/admin/rooms/${room.id}/edit`)}
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center p-8 border rounded-md bg-muted">
                            <BedDouble className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="mb-2 text-lg font-medium">No Rooms Found</p>
                            <p className="text-sm text-muted-foreground mb-4">
                              This hotel doesn't have any rooms linked to it yet.
                            </p>
                            <Button 
                              variant="outline" 
                              onClick={() => handleNavigateAway(`/admin/rooms/create?hotelId=${hotelId}`)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add New Room
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Location Tab */}
                  <TabsContent value="location">
                    <Card>
                      <CardHeader>
                        <CardTitle>Location Information</CardTitle>
                        <CardDescription>
                          Enter the address details and set the geographical location.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="md:col-span-3">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="123 Main St."
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Cairo"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Egypt"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

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
                          <FormField
                            control={form.control}
                            name="latitude"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Latitude</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="30.0444"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      if (e.target.value && form.getValues("longitude")) {
                                        setMapCenter({
                                          lat: parseFloat(e.target.value),
                                          lng: parseFloat(form.getValues("longitude")?.toString() || "0"),
                                        });
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="longitude"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Longitude</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="31.2357"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      if (e.target.value && form.getValues("latitude")) {
                                        setMapCenter({
                                          lat: parseFloat(form.getValues("latitude")?.toString() || "0"),
                                          lng: parseFloat(e.target.value),
                                        });
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="pt-4">
                          <FormLabel className="block mb-2">Map Location</FormLabel>
                          <p className="text-sm text-muted-foreground mb-4">
                            Click on the map to set the hotel's exact location
                          </p>
                          <div className="h-[400px] w-full overflow-hidden rounded-md border">
                            {isMapLoaded ? (
                              <GoogleMap
                                mapContainerStyle={{ width: "100%", height: "100%" }}
                                center={mapCenter}
                                zoom={13}
                                onClick={handleMapClick}
                              >
                                {form.getValues("latitude") && form.getValues("longitude") && (
                                  <Marker
                                    position={{
                                      lat: parseFloat(form.getValues("latitude")?.toString() || "0"),
                                      lng: parseFloat(form.getValues("longitude")?.toString() || "0"),
                                    }}
                                  />
                                )}
                              </GoogleMap>
                            ) : (
                              <div className="flex items-center justify-center h-full bg-muted">
                                <p>Loading map...</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Features Tab */}
                  <TabsContent value="features">
                    <Card>
                      <CardHeader>
                        <CardTitle>Hotel Amenities</CardTitle>
                        <CardDescription>
                          Select the amenities available at this hotel.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {hotelAmenitiesOptions.map((amenity) => (
                            <div
                              key={amenity.id}
                              className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors"
                            >
                              <Checkbox
                                id={`amenity-${amenity.id}`}
                                checked={selectedAmenities.includes(amenity.label)}
                                onCheckedChange={(checked) =>
                                  handleAmenityToggle(amenity.label, checked === true)
                                }
                              />
                              <label
                                htmlFor={`amenity-${amenity.id}`}
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                {amenity.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Transportation Options</CardTitle>
                        <CardDescription>
                          Select transportation services offered by the hotel.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="parkingAvailable"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Parking Available</FormLabel>
                                  <FormDescription>
                                    Hotel offers parking facilities for guests
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="airportTransferAvailable"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Airport Transfer</FormLabel>
                                  <FormDescription>
                                    Hotel offers airport pickup and drop-off services
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="carRentalAvailable"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Car Rental</FormLabel>
                                  <FormDescription>
                                    Hotel offers car rental services or partnerships
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="shuttleAvailable"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Shuttle Service</FormLabel>
                                  <FormDescription>
                                    Hotel offers shuttle services to nearby attractions
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Hotel Features Management</CardTitle>
                        <CardDescription>
                          Access management tools for hotel features.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleNavigateAway("/admin/hotels/categories")}
                            className="flex justify-start items-center"
                          >
                            <Tag className="h-4 w-4 mr-2" />
                            Category Manager
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleNavigateAway("/admin/hotels/facilities")}
                            className="flex justify-start items-center"
                          >
                            <Building className="h-4 w-4 mr-2" />
                            Facilities Manager
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleNavigateAway("/admin/hotels/highlights")}
                            className="flex justify-start items-center"
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Highlights Manager
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleNavigateAway("/admin/hotels/cleanliness-features")}
                            className="flex justify-start items-center"
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Cleanliness Features
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleNavigateAway("/admin/hotels")}
                >
                  Cancel
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    disabled={updateHotelMutation.isPending}
                  >
                    {updateHotelMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </div>
    </DashboardLayout>
  );
}