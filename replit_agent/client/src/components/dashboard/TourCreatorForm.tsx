import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest, getQueryFn } from "@/lib/queryClient";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { AlertCircle, Calendar as CalendarIcon, Loader2, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormRequiredFieldsNote } from "./FormRequiredFieldsNote";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tour, TourFormData, TourGalleryImage, TourMainImage, tourStatusOptions } from "@/../../shared/types/tour";

// Form schema for tour data
const tourSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(20, { message: "Description should be at least 20 characters" }),
  destinationId: z.coerce.number().positive({ message: "Please select a destination" }),
  tripType: z.string().min(1, { message: "Please select a trip type" }),
  duration: z.coerce.number().min(1, { message: "Duration is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  numPassengers: z.coerce.number().min(1, { message: "At least 1 passenger is required" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  discountedPrice: z.coerce.number().min(0, { message: "Discounted price must be a positive number" }).optional().nullable(),
  included: z.array(z.string()).default([]),
  excluded: z.array(z.string()).default([]),
  itinerary: z.string().min(20, { message: "Itinerary should provide sufficient details" }),
  maxGroupSize: z.coerce.number().min(1, { message: "Group size must be at least 1" }).optional().nullable(),
  featured: z.boolean().default(false),
  status: z.string().default("active"),
});

type TourFormValues = z.infer<typeof tourSchema>;

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "soldout", label: "Sold Out" },
];

export interface TourCreatorFormProps {
  tourId?: string; // Optional tour ID for edit mode
}

