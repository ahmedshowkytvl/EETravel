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

type TransportDuration = {
  id: number;
  name: string;
  hours: number;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
};

type TransportDurationFormValues = {
  name: string;
  hours: number;
  description: string;
  status: string;
};

const transportDurationSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required and must be at least 2 characters.",
  }),
  hours: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().min(0.5, { message: "Duration must be at least 0.5 hours." })
  ),
  description: z.string().optional(),
  status: z.string().default("active"),
});

export default function TransportDurationsManagement() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<TransportDuration | null>(null);
  
  const form = useForm<TransportDurationFormValues>({
    resolver: zodResolver(transportDurationSchema),
    defaultValues: {
      name: "",
      hours: 1,
      description: "",
      status: "active",
    },
  });
  
  const editForm = useForm<TransportDurationFormValues>({
    resolver: zodResolver(transportDurationSchema),
    defaultValues: {
      name: "",
      hours: 1,
      description: "",
      status: "active",
    },
  });
  
  const { data: transportDurations, isLoading } = useQuery({
    queryKey: ["/api/transport-durations"],
    queryFn: async () => {
      const response = await apiRequest<TransportDuration[]>("/api/transport-durations", {
        method: "GET",
      });
      return response;
    },
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: TransportDurationFormValues) => {
      const response = await apiRequest<TransportDuration>("/api/transport-durations", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transport duration created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transport-durations"] });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create transport duration",
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: TransportDurationFormValues) => {
      if (!selectedDuration) return null;
      
      const response = await apiRequest<TransportDuration>(`/api/transport-durations/${selectedDuration.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transport duration updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transport-durations"] });
      setIsEditModalOpen(false);
      setSelectedDuration(null);
      editForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update transport duration",
        variant: "destructive",
      });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest<{ success: boolean }>(`/api/transport-durations/${id}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transport duration deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transport-durations"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transport duration",
        variant: "destructive",
      });
    },
  });
  
  const handleCreateSubmit = (values: TransportDurationFormValues) => {
    createMutation.mutate(values);
  };
  
  const handleEditSubmit = (values: TransportDurationFormValues) => {
    updateMutation.mutate(values);
  };
  
  const handleEditClick = (item: TransportDuration) => {
    setSelectedDuration(item);
    editForm.reset({
      name: item.name,
      hours: item.hours,
      description: item.description || "",
      status: item.status,
    });
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (item: TransportDuration) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      deleteMutation.mutate(item.id);
    }
  };
  
  const columns: Column<TransportDuration>[] = [
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
      header: "Hours",
      accessorKey: "hours",
      cell: (item) => <span>{item.hours} {item.hours === 1 ? "hour" : "hours"}</span>,
      className: "w-[120px]",
    },
    {
      header: "Description",
      accessorKey: "description",
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
  
  // Calculate average duration
  const averageDuration = transportDurations && transportDurations.length > 0
    ? transportDurations.reduce((acc, item) => acc + item.hours, 0) / transportDurations.length
    : 0;
  
  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Transport Durations</h1>
          <p className="text-zinc-500">Manage duration options for transportation services.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Duration
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Durations</CardTitle>
            <CardDescription>All duration options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                transportDurations?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Durations</CardTitle>
            <CardDescription>Currently active options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                transportDurations?.filter(t => t.status === "active").length || 0
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Duration</CardTitle>
            <CardDescription>Average hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                transportDurations && transportDurations.length > 0 
                  ? (() => {
                      const activeItems = transportDurations.filter(t => t.status === "active");
                      if (activeItems.length === 0) return "0";
                      const avg = activeItems.reduce((acc, item) => acc + item.hours, 0) / activeItems.length;
                      return avg.toFixed(1);
                    })()
                  : "0"
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <DataTable
        data={transportDurations || []}
        columns={columns}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      
      {/* Create Modal */}
      <DataModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        title="Add Duration Option"
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
                <Input placeholder="Half Day, Full Day, Evening, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (Hours)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.5" 
                  min="0.5" 
                  placeholder="Enter duration in hours" 
                  {...field} 
                />
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
                <Textarea placeholder="Optional description of this duration option" {...field} />
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
        title="Edit Duration Option"
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
                <Input placeholder="Half Day, Full Day, Evening, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={editForm.control}
          name="hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (Hours)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.5" 
                  min="0.5" 
                  placeholder="Enter duration in hours" 
                  {...field} 
                />
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
                <Textarea placeholder="Optional description of this duration option" {...field} />
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