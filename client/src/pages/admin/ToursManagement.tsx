import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowDownUp, ArrowUpDown, ClockIcon, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format, parseISO } from "date-fns";

// Form schema for tour data
const tourSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
  destinationId: z.coerce.number().positive({ message: "Please select a destination" }),
  tripType: z.string().optional().nullable(),
  // Always coerce duration to a number
  duration: z.coerce.number().min(1, { message: "Duration is required" }),
  // Accept string input but ensure we send an ISO string to the server
  date: z.preprocess(
    // If it's a date string, convert it to an ISO string
    (arg) => {
      if (typeof arg === 'string') {
        const date = new Date(arg);
        return !isNaN(date.getTime()) ? date.toISOString() : null;
      }
      // Return the existing Date object or null
      return arg;
    },
    z.string().nullable().optional()
  ),
  numPassengers: z.coerce.number().min(1).optional().nullable(),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  discountedPrice: z.coerce.number().min(0, { message: "Price must be a positive number" }).optional().nullable(),
  // Define these as strings in the form, then transform to arrays before sending to server
  included: z.string().optional().nullable().transform(val => 
    val ? val.split('\n').filter(i => i.trim()) : []
  ),
  excluded: z.string().optional().nullable().transform(val => 
    val ? val.split('\n').filter(i => i.trim()) : []
  ),
  itinerary: z.string().optional().nullable(),
  maxGroupSize: z.coerce.number().min(1, { message: "Group size must be at least 1" }).optional().nullable(),
  featured: z.boolean().default(false),
  rating: z.coerce.number().min(0).max(5).optional().nullable(),
  status: z.string().default("active"),
});

type TourFormValues = z.infer<typeof tourSchema>;
type TourFormInput = z.input<typeof tourSchema>;

