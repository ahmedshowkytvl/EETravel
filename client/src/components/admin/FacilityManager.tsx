import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreVertical, Plus, ChevronRight, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

// Common form schema for facilities, highlights, and cleanliness features
const facilitySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  category: z.string().optional(),
  active: z.boolean().default(true),
});

type FacilityFormValues = z.infer<typeof facilitySchema>;

interface FacilityManagerProps {
  title: string;
  description: string;
  facilityType: "facility" | "highlight" | "cleanliness";
  apiEndpoint: string;
}

export function FacilityManager({ 
  title, 
  description, 
  facilityType, 
  apiEndpoint 
}: FacilityManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [_, navigate] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Form for creating a new facility
  const createForm = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      category: "",
      active: true,
    },
  });

  // Form for editing an existing facility
  const editForm = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      category: "",
      active: true,
    },
  });

  // Query to fetch all facilities
  const {
    data: facilities = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [apiEndpoint],
    queryFn: async () => {
      const response = await apiRequest(apiEndpoint);
      return response || [];
    },
  });

  // Mutation for creating a new facility
  const createMutation = useMutation({
    mutationFn: async (data: FacilityFormValues) => {
      return await apiRequest(apiEndpoint, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiEndpoint] });
      setIsCreateDialogOpen(false);
      createForm.reset();
      toast({
        title: "Success",
        description: "Item created successfully",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create item",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Mutation for updating an existing facility
  const updateMutation = useMutation({
    mutationFn: async (data: FacilityFormValues) => {
      return await apiRequest(`${apiEndpoint}/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiEndpoint] });
      setIsEditDialogOpen(false);
      editForm.reset();
      setSelectedItem(null);
      toast({
        title: "Success",
        description: "Item updated successfully",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Mutation for deleting a facility
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`${apiEndpoint}/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiEndpoint] });
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      toast({
        title: "Success",
        description: "Item deleted successfully",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Handle creating a new facility
  const handleCreateSubmit = (data: FacilityFormValues) => {
    createMutation.mutate(data);
  };

  // Handle editing an existing facility
  const handleEditSubmit = (data: FacilityFormValues) => {
    updateMutation.mutate(data);
  };

  // Handle deleting a facility
  const handleDelete = () => {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem.id);
    }
  };

  // Populate edit form when an item is selected for editing
  useEffect(() => {
    if (selectedItem && isEditDialogOpen) {
      editForm.reset({
        id: selectedItem.id,
        name: selectedItem.name,
        description: selectedItem.description || "",
        icon: selectedItem.icon || "",
        category: selectedItem.category || "",
        active: selectedItem.active,
      });
    }
  }, [selectedItem, isEditDialogOpen, editForm]);

  // Set up the item for editing
  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  // Set up the item for deletion
  const handleConfirmDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Clear form and close dialog when creating is cancelled
  const handleCreateCancel = () => {
    createForm.reset();
    setIsCreateDialogOpen(false);
  };

  // Clear form and close dialog when editing is cancelled
  const handleEditCancel = () => {
    editForm.reset();
    setSelectedItem(null);
    setIsEditDialogOpen(false);
  };

  // Helper function to get the entity name based on type
  const getEntityName = () => {
    switch (facilityType) {
      case "facility":
        return "Facility";
      case "highlight":
        return "Highlight";
      case "cleanliness":
        return "Cleanliness Feature";
      default:
        return "Item";
    }
  };

  // Render breadcrumbs and back button
  const renderNavigation = () => {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-1 mb-4 flex-wrap bg-gray-50 py-2 px-4 rounded-md">
          <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0" onClick={() => navigate("/admin")}>
            Dashboard
          </Button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0" onClick={() => navigate("/admin/hotels")}>
            Hotels
          </Button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0" onClick={() => navigate("/admin/hotels/create")}>
            Create Hotel
          </Button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-700">{title}</span>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/hotels/create")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Hotel Creation
        </Button>
      </div>
    );
  };

  // Render loading state
  if (isLoading) {
    return (
      <div>
        {renderNavigation()}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-64" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-96" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <div>
        {renderNavigation()}
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              Failed to load {facilityType} data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{(error as Error)?.message || "Unknown error occurred"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main render
  return (
    <div>
      {renderNavigation()}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add {getEntityName()}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New {getEntityName()}</DialogTitle>
                <DialogDescription>
                  Add a new {getEntityName().toLowerCase()} to the system.
                </DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name*</FormLabel>
                        <FormControl>
                          <Input placeholder={`Enter ${getEntityName().toLowerCase()} name`} {...field} />
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
                          <Textarea 
                            placeholder={`Describe this ${getEntityName().toLowerCase()}`} 
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
                        <FormLabel>Icon (FontAwesome name)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. fa-wifi" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {facilityType === "facility" && (
                    <FormField
                      control={createForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. general, recreation, services" 
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={createForm.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Show this {getEntityName().toLowerCase()} in the hotel form
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
                    <Button type="button" variant="outline" onClick={handleCreateCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {createMutation.isPending ? "Creating..." : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {facilities.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No {getEntityName().toLowerCase()}s found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click the "Add {getEntityName()}" button to add one.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilities.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {item.description || "No description"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.active
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleConfirmDelete(item)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit {getEntityName()}</DialogTitle>
                <DialogDescription>
                  Update the {getEntityName().toLowerCase()} information.
                </DialogDescription>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name*</FormLabel>
                        <FormControl>
                          <Input placeholder={`Enter ${getEntityName().toLowerCase()} name`} {...field} />
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
                          <Textarea 
                            placeholder={`Describe this ${getEntityName().toLowerCase()}`} 
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
                        <FormLabel>Icon (FontAwesome name)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. fa-wifi" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {facilityType === "facility" && (
                    <FormField
                      control={editForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. general, recreation, services" 
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={editForm.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Show this {getEntityName().toLowerCase()} in the hotel form
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
                    <Button type="button" variant="outline" onClick={handleEditCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the {getEntityName().toLowerCase()}.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedItem(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}