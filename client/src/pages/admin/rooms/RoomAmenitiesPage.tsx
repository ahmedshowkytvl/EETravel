import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Import FontAwesome components and icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

// Import Lucide icons for UI elements
import {
  ChevronRight,
  Plus,
  Edit,
  Trash,
  Home,
  BedDouble,
  Loader2,
  X,
  Search,
} from "lucide-react";

// Add FontAwesome icon libraries
library.add(fas, far, fab);

// Define the schema for room amenity data
const amenitySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
  icon: z.string().min(1, { message: "Please select an icon" }),
  iconType: z.enum(["fas", "far", "fab"]).default("fas"),
  active: z.boolean().default(true),
});

type AmenityFormValues = z.infer<typeof amenitySchema>;

export default function RoomAmenitiesPage() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Placeholder for amenities data - will be replaced with actual API data
  const amenities = [
    { id: 1, name: "Free Wi-Fi", description: "High-speed wireless internet", icon: "wifi", iconType: "fas", active: true },
    { id: 2, name: "TV", description: "Flat-screen TV with cable channels", icon: "tv", iconType: "fas", active: true },
    { id: 3, name: "Air Conditioning", description: "Climate control", icon: "wind", iconType: "fas", active: true },
    { id: 4, name: "Coffee Maker", description: "In-room coffee machine", icon: "coffee", iconType: "fas", active: true },
    { id: 5, name: "Mini Fridge", description: "Small refrigerator", icon: "utensils", iconType: "fas", active: true },
    { id: 6, name: "Bathtub", description: "Private bathtub", icon: "bath", iconType: "fas", active: true },
    { id: 7, name: "Shower", description: "Standing shower", icon: "shower", iconType: "fas", active: true },
  ];
  
  // Icon picker state
  const [iconSearchQuery, setIconSearchQuery] = useState("");
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [selectedIconForm, setSelectedIconForm] = useState<"create" | "edit">("create");
  
  // FontAwesome icon categories
  const commonIcons = [
    { name: "wifi", type: "fas", label: "Wi-Fi" },
    { name: "tv", type: "fas", label: "TV" },
    { name: "shower", type: "fas", label: "Shower" },
    { name: "bath", type: "fas", label: "Bath" },
    { name: "swimming-pool", type: "fas", label: "Pool" },
    { name: "dumbbell", type: "fas", label: "Gym" },
    { name: "utensils", type: "fas", label: "Dining" },
    { name: "coffee", type: "fas", label: "Coffee" },
    { name: "concierge-bell", type: "fas", label: "Service" },
    { name: "air-freshener", type: "fas", label: "Fresh Air" },
    { name: "snowflake", type: "fas", label: "AC" },
    { name: "wifi", type: "fas", label: "Wi-Fi" },
    { name: "parking", type: "fas", label: "Parking" },
    { name: "wheelchair", type: "fas", label: "Accessible" },
    { name: "baby", type: "fas", label: "Baby Friendly" },
    { name: "paw", type: "fas", label: "Pet Friendly" },
    { name: "smoking-ban", type: "fas", label: "No Smoking" },
    { name: "lock", type: "fas", label: "Secure" },
    { name: "broom", type: "fas", label: "Cleaning" },
    { name: "sink", type: "fas", label: "Sink" },
    { name: "toilet", type: "fas", label: "Toilet" },
    { name: "key", type: "fas", label: "Room Key" },
    { name: "bed", type: "fas", label: "Bed" },
    { name: "couch", type: "fas", label: "Couch" },
  ];
  
  // Get all Font Awesome solid icons
  const allSolidIcons = Object.keys(fas).filter(key => key.startsWith('fa')).map(key => ({
    name: key.replace('fa', '').toLowerCase().replace(/^-/, ''),
    type: "fas",
    label: key.replace('fa', '').replace(/([A-Z])/g, ' $1').trim()
  }));
  
  // Filter icons based on search query
  const getFilteredIcons = () => {
    if (!iconSearchQuery) {
      return commonIcons.slice(0, 24); // Show common icons if no search
    }
    
    const query = iconSearchQuery.toLowerCase();
    return allSolidIcons
      .filter(icon => 
        icon.name.includes(query) || 
        icon.label.toLowerCase().includes(query)
      )
      .slice(0, 100); // Limit results to prevent performance issues
  };

  const isLoadingAmenities = false;

  // Filter amenities based on search query
  const filteredAmenities = amenities.filter(amenity =>
    amenity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (amenity.description && amenity.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Create form
  const createForm = useForm<AmenityFormValues>({
    resolver: zodResolver(amenitySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "wifi",
      active: true,
    },
  });

  // Edit form
  const editForm = useForm<AmenityFormValues>({
    resolver: zodResolver(amenitySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "wifi",
      active: true,
    },
  });

  // Handle dialog states
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

  // Handle form submissions
  const onCreateSubmit = (data: AmenityFormValues) => {
    // This would be a mutation in a real implementation
    console.log("Creating amenity:", data);
    toast({
      title: "Amenity Created",
      description: `Successfully created ${data.name}`,
    });
    setIsCreateDialogOpen(false);
  };

  const onEditSubmit = (data: AmenityFormValues) => {
    // This would be a mutation in a real implementation
    console.log("Updating amenity:", data);
    toast({
      title: "Amenity Updated",
      description: `Successfully updated ${data.name}`,
    });
    setIsEditDialogOpen(false);
  };

  const handleEditClick = (amenity: any) => {
    setSelectedAmenity(amenity);
    editForm.reset({
      name: amenity.name,
      description: amenity.description || "",
      icon: amenity.icon || "wifi",
      active: amenity.active,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (amenity: any) => {
    setSelectedAmenity(amenity);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // This would be a mutation in a real implementation
    console.log("Deleting amenity:", selectedAmenity);
    toast({
      title: "Amenity Deleted",
      description: `Successfully deleted ${selectedAmenity.name}`,
    });
    setIsDeleteDialogOpen(false);
  };

  // Helper function to render icon
  const renderIcon = (icon: string, iconType: string = "fas") => {
    return <FontAwesomeIcon icon={[iconType as any, icon]} className="h-5 w-5" />;
  };
  
  // Function to open the icon picker
  const openIconPicker = (formType: "create" | "edit") => {
    setSelectedIconForm(formType);
    setIconSearchQuery("");
    setIsIconPickerOpen(true);
  };
  
  // Function to select an icon from the picker
  const selectIcon = (icon: string, iconType: string) => {
    if (selectedIconForm === "create") {
      createForm.setValue("icon", icon);
      createForm.setValue("iconType", iconType as any);
    } else {
      editForm.setValue("icon", icon);
      editForm.setValue("iconType", iconType as any);
    }
    setIsIconPickerOpen(false);
  };

  return (
    <div>
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Button variant="link" onClick={() => navigate("/admin")}>
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <ChevronRight className="h-4 w-4" />
            <Button variant="link" onClick={() => navigate("/admin/rooms")}>
              <BedDouble className="h-4 w-4 mr-1" />
              Rooms
            </Button>
            <ChevronRight className="h-4 w-4" />
            <span>Room Amenities</span>
          </div>
        </div>

        {/* Title and Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Room Amenities Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage the amenities that can be assigned to rooms
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Amenity
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative w-full md:w-80">
            <Input
              placeholder="Search amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <X
              className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer ${
                searchQuery ? "text-gray-500" : "text-gray-300"
              }`}
              onClick={() => setSearchQuery("")}
            />
          </div>
        </div>

        {/* Amenities Table */}
        <Card>
          <CardHeader>
            <CardTitle>Room Amenities</CardTitle>
            <CardDescription>
              These amenities can be selected when creating or editing rooms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAmenities ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredAmenities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No amenities found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAmenities.map((amenity) => (
                    <TableRow key={amenity.id}>
                      <TableCell>
                        <div className="p-1 rounded-md bg-secondary/50 w-8 h-8 flex items-center justify-center">
                          {renderIcon(amenity.icon)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{amenity.name}</TableCell>
                      <TableCell>{amenity.description || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={amenity.active ? "default" : "outline"}
                          className={amenity.active ? "bg-green-50 text-green-700 hover:bg-green-50" : ""}
                        >
                          {amenity.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(amenity)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(amenity)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={onCreateDialogOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Room Amenity</DialogTitle>
              <DialogDescription>
                Create a new amenity that can be assigned to rooms
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form
                onSubmit={createForm.handleSubmit(onCreateSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Free Wi-Fi" {...field} />
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
                        <Input
                          placeholder="e.g., High-speed wireless internet"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <div 
                            className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-muted"
                            onClick={() => openIconPicker("create")}
                          >
                            {field.value ? (
                              <div className="flex items-center space-x-2">
                                <div className="bg-secondary/50 h-10 w-10 rounded-md flex items-center justify-center">
                                  {renderIcon(field.value, createForm.getValues("iconType"))}
                                </div>
                                <span className="text-sm">
                                  Selected: {field.value.replace(/-/g, ' ')}
                                </span>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  className="ml-auto"
                                >
                                  Change
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <Plus className="h-5 w-5" />
                                <span>Select an icon</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Make this amenity available for selection
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
                <DialogFooter>
                  <Button type="submit">Create Amenity</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Room Amenity</DialogTitle>
              <DialogDescription>
                Modify this room amenity's details
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(onEditSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Free Wi-Fi" {...field} />
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
                        <Input
                          placeholder="e.g., High-speed wireless internet"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <div 
                            className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-muted"
                            onClick={() => openIconPicker("edit")}
                          >
                            {field.value ? (
                              <div className="flex items-center space-x-2">
                                <div className="bg-secondary/50 h-10 w-10 rounded-md flex items-center justify-center">
                                  {renderIcon(field.value, editForm.getValues("iconType"))}
                                </div>
                                <span className="text-sm">
                                  Selected: {field.value.replace(/-/g, ' ')}
                                </span>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  className="ml-auto"
                                >
                                  Change
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <Plus className="h-5 w-5" />
                                <span>Select an icon</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Make this amenity available for selection
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
                <DialogFooter>
                  <Button type="submit">Update Amenity</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the amenity "{selectedAmenity?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete Amenity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Icon Picker Dialog */}
        <Dialog open={isIconPickerOpen} onOpenChange={setIsIconPickerOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Select an Icon</DialogTitle>
              <DialogDescription>
                Choose an icon for this amenity from our collection
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center space-x-2 my-2 py-2 border-b">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for icons..."
                value={iconSearchQuery}
                onChange={(e) => setIconSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            
            <div className="overflow-y-auto flex-grow">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 p-2">
                {getFilteredIcons().map((icon) => (
                  <div
                    key={`${icon.type}-${icon.name}`}
                    className="flex flex-col items-center justify-center p-3 rounded-md bg-secondary/30 hover:bg-secondary cursor-pointer text-center"
                    onClick={() => selectIcon(icon.name, icon.type)}
                  >
                    <div className="h-8 w-8 flex items-center justify-center mb-2">
                      <FontAwesomeIcon icon={[icon.type as any, icon.name]} />
                    </div>
                    <span className="text-xs truncate w-full">
                      {icon.name.replace(/-/g, ' ')}
                    </span>
                  </div>
                ))}
                {getFilteredIcons().length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No icons matching your search. Try a different term.
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="mt-4 pt-2 border-t">
              <Button variant="outline" onClick={() => setIsIconPickerOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}