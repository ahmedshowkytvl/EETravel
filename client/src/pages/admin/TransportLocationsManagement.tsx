import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { DataModal } from "@/components/dashboard/DataModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Plus, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TransportLocation = {
  id: number;
  name: string;
  city: string;
  country: string;
  locationType: string;
  description: string | null;
  imageUrl: string | null;
  popular: boolean;
  latitude: number | null;
  longitude: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
};

type TransportLocationFormValues = {
  name: string;
  city: string;
  country: string;
  locationType: string;
  description: string;
  imageUrl: string;
  popular: boolean;
  latitude: number;
  longitude: number;
  status: string;
};

const transportLocationSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required and must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City is required and must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country is required and must be at least 2 characters.",
  }),
  locationType: z.string().min(2, {
    message: "Location type is required and must be at least 2 characters.",
  }),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  popular: z.boolean().default(false),
  latitude: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().optional()
  ),
  longitude: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().optional()
  ),
  status: z.string().optional(),
});

export default function TransportLocationsManagement() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<TransportLocation | null>(null);
  
  const form = useForm<TransportLocationFormValues>({
    resolver: zodResolver(transportLocationSchema),
    defaultValues: {
      name: "",
      city: "",
      country: "",
      locationType: "Airport",
      description: "",
      imageUrl: "",
      popular: false,
      latitude: 0,
      longitude: 0,
      status: "active",
    },
  });
  
  const editForm = useForm<TransportLocationFormValues>({
    resolver: zodResolver(transportLocationSchema),
    defaultValues: {
      name: "",
      city: "",
      country: "",
      locationType: "Airport",
      description: "",
      imageUrl: "",
      popular: false,
      latitude: 0,
      longitude: 0,
      status: "active",
    },
  });
  
  const { data: transportLocations, isLoading } = useQuery({
    queryKey: ["/api/transport-locations"],
    queryFn: async () => {
      const response = await apiRequest<TransportLocation[]>("/api/transport-locations", {
        method: "GET",
      });
      return response;
    },
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: TransportLocationFormValues) => {
      const response = await apiRequest<TransportLocation>("/api/transport-locations", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transport location created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transport-locations"] });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create transport location",
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: TransportLocationFormValues) => {
      if (!selectedLocation) return null;
      
      const response = await apiRequest<TransportLocation>(`/api/transport-locations/${selectedLocation.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transport location updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transport-locations"] });
      setIsEditModalOpen(false);
      setSelectedLocation(null);
      editForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update transport location",
        variant: "destructive",
      });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest<{ success: boolean }>(`/api/transport-locations/${id}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transport location deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transport-locations"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transport location",
        variant: "destructive",
      });
    },
  });
  
  const handleCreateSubmit = (values: TransportLocationFormValues) => {
    createMutation.mutate(values);
  };
  
  const handleEditSubmit = (values: TransportLocationFormValues) => {
    updateMutation.mutate(values);
  };
  
  const handleEditClick = (item: TransportLocation) => {
    setSelectedLocation(item);
    editForm.reset({
      name: item.name,
      city: item.city,
      country: item.country,
      locationType: item.locationType,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      popular: item.popular,
      latitude: item.latitude || 0,
      longitude: item.longitude || 0,
      status: item.status,
    });
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (item: TransportLocation) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      deleteMutation.mutate(item.id);
    }
  };
  
  const columns: Column<TransportLocation>[] = [
    {
      header: "ID",
      accessorKey: "id",
      className: "w-[80px]",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "City",
      accessorKey: "city",
    },
    {
      header: "Country",
      accessorKey: "country",
    },
    {
      header: "Type",
      accessorKey: "locationType",
    },
    {
      header: "Popular",
      accessorKey: "popular",
      cell: (item) => (
        <Badge variant={item.popular ? "default" : "secondary"}>
          {item.popular ? "Yes" : "No"}
        </Badge>
      ),
      className: "w-[100px]",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => (
        <Badge variant={item.status === "active" ? "default" : "secondary"}>
          {item.status}
        </Badge>
      ),
      className: "w-[100px]",
    },
  ];
  
  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Transport Locations</h1>
          <p className="text-zinc-500">Manage pickup and dropoff locations for transportation services.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Locations</CardTitle>
            <CardDescription>All transport locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                transportLocations?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Locations</CardTitle>
            <CardDescription>Currently active locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                transportLocations?.filter(t => t.status === "active").length || 0
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Popular Locations</CardTitle>
            <CardDescription>Highlighted popular locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                transportLocations?.filter(t => t.popular).length || 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <DataTable
        data={transportLocations || []}
        columns={columns}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      
      {/* Create Modal */}
      <DataModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        title="Add Transport Location"
        form={form}
        onSubmit={handleCreateSubmit}
        isSubmitting={createMutation.isPending}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Cairo International Airport, Giza Pyramids, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Cairo, Alexandria, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Egypt, Saudi Arabia, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="locationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Type</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Airport">Airport</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Landmark">Landmark</SelectItem>
                  <SelectItem value="Marina">Marina</SelectItem>
                  <SelectItem value="Port">Port</SelectItem>
                  <SelectItem value="Station">Train/Bus Station</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
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
                <Textarea placeholder="Brief description of this location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
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
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="popular"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Popular Location</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === "true")}
                  defaultValue={field.value ? "true" : "false"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Is this a popular location?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </DataModal>
      
      {/* Edit Modal */}
      <DataModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        title="Edit Transport Location"
        form={editForm}
        onSubmit={handleEditSubmit}
        isSubmitting={updateMutation.isPending}
      >
        <FormField
          control={editForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Cairo International Airport, Giza Pyramids, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={editForm.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Cairo, Alexandria, etc." {...field} />
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
                  <Input placeholder="Egypt, Saudi Arabia, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={editForm.control}
          name="locationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Type</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Airport">Airport</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Landmark">Landmark</SelectItem>
                  <SelectItem value="Marina">Marina</SelectItem>
                  <SelectItem value="Port">Port</SelectItem>
                  <SelectItem value="Station">Train/Bus Station</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
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
                <Textarea placeholder="Brief description of this location" {...field} />
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
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={editForm.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={editForm.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={editForm.control}
            name="popular"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Popular Location</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === "true")}
                  defaultValue={field.value ? "true" : "false"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Is this a popular location?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </DataModal>
    </DashboardLayout>
  );
}