export default function ToursManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"name" | "updatedAt" | "createdAt">("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc"); // Default to newest first
  
  // Fetch tour categories for the trip type dropdown
  const { data: tourCategories = [] } = useQuery<any[]>({
    queryKey: ['/api/tour-categories'],
    select: (data) => 
      data
        .filter((category) => category.active)
        .map((category) => ({
          value: category.name,
          label: category.name
        }))
  });

  // Fetch tours
  const {
    data: tours = [],
    isLoading: isLoadingTours,
    error: toursError,
  } = useQuery({
    queryKey: ["/api/admin/tours"],
    queryFn: getQuery("/api/admin/tours"),
  });

  // Show error toast if there's an error fetching tours
  React.useEffect(() => {
    if (toursError) {
      toast({
        title: "Error fetching tours",
        description: (toursError as Error).message,
        variant: "destructive",
      });
    }
  }, [toursError, toast]);

  // Fetch destinations for the dropdown
  const {
    data: destinations = [],
    isLoading: isLoadingDestinations,
    error: destinationsError,
  } = useQuery({
    queryKey: ["/api/destinations"],
    queryFn: getQuery("/api/destinations"),
  });

  // Show error toast if there's an error fetching destinations
  React.useEffect(() => {
    if (destinationsError) {
      toast({
        title: "Error fetching destinations",
        description: (destinationsError as Error).message,
        variant: "destructive",
      });
    }
  }, [destinationsError, toast]);

  // Create tour mutation
  const createTourMutation = useMutation({
    mutationFn: async (data: TourFormValues) => {
      return await apiRequest("/api/admin/tours", {
        method: "POST", 
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tour created successfully",
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tours"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating tour",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update tour mutation
  const updateTourMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TourFormValues }) => {
      return await apiRequest(`/api/admin/tours/${id}`, {
        method: "PUT", 
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tour updated successfully",
      });
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tours"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating tour",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete tour mutation
  const deleteTourMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/tours/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tour deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tours"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting tour",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create form
  const createForm = useForm<TourFormInput>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      destinationId: 0,
      tripType: "",
      duration: 0,
      date: undefined,
      numPassengers: undefined,
      price: 0,
      discountedPrice: null,
      included: "",
      excluded: "",
      itinerary: "",
      maxGroupSize: null,
      featured: false,
      rating: null,
      status: "active",
    },
  });

  // Edit form
  const editForm = useForm<TourFormInput>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      destinationId: 0,
      tripType: "",
      duration: 0,
      date: undefined,
      numPassengers: undefined,
      price: 0,
      discountedPrice: null,
      included: "",
      excluded: "",
      itinerary: "",
      maxGroupSize: null,
      featured: false,
      rating: null,
      status: "active",
    },
  });

  // Reset forms when closing dialogs
  const onCreateDialogOpenChange = (open: boolean) => {
    if (!open) {
      createForm.reset();
    }
    setIsCreateDialogOpen(open);
  };

  const onEditDialogOpenChange = (open: boolean) => {
    if (!open) {
      editForm.reset();
    }
    setIsEditDialogOpen(open);
  };

  const onDeleteDialogOpenChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
  };

  // Handle form submissions
  const onCreateSubmit = (data: TourFormInput) => {
    // The data is already processed by zod schema through the resolver
    // but we need to ensure it's sent in the right format
    console.log("Submitting tour data:", data);
    createTourMutation.mutate(data as unknown as TourFormValues);
  };

  const onEditSubmit = (data: TourFormInput) => {
    if (selectedTour) {
      // The data is already processed by zod schema through the resolver
      console.log("Updating tour data:", data);
      updateTourMutation.mutate({ id: selectedTour.id, data: data as unknown as TourFormValues });
    }
  };

  const handleDelete = () => {
    if (selectedTour) {
      deleteTourMutation.mutate(selectedTour.id);
    }
  };

  // Navigate to edit tour page
  const handleEditClick = (tour: any) => {
    setLocation(`/admin/tours/edit/${tour.id}`);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (tour: any) => {
    setSelectedTour(tour);
    setIsDeleteDialogOpen(true);
  };

  // Helper function to get destination name
  const getDestinationName = (id: number) => {
    const destination = destinations.find((d: any) => d.id === id);
    return destination ? destination.name : "Unknown";
  };

  // Filter and sort tours based on search query and sort preferences
  const filteredTours = React.useMemo(() => {
    // First filter by search query
    const filtered = tours.filter((tour: any) =>
      tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getDestinationName(tour.destinationId).toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Then sort according to selected criteria
    return [...filtered].sort((a, b) => {
      if (sortBy === "updatedAt") {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "createdAt") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        // Sort by name
        return sortDirection === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });
  }, [tours, searchQuery, sortBy, sortDirection, destinations, getDestinationName]);

  // Helper function to create query function with error handling
  function getQuery(url: string) {
    return async () => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    };
  }

  if (isLoadingTours || isLoadingDestinations) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (toursError || destinationsError) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-500">
            {toursError
              ? `Error loading tours: ${toursError.message}`
              : `Error loading destinations: ${(destinationsError as Error).message}`}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Tour Management</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tours..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as "name" | "updatedAt" | "createdAt")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="updatedAt">Last Modified</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                title={sortDirection === "asc" ? "Ascending" : "Descending"}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setLocation("/admin/tours/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tour
            </Button>
            {/* Keeping the old dialog for reference until the new form is fully integrated */}
            <Dialog open={isCreateDialogOpen} onOpenChange={onCreateDialogOpenChange} className="hidden">
              <DialogTrigger asChild>
                <Button className="hidden">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tour
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Tour</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new tour package.
                  </DialogDescription>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                    <FormField
                      control={createForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tour Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter tour name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
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
                              {destinations.map((destination: any) => (
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
                    <FormField
                      control={createForm.control}
                      name="tripType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trip Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tourCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
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
                        control={createForm.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hours/Duration*</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1"
                                placeholder="Enter duration in hours" 
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                                value={field.value === null ? "" : field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                placeholder="Select date" 
                                {...field}
                                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                onChange={(e) => field.onChange(e.target.value || null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="numPassengers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Passengers</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter number of passengers"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                value={field.value === null ? '' : field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="maxGroupSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Group Size</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter max group size"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price*</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter price"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="discountedPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discounted Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter discounted price"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                value={field.value === null ? "" : field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={createForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter tour description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="itinerary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Itinerary</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter tour itinerary" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="included"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What's Included</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter included items (one per line)" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormDescription>
                              Enter each item on a new line
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="excluded"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What's Excluded</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter excluded items (one per line)" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormDescription>
                              Enter each item on a new line
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={createForm.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating (0-5)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              placeholder="Enter rating"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured</FormLabel>
                            <FormDescription>Show this tour in featured sections</FormDescription>
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
                      control={createForm.control}
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
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="soldout">Sold Out</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createTourMutation.isPending}>
                        {createTourMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Tour
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tours</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTours.length === 0 ? (
              <p className="text-center py-4">No tours found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTours.map((tour: any) => (
                      <TableRow key={tour.id}>
                        <TableCell className="font-medium">{tour.name}</TableCell>
                        <TableCell>{getDestinationName(tour.destinationId)}</TableCell>
                        <TableCell>{tour.duration}</TableCell>
                        <TableCell>
                          ${tour.price}
                          {tour.discountedPrice && <span className="text-green-600 ml-2">${tour.discountedPrice}</span>}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              tour.status === "active"
                                ? "bg-green-100 text-green-800"
                                : tour.status === "inactive"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {tour.status}
                          </span>
                        </TableCell>
                        <TableCell>{tour.featured ? "Yes" : "No"}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(tour)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(tour)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Tour Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tour</DialogTitle>
            <DialogDescription>
              Modify the tour details and save your changes.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tour name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="destinationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination*</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a destination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {destinations.map((destination: any) => (
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
              <FormField
                control={editForm.control}
                name="tripType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tourCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
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
                  control={editForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours/Duration*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          placeholder="Enter duration in hours" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                          value={field.value === null ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          placeholder="Select date" 
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="numPassengers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Passengers</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter number of passengers"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          value={field.value === null ? '' : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="maxGroupSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Group Size</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter max group size"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          value={field.value === null ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter price"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discounted Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter discounted price"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          value={field.value === null ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter tour description" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="itinerary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Itinerary</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter tour itinerary" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="included"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's Included</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter included items (one per line)" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>
                        Enter each item on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="excluded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's Excluded</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter excluded items (one per line)" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>
                        Enter each item on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="Enter rating"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        value={field.value === null ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Show this tour in featured sections
                      </p>
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
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="soldout">Sold Out</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTourMutation.isPending}>
                  {updateTourMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the tour "{selectedTour?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteTourMutation.isPending}
            >
              {deleteTourMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}