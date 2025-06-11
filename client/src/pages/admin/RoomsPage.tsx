import React, { useState, useEffect } from "react";
import { Link, useLocation, useRoute, useSearch } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import { 
  BedDouble, 
  ChevronRight, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Settings,
  Trash,
  Eye,
  Building,
  User,
  Users
} from "lucide-react";

interface Room {
  id: number;
  name: string;
  description: string;
  hotelId: number;
  hotelName: string;
  price: number;
  maxAdults: number;
  maxChildren: number;
  maxInfants: number;
  amenities: string[];
  images: string[];
  isActive: boolean;
  category?: string;
}

export default function RoomsPage() {
  const { t } = useLanguage();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get URL parameters
  const params = new URLSearchParams(location.split('?')[1] || '');
  const urlFilter = params.get('filter');
  
  // State for filtering and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [hotelFilter, setHotelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(urlFilter || "all");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Update filter when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const newFilter = params.get('filter');
    if (newFilter) {
      setCategoryFilter(newFilter);
    } else {
      setCategoryFilter("all");
    }
  }, [location]);
  
  // Number of items per page
  const itemsPerPage = 10;
  
  // Query to get rooms
  const { data: rawRooms = [], isLoading } = useQuery({
    queryKey: ["/api/admin/rooms"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Query to get hotels for filtering
  const { data: hotels = [] } = useQuery({
    queryKey: ["/api/admin/hotels"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: async (roomId: number) => {
      return await apiRequest(`/api/admin/rooms/${roomId}`, {
        method: "DELETE",
        credentials: "include"
      });
    },
    onSuccess: () => {
      toast({
        title: "Room Deleted",
        description: "The room has been deleted successfully",
        duration: 5000,
      });
      
      // Close the dialog and reset the room to delete
      setShowDeleteDialog(false);
      setRoomToDelete(null);
      
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rooms"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete room",
        variant: "destructive",
        duration: 5000,
      });
      setShowDeleteDialog(false);
    },
  });

  // Apply filters to the rooms data
  const filteredRooms = (Array.isArray(rawRooms) ? rawRooms : []).filter((room: Room) => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Hotel filter
    const matchesHotel = hotelFilter === "all" || room.hotelId.toString() === hotelFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && room.isActive) || 
      (statusFilter === "inactive" && !room.isActive);
    
    // Category filter (from URL)
    const matchesCategory = categoryFilter === "all" || 
      (categoryFilter === "standard" && room.category?.toLowerCase() === "standard") ||
      (categoryFilter === "deluxe" && room.category?.toLowerCase() === "deluxe");
    
    return matchesSearch && matchesHotel && matchesStatus && matchesCategory;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage);
  
  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, hotelFilter, statusFilter, categoryFilter]);
  
  // Handle room deletion
  const handleDeleteRoom = () => {
    if (roomToDelete) {
      deleteRoomMutation.mutate(roomToDelete.id);
    }
  };

  return (
    <div>
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Button variant="link" onClick={() => navigate("/admin")}>Dashboard</Button>
            <ChevronRight className="h-4 w-4" />
            <span>Rooms</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {categoryFilter === "standard" 
                ? "Standard Rooms" 
                : categoryFilter === "deluxe" 
                  ? "Deluxe Rooms" 
                  : "Rooms Management"}
            </h1>
            {categoryFilter !== "all" && (
              <div className="text-muted-foreground text-sm mt-1">
                Filtered by category: {categoryFilter}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate("/admin/rooms/amenities")}>
              <Settings className="mr-2 h-4 w-4" /> Room Amenities
            </Button>
            <Button onClick={() => navigate("/admin/rooms/create")}>
              <Plus className="mr-2 h-4 w-4" /> Add New Room
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search rooms..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Hotel Filter */}
              <Select value={hotelFilter} onValueChange={setHotelFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <SelectValue placeholder="Filter by hotel" />
                  </div>
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
              
              {/* Category Filter */}
              <Select 
                value={categoryFilter} 
                onValueChange={(value) => {
                  setCategoryFilter(value);
                  if (value === "all") {
                    navigate("/admin/rooms");
                  } else {
                    navigate(`/admin/rooms?filter=${value}`);
                  }
                }}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4" />
                    <SelectValue placeholder="Filter by category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No rooms found matching your filters
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Name</TableHead>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRooms.map((room: Room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <BedDouble className="h-4 w-4 mr-2 text-gray-500" />
                            {room.name}
                          </div>
                        </TableCell>
                        <TableCell>{room.hotelName}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <User className="h-3 w-3" /> {room.maxAdults}
                            </Badge>
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Users className="h-3 w-3" /> {room.maxChildren}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {room.maxInfants} Infants
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${room.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">per night</div>
                        </TableCell>
                        <TableCell>
                          {room.isActive ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/admin/rooms/${room.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/admin/rooms/${room.id}/edit`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => {
                                  setRoomToDelete(room);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the room "{roomToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteRoom}
                disabled={deleteRoomMutation.isPending}
              >
                {deleteRoomMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}