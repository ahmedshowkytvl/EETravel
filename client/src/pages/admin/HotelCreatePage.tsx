import React, { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
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
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

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
});

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

export default function HotelCreatePage() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [formInitialized, setFormInitialized] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // Get saved form data from localStorage or use defaults
  const getSavedFormData = (): Partial<HotelFormValues> => {
    const savedData = localStorage.getItem('hotelCreateFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setIsDraft(true);
        return parsed;
      } catch (e) {
        console.error('Error parsing saved form data:', e);
      }
    }
    return {};
  };
  
  // Save form data to localStorage as draft
  const saveFormAsDraft = () => {
    const formValues = form.getValues();
    localStorage.setItem('hotelCreateFormData', JSON.stringify(formValues));
    setIsDraft(true);
    toast({
      title: "Draft Saved",
      description: "Your hotel information has been saved as a draft.",
    });
  };
  
  // Use navigateWithConfirmation from our hook for all navigation

  // Query to fetch destinations data for the dropdown
  const { data: destinations = [] } = useQuery({
    queryKey: ["/api/destinations"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Merge default values with saved values from localStorage
  const savedFormData = getSavedFormData();
  
  // Form setup with default values
  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: savedFormData.name || "",
      description: savedFormData.description || "",
      destinationId: savedFormData.destinationId || undefined,
      address: savedFormData.address || "",
      city: savedFormData.city || "",
      country: savedFormData.country || "",
      postalCode: savedFormData.postalCode || "",
      phone: savedFormData.phone || "",
      email: savedFormData.email || "",
      website: savedFormData.website || "",
      imageUrl: savedFormData.imageUrl || "",
      stars: savedFormData.stars || 3,
      amenities: savedFormData.amenities || [],
      checkInTime: savedFormData.checkInTime || "14:00",
      checkOutTime: savedFormData.checkOutTime || "11:00",
      longitude: savedFormData.longitude || undefined,
      latitude: savedFormData.latitude || undefined,
      featured: savedFormData.featured || false,
      status: savedFormData.status || "active",
    },
  });

  // Check for drafts on component mount
  useEffect(() => {
    const draftExists = localStorage.getItem('hotelDraft');
    if (draftExists) {
      setIsDraft(true);
    }
    
    // Initialize selectedAmenities from saved data if available
    if (!formInitialized && savedFormData.amenities && Array.isArray(savedFormData.amenities)) {
      setSelectedAmenities(savedFormData.amenities);
      setFormInitialized(true);
    }
  }, [formInitialized, savedFormData.amenities]);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem('hotelCreateFormData', JSON.stringify({
        ...value,
        amenities: selectedAmenities
      }));
    });
    
    return () => subscription.unsubscribe();
  }, [form, selectedAmenities]);
  
  // Save as draft function
  const saveAsDraft = () => {
    const formData = form.getValues();
    const draftData = {
      ...formData,
      amenities: selectedAmenities,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('hotelDraft', JSON.stringify(draftData));
    setIsDraft(true);
    
    toast({
      title: "Draft Saved",
      description: "Your hotel data has been saved as a draft",
      duration: 3000,
    });
  };
  
  // Load draft function
  const loadDraft = () => {
    const draftData = localStorage.getItem('hotelDraft');
    if (draftData) {
      try {
        const parsedData = JSON.parse(draftData);
        form.reset(parsedData);
        if (parsedData.amenities && Array.isArray(parsedData.amenities)) {
          setSelectedAmenities(parsedData.amenities);
        }
        
        toast({
          title: "Draft Loaded",
          description: "Your saved hotel draft has been loaded",
          duration: 3000,
        });
        
        // Keep the draft but mark it as viewed
        setIsDraft(false);
      } catch (e) {
        console.error('Error loading draft data:', e);
        toast({
          title: "Error",
          description: "Failed to load draft data",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };
  
  // Define the clearDraft function
  const clearDraft = () => {
    localStorage.removeItem('hotelDraft');
    setIsDraft(false);
    toast({
      title: "Draft Cleared",
      description: "Your saved hotel draft has been deleted",
      duration: 3000,
    });
  };
  
  // Create hotel mutation
  const createHotelMutation = useMutation({
    mutationFn: async (data: HotelFormValues) => {
      // Convert amenities array to expected format
      const formData = {
        ...data,
        amenities: selectedAmenities,
      };
      
      // Clear form data and draft from localStorage on successful submission
      localStorage.removeItem('hotelCreateFormData');
      localStorage.removeItem('hotelDraft');
      
      // Fix API request to match expected format
      return await apiRequest("/api/admin/hotels", {
        method: 'POST', 
        body: JSON.stringify(formData)
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

  // Handle amenity selection
  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities((prev) => [...prev, amenityId]);
    } else {
      setSelectedAmenities((prev) => prev.filter((id) => id !== amenityId));
    }
  };

  // Check if the form is dirty
  const isDirtyCheck = () => {
    return form.formState.isDirty;
  };

  // Use the shared hook for handling unsaved changes
  const {
    showConfirmDialog: confirmDialogOpen,
    setShowConfirmDialog: setConfirmDialogOpen,
    handleNavigation: navigateWithConfirmation,
    handleSaveAsDraft,
    handleContinue,
    handleDiscard
  } = useUnsavedChanges({
    isDirtyFn: isDirtyCheck,
    onSaveAsDraft: saveAsDraft,
    onDiscard: clearDraft
  });

  return (
    <DashboardLayout>
      {/* Confirmation Dialog for Unsaved Changes */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in your hotel form. What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={handleDiscard}
              className="sm:order-1 w-full sm:w-auto"
            >
              Discard Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSaveAsDraft}
              className="sm:order-2 w-full sm:w-auto"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={handleContinue}
              className="sm:order-3 w-full sm:w-auto"
            >
              Continue Editing
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Button variant="link" onClick={() => navigateWithConfirmation("/admin")}>Dashboard</Button>
            <ChevronRight className="h-4 w-4" />
            <Button variant="link" onClick={() => navigateWithConfirmation("/admin/hotels")}>Hotels</Button>
            <ChevronRight className="h-4 w-4" />
            <span>Create Hotel</span>
          </div>
        </div>
        
        {/* Draft notice banner */}
        {isDraft && (
          <div className="mb-4 p-4 border border-blue-200 bg-blue-50 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-800">Draft Available</h3>
              <p className="text-blue-600">You have a saved hotel draft. Would you like to continue where you left off?</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearDraft}>
                Discard Draft
              </Button>
              <Button onClick={loadDraft}>
                Load Draft
              </Button>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Create New Hotel</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hotel Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotel Name*</FormLabel>
                        <FormControl>
                          <Input 
                            id="hotel-name"
                            className="hotel-name-input admin-input"
                            placeholder="Grand Hotel" 
                            {...field} 
                          />
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
                            <SelectTrigger 
                              id="hotel-destination"
                              className="destination-select admin-select"
                            >
                              <SelectValue placeholder="Select a destination" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.isArray(destinations) && destinations.map((destination: any) => (
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
                          id="hotel-description"
                          className="min-h-[120px] hotel-description-input admin-textarea"
                          placeholder="Describe the hotel and its unique features"
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
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="hotel-address"
                              className="pl-10 hotel-address-input admin-input"
                              placeholder="123 Hotel Street"
                              {...field}
                              value={field.value || ""}
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
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            id="hotel-city"
                            className="hotel-city-input admin-input"
                            placeholder="City Name"
                            {...field}
                            value={field.value || ""}
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
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            id="hotel-country"
                            className="hotel-country-input admin-input"
                            placeholder="Country Name"
                            {...field}
                            value={field.value || ""}
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
                            id="hotel-postal-code"
                            className="hotel-postal-code-input admin-input"
                            placeholder="12345"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                              id="hotel-phone"
                              className="pl-10 hotel-phone-input admin-phone-input"
                              placeholder="+1 (123) 456-7890"
                              {...field}
                              value={field.value || ""}
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
                              id="hotel-email"
                              className="pl-10 hotel-email-input admin-email-input"
                              placeholder="info@hotelname.com"
                              {...field}
                              value={field.value || ""}
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                              id="hotel-website"
                              className="pl-10 hotel-website-input admin-url-input"
                              placeholder="https://www.hotelname.com"
                              {...field}
                              value={field.value || ""}
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
                            id="hotel-image-url"
                            className="hotel-image-url-input admin-url-input"
                            placeholder="https://example.com/hotel-image.jpg"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Stars */}
                  <FormField
                    control={form.control}
                    name="stars"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Star Rating</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value?.toString() || "3"}
                            >
                              <SelectTrigger 
                                id="hotel-stars"
                                className="pl-10 hotel-stars-select admin-select"
                              >
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
                            value={field.value === undefined ? "" : field.value}
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
                            value={field.value === undefined ? "" : field.value}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Featured */}
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Hotel</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Feature this hotel on the homepage
                        </div>
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

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="maintenance">Under Maintenance</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amenities */}
                <div className="space-y-3">
                  <FormLabel>Amenities</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {hotelAmenitiesOptions.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity.id}`}
                          checked={selectedAmenities.includes(amenity.id)}
                          onCheckedChange={(checked) => 
                            handleAmenityChange(amenity.id, checked as boolean)
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
                      onClick={() => navigate("/admin/hotels/categories")}
                      className="flex justify-start items-center"
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Category Manager
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/admin/hotels/facilities")}
                      className="flex justify-start items-center"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Facilities Manager
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/admin/hotels/highlights")}
                      className="flex justify-start items-center"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Highlights Manager
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/admin/hotels/cleanliness-features")}
                      className="flex justify-start items-center"
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Cleanliness Features
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleNavigation("/admin/hotels")}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={saveAsDraft}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={createHotelMutation.isPending}
                  >
                    {createHotelMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Creating...
                      </div>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Hotel
                      </>
                    )}
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