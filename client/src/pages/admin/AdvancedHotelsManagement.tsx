import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Loader2, 
  Pencil, 
  Plus, 
  Search, 
  Trash2, 
  Star, 
  Filter, 
  X, 
  SlidersHorizontal,
  Eye,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

// Form schema for hotel data
const hotelSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  destinationId: z.number().positive({ message: "Please select a destination" }),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email" }).optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional(),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
  stars: z.number().min(1).max(5).optional(),
  amenities: z.string()
    .transform((val) => val ? val.split(',').map(item => item.trim()) : [])
    .optional(),
  checkInTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time in 24-hour format (HH:MM)" })
    .optional(),
  checkOutTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time in 24-hour format (HH:MM)" })
    .optional(),
  featured: z.boolean().default(false),
  rating: z.number().min(0).max(5).optional(),
  status: z.string().default("active"),
});

type HotelFormValues = z.infer<typeof hotelSchema>;

export default function AdvancedHotelsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States for filters and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [destinationFilter, setDestinationFilter] = useState<number | null>(null);
  const [starsFilter, setStarsFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  
  // Import states
  const [importData, setImportData] = useState<any[]>([]);
  const [duplicateHandlingStrategy, setDuplicateHandlingStrategy] = useState("skip");
  const [importValidationErrors, setImportValidationErrors] = useState<string[]>([]);

  // Fetch hotels
  const {
    data: hotels = [],
    isLoading: isLoadingHotels,
    error: hotelsError,
  } = useQuery({
    queryKey: ["/api/admin/hotels"],
    queryFn: getQueryFn(),
  });

  // Fetch destinations for dropdowns
  const {
    data: destinations = [],
    isLoading: isLoadingDestinations,
  } = useQuery({
    queryKey: ["/api/admin/destinations"],
    queryFn: getQueryFn(),
  });

  // Fetch hotel categories for dropdowns (if needed later)
  const {
    data: hotelCategories = [],
    isLoading: isLoadingHotelCategories,
  } = useQuery({
    queryKey: ["/api/admin/hotel-categories"],
    queryFn: getQueryFn(),
  });

  // Forms
  const createForm = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: "",
      description: "",
      destinationId: undefined,
      featured: false,
      status: "active",
    },
  });

  const editForm = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: "",
      description: "",
      destinationId: undefined,
      featured: false,
      status: "active",
    },
  });

  // Apply filters to hotels
  const filteredHotels = React.useMemo(() => {
    return hotels.filter((hotel: any) => {
      // Text search filter
      const textMatch = searchQuery 
        ? hotel.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          hotel.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.city?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      // Destination filter
      const destinationMatch = destinationFilter 
        ? hotel.destinationId === destinationFilter 
        : true;
      
      // Stars filter
      const starsMatch = starsFilter 
        ? hotel.stars === starsFilter 
        : true;
      
      // Status filter
      const statusMatch = statusFilter 
        ? hotel.status === statusFilter 
        : true;
      
      // Featured filter
      const featuredMatch = featuredFilter !== null 
        ? hotel.featured === featuredFilter 
        : true;
      
      return textMatch && destinationMatch && starsMatch && statusMatch && featuredMatch;
    });
  }, [hotels, searchQuery, destinationFilter, starsFilter, statusFilter, featuredFilter]);

  // Apply pagination
  const paginatedHotels = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredHotels.slice(startIndex, endIndex);
  }, [filteredHotels, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, destinationFilter, starsFilter, statusFilter, featuredFilter]);

  // Create hotel mutation
  const createHotelMutation = useMutation({
    mutationFn: async (data: HotelFormValues) => {
      return await apiRequest("/api/admin/hotels", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Hotel created successfully",
      });
      setIsCreateDialogOpen(false);
      createForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hotels"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create hotel: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update hotel mutation
  const updateHotelMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: HotelFormValues }) => {
      return await apiRequest(`/api/admin/hotels/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Hotel updated successfully",
      });
      setIsEditDialogOpen(false);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hotels"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update hotel: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete hotel mutation
  const deleteHotelMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/hotels/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Hotel deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hotels"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete hotel: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Dialog handlers
  const onCreateDialogOpenChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      createForm.reset();
    }
  };

  const onEditDialogOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      editForm.reset();
    }
  };

  const onDeleteDialogOpenChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
  };

  const onViewDialogOpenChange = (open: boolean) => {
    setIsViewDialogOpen(open);
  };
  
  const onImportDialogOpenChange = (open: boolean) => {
    setIsImportDialogOpen(open);
    if (!open) {
      setImportData([]);
      setImportValidationErrors([]);
    }
  };
  
  // Navigation to edit page
  const navigateToEditPage = (hotel: any) => {
    navigate(`/admin/hotels/edit/${hotel.id}`);
  };

  // Form submission handlers
  const onCreateSubmit = (data: HotelFormValues) => {
    createHotelMutation.mutate(data);
  };

  const onEditSubmit = (data: HotelFormValues) => {
    if (selectedHotel) {
      updateHotelMutation.mutate({ id: selectedHotel.id, data });
    }
  };

  // Action handlers
  const handleEdit = (hotel: any) => {
    // Navigate to enhanced edit page instead of opening dialog
    navigateToEditPage(hotel);
  };

  const handleView = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsViewDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedHotel) {
      deleteHotelMutation.mutate(selectedHotel.id);
    }
  };

  const handleConfirmDelete = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsDeleteDialogOpen(true);
  };

  // Helper functions for rendering
  const renderStarRating = (stars: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setDestinationFilter(null);
    setStarsFilter(null);
    setStatusFilter(null);
    setFeaturedFilter(null);
    setCurrentPage(1);
  };
  
  // Export hotels to JSON file
  const handleExportHotels = () => {
    // Use only the filtered hotels if there are filters applied
    const dataToExport = filteredHotels.length > 0 ? filteredHotels : hotels;
    
    // Create a clean version of the data without internal IDs
    const exportData = dataToExport.map((hotel: any) => {
      const { id, createdAt, updatedAt, ...cleanData } = hotel;
      return cleanData;
    });
    
    // Create the JSON file
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = `hotels-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `${exportData.length} hotels exported to JSON file.`,
    });
  };
  
  // Handle file selection for import
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        
        // Validate the data
        const errors: string[] = [];
        const validData = jsonData.filter((item: any, index: number) => {
          if (!item.name) {
            errors.push(`Item #${index + 1}: Missing required field 'name'`);
            return false;
          }
          return true;
        });
        
        setImportData(validData);
        setImportValidationErrors(errors);
        setIsImportDialogOpen(true);
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse JSON file. Please ensure it's valid JSON format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };
  
  // Import hotels batch mutation
  const importHotelsMutation = useMutation({
    mutationFn: async (data: { hotels: any[], strategy: string }) => {
      return await apiRequest("/api/admin/hotels/import", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Import Successful",
        description: `${data.imported} hotels imported successfully.`,
      });
      setIsImportDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hotels"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Import Error",
        description: `Failed to import hotels: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Proceed with import using the selected strategy
  const handleImportConfirm = () => {
    importHotelsMutation.mutate({
      hotels: importData,
      strategy: duplicateHandlingStrategy
    });
  };

  if (hotelsError) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load hotels: {(hotelsError as Error).message}</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  // Modify the "Actions" column to include an Edit button that navigates to the edit page
  const renderActions = (hotel: any) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleView(hotel)}
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigateToEditPage(hotel)}
        title="Edit Hotel"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleConfirmDelete(hotel)}
        title="Delete Hotel"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );

  return (
    <DashboardLayout>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between gap-4 py-4">
          <CardTitle>Hotels Management</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate("/admin/hotels/create")} variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Add Hotel
            </Button>
            <Button onClick={handleExportHotels} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search hotels..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Filter button with slide-in panel */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {(destinationFilter || starsFilter || statusFilter || featuredFilter !== null) && (
                        <Badge variant="secondary" className="ml-2">
                          {[
                            destinationFilter !== null && "1",
                            starsFilter !== null && "1",
                            statusFilter !== null && "1",
                            featuredFilter !== null && "1",
                          ].filter(Boolean).length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filter Hotels</SheetTitle>
                      <SheetDescription>
                        Refine the hotel list using filters
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 space-y-6">
                      {/* Destination Filter */}
                      <div className="space-y-2">
                        <Label htmlFor="destination-filter">Destination</Label>
                        <Select 
                          value={destinationFilter?.toString() || ""} 
                          onValueChange={(value) => setDestinationFilter(value ? parseInt(value) : null)}
                        >
                          <SelectTrigger id="destination-filter">
                            <SelectValue placeholder="All destinations" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All destinations</SelectItem>
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
                      </div>
                      
                      {/* Stars Filter */}
                      <div className="space-y-2">
                        <Label htmlFor="stars-filter">Star Rating</Label>
                        <Select 
                          value={starsFilter?.toString() || ""} 
                          onValueChange={(value) => setStarsFilter(value ? parseInt(value) : null)}
                        >
                          <SelectTrigger id="stars-filter">
                            <SelectValue placeholder="Any rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Any rating</SelectItem>
                            {[5, 4, 3, 2, 1].map((stars) => (
                              <SelectItem key={stars} value={stars.toString()}>
                                <div className="flex items-center">
                                  {renderStarRating(stars)}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Status Filter */}
                      <div className="space-y-2">
                        <Label htmlFor="status-filter">Status</Label>
                        <Select 
                          value={statusFilter || ""} 
                          onValueChange={(value) => setStatusFilter(value || null)}
                        >
                          <SelectTrigger id="status-filter">
                            <SelectValue placeholder="Any status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Any status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Featured Filter */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="featured-filter">Featured Only</Label>
                          <Switch 
                            id="featured-filter"
                            checked={featuredFilter === true}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFeaturedFilter(true);
                              } else if (featuredFilter === true) {
                                setFeaturedFilter(null);
                              } else {
                                setFeaturedFilter(true);
                              }
                            }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {featuredFilter === true ? "Showing featured hotels only" : "Showing all hotels"}
                        </p>
                      </div>
                      
                      {/* Items per page */}
                      <div className="space-y-2">
                        <Label htmlFor="items-per-page">Items per page</Label>
                        <Select 
                          value={itemsPerPage.toString()} 
                          onValueChange={(value) => setItemsPerPage(parseInt(value))}
                        >
                          <SelectTrigger id="items-per-page">
                            <SelectValue placeholder="10" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2 pt-4 flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={clearFilters}
                          className="w-1/2"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear Filters
                        </Button>
                        <SheetClose asChild>
                          <Button className="w-1/2">Apply Filters</Button>
                        </SheetClose>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                {/* Active filter badges */}
                <div className="flex flex-wrap gap-2">
                  {destinationFilter && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span>
                        Destination: {
                          destinations.find((d: any) => d.id === destinationFilter)?.name || 'Unknown'
                        }
                      </span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setDestinationFilter(null)}
                      />
                    </Badge>
                  )}
                  
                  {starsFilter && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span>
                        {starsFilter} Stars
                      </span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setStarsFilter(null)}
                      />
                    </Badge>
                  )}
                  
                  {statusFilter && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span>
                        Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                      </span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setStatusFilter(null)}
                      />
                    </Badge>
                  )}
                  
                  {featuredFilter === true && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span>Featured Only</span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setFeaturedFilter(null)}
                      />
                    </Badge>
                  )}
                  
                  {(destinationFilter || starsFilter || statusFilter || featuredFilter !== null) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="h-7 px-2 text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Results summary */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredHotels.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {
                Math.min(currentPage * itemsPerPage, filteredHotels.length)
              } of {filteredHotels.length} hotels
              {(searchQuery || destinationFilter || starsFilter || statusFilter || featuredFilter !== null) && 
                ` (filtered from ${hotels.length} total)`
              }
            </div>

            {/* Hotel listing */}
            {isLoadingHotels ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-10 border rounded-md">
                <p className="text-muted-foreground">No hotels found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/admin/hotels/create")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add a Hotel
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHotels.map((hotel: any) => (
                      <TableRow key={hotel.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {hotel.imageUrl ? (
                              <img 
                                src={hotel.imageUrl} 
                                alt={hotel.name} 
                                className="h-10 w-14 rounded object-cover"
                              />
                            ) : (
                              <div className="h-10 w-14 bg-muted rounded flex items-center justify-center text-muted-foreground">
                                No img
                              </div>
                            )}
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {hotel.name}
                                {hotel.featured && (
                                  <Badge variant="secondary" className="h-5 text-xs">Featured</Badge>
                                )}
                              </div>
                              <div className="flex items-center mt-1">
                                {hotel.stars && renderStarRating(hotel.stars)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {destinations.find((d: any) => d.id === hotel.destinationId)?.name || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {hotel.rating ? (
                            <span className="flex items-center gap-1">
                              {hotel.rating.toFixed(1)}
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            </span>
                          ) : (
                            'Not rated'
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              hotel.status === "active"
                                ? "bg-green-100 text-green-800"
                                : hotel.status === "inactive"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {hotel.status?.charAt(0).toUpperCase() + hotel.status?.slice(1) || "Active"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleView(hotel)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(hotel)}
                              title="Edit Hotel"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleConfirmDelete(hotel)}
                              title="Delete Hotel"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current page
                      return (
                        page === 1 || 
                        page === totalPages || 
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis where there are gaps
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      );
                    })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Hotel Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={onCreateDialogOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Hotel</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new hotel.
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
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
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter hotel description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="stars"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Star Rating</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hotel star rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <SelectItem key={star} value={star.toString()}>
                              <div className="flex items-center">
                                {renderStarRating(star)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={createForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full address" {...field} />
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
                      <FormDescription>
                        Display this hotel in featured sections
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
              <DialogFooter>
                <Button type="submit" disabled={createHotelMutation.isPending}>
                  {createHotelMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Hotel
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Hotel Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
            <DialogDescription>
              Update the hotel details.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
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
                control={editForm.control}
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
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter hotel description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="stars"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Star Rating</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hotel star rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <SelectItem key={star} value={star.toString()}>
                              <div className="flex items-center">
                                {renderStarRating(star)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full address" {...field} />
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
                      <FormDescription>
                        Display this hotel in featured sections
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
                control={editForm.control}
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
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={updateHotelMutation.isPending}>
                  {updateHotelMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Hotel
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Hotel Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={onViewDialogOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hotel Details</DialogTitle>
          </DialogHeader>
          
          {selectedHotel && (
            <div className="space-y-6">
              {/* Hotel Image */}
              {selectedHotel.imageUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img 
                    src={selectedHotel.imageUrl} 
                    alt={selectedHotel.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Basic Info */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {selectedHotel.name}
                  {selectedHotel.featured && (
                    <Badge>Featured</Badge>
                  )}
                </h3>
                
                <div className="flex items-center gap-2">
                  {selectedHotel.stars ? (
                    <div className="flex items-center">
                      {renderStarRating(selectedHotel.stars)}
                    </div>
                  ) : null}
                  
                  <Badge variant="outline" className={
                    selectedHotel.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : selectedHotel.status === "inactive"
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  }>
                    {selectedHotel.status?.charAt(0).toUpperCase() + selectedHotel.status?.slice(1) || "Active"}
                  </Badge>
                </div>
                
                <p className="text-gray-500">
                  {selectedHotel.description || "No description available"}
                </p>
              </div>
              
              {/* Location Info */}
              <div className="space-y-2">
                <h4 className="font-semibold">Location</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Destination:</span>{" "}
                    {destinations.find((d: any) => d.id === selectedHotel.destinationId)?.name || 'Unknown'}
                  </div>
                  <div>
                    <span className="text-gray-500">City:</span>{" "}
                    {selectedHotel.city || "Not specified"}
                  </div>
                  <div>
                    <span className="text-gray-500">Country:</span>{" "}
                    {selectedHotel.country || "Not specified"}
                  </div>
                  <div>
                    <span className="text-gray-500">Address:</span>{" "}
                    {selectedHotel.address || "Not specified"}
                  </div>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <h4 className="font-semibold">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Phone:</span>{" "}
                    {selectedHotel.phone || "Not specified"}
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>{" "}
                    {selectedHotel.email || "Not specified"}
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Website:</span>{" "}
                    {selectedHotel.website ? (
                      <a 
                        href={selectedHotel.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedHotel.website}
                      </a>
                    ) : "Not specified"}
                  </div>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="space-y-2">
                <h4 className="font-semibold">Additional Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Check-in:</span>{" "}
                    {selectedHotel.checkInTime || "Not specified"}
                  </div>
                  <div>
                    <span className="text-gray-500">Check-out:</span>{" "}
                    {selectedHotel.checkOutTime || "Not specified"}
                  </div>
                  <div>
                    <span className="text-gray-500">Rating:</span>{" "}
                    {selectedHotel.rating ? (
                      <span className="flex items-center gap-1">
                        {selectedHotel.rating.toFixed(1)}
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </span>
                    ) : "Not rated"}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <DialogFooter className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEdit(selectedHotel);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Hotel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleConfirmDelete(selectedHotel);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Hotel
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the hotel "{selectedHotel?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteHotelMutation.isPending}
            >
              {deleteHotelMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Hotel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Configuration Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={onImportDialogOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Hotels</DialogTitle>
            <DialogDescription>
              {importData.length} hotels ready to import. Please review and select how to handle duplicates.
            </DialogDescription>
          </DialogHeader>
          
          {importValidationErrors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 my-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <h4 className="font-medium text-amber-800">Validation Warnings</h4>
              </div>
              <ul className="text-sm text-amber-700 list-disc pl-5 space-y-1">
                {importValidationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="my-4">
            <h4 className="font-medium mb-2">Duplicate Handling Strategy</h4>
            <RadioGroup 
              value={duplicateHandlingStrategy} 
              onValueChange={setDuplicateHandlingStrategy}
              className="space-y-3"
            >
              <div className="flex items-start space-x-2 bg-white border rounded-md p-3">
                <RadioGroupItem value="skip" id="strategy-skip" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="strategy-skip" className="font-medium">
                    Skip Duplicates (Safe)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Don't import hotels if a hotel with the same name already exists
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 bg-white border rounded-md p-3">
                <RadioGroupItem value="update" id="strategy-update" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="strategy-update" className="font-medium">
                    Update Existing
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Update existing hotels with the same name using the imported data
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 bg-white border rounded-md p-3">
                <RadioGroupItem value="allow" id="strategy-allow" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="strategy-allow" className="font-medium">
                    Allow Duplicates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Import all hotels, even if there are duplicates with the same name
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          {importData.length > 0 && (
            <div className="max-h-64 overflow-y-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hotel Name</TableHead>
                    <TableHead>Stars</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importData.map((hotel, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{hotel.name}</TableCell>
                      <TableCell>{renderStarRating(hotel.stars || 0)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            hotel.status === "active"
                              ? "success"
                              : hotel.status === "inactive"
                              ? "outline"
                              : hotel.status === "pending"
                              ? "warning"
                              : "default"
                          }
                        >
                          {hotel.status?.charAt(0).toUpperCase() + hotel.status?.slice(1) || "Unknown"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleImportConfirm}
              disabled={importHotelsMutation.isPending || importData.length === 0}
            >
              {importHotelsMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Import
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}