import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
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

// Zod schema for tour validation
const tourSchema = z.object({
  name: z.string().min(1, "Tour name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 day"),
  maxGroupSize: z.coerce.number().min(1, "Max group size must be at least 1"),
  difficulty: z.enum(["Easy", "Moderate", "Hard"]),
  categoryId: z.coerce.number().min(1, "Category is required"),
  locationId: z.coerce.number().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean().default(true),
  includes: z.string().optional(),
  excludes: z.string().optional(),
  highlights: z.string().optional(),
  itinerary: z.string().optional(),
  gallery: z.array(z.string()).default([]),
});

type TourFormValues = z.infer<typeof tourSchema>;
type TourFormInput = z.input<typeof tourSchema>;

export default function ToursManagement() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "updatedAt" | "createdAt">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isArabicDialogOpen, setIsArabicDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  const [deletingTour, setDeletingTour] = useState<any>(null);
  const [arabicTour, setArabicTour] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  // Fetch tours
  const {
    data: tours = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/tours"],
  });

  // Fetch tour categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/tour-categories"],
  });

  // Fetch locations
  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  // Create tour mutation
  const createTourMutation = useMutation({
    mutationFn: async (data: TourFormValues) => {
      const response = await apiRequest("/api/tours", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      toast({
        title: "Success",
        description: "Tour created successfully",
      });
      setIsCreateDialogOpen(false);
      createForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create tour",
        variant: "destructive",
      });
    },
  });

  // Update tour mutation
  const updateTourMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TourFormValues }) => {
      const response = await apiRequest(`/api/tours/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      toast({
        title: "Success",
        description: "Tour updated successfully",
      });
      setIsEditDialogOpen(false);
      editForm.reset();
      setEditingTour(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update tour",
        variant: "destructive",
      });
    },
  });

  // Delete tour mutation
  const deleteTourMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/tours/${id}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      toast({
        title: "Success",
        description: "Tour deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setDeletingTour(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete tour",
        variant: "destructive",
      });
    },
  });

  // Forms
  const createForm = useForm<TourFormInput>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 1,
      maxGroupSize: 1,
      difficulty: "Easy",
      categoryId: 0,
      locationId: 0,
      startDate: "",
      endDate: "",
      isActive: true,
      includes: "",
      excludes: "",
      highlights: "",
      itinerary: "",
      gallery: [],
    },
  });

  const editForm = useForm<TourFormInput>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 1,
      maxGroupSize: 1,
      difficulty: "Easy",
      categoryId: 0,
      locationId: 0,
      startDate: "",
      endDate: "",
      isActive: true,
      includes: "",
      excludes: "",
      highlights: "",
      itinerary: "",
      gallery: [],
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
      setEditingTour(null);
    }
  };

  const onDeleteDialogOpenChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setDeletingTour(null);
    }
  };

  // Form handlers
  const onCreateSubmit = (data: TourFormInput) => {
    createTourMutation.mutate(data as TourFormValues);
  };

  const onEditSubmit = (data: TourFormInput) => {
    if (editingTour) {
      updateTourMutation.mutate({
        id: editingTour.id,
        data: data as TourFormValues,
      });
    }
  };

  // Helper functions
  function getQuery(url: string) {
    const urlObj = new URL(url, window.location.origin);
    return Object.fromEntries(urlObj.searchParams.entries());
  }

  // Event handlers
  const handleEdit = (tour: any) => {
    setEditingTour(tour);
    editForm.reset({
      name: tour.name || "",
      description: tour.description || "",
      price: tour.price || 0,
      duration: tour.duration || 1,
      maxGroupSize: tour.maxGroupSize || 1,
      difficulty: tour.difficulty || "Easy",
      categoryId: tour.categoryId || 0,
      locationId: tour.locationId || 0,
      startDate: tour.startDate ? format(parseISO(tour.startDate), "yyyy-MM-dd") : "",
      endDate: tour.endDate ? format(parseISO(tour.endDate), "yyyy-MM-dd") : "",
      isActive: tour.isActive ?? true,
      includes: tour.includes || "",
      excludes: tour.excludes || "",
      highlights: tour.highlights || "",
      itinerary: tour.itinerary || "",
      gallery: tour.gallery || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (tour: any) => {
    setDeletingTour(tour);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingTour) {
      deleteTourMutation.mutate(deletingTour.id);
    }
  };

  const handleCreateArabicVersion = (tour: any) => {
    setArabicTour(tour);
    setIsArabicDialogOpen(true);
  };

  const handleEditArabicVersion = (tour: any) => {
    setArabicTour(tour);
    setIsArabicDialogOpen(true);
  };

  // Filter and sort tours
  const filteredTours = (tours as any[]).filter((tour: any) => {
    const matchesSearch = tour.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tour.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tour.categoryId?.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTours = [...filteredTours].sort((a: any, b: any) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "updatedAt" || sortBy === "createdAt") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue?.toLowerCase() || "";
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading tours</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.tours.title', 'Tour Management')}</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('admin.tours.searchPlaceholder', 'Search tours...')}
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
                <SelectValue placeholder={t('admin.tours.sortBy', 'Sort by')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t('admin.tours.sortByName', 'Name')}</SelectItem>
                <SelectItem value="updatedAt">{t('admin.tours.sortByUpdated', 'Last Updated')}</SelectItem>
                <SelectItem value="createdAt">{t('admin.tours.sortByCreated', 'Date Created')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <ArrowUpDown className="h-4 w-4" /> : <ArrowDownUp className="h-4 w-4" />}
            </Button>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {(categories as any[]).map((category: any) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => setLocation("/admin/tours/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tours ({sortedTours.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedTours.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tours found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Max Group</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTours.map((tour: any) => (
                    <TableRow key={tour.id}>
                      <TableCell className="font-medium">{tour.name}</TableCell>
                      <TableCell>
                        {(categories as any[]).find((cat: any) => cat.id === tour.categoryId)?.name || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {(locations as any[]).find((loc: any) => loc.id === tour.locationId)?.name || "Unknown"}
                      </TableCell>
                      <TableCell>${tour.price}</TableCell>
                      <TableCell>{tour.duration} days</TableCell>
                      <TableCell>{tour.maxGroupSize}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tour.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {tour.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(tour)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {!tour.hasArabicVersion && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCreateArabicVersion(tour)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {t('admin.tours.createArabicVersion', 'Arabic')}
                            </Button>
                          )}
                          {tour.hasArabicVersion && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditArabicVersion(tour)}
                              className="text-green-600 hover:text-green-700"
                            >
                              {t('admin.tours.editArabicVersion', 'Edit Arabic')}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(tour)}
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
                    <FormLabel>Tour Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tour name" {...field} />
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
                      <Textarea placeholder="Enter tour description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (days)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="maxGroupSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Group Size</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(categories as any[]).map((category: any) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
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
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(locations as any[]).map((location: any) => (
                            <SelectItem key={location.id} value={location.id.toString()}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Make this tour available for booking
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
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTourMutation.isPending}>
                  {updateTourMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Tour
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Arabic Version Dialog */}
      <Dialog open={isArabicDialogOpen} onOpenChange={setIsArabicDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {arabicTour?.hasArabicVersion 
                ? t('admin.tours.editArabicVersion', 'تحرير النسخة العربية')
                : t('admin.tours.createArabicVersion', 'إنشاء النسخة العربية')
              }
            </DialogTitle>
            <DialogDescription>
              {t('admin.tours.arabicVersionDescription', 'أضف أو حرر المحتوى العربي للجولة')}
            </DialogDescription>
          </DialogHeader>
          <ArabicVersionForm 
            tour={arabicTour} 
            onClose={() => setIsArabicDialogOpen(false)}
            onSuccess={() => {
              setIsArabicDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Tour Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tour</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingTour?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteTourMutation.isPending}>
              {deleteTourMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Arabic Version Form Component
interface ArabicVersionFormProps {
  tour: any;
  onClose: () => void;
  onSuccess: () => void;
}

function ArabicVersionForm({ tour, onClose, onSuccess }: ArabicVersionFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const arabicSchema = z.object({
    nameAr: z.string().min(1, "الاسم العربي مطلوب"),
    descriptionAr: z.string().min(1, "الوصف العربي مطلوب"),
    itineraryAr: z.string().optional(),
    includedAr: z.string().optional(),
    excludedAr: z.string().optional(),
  });

  const form = useForm<z.infer<typeof arabicSchema>>({
    resolver: zodResolver(arabicSchema),
    defaultValues: {
      nameAr: tour?.nameAr || "",
      descriptionAr: tour?.descriptionAr || "",
      itineraryAr: tour?.itineraryAr || "",
      includedAr: tour?.includedAr ? JSON.stringify(tour.includedAr, null, 2) : "",
      excludedAr: tour?.excludedAr ? JSON.stringify(tour.excludedAr, null, 2) : "",
    },
  });

  const updateArabicMutation = useMutation({
    mutationFn: async (data: z.infer<typeof arabicSchema>) => {
      const payload = {
        ...data,
        includedAr: data.includedAr ? JSON.parse(data.includedAr) : null,
        excludedAr: data.excludedAr ? JSON.parse(data.excludedAr) : null,
        hasArabicVersion: true,
      };
      
      return await apiRequest(`/api/tours/${tour.id}/arabic`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      toast({
        title: t('admin.tours.arabicVersionSaved', 'تم حفظ النسخة العربية'),
        description: t('admin.tours.arabicVersionSavedDesc', 'تم حفظ النسخة العربية بنجاح'),
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: t('admin.tours.arabicVersionError', 'خطأ في حفظ النسخة العربية'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof arabicSchema>) => {
    updateArabicMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nameAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.tours.nameAr', 'الاسم (عربي)')}</FormLabel>
              <FormControl>
                <Input {...field} dir="rtl" placeholder="أدخل اسم الجولة بالعربية" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descriptionAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.tours.descriptionAr', 'الوصف (عربي)')}</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  dir="rtl" 
                  placeholder="أدخل وصف الجولة بالعربية"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="itineraryAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.tours.itineraryAr', 'برنامج الرحلة (عربي)')}</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  dir="rtl" 
                  placeholder="أدخل برنامج الرحلة بالعربية"
                  rows={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="includedAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.tours.includedAr', 'المشمولات (عربي)')}</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  dir="rtl" 
                  placeholder='["عنصر 1", "عنصر 2", "عنصر 3"]'
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                {t('admin.tours.includedArDesc', 'أدخل المشمولات كقائمة JSON بالعربية')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excludedAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.tours.excludedAr', 'غير المشمولات (عربي)')}</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  dir="rtl" 
                  placeholder='["عنصر 1", "عنصر 2", "عنصر 3"]'
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                {t('admin.tours.excludedArDesc', 'أدخل غير المشمولات كقائمة JSON بالعربية')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('admin.tours.cancel', 'إلغاء')}
          </Button>
          <Button type="submit" disabled={updateArabicMutation.isPending}>
            {updateArabicMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('admin.tours.saveArabicVersion', 'حفظ النسخة العربية')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}