export function TourCreatorForm({ tourId }: TourCreatorFormProps) {
  const isEditMode = !!tourId;
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [images, setImages] = useState<TourMainImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<TourGalleryImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch destinations for the dropdown
  const { data: destinations = [] } = useQuery<any[]>({
    queryKey: ['/api/destinations'],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Fetch tour categories for trip types dropdown
  const { data: tourCategories = [] } = useQuery<any[]>({
    queryKey: ['/api/tour-categories'],
    queryFn: getQueryFn({ on401: "throw" }),
    select: (data) => 
      data
        .filter((category) => category.active)
        .map((category) => ({
          value: category.name,
          label: category.name
        }))
  });

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      name: "",
      description: "",
      destinationId: 0,
      tripType: "",
      duration: 1,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Default to tomorrow
      numPassengers: 1,
      price: 0,
      discountedPrice: null,
      included: [],
      excluded: [],
      itinerary: "",
      maxGroupSize: 10,
      featured: false,
      status: "active",
    },
  });

  // Upload main image function
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const id = Date.now().toString();
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      
      // Add image to state
      setImages([
        ...images.filter(img => !img.isMain), // Remove any existing main image
        { id, file, preview, isMain: true }
      ]);
    }
  };

  // Upload gallery image function
  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      const newGalleryImages = files.map(file => {
        const id = `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const preview = URL.createObjectURL(file);
        return { id, file, preview };
      });
      
      // Add images to gallery state
      setGalleryImages(prev => [...prev, ...newGalleryImages]);
    }
  };

  // Remove gallery image
  const handleRemoveGalleryImage = (id: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
  };

  // Add inclusion
  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      const currentInclusions = form.getValues().included || [];
      form.setValue('included', [...currentInclusions, newInclusion.trim()]);
      setNewInclusion("");
    }
  };

  // Add exclusion
  const handleAddExclusion = () => {
    if (newExclusion.trim()) {
      const currentExclusions = form.getValues().excluded || [];
      form.setValue('excluded', [...currentExclusions, newExclusion.trim()]);
      setNewExclusion("");
    }
  };

  // Remove inclusion
  const removeInclusion = (index: number) => {
    const currentInclusions = form.getValues().included || [];
    form.setValue('included', currentInclusions.filter((_, i) => i !== index));
  };

  // Remove exclusion
  const removeExclusion = (index: number) => {
    const currentExclusions = form.getValues().excluded || [];
    form.setValue('excluded', currentExclusions.filter((_, i) => i !== index));
  };

  // Tour mutation for create/update
  const tourMutation = useMutation({
    mutationFn: async (data: any) => {
      setIsSubmitting(true);
      
      // Handle main image upload first if there's a new image
      let imageUrl = "";
      const mainImage = images.find(img => img.isMain && img.file);
      
      if (mainImage?.file) {
        const formData = new FormData();
        formData.append('image', mainImage.file);
        
        try {
          const uploadResponse = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          });
          
          // Read the response text only once
          const responseText = await uploadResponse.text();
          
          if (!uploadResponse.ok) {
            console.error('Upload error response:', responseText);
            throw new Error('Failed to upload main image');
          }
          
          try {
            const uploadResult = JSON.parse(responseText);
            imageUrl = uploadResult.url;
          } catch (e) {
            console.error('Failed to parse JSON:', responseText);
            throw new Error('Invalid response from server');
          }
        } catch (error) {
          console.error('Image upload error:', error);
          throw new Error('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      }
      
      // Handle gallery images upload if there are new ones
      let galleryUrls: string[] = [];
      
      if (galleryImages.length > 0) {
        // Upload each gallery image
        const galleryUploadPromises = galleryImages
          .filter(img => img.file) // Only upload new files
          .map(async (img) => {
            if (!img.file) return null;
            
            const formData = new FormData();
            formData.append('image', img.file);
            
            try {
              const uploadResponse = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
              });
              
              // Read the response text only once
              const responseText = await uploadResponse.text();
              
              if (!uploadResponse.ok) {
                console.error('Gallery upload error response:', responseText);
                throw new Error('Failed to upload gallery image');
              }
              
              try {
                const uploadResult = JSON.parse(responseText);
                return uploadResult.url;
              } catch (e) {
                console.error('Failed to parse gallery image JSON:', responseText);
                throw new Error('Invalid response from server for gallery image');
              }
            } catch (error) {
              console.error('Gallery image upload error:', error);
              // Don't throw here, just return null so other uploads can continue
              return null;
            }
          });
        
        // Wait for all uploads to complete
        const uploadedUrls = await Promise.all(galleryUploadPromises);
        galleryUrls = uploadedUrls.filter(Boolean) as string[];
      }
      
      // Prepare the final data object with the image URLs
      const finalData = {
        ...data,
        imageUrl: imageUrl || data.imageUrl,
        galleryUrls: galleryUrls.length > 0 ? galleryUrls : data.galleryUrls || [],
        // Convert date objects to ISO strings
        date: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      };
      
      // Send the data to the API
      const url = isEditMode 
        ? `/api/admin/tours/${tourId}` 
        : '/api/admin/tours';
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      try {
        // Make request directly instead of using apiRequest to have more control over error handling
        const fetchResponse = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(finalData)
        });
        
        if (!fetchResponse.ok) {
          // Try to get error message from response
          const errorText = await fetchResponse.text();
          try {
            // Try to parse as JSON first
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || 'An error occurred');
          } catch (parseError) {
            // If parsing fails, use the status text or a generic message
            throw new Error(`Error ${fetchResponse.status}: ${fetchResponse.statusText || 'Unknown error'}`);
          }
        }
        
        // Parse successful response
        return await fetchResponse.json();
      } catch (error) {
        console.error('Tour update error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tours'] });
      toast({
        title: isEditMode ? "Tour Updated" : "Tour Created",
        description: isEditMode 
          ? "The tour was successfully updated" 
          : "The tour was successfully created",
      });
      setLocation('/admin/tours');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  // Load tour data for edit mode
  useEffect(() => {
    if (isEditMode && tourId) {
      const fetchTour = async () => {
        try {
          const response = await fetch(`/api/admin/tours/${tourId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch tour data");
          }
          
          const tourData = await response.json();
          
          // Parse dates
          const startDate = tourData.date ? new Date(tourData.date) : new Date();
          const endDate = tourData.endDate 
            ? new Date(tourData.endDate) 
            : new Date(new Date(startDate).setDate(startDate.getDate() + tourData.duration - 1));
          
          // Setup form values
          form.reset({
            name: tourData.name || "",
            description: tourData.description || "",
            destinationId: tourData.destinationId || 0,
            tripType: tourData.tripType || "",
            duration: tourData.duration || 1,
            startDate,
            endDate,
            numPassengers: tourData.numPassengers || 1,
            price: tourData.price || 0,
            discountedPrice: tourData.discountedPrice,
            included: Array.isArray(tourData.included) ? tourData.included : [],
            excluded: Array.isArray(tourData.excluded) ? tourData.excluded : [],
            itinerary: tourData.itinerary || "",
            maxGroupSize: tourData.maxGroupSize || 10,
            featured: !!tourData.featured,
            status: tourData.status || "active",
          });
          
          // Set image preview if exists
          if (tourData.imageUrl) {
            setImages([{ id: 'existing', file: null, preview: tourData.imageUrl, isMain: true }]);
          }
          
          // Set gallery images if available
          if (tourData.galleryUrls && Array.isArray(tourData.galleryUrls) && tourData.galleryUrls.length > 0) {
            const existingGalleryImages = tourData.galleryUrls.map((url: string, index: number) => ({
              id: `existing-gallery-${index}`,
              file: null,
              preview: url
            }));
            
            setGalleryImages(existingGalleryImages);
          }
        } catch (error) {
          console.error("Error fetching tour:", error);
          toast({
            title: "Error",
            description: "Failed to load tour data",
            variant: "destructive",
          });
        }
      };
      
      fetchTour();
    }
  }, [isEditMode, tourId, form, toast]);

  // Handle form submission
  const onSubmit = (data: TourFormValues) => {
    tourMutation.mutate(data);
  };

  // Update duration when dates change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'startDate' || name === 'endDate') {
        const startDate = value.startDate as Date;
        const endDate = value.endDate as Date;
        
        if (startDate && endDate && startDate <= endDate) {
          // Calculate the difference in days and set duration
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          form.setValue('duration', diffDays + 1); // +1 because it's inclusive
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          {tourMutation.isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {tourMutation.error?.message || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the tour.`} 
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <FormRequiredFieldsNote />
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="dates">Dates & Pricing</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="media">Media & Features</TabsTrigger>
          </TabsList>
          
          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <Label htmlFor="name" className={cn(fieldState.error && "text-destructive")}>
                        Tour Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter tour name"
                        {...field}
                        className={cn(fieldState.error && "border-destructive")}
                      />
                      {fieldState.error && (
                        <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
                
                <Controller
                  control={form.control}
                  name="destinationId"
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <Label htmlFor="destinationId" className={cn(fieldState.error && "text-destructive")}>
                        Destination <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <SelectTrigger id="destinationId" className={cn(fieldState.error && "border-destructive")}>
                          <SelectValue placeholder="Select a destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {destinations.map((destination: any) => (
                            <SelectItem key={destination.id} value={destination.id.toString()}>
                              {destination.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
                
                <Controller
                  control={form.control}
                  name="tripType"
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <Label htmlFor="tripType" className={cn(fieldState.error && "text-destructive")}>
                        Trip Type <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="tripType" className={cn(fieldState.error && "border-destructive")}>
                          <SelectValue placeholder="Select trip type" />
                        </SelectTrigger>
                        <SelectContent>
                          {tourCategories.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <Label htmlFor="description" className={cn(fieldState.error && "text-destructive")}>
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Enter tour description"
                        {...field}
                        className={cn("min-h-[150px]", fieldState.error && "border-destructive")}
                      />
                      {fieldState.error && (
                        <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
                
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                
                <Controller
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="featured" className="text-base">Featured Tour</Label>
                        <p className="text-sm text-muted-foreground">Show this tour in featured sections</p>
                      </div>
                      <Switch
                        id="featured"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Dates & Pricing Tab */}
          <TabsContent value="dates" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="startDate"
                    render={({ field, fieldState }) => (
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className={cn(fieldState.error && "text-destructive")}>
                          Start Date <span className="text-destructive">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="startDate"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                                fieldState.error && "border-destructive"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {fieldState.error && (
                          <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
                        )}
                      </div>
                    )}
                  />
                  
                  <Controller
                    control={form.control}
                    name="endDate"
                    render={({ field, fieldState }) => (
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className={cn(fieldState.error && "text-destructive")}>
                          End Date <span className="text-destructive">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="endDate"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                                fieldState.error && "border-destructive"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const startDate = form.getValues().startDate;
                                return startDate ? date < startDate : false;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {fieldState.error && (
                          <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>
                
                <Controller
                  control={form.control}
                  name="duration"
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <Label htmlFor="duration" className={cn(fieldState.error && "text-destructive")}>
                        Duration (days) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min={1}
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        className={cn(fieldState.error && "border-destructive")}
                        readOnly
                      />
                      <p className="text-sm text-muted-foreground">
                        Duration is automatically calculated from start and end dates
                      </p>
                      {fieldState.error && (
                        <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
                
                <Controller
                  control={form.control}
                  name="maxGroupSize"
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <Label htmlFor="maxGroupSize">Maximum Group Size</Label>
                      <Input
                        id="maxGroupSize"
                        type="number"
                        min={1}
                        placeholder="Maximum number of participants"
                        {...field}
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : parseInt(e.target.value))}
                      />
                      {fieldState.error && (
                        <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <Controller
                  control={form.control}
                  name="price"
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <Label htmlFor="price" className={cn(fieldState.error && "text-destructive")}>
                        Price <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="price"
                          type="number"
                          min={0}
                          step={0.01}
                          placeholder="0.00"
                          {...field}
                          value={field.value}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className={cn("pl-7", fieldState.error && "border-destructive")}
                        />
                      </div>
                      {fieldState.error && (
                        <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
                
                <Controller
                  control={form.control}
                  name="discountedPrice"
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <Label htmlFor="discountedPrice">Discounted Price</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="discountedPrice"
                          type="number"
                          min={0}
                          step={0.01}
                          placeholder="0.00"
                          {...field}
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                          className="pl-7"
                        />
                      </div>
                      {field.value && parseFloat(field.value.toString()) >= form.getValues().price && (
                        <p className="text-sm text-amber-600">
                          Discounted price should be lower than the regular price
                        </p>
                      )}
                      {fieldState.error && (
                        <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
                
                <Controller
                  control={form.control}
                  name="numPassengers"
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <Label htmlFor="numPassengers" className={cn(fieldState.error && "text-destructive")}>
                        Minimum Participants <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="numPassengers"
                        type="number"
                        min={1}
                        placeholder="Minimum number of participants"
                        {...field}
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : parseInt(e.target.value))}
                        className={cn(fieldState.error && "border-destructive")}
                      />
                      {fieldState.error && (
                        <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-6">
              <Controller
                control={form.control}
                name="itinerary"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label htmlFor="itinerary" className={cn(fieldState.error && "text-destructive")}>
                      Itinerary <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="itinerary"
                      placeholder="Enter detailed tour itinerary"
                      {...field}
                      className={cn("min-h-[200px]", fieldState.error && "border-destructive")}
                    />
                    <p className="text-sm text-muted-foreground">
                      Provide a detailed day-by-day breakdown of the tour activities
                    </p>
                    {fieldState.error && (
                      <p className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>What's Included</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newInclusion}
                      onChange={(e) => setNewInclusion(e.target.value)}
                      placeholder="Add included item"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclusion())}
                    />
                    <Button type="button" onClick={handleAddInclusion} size="sm">
                      Add
                    </Button>
                  </div>
                  
                  <div className="border rounded-md divide-y">
                    {form.watch('included').length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground italic">No items added yet</p>
                    ) : (
                      form.watch('included').map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          <span className="text-sm">{item}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeInclusion(index)}
                            className="h-8 w-8 p-0 text-muted-foreground"
                          >
                            &times;
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>What's Not Included</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newExclusion}
                      onChange={(e) => setNewExclusion(e.target.value)}
                      placeholder="Add excluded item"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExclusion())}
                    />
                    <Button type="button" onClick={handleAddExclusion} size="sm">
                      Add
                    </Button>
                  </div>
                  
                  <div className="border rounded-md divide-y">
                    {form.watch('excluded').length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground italic">No items added yet</p>
                    ) : (
                      form.watch('excluded').map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          <span className="text-sm">{item}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeExclusion(index)}
                            className="h-8 w-8 p-0 text-muted-foreground"
                          >
                            &times;
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Media Tab */}
          <TabsContent value="media" className="space-y-4 pt-4">
            <div className="space-y-6">
              <div>
                <Label>Main Tour Image</Label>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="space-y-2 text-center">
                      {images.length > 0 ? (
                        <div className="relative">
                          <img 
                            src={images[0].preview} 
                            alt="Tour preview" 
                            className="mx-auto h-40 object-cover rounded-md" 
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-0 right-0 rounded-full h-8 w-8 p-0"
                            onClick={() => setImages([])}
                          >
                            &times;
                          </Button>
                        </div>
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      )}
                      <div className="flex justify-center text-sm leading-6 text-muted-foreground">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                        >
                          <span>{images.length > 0 ? "Replace image" : "Upload an image"}</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, or WEBP up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Gallery Images */}
              <div>
                <Label>Gallery Images</Label>
                <div className="mt-2 space-y-4">
                  {galleryImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {galleryImages.map((img) => (
                        <div key={img.id} className="relative">
                          <img
                            src={img.preview}
                            alt="Gallery image"
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-0 right-0 rounded-full h-6 w-6 p-0"
                            onClick={() => handleRemoveGalleryImage(img.id)}
                          >
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="space-y-2 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="flex justify-center text-sm leading-6 text-muted-foreground">
                        <label
                          htmlFor="gallery-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                        >
                          <span>{galleryImages.length > 0 ? "Add more images" : "Upload gallery images"}</span>
                          <input
                            id="gallery-upload"
                            name="gallery-upload"
                            type="file"
                            multiple
                            className="sr-only"
                            accept="image/*"
                            onChange={handleGalleryImageUpload}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, or WEBP up to 10MB (multiple allowed)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setLocation('/admin/tours')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? "Update Tour" : "Create Tour"}
          </Button>
        </div>
      </form>
    </Form>
  );
}