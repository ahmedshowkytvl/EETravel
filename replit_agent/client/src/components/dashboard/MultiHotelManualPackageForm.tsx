import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useLocation } from "wouter";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ImagePlus, Loader2, Plus, Trash, Star, X, Edit, PlusCircle, Hotel, Building, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { validateForm, validateRequiredFields, validateNumericFields } from "@/lib/validateForm";
import { FormRequiredFieldsNote, FormValidationAlert } from "@/components/dashboard/FormValidationAlert";

// Define the hotel entry schema
const hotelEntrySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Hotel name must be at least 2 characters" }),
  stars: z.coerce.number().min(1).max(5),
  roomType: z.string().optional(),
  pricePerNight: z.coerce.number().optional(),
});

// Validation schema for manual package form
const manualPackageFormSchema = z.object({
  title: z.string().min(3, { message: "Package title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  discountedPrice: z.coerce.number().optional(),
  hotels: z.array(hotelEntrySchema).min(1, { message: "At least one hotel is required" }),
  transportationDetails: z.string().min(3, { message: "Transportation details must be at least 3 characters" }),
  tourDetails: z.string().min(3, { message: "Tour details must be at least 3 characters" }),
  duration: z.coerce.number().positive({ message: "Duration must be a positive number" }),
  destinationId: z.coerce.number({ required_error: "Please select a destination" }),
  categoryId: z.coerce.number({ required_error: "Please select a category" }),
  type: z.string().min(2, { message: "Type must be at least 2 characters" }),
  featured: z.boolean().default(false),
  inclusions: z.array(z.string()).min(1, { message: "At least one inclusion is required" }),
});

type ManualPackageFormValues = z.infer<typeof manualPackageFormSchema>;

export function MultiHotelManualPackageForm() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [images, setImages] = useState<{ id: string; file: File | null; preview: string; isMain: boolean }[]>([]);
  const [newInclusion, setNewInclusion] = useState("");
  const [newHotelName, setNewHotelName] = useState("");
  const [editingHotelIndex, setEditingHotelIndex] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isDraft, setIsDraft] = useState(false);
  
  // Used for autocomplete suggestion functionality
  const [hotelSuggestions, setHotelSuggestions] = useState<string[]>([]);
  const [typeSuggestions, setTypeSuggestions] = useState<string[]>([]);
  const [transportationSuggestions, setTransportationSuggestions] = useState<string[]>([]);
  const [tourSuggestions, setTourSuggestions] = useState<string[]>([]);
  const [inclusionSuggestions, setInclusionSuggestions] = useState<string[]>([]);
  const [roomTypeSuggestions, setRoomTypeSuggestions] = useState<string[]>([
    "Standard Room", "Deluxe Room", "Suite", "Executive Suite", "Family Room"
  ]);
  
  // Control displaying the suggestion dropdowns
  const [showHotelSuggestions, setShowHotelSuggestions] = useState(false);
  const [showTypeSuggestions, setShowTypeSuggestions] = useState(false);
  const [showTransportationSuggestions, setShowTransportationSuggestions] = useState(false);
  const [showTourSuggestions, setShowTourSuggestions] = useState(false);
  const [showInclusionSuggestions, setShowInclusionSuggestions] = useState(false);

  // Dialog state for adding/editing hotels
  const [isHotelDialogOpen, setIsHotelDialogOpen] = useState(false);
  const [hotelFormData, setHotelFormData] = useState({
    name: "",
    stars: 3,
    roomType: "",
    pricePerNight: undefined as number | undefined
  });

  // Fetch destinations for the dropdown
  const { data: destinations = [] } = useQuery<any[]>({
    queryKey: ['/api/destinations'],
  });

  // Fetch package categories for the dropdown
  const { data: packageCategories = [] } = useQuery<any[]>({
    queryKey: ['/api/package-categories'],
  });

  // Fetch existing packages to extract suggestions
  const { data: packages = [] } = useQuery<any[]>({
    queryKey: ['/api/packages'],
  });
  
  // Fetch hotels for the hotel name suggestions
  const { data: hotels = [] } = useQuery<any[]>({
    queryKey: ['/api/admin/hotels'],
  });

  const form = useForm<ManualPackageFormValues>({
    resolver: zodResolver(manualPackageFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      discountedPrice: 0,
      hotels: [],
      transportationDetails: "",
      tourDetails: "",
      duration: 1,
      destinationId: undefined,
      categoryId: undefined,
      type: "",
      featured: false,
      inclusions: [],
    },
  });

  // Setup field array for hotels
  const { fields: hotelFields, append: appendHotel, remove: removeHotel, update: updateHotel } = useFieldArray({
    control: form.control,
    name: "hotels",
  });

  // Populate suggestion data from existing packages and hotels when data is fetched
  useEffect(() => {
    // Extract unique values for autocomplete suggestions
    const hotelNames = new Set<string>();
    const types = new Set<string>();
    const inclusions = new Set<string>();

    // Add hotel names from the hotel database 
    if (hotels && hotels.length > 0) {
      hotels.forEach((hotel: any) => {
        if (hotel.name) {
          hotelNames.add(hotel.name);
        }
      });
    }

    // Extract data from packages if available
    if (packages && packages.length > 0) {
      packages.forEach((pkg: any) => {
        // Extract hotel names from package descriptions
        if (pkg.description && pkg.description.includes("Hotel:")) {
          const hotelMatch = pkg.description.match(/Hotel:\s*([\w\s]+)/);
          if (hotelMatch && hotelMatch[1]) {
            hotelNames.add(hotelMatch[1].trim());
          }
        }

        // Extract types
        if (pkg.type) {
          types.add(pkg.type);
        }

        // Extract inclusions
        if (pkg.inclusions && Array.isArray(pkg.inclusions)) {
          pkg.inclusions.forEach((inclusion: string) => {
            inclusions.add(inclusion);
          });
        }
      });
    }

    // Example data for transportation and tours - starting with some common options
    // In a real implementation, these would be fetched from specific API endpoints
    const transportations = new Set<string>([
      "Private car transfer",
      "Airport shuttle",
      "Luxury vehicle",
      "Group bus tour",
      "Private SUV with driver"
    ]);

    const tours = new Set<string>([
      "Pyramids guided tour",
      "Museum visit with expert",
      "Nile dinner cruise",
      "Desert safari experience",
      "Historical sites tour"
    ]);

    // Update state with suggestions
    setHotelSuggestions(Array.from(hotelNames));
    setTypeSuggestions(Array.from(types));
    setInclusionSuggestions(Array.from(inclusions));
    setTransportationSuggestions(Array.from(transportations));
    setTourSuggestions(Array.from(tours));
  }, [packages, hotels]);

  // Create manual package mutation
  const createManualPackageMutation = useMutation({
    mutationFn: async (formData: ManualPackageFormValues) => {
      // Get the main image URL (or a default if none is set)
      const mainImage = images.find(img => img.isMain);
      const mainImageUrl = mainImage ? mainImage.preview : "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800";
      
      // Get all gallery image URLs
      const galleryUrls = images.map(img => img.preview);
      
      // Build a more detailed description that includes all hotels
      const hotelsText = formData.hotels.map(hotel => 
        `${hotel.name} (${hotel.stars}★)${hotel.roomType ? ' - ' + hotel.roomType : ''}${hotel.pricePerNight ? ' - $' + hotel.pricePerNight + '/night' : ''}`
      ).join('\n');
      
      const enhancedDescription = `${formData.description}\n\nHotels:\n${hotelsText}\n\nTransportation: ${formData.transportationDetails}\n\nTour: ${formData.tourDetails}`;
      
      // Transform the form data to match the API schema
      const packageData = {
        title: 'MANUAL:' + formData.title, // Prefix with MANUAL: to identify manual packages
        description: enhancedDescription,
        price: formData.price,
        discountedPrice: formData.discountedPrice || Math.round(formData.price * 0.9), // Use provided discounted price or 10% off
        imageUrl: mainImageUrl,
        galleryUrls: galleryUrls,
        duration: formData.duration,
        rating: 45, // Default 4.5 stars (stored as 45 in DB)
        destinationId: formData.destinationId,
        featured: formData.featured,
        type: formData.type,
        inclusions: formData.inclusions
      };
      
      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create package');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      
      // Show success message
      toast({
        title: "Manual Package Created",
        description: "The manual package was created successfully",
        variant: "default",
      });
      
      // Reset form and state
      form.reset();
      setImages([]);
      setNewInclusion("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating manual package",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ManualPackageFormValues) => {
    // Validation for hotels
    if (data.hotels.length === 0) {
      toast({
        title: "No Hotels Added",
        description: "Please add at least one hotel to the package",
        variant: "destructive",
      });
      return;
    }
    
    // Validation
    const requiredFieldsValid = validateRequiredFields(
      data,
      ['title', 'description', 'price', 'transportationDetails', 'tourDetails', 'duration', 'destinationId', 'categoryId', 'type'],
      {
        title: 'Package Title',
        description: 'Description',
        price: 'Price',
        transportationDetails: 'Transportation Details',
        tourDetails: 'Tour Details',
        duration: 'Duration',
        destinationId: 'Destination',
        categoryId: 'Package Category',
        type: 'Package Type'
      }
    );
    
    if (!requiredFieldsValid) return;
    
    // Numeric fields validation
    const numericFieldsValid = validateNumericFields(
      data,
      [
        { field: 'price', label: 'Price', min: 0.01 },
        { field: 'discountedPrice', label: 'Discounted Price', min: 0 },
        { field: 'duration', label: 'Duration', min: 1, integer: true }
      ]
    );
    
    if (!numericFieldsValid) return;

    // Custom validations
    const customValidationsValid = validateForm(data, [
      {
        condition: data.inclusions.length === 0,
        errorMessage: {
          title: "No Inclusions Added",
          description: "Please add at least one inclusion for the package"
        },
        variant: "destructive"
      }
    ]);
    
    if (!customValidationsValid) return;
    
    // All validations passed, proceed with submission
    createManualPackageMutation.mutate(data);
  };

  // Hotel dialog handlers
  const openAddHotelDialog = () => {
    setEditingHotelIndex(null);
    setHotelFormData({
      name: "",
      stars: 3,
      roomType: "",
      pricePerNight: undefined
    });
    setIsHotelDialogOpen(true);
  };

  const openEditHotelDialog = (index: number) => {
    const hotel = form.getValues().hotels[index];
    setEditingHotelIndex(index);
    setHotelFormData({
      name: hotel.name,
      stars: hotel.stars,
      roomType: hotel.roomType || "",
      pricePerNight: hotel.pricePerNight
    });
    setIsHotelDialogOpen(true);
  };

  const handleHotelFormChange = (field: string, value: any) => {
    setHotelFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHotelSave = () => {
    // Validate hotel data
    if (!hotelFormData.name || hotelFormData.name.length < 2) {
      toast({
        title: "Invalid Hotel Name",
        description: "Hotel name must be at least 2 characters",
        variant: "destructive",
      });
      return;
    }

    const hotelEntry = {
      id: Math.random().toString(36).substring(7),
      name: hotelFormData.name,
      stars: hotelFormData.stars,
      roomType: hotelFormData.roomType || undefined,
      pricePerNight: hotelFormData.pricePerNight
    };

    if (editingHotelIndex !== null) {
      // Update existing hotel
      updateHotel(editingHotelIndex, hotelEntry);
    } else {
      // Add new hotel
      appendHotel(hotelEntry);
    }

    setIsHotelDialogOpen(false);
  };

  // Reference to hidden file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Create URL for preview
      const preview = URL.createObjectURL(file);
      
      // Set as main image if this is the first image
      const isFirstImage = images.length === 0;
      
      // Add to images array with the isMain property
      const newImage = {
        id: Math.random().toString(36).substring(7),
        file: file,
        preview: preview,
        isMain: isFirstImage
      };
      
      setImages(prev => [...prev, newImage]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const setMainImage = (id: string) => {
    setImages(prev => 
      prev.map(image => ({
        ...image,
        isMain: image.id === id
      }))
    );
  };
  
  const addImage = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (id: string) => {
    // Find the image to remove
    const imageToRemove = images.find(img => img.id === id);
    const wasMainImage = imageToRemove?.isMain || false;
    
    // Revoke object URL to prevent memory leaks
    if (imageToRemove && imageToRemove.preview && !imageToRemove.preview.startsWith('https://')) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    // Remove from state
    const newImages = images.filter(img => img.id !== id);
    
    // If removed image was the main image, set a new main image
    if (wasMainImage && newImages.length > 0) {
      newImages[0].isMain = true;
    }
    
    setImages(newImages);
  };

  // Handle adding a new inclusion
  const addInclusion = () => {
    if (!newInclusion.trim()) return;
    
    form.setValue("inclusions", [...form.getValues("inclusions"), newInclusion]);
    setNewInclusion("");
    setShowInclusionSuggestions(false);
  };

  // Handle removing an inclusion
  const removeInclusion = (index: number) => {
    const currentInclusions = form.getValues("inclusions");
    form.setValue("inclusions", currentInclusions.filter((_, i) => i !== index));
  };

  // Filter suggestions based on input
  const filterSuggestions = (input: string, suggestions: string[]) => {
    if (!input) return suggestions;
    const lowerInput = input.toLowerCase();
    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(lowerInput)
    );
  };

  // Autocomplete handlers
  const handleNewHotelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHotelFormData(prev => ({ ...prev, name: value }));
    setShowHotelSuggestions(value.length >= 2);
  };

  const handleTypeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("type", value);
    setShowTypeSuggestions(value.length >= 2);
  };

  const handleTransportationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("transportationDetails", value);
    setShowTransportationSuggestions(value.length >= 3);
  };

  const handleTourInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("tourDetails", value);
    setShowTourSuggestions(value.length >= 3);
  };

  const handleInclusionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewInclusion(value);
    setShowInclusionSuggestions(value.length >= 2);
  };

  // Click outside handlers to close suggestion dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.suggestion-dropdown')) {
        setShowHotelSuggestions(false);
        setShowTypeSuggestions(false);
        setShowTransportationSuggestions(false);
        setShowTourSuggestions(false);
        setShowInclusionSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate star emoji based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push("★");
    }
    for (let i = rating; i < 5; i++) {
      stars.push("☆");
    }
    return stars.join("");
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Basic Information</h2>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Title <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Luxor & Cairo Historical Tour" 
                          {...field} 
                        />
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
                      <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter package description..." 
                          rows={5}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of the package, including key highlights
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($) <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 1299" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="discountedPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discounted Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 999" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Optional. Leave at 0 for 10% automatic discount
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (days) <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 7" 
                            {...field} 
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
                        <FormLabel>Destination <span className="text-destructive">*</span></FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {destinations.map((dest: any) => (
                              <SelectItem key={dest.id} value={dest.id.toString()}>
                                {dest.name}, {dest.country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Category <span className="text-destructive">*</span></FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {packageCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the category that best describes this package.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="suggestion-dropdown">
                      <FormLabel>Package Type <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="e.g., Cultural, Beach, Family" 
                            {...field} 
                            onChange={(e) => handleTypeInputChange(e)}
                          />
                          {showTypeSuggestions && typeSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
                              {filterSuggestions(field.value, typeSuggestions).map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 cursor-pointer hover:bg-zinc-100"
                                  onClick={() => {
                                    form.setValue("type", suggestion);
                                    setShowTypeSuggestions(false);
                                  }}
                                >
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        The sub-type or specific theme of the package (e.g., "Honeymoon", "Family", etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Package</FormLabel>
                        <FormDescription>
                          Mark this package as featured to highlight it on the homepage
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

              {/* Right Column - Hotels, Details & Images */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Hotels & Details</h2>
                
                {/* Hotels Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <FormLabel>Hotels <span className="text-destructive">*</span></FormLabel>
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openAddHotelDialog}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Hotel
                    </Button>
                  </div>
                  
                  {hotelFields.length === 0 ? (
                    <div className="text-center p-6 border border-dashed rounded-md">
                      <Hotel className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-4">No hotels added yet</p>
                      <Button
                        type="button"
                        onClick={openAddHotelDialog}
                        size="sm"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add First Hotel
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {hotelFields.map((hotel, index) => (
                        <div 
                          key={hotel.id} 
                          className="p-3 border rounded-md flex justify-between items-center"
                        >
                          <div>
                            <h4 className="font-medium">{hotel.name}</h4>
                            <div className="flex text-sm text-muted-foreground gap-3">
                              <span className="text-amber-500">{renderStars(hotel.stars)}</span>
                              {hotel.roomType && <span>{hotel.roomType}</span>}
                              {hotel.pricePerNight && <span>${hotel.pricePerNight}/night</span>}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              type="button" 
                              onClick={() => openEditHotelDialog(index)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              type="button"
                              className="text-destructive" 
                              onClick={() => removeHotel(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="transportationDetails"
                  render={({ field }) => (
                    <FormItem className="suggestion-dropdown">
                      <FormLabel>Transportation Details <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="e.g., Private car transfer" 
                            {...field} 
                            onChange={(e) => handleTransportationInputChange(e)}
                          />
                          {showTransportationSuggestions && transportationSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
                              {filterSuggestions(field.value, transportationSuggestions).map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 cursor-pointer hover:bg-zinc-100"
                                  onClick={() => {
                                    form.setValue("transportationDetails", suggestion);
                                    setShowTransportationSuggestions(false);
                                  }}
                                >
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tourDetails"
                  render={({ field }) => (
                    <FormItem className="suggestion-dropdown">
                      <FormLabel>Tour Details <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="e.g., Pyramids guided tour" 
                            {...field} 
                            onChange={(e) => handleTourInputChange(e)}
                          />
                          {showTourSuggestions && tourSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
                              {filterSuggestions(field.value, tourSuggestions).map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 cursor-pointer hover:bg-zinc-100"
                                  onClick={() => {
                                    form.setValue("tourDetails", suggestion);
                                    setShowTourSuggestions(false);
                                  }}
                                >
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inclusions"
                  render={() => (
                    <FormItem>
                      <FormLabel>Inclusions <span className="text-destructive">*</span></FormLabel>
                      <div className="space-y-3">
                        <div className="flex gap-2 suggestion-dropdown">
                          <div className="relative flex-1">
                            <Input
                              placeholder="Add an inclusion..."
                              value={newInclusion}
                              onChange={handleInclusionInputChange}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addInclusion();
                                }
                              }}
                            />
                            {showInclusionSuggestions && inclusionSuggestions.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
                                {filterSuggestions(newInclusion, inclusionSuggestions).map((suggestion, index) => (
                                  <div
                                    key={index}
                                    className="px-4 py-2 cursor-pointer hover:bg-zinc-100"
                                    onClick={() => {
                                      setNewInclusion(suggestion);
                                      setShowInclusionSuggestions(false);
                                    }}
                                  >
                                    {suggestion}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            onClick={addInclusion}
                            className="w-[120px]"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {form.watch("inclusions").map((inclusion, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="flex items-center gap-1 px-3 py-1.5"
                            >
                              {inclusion}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => removeInclusion(index)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <FormDescription>
                        Add what's included in this package (e.g., breakfast, airport transfer)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel>Package Images</FormLabel>
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div 
                        key={image.id} 
                        className={cn(
                          "relative aspect-square border rounded overflow-hidden bg-zinc-50",
                          image.isMain && "ring-2 ring-primary"
                        )}
                      >
                        <img 
                          src={image.preview} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-1 right-1 space-x-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className={cn(
                              "h-7 w-7 bg-white rounded-full shadow-sm hover:scale-110 transition-transform", 
                              image.isMain ? "text-amber-500" : "text-muted-foreground"
                            )}
                            onClick={() => setMainImage(image.id)}
                          >
                            <Star className="h-3.5 w-3.5" />
                            <span className="sr-only">Set as main image</span>
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
                            onClick={() => removeImage(image.id)}
                          >
                            <Trash className="h-3.5 w-3.5" />
                            <span className="sr-only">Remove image</span>
                          </Button>
                        </div>
                        {image.isMain && (
                          <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                            Main Image
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImage}
                      className="aspect-square border border-dashed rounded flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 cursor-pointer"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Add Image</span>
                      </div>
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <FormDescription>
                    Upload images for the package. The first image or starred image will be used as the main image.
                  </FormDescription>
                </div>
              </div>
            </div>

            <FormRequiredFieldsNote />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createManualPackageMutation.isPending}
              >
                {createManualPackageMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Manual Package'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      {/* Hotel Dialog */}
      <AlertDialog open={isHotelDialogOpen} onOpenChange={setIsHotelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editingHotelIndex !== null ? "Edit Hotel" : "Add Hotel"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Enter the hotel details below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2 suggestion-dropdown">
              <FormLabel htmlFor="hotelName">Hotel Name <span className="text-destructive">*</span></FormLabel>
              <div className="relative">
                <Input
                  id="hotelName"
                  placeholder="e.g., Sharm El Sheikh Resort"
                  value={hotelFormData.name}
                  onChange={handleNewHotelInputChange}
                />
                {showHotelSuggestions && hotelSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
                    {filterSuggestions(hotelFormData.name, hotelSuggestions).map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 cursor-pointer hover:bg-zinc-100"
                        onClick={() => {
                          setHotelFormData(prev => ({ ...prev, name: suggestion }));
                          setShowHotelSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <FormLabel htmlFor="hotelStars">Stars <span className="text-destructive">*</span></FormLabel>
              <Select
                value={hotelFormData.stars.toString()}
                onValueChange={(value) => handleHotelFormChange('stars', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select star rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Star ★</SelectItem>
                  <SelectItem value="2">2 Stars ★★</SelectItem>
                  <SelectItem value="3">3 Stars ★★★</SelectItem>
                  <SelectItem value="4">4 Stars ★★★★</SelectItem>
                  <SelectItem value="5">5 Stars ★★★★★</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 suggestion-dropdown">
              <FormLabel htmlFor="roomType">Room Type (Optional)</FormLabel>
              <div className="relative">
                <Input
                  id="roomType"
                  placeholder="e.g., Deluxe Room"
                  value={hotelFormData.roomType}
                  onChange={(e) => {
                    handleHotelFormChange('roomType', e.target.value);
                  }}
                />
                {roomTypeSuggestions.length > 0 && hotelFormData.roomType && (
                  <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
                    {filterSuggestions(hotelFormData.roomType, roomTypeSuggestions).map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 cursor-pointer hover:bg-zinc-100"
                        onClick={() => {
                          handleHotelFormChange('roomType', suggestion);
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel htmlFor="pricePerNight">Price Per Night ($) (Optional)</FormLabel>
              <Input
                id="pricePerNight"
                type="number"
                placeholder="e.g., 120"
                value={hotelFormData.pricePerNight !== undefined ? hotelFormData.pricePerNight : ''}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  handleHotelFormChange('pricePerNight', value);
                }}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleHotelSave}>
              {editingHotelIndex !== null ? "Update" : "Add"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}