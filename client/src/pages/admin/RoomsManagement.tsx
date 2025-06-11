import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { RoomCombinationsForm } from "@/components/rooms/RoomCombinationsForm";
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

// Form schema for room data
const roomSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  hotelId: z.number().positive({ message: "Please select a hotel" }),
  type: z.string().min(1, { message: "Room type is required" }),
  maxOccupancy: z.number().min(1, { message: "Maximum occupancy must be at least 1" }),
  maxAdults: z.number().min(1, { message: "Maximum adults must be at least 1" }),
  maxChildren: z.number().min(0, { message: "Maximum children cannot be negative" }),
  maxInfants: z.number().min(0, { message: "Maximum infants cannot be negative" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  discountedPrice: z.number().min(0, { message: "Price must be a positive number" }).optional(),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
  size: z.string().optional(),
  bedType: z.string().optional(),
  amenities: z.string().optional(),
  view: z.string().optional(),
  available: z.boolean().default(true),
  status: z.string().default("active"),
});

type RoomFormValues = z.infer<typeof roomSchema>;

export default function RoomsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  // Fetch rooms
  const {
    data: rooms = [],
    isLoading: isLoadingRooms,
    error: roomsError,
  } = useQuery({
    queryKey: ["/api/admin/rooms"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch hotels for the dropdown
  const {
    data: hotels = [],
    isLoading: isLoadingHotels,
    error: hotelsError,
  } = useQuery({
    queryKey: ["/api/admin/hotels"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Fetch room categories for the room type dropdown
  const {
    data: roomCategories = [],
    isLoading: isLoadingRoomCategories,
    error: roomCategoriesError,
  } = useQuery<any[]>({
    queryKey: ['/api/room-categories'],
    select: (data) => 
      data
        .filter((category: any) => category.active)
        .map((category: any) => ({
          value: category.name,
          label: category.name
        }))
  });

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: async (data: RoomFormValues) => {
      const response = await apiRequest("/api/admin/rooms", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Room created successfully",
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rooms"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating room",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update room mutation
  const updateRoomMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: RoomFormValues }) => {
      const response = await apiRequest(`/api/admin/rooms/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Room updated successfully",
      });
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rooms"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating room",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/admin/rooms/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to delete room");
      }
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rooms"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting room",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create form
  const createForm = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      description: "",
      hotelId: undefined,
      type: "",
      maxOccupancy: 2,
      maxAdults: 2,
      maxChildren: 1,
      maxInfants: 1,
      price: 0,
      discountedPrice: undefined,
      imageUrl: "",
      size: "",
      bedType: "",
      amenities: "",
      view: "",
      available: true,
      status: "active",
    },
  });

  // Edit form
  const editForm = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      description: "",
      hotelId: undefined,
      type: "",
      maxOccupancy: 2,
      maxAdults: 2,
      maxChildren: 1,
      maxInfants: 1,
      price: 0,
      discountedPrice: undefined,
      imageUrl: "",
      size: "",
      bedType: "",
      amenities: "",
      view: "",
      available: true,
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
  const onCreateSubmit = (data: RoomFormValues) => {
    createRoomMutation.mutate(data);
  };

  const onEditSubmit = (data: RoomFormValues) => {
    if (selectedRoom) {
      updateRoomMutation.mutate({ id: selectedRoom.id, data });
    }
  };

  const handleDelete = () => {
    if (selectedRoom) {
      deleteRoomMutation.mutate(selectedRoom.id);
    }
  };

  // Open edit dialog and populate form with room data
  const handleEditClick = (room: any) => {
    setSelectedRoom(room);
    editForm.reset({
      name: room.name,
      description: room.description || "",
      hotelId: room.hotelId,
      type: room.type || "",
      maxOccupancy: room.maxOccupancy || 2,
      maxAdults: room.maxAdults || 2,
      maxChildren: room.maxChildren || 1,
      maxInfants: room.maxInfants || 1,
      price: room.price,
      discountedPrice: room.discountedPrice,
      imageUrl: room.imageUrl || "",
      size: room.size || "",
      bedType: room.bedType || "",
      amenities: room.amenities || "",
      view: room.view || "",
      available: room.available != null ? room.available : true,
      status: room.status || "active",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (room: any) => {
    setSelectedRoom(room);
    setIsDeleteDialogOpen(true);
  };

  // Filter rooms based on search query and hotel filter
  const filteredRooms = Array.isArray(rooms)
    ? rooms.filter((room: any) => {
        const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesHotel = selectedHotelId && selectedHotelId !== "all" ? room.hotelId === parseInt(selectedHotelId) : true;
        return matchesSearch && matchesHotel;
      })
    : [];

  // Helper function to get hotel name
  const getHotelName = (id: number) => {
    if (!Array.isArray(hotels)) return "Unknown";
    const hotel = hotels.find((h: any) => h.id === id);
    return hotel ? hotel.name : "Unknown";
  };

  if (isLoadingRooms || isLoadingHotels) {
    return (
      <div>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (roomsError || hotelsError) {
    return (
      <div>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-500">
            {roomsError
              ? `Error loading rooms: ${(roomsError as Error).message}`
              : `Error loading hotels: ${(hotelsError as Error).message}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Room Management</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search rooms..."
                className="pl-8 w-full md:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedHotelId || ""}
              onValueChange={(value) => setSelectedHotelId(value || null)}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by hotel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hotels</SelectItem>
                {Array.isArray(hotels) && hotels.map((hotel: any) => (
                  <SelectItem key={hotel.id} value={hotel.id.toString()}>
                    {hotel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isCreateDialogOpen} onOpenChange={onCreateDialogOpenChange}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Room</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new room.
                  </DialogDescription>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                    <FormField
                      control={createForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter room name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="hotelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hotel*</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a hotel" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.isArray(hotels) && hotels.map((hotel: any) => (
                                <SelectItem
                                  key={hotel.id}
                                  value={hotel.id.toString()}
                                >
                                  {hotel.name}
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
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select room type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingRoomCategories ? (
                                <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                              ) : roomCategories.length > 0 ? (
                                roomCategories.map(category => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))
                              ) : (
                                <>
                                  <SelectItem value="Standard">Standard</SelectItem>
                                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                                  <SelectItem value="Suite">Suite</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="maxOccupancy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Occupancy*</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Enter max occupancy"
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
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Room Size</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 30 sqm" {...field} />
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
                                min="0"
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
                                min="0"
                                placeholder="Enter discounted price"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                value={field.value === undefined ? "" : field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={createForm.control}
                      name="bedType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bed Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bed type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="King">King</SelectItem>
                              <SelectItem value="Queen">Queen</SelectItem>
                              <SelectItem value="Double">Double</SelectItem>
                              <SelectItem value="Twin">Twin</SelectItem>
                              <SelectItem value="Single">Single</SelectItem>
                              <SelectItem value="Bunk">Bunk</SelectItem>
                              <SelectItem value="Sofa">Sofa Bed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="view"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>View</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select view type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="City">City</SelectItem>
                              <SelectItem value="Ocean">Ocean</SelectItem>
                              <SelectItem value="Mountain">Mountain</SelectItem>
                              <SelectItem value="Garden">Garden</SelectItem>
                              <SelectItem value="Pool">Pool</SelectItem>
                              <SelectItem value="Landmark">Landmark</SelectItem>
                              <SelectItem value="None">None</SelectItem>
                            </SelectContent>
                          </Select>
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
                            <Input placeholder="https://example.com/image.jpg" {...field} />
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
                            <Textarea placeholder="Enter room description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="amenities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amenities</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter amenities (e.g., WiFi, TV, Mini Bar)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="available"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Available</FormLabel>
                            <FormDescription>Is this room currently available for booking?</FormDescription>
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
                              <SelectItem value="maintenance">Under Maintenance</SelectItem>
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
                      <Button type="submit" disabled={createRoomMutation.isPending}>
                        {createRoomMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Room
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
            <CardTitle>Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRooms.length === 0 ? (
              <p className="text-center py-4">No rooms found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Occupancy</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.map((room: any) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.name}</TableCell>
                        <TableCell>{getHotelName(room.hotelId)}</TableCell>
                        <TableCell>{room.type}</TableCell>
                        <TableCell>{room.maxOccupancy} guests</TableCell>
                        <TableCell>
                          ${room.price}
                          {room.discountedPrice && <span className="text-green-600 ml-2">${room.discountedPrice}</span>}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              room.available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {room.available ? "Yes" : "No"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              room.status === "active"
                                ? "bg-green-100 text-green-800"
                                : room.status === "inactive"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {room.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(room)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(room)}
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

      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Modify the room details and save your changes.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter room name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel*</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hotel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.isArray(hotels) && hotels.map((hotel: any) => (
                          <SelectItem
                            key={hotel.id}
                            value={hotel.id.toString()}
                          >
                            {hotel.name}
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingRoomCategories ? (
                          <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                        ) : roomCategories.length > 0 ? (
                          roomCategories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Deluxe">Deluxe</SelectItem>
                            <SelectItem value="Suite">Suite</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="maxOccupancy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Occupancy*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter max occupancy"
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
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 30 sqm" {...field} value={field.value || ""} />
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
                          min="0"
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
                          min="0"
                          placeholder="Enter discounted price"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          value={field.value === undefined ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="bedType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bed type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="King">King</SelectItem>
                        <SelectItem value="Queen">Queen</SelectItem>
                        <SelectItem value="Double">Double</SelectItem>
                        <SelectItem value="Twin">Twin</SelectItem>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Bunk">Bunk</SelectItem>
                        <SelectItem value="Sofa">Sofa Bed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="view"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>View</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select view type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="City">City</SelectItem>
                        <SelectItem value="Ocean">Ocean</SelectItem>
                        <SelectItem value="Mountain">Mountain</SelectItem>
                        <SelectItem value="Garden">Garden</SelectItem>
                        <SelectItem value="Pool">Pool</SelectItem>
                        <SelectItem value="Landmark">Landmark</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Textarea placeholder="Enter room description" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter amenities (e.g., WiFi, TV, Mini Bar)" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Available</FormLabel>
                      <FormDescription>Is this room currently available for booking?</FormDescription>
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
                        <SelectItem value="maintenance">Under Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Room Combinations */}
              <div className="mt-6 border-t pt-6">
                {selectedRoom && (
                  <RoomCombinationsForm 
                    roomId={selectedRoom.id}
                    existingCombinations={selectedRoom.combinations || []}
                    onAddCombination={(combination) => {
                      // Handler for adding a combination
                      toast({
                        title: "Room combination added",
                        description: "The room occupancy combination has been added successfully.",
                      });
                    }}
                    onRemoveCombination={(index) => {
                      // Handler for removing a combination
                      toast({
                        title: "Room combination removed",
                        description: "The room occupancy combination has been removed.",
                      });
                    }}
                  />
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateRoomMutation.isPending}>
                  {updateRoomMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
              Are you sure you want to delete the room "{selectedRoom?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteRoomMutation.isPending}
            >
              {deleteRoomMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}