import React, { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Pencil, Trash2, Plus, RefreshCw, Loader2, Filter, Search, Calendar, 
  LayoutGrid, List, ArrowUpDown, ArrowDown, ArrowUp, X, Check,
  AlertTriangle, Upload, Download, ChevronLeft, ChevronRight, MoreHorizontal, 
  Sparkles, Zap, Activity, AlertCircle, Archive, FileText, ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";

// Base form schema for categories
const baseCategorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

// Stats card component
interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

interface CategoryManagerProps {
  title: string;
  description: string;
  categoryType: "tour" | "hotel" | "room" | "package";
  apiEndpoint: string;
}

interface Category {
  id: number;
  name: string;
  description?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export function CategoryManager({ title, description, categoryType, apiEndpoint }: CategoryManagerProps) {
  // State for managing categories and UI
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [sortField, setSortField] = useState<"name" | "createdAt">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [detailCategoryId, setDetailCategoryId] = useState<number | null>(null);
  const [activeTabs, setActiveTabs] = useState("all");
  
  // Pagination settings
  const itemsPerPage = 5;
  
  const { toast } = useToast();
  
  // Form for adding new category
  const form = useForm<z.infer<typeof baseCategorySchema>>({
    resolver: zodResolver(baseCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      active: true,
    },
  });
  
  // Form for editing existing category
  const editForm = useForm<z.infer<typeof baseCategorySchema>>({
    resolver: zodResolver(baseCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      active: true,
    },
  });

  // Fetch categories function
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(apiEndpoint, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched categories:', data);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Error fetching categories');
      console.error('Error fetching categories:', err);
      toast({
        title: "Error",
        description: err.message || 'Error fetching categories',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [apiEndpoint]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortField, sortDirection]);

  // Create a new category
  const createCategory = async (values: z.infer<typeof baseCategorySchema>) => {
    try {
      setIsCreating(true);
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error(`Error creating category: ${response.statusText}`);
      }
      
      await fetchCategories();
      toast({
        title: "Success",
        description: "Category has been created successfully",
      });
      form.reset();
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error('Error creating category:', err);
      toast({
        title: "Error",
        description: err.message || 'Error creating category',
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Update an existing category
  const updateCategory = async (id: number, values: z.infer<typeof baseCategorySchema>) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating category: ${response.statusText}`);
      }
      
      await fetchCategories();
      toast({
        title: "Success",
        description: "Category has been updated successfully",
      });
      setEditingCategory(null);
      setIsEditDialogOpen(false);
    } catch (err: any) {
      console.error('Error updating category:', err);
      toast({
        title: "Error",
        description: err.message || 'Error updating category',
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete a category
  const deleteCategory = async (id: number) => {
    try {
      setDeletingIds((prev) => [...prev, id]);
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method: 'DELETE',
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting category: ${response.statusText}`);
      }
      
      await fetchCategories();
      toast({
        title: "Success",
        description: "Category has been deleted successfully",
      });
      // Remove from selected categories if it was selected
      setSelectedCategories((prev) => prev.filter((selectedId) => selectedId !== id));
    } catch (err: any) {
      console.error('Error deleting category:', err);
      toast({
        title: "Error",
        description: err.message || 'Error deleting category',
        variant: "destructive",
      });
    } finally {
      setDeletingIds((prev) => prev.filter((deletingId) => deletingId !== id));
    }
  };

  // Bulk delete categories
  const bulkDeleteCategories = async () => {
    try {
      setIsDeleting(true);
      let success = true;
      
      for (const id of selectedCategories) {
        const response = await fetch(`${apiEndpoint}/${id}`, {
          method: 'DELETE',
          credentials: "include",
        });
        
        if (!response.ok) {
          success = false;
        }
      }
      
      await fetchCategories();
      if (success) {
        toast({
          title: "Success",
          description: `${selectedCategories.length} categories have been deleted`,
        });
        setSelectedCategories([]);
      } else {
        toast({
          title: "Warning",
          description: "Some categories could not be deleted",
          variant: "destructive",
        });
      }
      setBulkActionOpen(false);
    } catch (err: any) {
      console.error('Error bulk deleting categories:', err);
      toast({
        title: "Error",
        description: err.message || 'Error deleting categories',
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk update categories status
  const bulkUpdateStatus = async (active: boolean) => {
    try {
      setIsUpdating(true);
      let success = true;
      
      for (const id of selectedCategories) {
        const category = categories.find(cat => cat.id === id);
        if (category) {
          const updatedCategory = {
            name: category.name,
            description: category.description,
            active: active,
          };
          
          const response = await fetch(`${apiEndpoint}/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(updatedCategory),
          });
          
          if (!response.ok) {
            success = false;
          }
        }
      }
      
      await fetchCategories();
      if (success) {
        toast({
          title: "Success",
          description: `${selectedCategories.length} categories have been updated`,
        });
      } else {
        toast({
          title: "Warning",
          description: "Some categories could not be updated",
          variant: "destructive",
        });
      }
      setBulkActionOpen(false);
    } catch (err: any) {
      console.error('Error bulk updating categories:', err);
      toast({
        title: "Error",
        description: err.message || 'Error updating categories',
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      setSelectedCategories([]);
    }
  };
  
  // Export categories to JSON
  const exportCategories = () => {
    try {
      // Create a filtered list based on current filters
      const dataToExport = filteredAndSortedCategories;
      
      // Convert to JSON string
      const jsonString = JSON.stringify(dataToExport, null, 2);
      
      // Create download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${categoryType}-categories-${format(new Date(), 'yyyy-MM-dd')}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Categories exported successfully",
      });
      
      setExportDialogOpen(false);
    } catch (err: any) {
      console.error('Error exporting categories:', err);
      toast({
        title: "Error",
        description: err.message || 'Error exporting categories',
        variant: "destructive",
      });
    }
  };
  
  // Handle form submission for new category
  const onSubmit = (values: z.infer<typeof baseCategorySchema>) => {
    createCategory(values);
  };
  
  // Handle form submission for editing category
  const onEditSubmit = (values: z.infer<typeof baseCategorySchema>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, values);
    }
  };
  
  // Open edit dialog with category data
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    editForm.reset({
      name: category.name,
      description: category.description || "",
      active: category.active,
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle deleting a category
  const handleDelete = (id: number) => {
    deleteCategory(id);
  };

  // Toggle select all categories
  const toggleSelectAll = () => {
    if (selectedCategories.length === filteredAndSortedCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredAndSortedCategories.map(cat => cat.id));
    }
  };

  // Handle select single category
  const toggleSelectCategory = (id: number) => {
    setSelectedCategories(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  // Toggle sort direction
  const toggleSort = (field: "name" | "createdAt") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    let result = [...categories];

    // Filter by active tab
    if (activeTabs === "active") {
      result = result.filter(category => category.active);
    } else if (activeTabs === "inactive") {
      result = result.filter(category => !category.active);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        category => 
          category.name.toLowerCase().includes(query) || 
          (category.description && category.description.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(category => 
        statusFilter === "active" ? category.active : !category.active
      );
    }

    // Sort by field
    result.sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

    return result;
  }, [categories, searchQuery, statusFilter, sortField, sortDirection, activeTabs]);

  // Pagination
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedCategories, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedCategories.length / itemsPerPage);

  // Get category by id (for detail view)
  const getDetailCategory = useMemo(() => {
    if (!detailCategoryId) return null;
    return categories.find(cat => cat.id === detailCategoryId) || null;
  }, [detailCategoryId, categories]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter(cat => cat.active).length;
    const inactive = total - active;
    
    // Get latest created category
    const latest = [...categories].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })[0];
    
    return { total, active, inactive, latest };
  }, [categories]);

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchCategories} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setExportDialogOpen(true)}>
                <Download className="h-4 w-4 mr-2" />
                Export Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
                {viewMode === "list" ? (
                  <>
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Switch to Grid View
                  </>
                ) : (
                  <>
                    <List className="h-4 w-4 mr-2" />
                    Switch to List View
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new {categoryType} category. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Category description (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Active</FormLabel>
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
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Total Categories" 
          value={stats.total.toString()} 
          description="All categories in the system"
          icon={<Activity className="h-6 w-6" />} 
        />
        <StatsCard 
          title="Active Categories" 
          value={stats.active.toString()} 
          description={`${Math.round((stats.active / stats.total) * 100) || 0}% of total`}
          icon={<Check className="h-6 w-6" />} 
        />
        <StatsCard 
          title="Inactive Categories" 
          value={stats.inactive.toString()} 
          description={`${Math.round((stats.inactive / stats.total) * 100) || 0}% of total`}
          icon={<AlertCircle className="h-6 w-6" />} 
        />
        <StatsCard 
          title="Latest Category" 
          value={stats.latest ? stats.latest.name : "None"} 
          description={stats.latest ? `Added ${format(new Date(stats.latest.createdAt), 'MMM d, yyyy')}` : ""}
          icon={<Sparkles className="h-6 w-6" />} 
        />
      </div>
      
      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          {selectedCategories.length > 0 && (
            <div className="flex items-center">
              <Badge variant="secondary" className="mr-2">
                {selectedCategories.length} selected
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setBulkActionOpen(true)}>
                Bulk Actions
              </Button>
            </div>
          )}
          
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 ${viewMode === "list" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 ${viewMode === "grid" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTabs} onValueChange={setActiveTabs} className="mb-6">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">{categories.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2">{stats.active}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive
            <Badge variant="secondary" className="ml-2">{stats.inactive}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Separator className="my-6" />
      
      {/* Categories List View */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>
            View, edit and manage all {categoryType} categories.
            {filteredAndSortedCategories.length > 0 && (
              <span className="ml-2">
                Showing {paginatedCategories.length} of {filteredAndSortedCategories.length} categories
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-10 w-[250px]" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-[100px]" />
                  <Skeleton className="h-10 w-[100px]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-6">
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <p className="mb-2">{error}</p>
              <Button variant="outline" onClick={fetchCategories}>
                Try Again
              </Button>
            </div>
          ) : filteredAndSortedCategories.length > 0 ? (
            <>
              {viewMode === "list" ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox 
                            checked={selectedCategories.length === filteredAndSortedCategories.length && filteredAndSortedCategories.length > 0} 
                            onCheckedChange={toggleSelectAll}
                            aria-label="Select all categories"
                          />
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                          <div className="flex items-center space-x-1">
                            <span>Name</span>
                            {sortField === "name" ? (
                              sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("createdAt")}>
                          <div className="flex items-center space-x-1">
                            <span>Created</span>
                            {sortField === "createdAt" ? (
                              sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCategories.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            No matching categories found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedCategories.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedCategories.includes(category.id)} 
                                onCheckedChange={() => toggleSelectCategory(category.id)}
                                aria-label={`Select ${category.name}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell className="max-w-xs truncate">{category.description || "-"}</TableCell>
                            <TableCell>
                              <Badge variant={category.active ? "default" : "secondary"} className="capitalize">
                                {category.active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>{format(new Date(category.createdAt), 'MMM d, yyyy')}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDetailCategoryId(category.id)}
                                >
                                  <FileText className="h-4 w-4" />
                                  <span className="sr-only">View Details</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(category)}
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-700"
                                      disabled={deletingIds.includes(category.id)}
                                    >
                                      {deletingIds.includes(category.id) ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the category "{category.name}". This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(category.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedCategories.map((category) => (
                    <Card key={category.id} className="overflow-hidden">
                      <CardHeader className="pb-2 pt-4">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center">
                            <Checkbox 
                              checked={selectedCategories.includes(category.id)} 
                              onCheckedChange={() => toggleSelectCategory(category.id)}
                              aria-label={`Select ${category.name}`}
                              className="mr-2"
                            />
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                          </div>
                          <Badge variant={category.active ? "default" : "secondary"} className="capitalize">
                            {category.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">
                          Created on {format(new Date(category.createdAt), 'MMM d, yyyy')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                          {category.description || "No description provided"}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 pb-4 flex justify-between">
                        <Button variant="ghost" size="sm" onClick={() => setDetailCategoryId(category.id)}>
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                disabled={deletingIds.includes(category.id)}
                              >
                                {deletingIds.includes(category.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <Trash2 className="h-4 w-4 mr-1" />
                                )}
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the category "{category.name}". This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(category.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-6 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-9"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <Archive className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="mb-4 text-muted-foreground">No categories found. Create your first category to get started.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  {/* Dialog content will be the same as the add dialog */}
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to the {categoryType} category. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Category name" {...field} />
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
                        <Textarea placeholder="Category description (optional)" {...field} />
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
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Dialog */}
      <AlertDialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bulk Actions</AlertDialogTitle>
            <AlertDialogDescription>
              Choose an action to perform on {selectedCategories.length} selected categories.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-4">
            <Button 
              variant="outline" 
              onClick={() => bulkUpdateStatus(true)}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
              Set Active
            </Button>
            <Button 
              variant="outline"
              onClick={() => bulkUpdateStatus(false)}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
              Set Inactive
            </Button>
            <Button 
              variant="destructive"
              onClick={bulkDeleteCategories}
              disabled={isDeleting}
              className="md:col-span-2"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete Selected
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Dialog */}
      <AlertDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export Categories</AlertDialogTitle>
            <AlertDialogDescription>
              This will export {filteredAndSortedCategories.length} categories to a JSON file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              The exported file will include all categories that match your current filters. The data will be exported in JSON format.
            </p>
            <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-auto max-h-[200px]">
              <pre>
                {JSON.stringify(filteredAndSortedCategories.slice(0, 2), null, 2)}
                {filteredAndSortedCategories.length > 2 && '\n...'}
              </pre>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={exportCategories}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category Detail Sheet */}
      <Sheet open={!!detailCategoryId} onOpenChange={(open) => !open && setDetailCategoryId(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Category Details</SheetTitle>
            <SheetDescription>
              Detailed information about this category.
            </SheetDescription>
          </SheetHeader>
          {getDetailCategory && (
            <ScrollArea className="h-[calc(100vh-200px)] pr-4 mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">{getDetailCategory.name}</h3>
                  <Badge variant={getDetailCategory.active ? "default" : "secondary"} className="mt-2">
                    {getDetailCategory.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {getDetailCategory.description || "No description provided."}
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">ID</div>
                    <div>{getDetailCategory.id}</div>
                    
                    <div className="text-muted-foreground">Created</div>
                    <div>{format(new Date(getDetailCategory.createdAt), 'PPP')}</div>
                    
                    <div className="text-muted-foreground">Last Updated</div>
                    <div>
                      {getDetailCategory.updatedAt 
                        ? format(new Date(getDetailCategory.updatedAt), 'PPP')
                        : "Never updated"}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Actions</h4>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        handleEdit(getDetailCategory);
                        setDetailCategoryId(null);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          disabled={deletingIds.includes(getDetailCategory.id)}
                        >
                          {deletingIds.includes(getDetailCategory.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the category "{getDetailCategory.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => {
                            handleDelete(getDetailCategory.id);
                            setDetailCategoryId(null);
                          }}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  {/* Example of additional data relations (placeholder) */}
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium mb-2">Associated Data</p>
                    <p className="text-xs text-muted-foreground">
                      This category has 0 related packages.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <SheetFooter className="mt-4">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Import Categories Dialog (Placeholder) */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import Categories</DialogTitle>
            <DialogDescription>
              Import categories from a JSON file.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                Drag and drop a JSON file or click to browse
              </p>
              <p className="text-xs text-muted-foreground/70">
                Supported format: JSON
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Browse Files
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2 font-medium">Import Guidelines:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>File must be valid JSON format</li>
                <li>Each category needs a name and active status</li>
                <li>Description is optional</li>
                <li>Maximum file size: 5MB</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}