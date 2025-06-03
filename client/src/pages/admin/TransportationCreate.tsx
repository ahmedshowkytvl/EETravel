import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

// Type definitions
type TransportType = {
  id: number;
  name: string;
  type?: string;
};

type TransportLocation = {
  id: number;
  name: string;
  city: string;
  type?: string;
};

type TransportDuration = {
  id: number;
  name: string;
  hours: number;
};

type Destination = {
  id: number;
  name: string;
};

type TransportationFormValues = {
  name: string;
  description: string;
  typeId: number;
  destinationId: number | null;
  fromLocationId: number | null;
  toLocationId: number | null;
  durationId: number | null;
  passengerCapacity: number;
  baggageCapacity: number;
  price: number;
  discountedPrice: number | null;
  imageUrl: string;
  features: string;
  withDriver: boolean;
  available: boolean;
  pickupIncluded: boolean;
  featured: boolean;
  status: string;
};

// Form validation schema
const transportationSchema = z.object({
  name: z.string().min(3, { message: "Name is required and must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description is required and must be at least 10 characters" }),
  typeId: z.coerce.number().min(1, { message: "Please select a vehicle type" }),
  destinationId: z.coerce.number().nullable(),
  fromLocationId: z.coerce.number().nullable(),
  toLocationId: z.coerce.number().nullable(),
  durationId: z.coerce.number().nullable(),
  passengerCapacity: z.coerce.number().min(1, { message: "Passenger capacity must be at least 1" }),
  baggageCapacity: z.coerce.number().min(0, { message: "Baggage capacity cannot be negative" }),
  price: z.coerce.number().min(0, { message: "Price cannot be negative" }),
  discountedPrice: z.coerce.number().nullable(),
  imageUrl: z.string().optional(),
  features: z.string().optional(),
  withDriver: z.boolean().default(true),
  available: z.boolean().default(true),
  pickupIncluded: z.boolean().default(true),
  featured: z.boolean().default(false),
  status: z.string().default("active"),
});

export default function TransportationCreate() {
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();
  
  const form = useForm<TransportationFormValues>({
    resolver: zodResolver(transportationSchema),
    defaultValues: {
      name: "",
      description: "",
      typeId: 0,
      destinationId: null,
      fromLocationId: null,
      toLocationId: null,
      durationId: null,
      passengerCapacity: 1,
      baggageCapacity: 1,
      price: 0,
      discountedPrice: null,
      imageUrl: "",
      features: "",
      withDriver: true,
      available: true,
      pickupIncluded: true,
      featured: false,
      status: "active",
    },
  });
  
  // Query types for select dropdown
  const { data: transportTypes } = useQuery({
    queryKey: ["/api/transport-types"],
    queryFn: async () => {
      const response = await apiRequest<TransportType[]>("/api/transport-types", {
        method: "GET",
      });
      return response;
    },
  });
  
  // Query locations for select dropdown
  const { data: transportLocations } = useQuery({
    queryKey: ["/api/transport-locations"],
    queryFn: async () => {
      const response = await apiRequest<TransportLocation[]>("/api/transport-locations", {
        method: "GET",
      });
      return response;
    },
  });
  
  // Query durations for select dropdown
  const { data: transportDurations } = useQuery({
    queryKey: ["/api/transport-durations"],
    queryFn: async () => {
      const response = await apiRequest<TransportDuration[]>("/api/transport-durations", {
        method: "GET",
      });
      return response;
    },
  });
  
  // Query destinations for select dropdown
  const { data: destinations } = useQuery({
    queryKey: ["/api/destinations"],
    queryFn: async () => {
      const response = await apiRequest<Destination[]>("/api/destinations", {
        method: "GET",
      });
      return response;
    },
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: TransportationFormValues) => {
      const response = await apiRequest("/api/admin/transportation", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response;
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/transportation"] });
      toast({
        title: "Success",
        description: "Transportation option created successfully",
      });
      setLocation("/admin/transportation");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create transportation option",
        variant: "destructive",
      });
    },
  });
  
  const handleCreateSubmit = (data: TransportationFormValues) => {
    createMutation.mutate(data);
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Add Transportation</h1>
          <p className="text-zinc-500">Create a new transportation option for your destinations.</p>
        </div>
        <Button variant="outline" onClick={() => setLocation("/admin/transportation")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for this transportation option</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Luxury SUV Transfer, Airport Shuttle, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="typeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a vehicle type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transportTypes?.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of this transportation option" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Location & Duration</CardTitle>
              <CardDescription>Specify pickup, dropoff and duration details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fromLocationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Location</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pickup location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transportLocations?.map((location) => (
                            <SelectItem key={location.id} value={location.id.toString()}>
                              {location.name}, {location.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="toLocationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dropoff Location</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dropoff location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transportLocations?.map((location) => (
                            <SelectItem key={location.id} value={location.id.toString()}>
                              {location.name}, {location.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="durationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transportDurations?.map((duration) => (
                            <SelectItem key={duration.id} value={duration.id.toString()}>
                              {duration.name} ({duration.hours} hours)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destinationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Associated Destination</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          {destinations?.map((destination) => (
                            <SelectItem key={destination.id} value={destination.id.toString()}>
                              {destination.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Capacity & Pricing</CardTitle>
              <CardDescription>Set capacity and pricing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Price</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discounted Price (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          placeholder="Leave blank for no discount"
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : Number(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>Set additional details and features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features ({transportTypes?.find(t => t.id === form.watch('typeId'))?.name || 'Select vehicle type above'})</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter features separated by commas (e.g., Air Conditioning, Wi-Fi, Water Bottles)" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="withDriver"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">With Driver</FormLabel>
                        <FormDescription>
                          Does this transportation option include a driver?
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
                
                <FormField
                  control={form.control}
                  name="pickupIncluded"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Pickup Included</FormLabel>
                        <FormDescription>
                          Is pickup included in the price?
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Available</FormLabel>
                        <FormDescription>
                          Is this transportation option available for booking?
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
                
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured</FormLabel>
                        <FormDescription>
                          Show this option as featured on the website?
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
              </div>
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={createMutation.isPending} className="w-full md:w-auto">
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Transportation
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </DashboardLayout>
  );
}