import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import { 
  ChevronRight, 
  Edit, 
  Plus, 
  Search, 
  Trash,
  Eye,
  BedDouble,
  Tag,
  Save
} from "lucide-react";

// Define zod schema for room category
const roomCategorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(3, { message: "Description must be at least 3 characters" }),
  isActive: z.boolean().default(true),
});

type RoomCategory = z.infer<typeof roomCategorySchema> & { id: number };

export default function RoomCategoriesPage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for filtering, modals and form
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<RoomCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<RoomCategory | null>(null);
  
  // Form for creating new category
  const createForm = useForm<z.infer<typeof roomCategorySchema>>({
    resolver: zodResolver(roomCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });
  
  // Form for editing category
  const editForm = useForm<z.infer<typeof roomCategorySchema>>({
    resolver: zodResolver(roomCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });
  
  // Query to get room categories
  const { data: rawCategories = [], isLoading } = useQuery({
    queryKey: ["/api/admin/room-categories"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Create room category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof roomCategorySchema>) => {
      return await apiRequest("/api/admin/room-categories", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Category Created",
        description: "The room category has been created successfully",
        duration: 5000,
      });
      
      // Close the dialog and reset the form
      setShowCreateDialog(false);
      createForm.reset();
      
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/room-categories"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create room category",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
  
  // Update room category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof roomCategorySchema> }) => {
      return await apiRequest(`/api/admin/room-categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Category Updated",
        description: "The room category has been updated successfully",
        duration: 5000,
      });
      
      // Close the dialog and reset
      setShowEditDialog(false);
      setCategoryToEdit(null);
      
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/room-categories"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update room category",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
  
  // Delete room category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      return await apiRequest(`/api/admin/room-categories/${categoryId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Category Deleted",
        description: "The room category has been deleted successfully",
        duration: 5000,
      });
      
      // Close the dialog and reset
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
      
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/room-categories"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete room category",
        variant: "destructive",
        duration: 5000,
      });
      setShowDeleteDialog(false);
    },
  });
  
  // Handle form submissions
  const onCreateSubmit = (data: z.infer<typeof roomCategorySchema>) => {
    createCategoryMutation.mutate(data);
  };
  
  const onEditSubmit = (data: z.infer<typeof roomCategorySchema>) => {
    if (categoryToEdit) {
      updateCategoryMutation.mutate({ id: categoryToEdit.id, data });
    }
  };
  
  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.id);
    }
  };
  
  // Open edit dialog and populate form
  const openEditDialog = (category: RoomCategory) => {
    setCategoryToEdit(category);
    editForm.reset({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    });
    setShowEditDialog(true);
  };
  
  // Apply filters to the categories data
  const filteredCategories = Array.isArray(rawCategories) 
    ? rawCategories.filter((category: RoomCategory) => 
        searchQuery === "" || 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Button variant="link" onClick={() => navigate("/admin")}>Dashboard</Button>
            <ChevronRight className="h-4 w-4" />
            <Button variant="link" onClick={() => navigate("/admin/rooms")}>Rooms</Button>
            <ChevronRight className="h-4 w-4" />
            <span>Categories</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Room Categories</h1>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search categories..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No room categories found
              </div>
            ) : (
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
                  {filteredCategories.map((category: RoomCategory) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        {category.isActive ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/admin/rooms?filter=${category.name.toLowerCase()}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Rooms
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openEditDialog(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => {
                              setCategoryToDelete(category);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
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

        {/* Create Category Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Room Category</DialogTitle>
              <DialogDescription>
                Add a new room category to organize your rooms.
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-6">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Standard, Deluxe, Suite" {...field} />
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
                          placeholder="Describe this room category..." 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Make this category available for rooms
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
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createCategoryMutation.isPending}>
                    {createCategoryMutation.isPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Category
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Room Category</DialogTitle>
              <DialogDescription>
                Update the details of this room category.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Make this category available for rooms
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
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowEditDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateCategoryMutation.isPending}>
                    {updateCategoryMutation.isPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Update Category
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the "{categoryToDelete?.name}" category? This action cannot be undone.
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
                onClick={handleDeleteCategory}
                disabled={deleteCategoryMutation.isPending}
              >
                {deleteCategoryMutation.isPending ? "Deleting..." : "Delete Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}