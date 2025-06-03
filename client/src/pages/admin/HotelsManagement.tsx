import React, { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Form schema for hotel data
const hotelSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  destinationId: z.number().positive({ message: "Please select a destination" }),
  categoryId: z.number().positive({ message: "Please select a hotel category" }).optional(),
  address: z.string().optional(),
  cityId: z.number().positive({ message: "Please select a city" }).optional(),
  countryId: z.number().positive({ message: "Please select a country" }).optional(),
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

export default function HotelsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

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

  // Fetch hotel categories for dropdowns
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
      categoryId: undefined,
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
      categoryId: undefined,
      featured: false,
      status: "active",
    },
  });

  // Filter hotels based on search query
  const filteredHotels = searchQuery
    ? hotels.filter((hotel: any) =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : hotels;

  // Create hotel mutation
  const createHotelMutation = useMutation({
    mutationFn: async (data: HotelFormValues) => {
      return await apiRequest({
        path: "/api/admin/hotels",
        method: "POST",
        data,
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
      return await apiRequest({
        path: `/api/admin/hotels/${id}`,
        method: "PATCH",
        data,
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
      return await apiRequest({
        path: `/api/admin/hotels/${id}`,
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

  const onCreateSubmit = (data: HotelFormValues) => {
    createHotelMutation.mutate(data);
  };

  const onEditSubmit = (data: HotelFormValues) => {
    if (selectedHotel) {
      updateHotelMutation.mutate({ id: selectedHotel.id, data });
    }
  };

  const handleEdit = (hotel: any) => {
    setSelectedHotel(hotel);
    editForm.reset({
      name: hotel.name,
      description: hotel.description || "",
      destinationId: hotel.destinationId,
      categoryId: hotel.categoryId,
      address: hotel.address || "",
      cityId: hotel.cityId,
      countryId: hotel.countryId,
      postalCode: hotel.postalCode || "",
      phone: hotel.phone || "",
      email: hotel.email || "",
      website: hotel.website || "",
      imageUrl: hotel.imageUrl || "",
      stars: hotel.stars || undefined,
      amenities: hotel.amenities ? hotel.amenities.join(", ") : "",
      checkInTime: hotel.checkInTime || "",
      checkOutTime: hotel.checkOutTime || "",
      featured: hotel.featured || false,
      rating: hotel.rating || undefined,
      status: hotel.status || "active",
    });
    setIsEditDialogOpen(true);
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

  return (
    <DashboardLayout>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Hotels Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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
            <div className="flex gap-2">
              <Button onClick={() => navigate("/admin/hotels/create")} variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Add Hotel (Full Form)
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={onCreateDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto dialog-content">
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
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
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
                                {isLoadingHotelCategories ? (
                                  <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                                ) : hotelCategories.length > 0 ? (
                                  hotelCategories.map((category: any) => (
                                    <SelectItem
                                      key={category.value}
                                      value={category.value}
                                    >
                                      {category.label}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="none" disabled>No categories available</SelectItem>
                                )}
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
            </div>
          </div>

          {isLoadingHotels ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No hotels found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsCreateDialogOpen(true)}
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
                    <TableHead>Name</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHotels.map((hotel: any) => (
                    <TableRow key={hotel.id}>
                      <TableCell className="font-medium">{hotel.name}</TableCell>
                      <TableCell>{hotel.destination?.name || "-"}</TableCell>
                      <TableCell>
                        {hotel.featured ? (
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                            Featured
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">
                            Standard
                          </span>
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
                            onClick={() => handleEdit(hotel)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleConfirmDelete(hotel)}
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
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto dialog-content">
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
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
                        {isLoadingHotelCategories ? (
                          <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                        ) : hotelCategories.length > 0 ? (
                          hotelCategories.map((category: any) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No categories available</SelectItem>
                        )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogOpenChange}>
        <DialogContent className="sm:max-w-[425px] dialog-content">
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
    </DashboardLayout>
  );
}