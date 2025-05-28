import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Search, Edit, Trash2, Loader2, MapPin, GlobeIcon, AlertCircle } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { validateForm, validateRequiredFields } from "@/lib/validateForm";
import { FormRequiredFieldsNote, FormValidationAlert } from "@/components/dashboard/FormValidationAlert";

// Interfaces matching our schema
interface Destination {
  id: number;
  name: string;
  country: string;
  countryId: number;
  cityId: number;
  description?: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface Country {
  id: number;
  name: string;
  code: string;
}

interface City {
  id: number;
  name: string;
  countryId: number;
}

// Destination validation schema
const destinationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  country: z.string().min(2, { message: "Country must be at least 2 characters" }),
  countryId: z.number({ message: "Country ID is required" }),
  cityId: z.number({ message: "City ID is required" }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  featured: z.boolean().default(false),
});

type DestinationFormValues = z.infer<typeof destinationSchema>;

export default function DestinationsManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);

  // Query destinations
  const { data: destinations = [], isLoading: isLoadingDestinations } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });

  // Query countries
  const { data: countries = [] } = useQuery<Country[]>({
    queryKey: ['/api/admin/countries'],
  });

  // Query cities
  const { data: cities = [] } = useQuery<City[]>({
    queryKey: ['/api/admin/cities'],
  });

  // Filter destinations based on search
  const filteredDestinations = destinations.filter(
    destination => 
      destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get filtered cities based on selected country
  const filteredCities = cities.filter(
    city => selectedCountryId ? city.countryId === selectedCountryId : true
  );

  // Destination form
  const destinationForm = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      name: "",
      country: "",
      countryId: 0,
      cityId: 0,
      description: "",
      imageUrl: "",
      featured: false,
    },
  });

  // Create Destination Mutation
  const createDestinationMutation = useMutation({
    mutationFn: async (destination: DestinationFormValues) => {
      const response = await fetch('/api/admin/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destination),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create destination');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/destinations'] });
      setIsCreateDialogOpen(false);
      destinationForm.reset();
      toast({
        title: "Success",
        description: "Destination created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update Destination Mutation
  const updateDestinationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: DestinationFormValues }) => {
      const response = await fetch(`/api/admin/destinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update destination');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/destinations'] });
      setIsEditDialogOpen(false);
      setSelectedDestination(null);
      toast({
        title: "Success",
        description: "Destination updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete Destination Mutation
  const deleteDestinationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/destinations/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete destination');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/destinations'] });
      setDeleteConfirmOpen(false);
      setSelectedDestination(null);
      toast({
        title: "Success",
        description: "Destination deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submissions
  const onCreateSubmit = (values: DestinationFormValues) => {
    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ['name', 'countryId', 'cityId'],
      {
        name: 'Destination Name',
        countryId: 'Country',
        cityId: 'City'
      }
    );
    
    if (!requiredFieldsValid) return;
    
    // Additional validation for country and city selection
    const customValidationsValid = validateForm(values, [
      {
        condition: values.countryId === 0,
        errorMessage: {
          title: "Country Required",
          description: "Please select a country for this destination"
        },
        variant: "destructive"
      },
      {
        condition: values.cityId === 0,
        errorMessage: {
          title: "City Required",
          description: "Please select a city for this destination"
        },
        variant: "destructive"
      },
      {
        condition: !!values.imageUrl && !values.imageUrl.startsWith('http'),
        errorMessage: {
          title: "Invalid Image URL",
          description: "Please provide a valid URL starting with http:// or https://"
        },
        variant: "destructive"
      }
    ]);
    
    if (!customValidationsValid) return;
    
    // All validations passed, proceed with submission
    createDestinationMutation.mutate(values);
  };

  const onUpdateSubmit = (values: DestinationFormValues) => {
    if (!selectedDestination) {
      toast({
        title: "Update Error",
        description: "No destination selected for update",
        variant: "destructive",
      });
      return;
    }
    
    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ['name', 'countryId', 'cityId'],
      {
        name: 'Destination Name',
        countryId: 'Country',
        cityId: 'City'
      }
    );
    
    if (!requiredFieldsValid) return;
    
    // Additional validation for country and city selection
    const customValidationsValid = validateForm(values, [
      {
        condition: values.countryId === 0,
        errorMessage: {
          title: "Country Required",
          description: "Please select a country for this destination"
        },
        variant: "destructive"
      },
      {
        condition: values.cityId === 0,
        errorMessage: {
          title: "City Required",
          description: "Please select a city for this destination"
        },
        variant: "destructive"
      },
      {
        condition: !!values.imageUrl && !values.imageUrl.startsWith('http'),
        errorMessage: {
          title: "Invalid Image URL",
          description: "Please provide a valid URL starting with http:// or https://"
        },
        variant: "destructive"
      }
    ]);
    
    if (!customValidationsValid) return;
    
    // All validations passed, proceed with submission
    updateDestinationMutation.mutate({ 
      id: selectedDestination.id, 
      data: values 
    });
  };

  // Handle edit button click
  const handleEditClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setSelectedCountryId(destination.countryId);
    
    destinationForm.reset({
      name: destination.name,
      country: destination.country,
      countryId: destination.countryId,
      cityId: destination.cityId,
      description: destination.description || "",
      imageUrl: destination.imageUrl || "",
      featured: destination.featured,
    });
    
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setDeleteConfirmOpen(true);
  };

  // Handle country change
  const handleCountryChange = (countryId: number) => {
    setSelectedCountryId(countryId);
    const country = countries.find(c => c.id === countryId);
    
    if (country) {
      destinationForm.setValue("country", country.name);
      destinationForm.setValue("countryId", country.id);
      
      // Reset city selection
      destinationForm.setValue("cityId", 0);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Destinations Management</h2>
            <Button onClick={() => {
              destinationForm.reset();
              setSelectedCountryId(null);
              setIsCreateDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add Destination
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Destinations</CardTitle>
              <CardDescription>
                Manage destinations for your travel application. Destinations are linked to countries and cities.
              </CardDescription>
              <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
                <Input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" size="icon" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingDestinations ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : filteredDestinations.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No destinations found. Add a new destination to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Country
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          City
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Featured
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDestinations.map((destination) => {
                        const city = cities.find(c => c.id === destination.cityId);
                        return (
                          <tr key={destination.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {destination.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {destination.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {destination.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {city?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {destination.featured ? 'Yes' : 'No'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(destination)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(destination)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create Destination Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Destination</DialogTitle>
              <DialogDescription>
                Create a new destination for your travel application.
              </DialogDescription>
            </DialogHeader>
            <FormRequiredFieldsNote />
            {createDestinationMutation.isError && (
              <FormValidationAlert 
                status="error" 
                title="Failed to Create Destination" 
                message={createDestinationMutation.error?.message || "An error occurred while creating the destination."}
                className="mt-3" 
              />
            )}
            <Form {...destinationForm}>
              <form onSubmit={destinationForm.handleSubmit(onCreateSubmit)} className="space-y-6">
                <FormField
                  control={destinationForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter destination name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={destinationForm.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                          handleCountryChange(parseInt(value));
                        }}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.id} value={country.id.toString()}>
                              {country.name} ({country.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={destinationForm.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value.toString()}
                        disabled={!selectedCountryId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={selectedCountryId ? "Select a city" : "Select a country first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredCities.map((city) => (
                            <SelectItem key={city.id} value={city.id.toString()}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={destinationForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter destination description" 
                          {...field} 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={destinationForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter image URL" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a URL to an image for this destination
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={destinationForm.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Destination</FormLabel>
                        <FormDescription>
                          Featured destinations appear prominently on the home page
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
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createDestinationMutation.isPending}
                  >
                    {createDestinationMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Destination
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Destination Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Destination</DialogTitle>
              <DialogDescription>
                Update the details for this destination.
              </DialogDescription>
            </DialogHeader>
            <FormRequiredFieldsNote />
            {updateDestinationMutation.isError && (
              <FormValidationAlert 
                status="error" 
                title="Failed to Update Destination" 
                message={updateDestinationMutation.error?.message || "An error occurred while updating the destination."}
                className="mt-3" 
              />
            )}
            <Form {...destinationForm}>
              <form onSubmit={destinationForm.handleSubmit(onUpdateSubmit)} className="space-y-6">
                <FormField
                  control={destinationForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter destination name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={destinationForm.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                          handleCountryChange(parseInt(value));
                        }}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.id} value={country.id.toString()}>
                              {country.name} ({country.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={destinationForm.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value.toString()}
                        disabled={!selectedCountryId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={selectedCountryId ? "Select a city" : "Select a country first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredCities.map((city) => (
                            <SelectItem key={city.id} value={city.id.toString()}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={destinationForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter destination description" 
                          {...field} 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={destinationForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter image URL" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a URL to an image for this destination
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={destinationForm.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Destination</FormLabel>
                        <FormDescription>
                          Featured destinations appear prominently on the home page
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
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={updateDestinationMutation.isPending}
                  >
                    {updateDestinationMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Destination
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the destination
                "{selectedDestination?.name}" and remove it from your database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedDestination) {
                    deleteDestinationMutation.mutate(selectedDestination.id);
                  }
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteDestinationMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </DashboardLayout>
  );
}