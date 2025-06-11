import React, { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ChevronRight,
  Save,
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  Globe,
  ShieldCheck,
  Tag,
  Building,
  ArrowLeft,
  Home,
  Hotel,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";

// Define the schema for hotel form validation
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
  // New fields
  parkingAvailable: z.boolean().default(false),
  airportTransferAvailable: z.boolean().default(false),
  carRentalAvailable: z.boolean().default(false),
  shuttleAvailable: z.boolean().default(false),
});

type HotelFormValues = z.infer<typeof hotelFormSchema>;

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

export default function HotelEditPage() {
  const { t } = useLanguage();
  const [_, navigate] = useLocation();
  const [match, params] = useRoute("/admin/hotels/edit/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [formInitialized, setFormInitialized] = useState(false);
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");

  const hotelId = params?.id ? parseInt(params.id) : null;

  // Query to fetch hotel data
  const {
    data: hotel,
    isLoading: isLoadingHotel,
    error: hotelError
  } = useQuery({
    queryKey: ["/api/admin/hotels", hotelId],
    queryFn: getQueryFn(`/api/admin/hotels/${hotelId}`),
    enabled: !!hotelId,
  });

  // Query to fetch destinations data for the dropdown
  const { data: destinations = [] } = useQuery({
    queryKey: ["/api/destinations"],
    queryFn: getQueryFn(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Query to fetch rooms related to this hotel
  const {
    data: hotelRooms = [],
    isLoading: isLoadingRooms,
    error: roomsError,
    refetch: refetchRooms
  } = useQuery({
    queryKey: ["/api/admin/rooms/hotel", hotelId],
    queryFn: getQueryFn(`/api/admin/rooms/hotel/${hotelId}`),
    enabled: !!hotelId,
  });
  
  // Creating a form with react-hook-form, using our zod schema for validation
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
      checkInTime: "",
      checkOutTime: "",
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

  // Update mutation to edit the hotel
  const updateMutation = useMutation({
    mutationFn: async (data: HotelFormValues) => {
      return await apiRequest(`/api/admin/hotels/${hotelId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Hotel updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hotels"] });
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

  const onSubmit = (data: HotelFormValues) => {
    data.amenities = selectedAmenities;
    updateMutation.mutate(data);
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities((prev) => [...prev, amenityId]);
    } else {
      setSelectedAmenities((prev) => prev.filter((id) => id !== amenityId));
    }
  };

  const handleNavigateAway = (path: string) => {
    if (formIsDirty) {
      setRedirectPath(path);
      setShowUnsavedChangesAlert(true);
    } else {
      navigate(path);
    }
  };

  const confirmNavigateAway = () => {
    setShowUnsavedChangesAlert(false);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  const cancelNavigateAway = () => {
    setShowUnsavedChangesAlert(false);
    setRedirectPath("");
  };

  if (isLoadingHotel) {
    return (
      <div>
        <div className="w-full h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (hotelError) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load hotel: {(hotelError as Error).message}</p>
            <Button 
              onClick={() => navigate("/admin/hotels")}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hotels
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hotel && !isLoadingHotel) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Hotel not found. It may have been deleted or the ID is invalid.</p>
            <Button 
              onClick={() => navigate("/admin/hotels")}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hotels
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Alert Dialog for Unsaved Changes */}
      <AlertDialog
        open={showUnsavedChangesAlert}
        onOpenChange={setShowUnsavedChangesAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelNavigateAway}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmNavigateAway}>
              Leave without saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto p-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/hotels">
                <Hotel className="h-4 w-4 mr-2" />
                Hotels
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <span className="flex items-center">
                <Pencil className="h-4 w-4 mr-2" />
                Edit Hotel
              </span>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Edit Hotel: {hotel?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Basic Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>

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
                      name="destinationId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination*</FormLabel>
                          <Select
                            value={field.value?.toString()}
                            onValueChange={(value) => {
                              field.onChange(parseInt(value));
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a destination" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.isArray(destinations) && destinations.map((destination: any) => (
                                <SelectItem
                                  key={destination.id}
                                  value={destination.id.toString()}
                                >
                                  {destination.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="stars"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Star Rating*</FormLabel>
                            <Select
                              value={field.value?.toString()}
                              onValueChange={(value) => {
                                field.onChange(parseInt(value));
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select star rating" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">⭐ 1 Star</SelectItem>
                                <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                                <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                                <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                                <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured Hotel</FormLabel>
                            <FormDescription>
                              Mark this hotel as featured to show it on the homepage
                            </FormDescription>
                          </div>
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

                  {/* Location Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Location Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter hotel address"
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
                                placeholder="Enter city"
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
                                placeholder="Enter country"
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
                                placeholder="Enter postal code"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Longitude</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.000001"
                                placeholder="Enter longitude"
                                {...field}
                                value={field.value === undefined ? "" : field.value}
                                onChange={(e) => {
                                  const value = e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined;
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Latitude</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.000001"
                                placeholder="Enter latitude"
                                {...field}
                                value={field.value === undefined ? "" : field.value}
                                onChange={(e) => {
                                  const value = e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined;
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter phone number"
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
                                placeholder="Enter email address"
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
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com"
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Hotel Operations Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Hotel Operations
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  {/* Transportation Options Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Transportation Options
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="parkingAvailable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Parking Available</FormLabel>
                              <FormDescription>
                                Hotel offers on-site parking
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="airportTransferAvailable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Airport Transfer</FormLabel>
                              <FormDescription>
                                Hotel offers airport pickup/drop-off
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="carRentalAvailable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Car Rental</FormLabel>
                              <FormDescription>
                                Hotel offers car rental services
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shuttleAvailable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Shuttle Service</FormLabel>
                              <FormDescription>
                                Hotel offers shuttle services to attractions
                              </FormDescription>
                            </div>
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

                  {/* Amenities Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">Amenities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {hotelAmenitiesOptions.map((amenity) => (
                        <div
                          key={amenity.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`amenity-${amenity.id}`}
                            checked={selectedAmenities.includes(amenity.id)}
                            onCheckedChange={(checked) =>
                              handleAmenityChange(
                                amenity.id,
                                checked as boolean
                              )
                            }
                          />
                          <label
                            htmlFor={`amenity-${amenity.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {amenity.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hotel Features Management */}
                  <div className="border p-4 rounded-lg mb-6 bg-slate-50">
                    <h3 className="text-lg font-semibold mb-3">Hotel Features Management</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create and manage various features that can be assigned to hotels.
                    </p>
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
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Cleanliness Features
                      </Button>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleNavigateAway("/admin/hotels")}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        type="submit"
                        disabled={!formIsDirty || updateMutation.isPending}
                      >
                        {updateMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Update Hotel
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}