import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

// Optimized package form schema
const optimizedPackageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  shortDescription: z.string().min(10, "Description must be at least 10 characters"),
  countryId: z.number().min(1, "Country is required"),
  cityId: z.number().min(1, "City is required"),
  categoryId: z.number().min(1, "Category is required"),
  overview: z.string().min(10, "Overview must be at least 10 characters"),
  basePrice: z.number().min(1, "Base price must be greater than 0"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

type OptimizedPackageFormValues = z.infer<typeof optimizedPackageSchema>;

interface OptimizedPackageFormProps {
  packageId?: string;
}

export function OptimizedPackageForm({ packageId }: OptimizedPackageFormProps) {
  const [allowFormSubmission, setAllowFormSubmission] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Optimized form initialization
  const form = useForm<OptimizedPackageFormValues>({
    resolver: zodResolver(optimizedPackageSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      countryId: 0,
      cityId: 0,
      categoryId: 0,
      overview: "",
      basePrice: 0,
      startDate: "",
      endDate: "",
    },
  });

  // Cached data queries with performance optimizations
  const { data: countries = [] } = useQuery<any[]>({
    queryKey: ['/api/countries'],
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
  });

  const { data: cities = [] } = useQuery<any[]>({
    queryKey: ['/api/cities'],
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ['/api/package-categories'],
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Memoized filtered cities to prevent recalculation
  const filteredCities = useMemo(() => {
    const countryId = form.watch("countryId");
    if (!countryId) return [];
    return cities.filter(city => city.countryId === countryId);
  }, [cities, form.watch("countryId")]);

  // Optimized validation function
  const validateForm = useCallback(() => {
    const formData = form.getValues();
    const errors: string[] = [];

    if (!formData.name?.trim()) errors.push("Package name");
    if (!formData.shortDescription?.trim() || formData.shortDescription.length < 10) errors.push("Description");
    if (!formData.countryId || formData.countryId === 0) errors.push("Country");
    if (!formData.cityId || formData.cityId === 0) errors.push("City");
    if (!formData.categoryId || formData.categoryId === 0) errors.push("Category");
    if (!formData.overview?.trim() || formData.overview.length < 10) errors.push("Overview");
    if (!formData.basePrice || formData.basePrice <= 0) errors.push("Base price");
    if (!formData.startDate) errors.push("Start date");
    if (!formData.endDate) errors.push("End date");

    return errors;
  }, [form]);

  // Optimized submission mutation
  const packageMutation = useMutation({
    mutationFn: async (formData: OptimizedPackageFormValues) => {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save package');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Package saved successfully",
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

  // Optimized submission handler
  const onSubmit = useCallback((data: OptimizedPackageFormValues) => {
    if (!allowFormSubmission) {
      console.log("Form submission blocked - manual trigger required");
      return;
    }

    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: `Missing required fields: ${errors.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    packageMutation.mutate(data);
    setAllowFormSubmission(false);
  }, [allowFormSubmission, validateForm, packageMutation]);

  // Manual save trigger
  const handleManualSave = useCallback(() => {
    setAllowFormSubmission(true);
    setTimeout(() => {
      form.handleSubmit(onSubmit)();
    }, 100);
  }, [form, onSubmit]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {packageId ? "Edit Package" : "Create New Package"}
        </h1>
        <Button 
          onClick={handleManualSave}
          disabled={packageMutation.isPending}
          className="bg-primary text-primary-foreground"
        >
          {packageMutation.isPending ? "Saving..." : "Save Package"}
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Package Name</label>
                <input
                  {...form.register("name")}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter package name"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <select
                  {...form.register("countryId", { valueAsNumber: true })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={0}>Select Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <select
                  {...form.register("cityId", { valueAsNumber: true })}
                  className="w-full p-2 border rounded-md"
                  disabled={!form.watch("countryId")}
                >
                  <option value={0}>Select City</option>
                  {filteredCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  {...form.register("categoryId", { valueAsNumber: true })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={0}>Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Short Description</label>
              <textarea
                {...form.register("shortDescription")}
                className="w-full p-2 border rounded-md h-24"
                placeholder="Enter short description (min 10 characters)"
              />
              {form.formState.errors.shortDescription && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.shortDescription.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Overview</label>
              <textarea
                {...form.register("overview")}
                className="w-full p-2 border rounded-md h-32"
                placeholder="Enter detailed overview (min 10 characters)"
              />
              {form.formState.errors.overview && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.overview.message}</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Base Price</label>
                <input
                  type="number"
                  {...form.register("basePrice", { valueAsNumber: true })}
                  className="w-full p-2 border rounded-md"
                  placeholder="0"
                  min="1"
                />
                {form.formState.errors.basePrice && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.basePrice.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  {...form.register("startDate")}
                  className="w-full p-2 border rounded-md"
                />
                {form.formState.errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  {...form.register("endDate")}
                  className="w-full p-2 border rounded-md"
                />
                {form.formState.errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.endDate.message}</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Additional details coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}

export default OptimizedPackageForm;