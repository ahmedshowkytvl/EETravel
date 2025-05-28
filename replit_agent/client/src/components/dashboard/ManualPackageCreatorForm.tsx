import React, { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
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
import { ImagePlus, Loader2, Plus, Trash, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { validateForm, validateRequiredFields, validateNumericFields } from "@/lib/validateForm";
import { FormRequiredFieldsNote, FormValidationAlert } from "@/components/dashboard/FormValidationAlert";

// Define the hotel entry schema
const hotelEntrySchema = z.object({
  id: z.string(),
  hotelName: z.string().min(2, { message: "Hotel name must be at least 2 characters" }),
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
  categoryId: z.coerce.number({ required_error: "Please select a package category" }),
  type: z.string().min(2, { message: "Type must be at least 2 characters" }),
  featured: z.boolean().default(false),
  inclusions: z.array(z.string()).min(1, { message: "At least one inclusion is required" }),
});

type ManualPackageFormValues = z.infer<typeof manualPackageFormSchema>;

export function ManualPackageCreatorForm() {
  const { toast } = useToast();
  const [images, setImages] = useState<{ id: string; file: File | null; preview: string; isMain: boolean }[]>([]);
  const [newInclusion, setNewInclusion] = useState("");
  
  // Used for autocomplete suggestion functionality
  const [hotelSuggestions, setHotelSuggestions] = useState<string[]>([]);
  const [typeSuggestions, setTypeSuggestions] = useState<string[]>([]);
  const [transportationSuggestions, setTransportationSuggestions] = useState<string[]>([]);
  const [tourSuggestions, setTourSuggestions] = useState<string[]>([]);
  const [inclusionSuggestions, setInclusionSuggestions] = useState<string[]>([]);
  
  // Control displaying the suggestion dropdowns
  const [showHotelSuggestions, setShowHotelSuggestions] = useState(false);
  const [showTypeSuggestions, setShowTypeSuggestions] = useState(false);
  const [showTransportationSuggestions, setShowTransportationSuggestions] = useState(false);
  const [showTourSuggestions, setShowTourSuggestions] = useState(false);
  const [showInclusionSuggestions, setShowInclusionSuggestions] = useState(false);

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

  // State for new hotel entry
  const [newHotelName, setNewHotelName] = useState("");
  const [newHotelStars, setNewHotelStars] = useState<number>(3);
  const [newHotelRoomType, setNewHotelRoomType] = useState("");
  const [newHotelPrice, setNewHotelPrice] = useState<number | undefined>(undefined);
  
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

  // Populate suggestion data from existing packages and hotels when data is fetched
  useEffect(() => {
    // Extract unique values for autocomplete suggestions
    const hotelNames = new Set<string>();
    const types = new Set<string>();
    const inclusions = new Set<string>();

    // Add hotel names from the hotel database 
    if (hotels && hotels.length > 0) {
      hotels.forEach(hotel => {
        if (hotel.name) {
          hotelNames.add(hotel.name);
        }
      });
    }

    // Extract data from packages if available
    if (packages && packages.length > 0) {
      packages.forEach(pkg => {
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
      
      // Transform the form data to match the API schema
      const packageData = {
        title: 'MANUAL:' + formData.title, // Prefix with MANUAL: to identify manual packages
        description: formData.description,
        price: formData.price,
        discountedPrice: formData.discountedPrice || Math.round(formData.price * 0.9), // Use provided discounted price or 10% off
        imageUrl: mainImageUrl,
        galleryUrls: galleryUrls,
        duration: formData.duration,
        rating: 45, // Default 4.5 stars (stored as 45 in DB)
        destinationId: formData.destinationId,
        categoryId: formData.categoryId, // Add the selected package category
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
    // Validation
    const requiredFieldsValid = validateRequiredFields(
      data,
      ['title', 'description', 'price', 'hotelName', 'transportationDetails', 'tourDetails', 'duration', 'destinationId', 'type'],
      {
        title: 'Package Title',
        description: 'Description',
        price: 'Price',
        hotelName: 'Hotel Name',
        transportationDetails: 'Transportation Details',
        tourDetails: 'Tour Details',
        duration: 'Duration',
        destinationId: 'Destination',
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

    // Build a more detailed description from the form fields
    const enhancedDescription = `${data.description}\n\nHotel: ${data.hotelName}\n\nTransportation: ${data.transportationDetails}\n\nTour: ${data.tourDetails}`;
    
    // Update the description with the enhanced version
    const submissionData = {
      ...data,
      description: enhancedDescription
    };
    
    // All validations passed, proceed with submission
    createManualPackageMutation.mutate(submissionData);
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
  const handleHotelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("hotelName", value);
    setShowHotelSuggestions(value.length >= 3);
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
                            {destinations.map((dest) => (
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
                  
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Category <span className="text-destructive">*</span></FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select package category" />
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
                          Select the category that best describes this package
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                          {showTypeSuggestions && filterSuggestions(field.value, typeSuggestions).length > 0 && (
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

              {/* Right Column - Details & Images */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Package Details</h2>
                
                <FormField
                  control={form.control}
                  name="hotelName"
                  render={({ field }) => (
                    <FormItem className="suggestion-dropdown">
                      <FormLabel>Hotel Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="e.g., Pyramids View Hotel" 
                            {...field} 
                            onChange={(e) => handleHotelInputChange(e)}
                          />
                          {showHotelSuggestions && filterSuggestions(field.value, hotelSuggestions).length > 0 && (
                            <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
                              {filterSuggestions(field.value, hotelSuggestions).map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 cursor-pointer hover:bg-zinc-100"
                                  onClick={() => {
                                    form.setValue("hotelName", suggestion);
                                    setShowHotelSuggestions(false);
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
                          {showTransportationSuggestions && filterSuggestions(field.value, transportationSuggestions).length > 0 && (
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
                          {showTourSuggestions && filterSuggestions(field.value, tourSuggestions).length > 0 && (
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
                            {showInclusionSuggestions && filterSuggestions(newInclusion, inclusionSuggestions).length > 0 && (
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
    </Card>
  );
}