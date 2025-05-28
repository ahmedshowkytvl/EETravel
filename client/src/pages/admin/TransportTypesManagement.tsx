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

type TransportType = {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  passengerCapacity: number;
  baggageCapacity: number;
  defaultFeatures: string[] | null;
  status: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

type TransportTypeFormValues = {
  name: string;
  description: string;
  imageUrl: string;
  passengerCapacity: number;
  baggageCapacity: number;
  defaultFeatures: string;
  status: string;
};

const transportTypeSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required and must be at least 2 characters.",
  }),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  passengerCapacity: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().min(1, { message: "Passenger capacity must be at least 1." })
  ),
  baggageCapacity: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().min(0, { message: "Baggage capacity must be a positive number." })
  ),
  defaultFeatures: z.string().optional(),
  status: z.string().optional(),
});

export default function TransportTypesManagement() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<TransportType | null>(null);
  
  const form = useForm<TransportTypeFormValues>({
    resolver: zodResolver(transportTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      passengerCapacity: 1,
      baggageCapacity: 1,
      defaultFeatures: "",
      status: "active",
    },
  });
  
  const editForm = useForm<TransportTypeFormValues>({
    resolver: zodResolver(transportTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      passengerCapacity: 1,
      baggageCapacity: 1,
      defaultFeatures: "",
      status: "active",
    },
  });
  
  const { data: transportTypes, isLoading } = useQuery({
    queryKey: ["/api/transport-types"],
    queryFn: async () => {
      const response = await apiRequest<TransportType[]>("/api/transport-types", {
        method: "GET",
      });
      return response;
    },
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: TransportTypeFormValues) => {
      // Process the features array
      const processedData = {
        ...data,
        defaultFeatures: data.defaultFeatures ? data.defaultFeatures.split(",").map(f => f.trim()) : [],
      };
      
      const response = await apiRequest<TransportType>("/api/transport-types", {
        method: "POST",
        body: JSON.stringify(processedData),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Vehicle type created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transport-types"] });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create vehicle type",
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: TransportTypeFormValues) => {
      if (!selectedType) return null;
      
      // Process the features array
      const processedData = {
        ...data,
        defaultFeatures: data.defaultFeatures ? data.defaultFeatures.split(",").map(f => f.trim()) : [],
      };
      
      const response = await apiRequest<TransportType>(`/api/transport-types/${selectedType.id}`, {
        method: "PATCH",
        body: JSON.stringify(processedData),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Vehicle type updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transport-types"] });
      setIsEditModalOpen(false);
      setSelectedType(null);
      editForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update vehicle type",
        variant: "destructive",
      });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest<{ success: boolean }>(`/api/transport-types/${id}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Vehicle type deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transport-types"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete vehicle type",
        variant: "destructive",
      });
    },
  });
  
  const handleCreateSubmit = (values: TransportTypeFormValues) => {
    createMutation.mutate(values);
  };
  
  const handleEditSubmit = (values: TransportTypeFormValues) => {
    updateMutation.mutate(values);
  };
  
  const handleEditClick = (item: TransportType) => {
    setSelectedType(item);
    editForm.reset({
      name: item.name,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      passengerCapacity: item.passengerCapacity,
      baggageCapacity: item.baggageCapacity,
      defaultFeatures: item.defaultFeatures ? item.defaultFeatures.join(", ") : "",
      status: item.status || "active",
    });
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (item: TransportType) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      deleteMutation.mutate(item.id);
    }
  };
  
  const columns: Column<TransportType>[] = [
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
      header: "Passenger Capacity",
      accessorKey: "passengerCapacity",
      className: "w-[150px]",
    },
    {
      header: "Baggage Capacity",
      accessorKey: "baggageCapacity",
      className: "w-[150px]",
    },
    {
      header: "Features",
      accessorKey: "defaultFeatures",
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.defaultFeatures ? 
            item.defaultFeatures.map((feature, index) => (
              <Badge key={index} variant="outline">{feature}</Badge>
            )) : 
            <span className="text-gray-400">-</span>
          }
        </div>
      ),
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
          <h1 className="text-2xl font-bold mb-1">Vehicle Types</h1>
          <p className="text-zinc-500">Manage vehicle types for transportation services.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle Type
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Types</CardTitle>
            <CardDescription>All vehicle types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                transportTypes?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Types</CardTitle>
            <CardDescription>Currently active types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                transportTypes?.filter(t => t.status === "active").length || 0
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Capacity</CardTitle>
            <CardDescription>Average passenger capacity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                transportTypes && transportTypes.length > 0 
                  ? (() => {
                      const activeTypes = transportTypes.filter(t => t.status === "active");
                      return activeTypes.length > 0
                        ? Math.round(activeTypes.reduce((acc, type) => acc + type.passengerCapacity, 0) / activeTypes.length)
                        : 0;
                    })()
                  : 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <DataTable
        data={transportTypes || []}
        columns={columns}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      
      {/* Create Modal */}
      <DataModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        title="Add Vehicle Type"
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
                <Input placeholder="SUV, Sedan, Bus, etc." {...field} />
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
                <Textarea placeholder="Description of the vehicle type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="passengerCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passenger Capacity</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="baggageCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Baggage Capacity</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="defaultFeatures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Features</FormLabel>
              <FormControl>
                <Input placeholder="AC, WiFi, USB Ports (comma separated)" {...field} />
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
      </DataModal>
      
      {/* Edit Modal */}
      <DataModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        title="Edit Vehicle Type"
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
                <Input placeholder="SUV, Sedan, Bus, etc." {...field} />
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
                <Textarea placeholder="Description of the vehicle type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={editForm.control}
            name="passengerCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passenger Capacity</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={editForm.control}
            name="baggageCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Baggage Capacity</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={editForm.control}
          name="defaultFeatures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Features</FormLabel>
              <FormControl>
                <Input placeholder="AC, WiFi, USB Ports (comma separated)" {...field} />
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
      </DataModal>
    </DashboardLayout>
  );
}