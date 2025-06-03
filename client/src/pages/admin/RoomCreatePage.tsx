import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useLocation, useParams } from "wouter";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ChevronRight, Save } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

// Room form schema
const roomFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  hotelId: z.string().min(1, "Hotel is required"),
  price: z.number().min(0, "Price must be a positive number"),
  maxAdults: z.number().min(0, "Must be a positive number"),
  maxChildren: z.number().min(0, "Must be a positive number"),
  maxInfants: z.number().min(0, "Must be a positive number"),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

// Define amenities options
const amenitiesOptions = [
  { id: "wifi", label: "Wi-Fi" },
  { id: "ac", label: "Air Conditioning" },
  { id: "tv", label: "Television" },
  { id: "minibar", label: "Mini Bar" },
  { id: "safe", label: "In-room Safe" },
  { id: "balcony", label: "Balcony" },
  { id: "bathtub", label: "Bathtub" },
  { id: "shower", label: "Shower" },
  { id: "coffeeMaker", label: "Coffee Maker" },
];

export default function RoomCreatePage() {
  const [_, navigate] = useLocation();
  const params = useParams();
  const roomId = params.id; // Get room ID from URL if in edit mode
  const isEditMode = !!roomId;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<string[]>([]);
  const [isDraft, setIsDraft] = useState(false);

  // Query to fetch room data for editing
  const { data: roomData, isLoading: isLoadingRoom } = useQuery({
    queryKey: [`/api/admin/rooms/${roomId}`],
    enabled: !!roomId, // Only run the query if we have a roomId (edit mode)
    staleTime: 1000 * 60 * 5, // 5 minutes
  });



  // Save form data to localStorage as draft
  const saveAsDraft = () => {
    const formData = form.getValues();
    const draftData = {
      ...formData,
      images,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('roomDraft', JSON.stringify(draftData));
    setIsDraft(true);
    
    toast({
      title: "Draft Saved",
      description: "Your room data has been saved as a draft",
      duration: 3000,
    });
  };
  
  // Load draft from localStorage
  const loadDraft = () => {
    const draftData = localStorage.getItem('roomDraft');
    if (draftData) {
      try {
        const parsedData = JSON.parse(draftData);
        form.reset(parsedData);
        if (parsedData.images && Array.isArray(parsedData.images)) {
          setImages(parsedData.images);
        }
        
        toast({
          title: "Draft Loaded",
          description: "Your saved room draft has been loaded",
          duration: 3000,
        });
        
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
  
  // Clear draft data
  const clearDraft = () => {
    localStorage.removeItem('roomDraft');
    setIsDraft(false);
    toast({
      title: "Draft Cleared",
      description: "Your saved room draft has been deleted",
      duration: 3000,
    });
  };

  // Form setup with default values
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: "",
      description: "",
      hotelId: "",
      price: 0,
      maxAdults: 2,
      maxChildren: 1,
      maxInfants: 1,
      amenities: [],
      images: [],
      isActive: true,
    },
  });

  // Use the shared hook for handling unsaved changes
  const {
    showConfirmDialog: confirmDialogOpen,
    setShowConfirmDialog: setConfirmDialogOpen,
    handleNavigation: navigateWithConfirmation,
    handleSaveAsDraft,
    handleContinue,
    handleDiscard
  } = useUnsavedChanges({
    isDirtyFn: () => form.formState.isDirty || images.length > 0,
    onSaveAsDraft: saveAsDraft,
    onDiscard: clearDraft
  });

  // Query to fetch hotel data for the dropdown
  const { data: hotels = [] } = useQuery({
    queryKey: ["/api/admin/hotels"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Check for draft on component mount and populate form with room data when in edit mode
  React.useEffect(() => {
    // Check for draft (only in create mode)
    if (!isEditMode) {
      const draftExists = localStorage.getItem('roomDraft');
      if (draftExists) {
        setIsDraft(true);
      }
    }
    
    // Populate form with room data when in edit mode and data is loaded
    if (isEditMode && roomData) {
      console.log("Loading room data for editing:", roomData);
      const amenitiesArray = roomData.amenities ? 
        (typeof roomData.amenities === 'string' ? 
          roomData.amenities.split(',').map((a: any) => a.trim()) : 
          Array.isArray(roomData.amenities) ? roomData.amenities : []
        ) : [];
      
      // Set images if available
      if (roomData.images && Array.isArray(roomData.images)) {
        setImages(roomData.images);
      } else if (roomData.imageUrl) {
        setImages([roomData.imageUrl]);
      }
      
      // Reset form with room data
      form.reset({
        name: roomData.name || "",
        description: roomData.description || "",
        hotelId: roomData.hotelId ? roomData.hotelId.toString() : "",
        price: roomData.price || 0,
        maxAdults: roomData.maxAdults || 2,
        maxChildren: roomData.maxChildren || 1,
        maxInfants: roomData.maxInfants || 1,
        amenities: amenitiesArray,
        isActive: roomData.status === "active" || roomData.available === true,
      });
    }
  }, [isEditMode, roomData, form]);

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: async (data: RoomFormValues) => {
      // Append images to the form data
      const formData = { ...data, images };
      return await apiRequest("/api/admin/rooms", {
        method: "POST",
        body: JSON.stringify(formData),
      });
    },
    onSuccess: () => {
      // Show success message
      toast({
        title: "Room Created",
        description: "The room was created successfully",
        duration: 5000,
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rooms"] });
      
      // Navigate back to rooms list
      navigate("/admin/rooms");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create room",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: RoomFormValues) => {
    createRoomMutation.mutate(data);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Mock image upload - in a real app, you would upload to server
    // For now, we'll just store the file names
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  return (
    <DashboardLayout>
      {/* Confirmation Dialog for Unsaved Changes */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in your room form. What would you like to do?
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
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Button variant="link" onClick={() => navigateWithConfirmation("/admin")}>Dashboard</Button>
            <ChevronRight className="h-4 w-4" />
            <Button variant="link" onClick={() => navigateWithConfirmation("/admin/rooms")}>Rooms</Button>
            <ChevronRight className="h-4 w-4" />
            <span>Create Room</span>
          </div>
        </div>
        
        {/* Draft notice banner */}
        {isDraft && (
          <div className="mb-4 p-4 border border-blue-200 bg-blue-50 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-800">Draft Available</h3>
              <p className="text-blue-600">You have a saved room draft. Would you like to continue where you left off?</p>
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
            <CardTitle>Create New Room</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Room Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Name*</FormLabel>
                        <FormControl>
                          <Input 
                            id="room-name"
                            className="room-name-input admin-input"
                            placeholder="Deluxe Room" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Hotel Selection */}
                  <FormField
                    control={form.control}
                    name="hotelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotel*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger 
                              id="hotel-select"
                              className="hotel-select admin-select"
                            >
                              <SelectValue placeholder="Select a hotel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.isArray(hotels) && hotels.map((hotel: any) => (
                              <SelectItem key={hotel.id} value={hotel.id.toString()}>
                                {hotel.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Room Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          id="room-description"
                          className="min-h-[120px] room-description-input admin-textarea"
                          placeholder="Enter room description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the room features and amenities
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Room Capacity Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Room Capacity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Adults */}
                    <FormField
                      control={form.control}
                      name="maxAdults"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Adults</FormLabel>
                          <FormControl>
                            <Input 
                              id="max-adults"
                              className="max-adults-input admin-number-input"
                              type="number" 
                              min="0" 
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Children */}
                    <FormField
                      control={form.control}
                      name="maxChildren"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Children</FormLabel>
                          <FormControl>
                            <Input 
                              id="max-children"
                              className="max-children-input admin-number-input"
                              type="number" 
                              min="0" 
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Infants */}
                    <FormField
                      control={form.control}
                      name="maxInfants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Infants</FormLabel>
                          <FormControl>
                            <Input 
                              id="max-infants"
                              className="max-infants-input admin-number-input"
                              type="number" 
                              min="0" 
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night*</FormLabel>
                      <FormControl>
                        <Input 
                          id="room-price"
                          className="room-price-input admin-currency-input"
                          type="number" 
                          min="0" 
                          placeholder="100.00" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amenities */}
                <div className="space-y-4">
                  <FormLabel>Amenities</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenitiesOptions.map((amenity) => (
                      <FormField
                        key={amenity.id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(amenity.id)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValues, amenity.id])
                                    : field.onChange(
                                        currentValues.filter((value) => value !== amenity.id)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {amenity.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Room Images */}
                <div className="space-y-4">
                  <FormLabel>Room Images</FormLabel>
                  <div className="flex flex-col space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                    <FormDescription>
                      Upload images of the room (up to 5)
                    </FormDescription>
                  </div>

                  {/* Display uploaded images */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={image}
                            alt={`Room preview ${index + 1}`}
                            className="object-cover rounded-md w-full h-full"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => {
                              setImages((prev) => prev.filter((_, i) => i !== index));
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Status */}
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel>Room is Active</FormLabel>
                        <FormDescription>
                          Inactive rooms won't be available for booking
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigateWithConfirmation("/admin/rooms")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={saveAsDraft}
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createRoomMutation.isPending}
                  >
                    {createRoomMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Creating...
                      </div>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Room
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      {/* Confirmation Dialog for Unsaved Changes */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="destructive" onClick={handleDiscard}>Discard Changes</Button>
            <Button variant="outline" onClick={handleContinue}>Continue Editing</Button>
            <Button onClick={handleSaveAsDraft}>Save as Draft</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}