import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileCheck, Plus, Trash2, Edit, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";

// Define schemas for visa management
const createVisaSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  targetCountryId: z.number({ required_error: "Country is required" }),
  price: z.number().optional(),
  processingTime: z.string().optional(),
  requiredDocuments: z.array(z.string()).optional(),
  validityPeriod: z.string().optional(),
  entryType: z.string().optional(),
  active: z.boolean().default(true),
});

const createRequirementSchema = z.object({
  visaId: z.number({ required_error: "Visa is required" }),
  nationalityId: z.number({ required_error: "Nationality is required" }),
  requirementDetails: z.string().optional(),
  additionalDocuments: z.array(z.string()).optional(),
  fees: z.number().optional(),
  processingTime: z.string().optional(),
  notes: z.string().optional(),
  active: z.boolean().default(true),
});

type Visa = {
  id: number;
  title: string;
  description: string | null;
  targetCountryId: number;
  imageUrl: string | null;
  price: number | null;
  processingTime: string | null;
  requiredDocuments: string[] | null;
  validityPeriod: string | null;
  entryType: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
};

type Nationality = {
  id: number;
  name: string;
  code: string;
  description: string | null;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
};

type Country = {
  id: number;
  name: string;
  code: string;
  description: string | null;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
};

type NationalityVisaRequirement = {
  id: number;
  visaId: number;
  nationalityId: number;
  requirementDetails: string | null;
  additionalDocuments: string[] | null;
  fees: number | null;
  processingTime: string | null;
  notes: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export default function VisasManagement() {
  const [activeTab, setActiveTab] = useState("visas");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState<number | null>(null);
  const [nationalityFilter, setNationalityFilter] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRequirementDialogOpen, setIsRequirementDialogOpen] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);
  const { toast } = useToast();

  // Add new state for management options
  const [processingTimeTemplate, setProcessingTimeTemplate] = useState({
    standard: "5-7 business days",
    express: "2-3 business days",
    rush: "1 business day"
  });

  const [documentTemplate, setDocumentTemplate] = useState({
    required: ["Passport", "Photo", "Application Form"],
    optional: ["Bank Statement", "Employment Letter", "Travel Insurance"]
  });

  const [feeStructure, setFeeStructure] = useState({
    standardFee: 100,
    expressFee: 50,
    rushFee: 100,
    currency: "USD"
  });

  const [generalSettings, setGeneralSettings] = useState({
    autoApprove: false,
    requireInterview: false,
    maxApplicationsPerDay: 50,
    notificationEmail: ""
  });

  // Fetch all visas
  const visasQuery = useQuery({ 
    queryKey: ['/api/visas'], 
    queryFn: () => apiRequest('/api/visas'),
  });

  // Fetch all nationalities
  const nationalitiesQuery = useQuery({ 
    queryKey: ['/api/nationalities'], 
    queryFn: () => apiRequest('/api/nationalities'),
  });

  // Fetch all countries
  const countriesQuery = useQuery({ 
    queryKey: ['/api/countries'], 
    queryFn: () => apiRequest('/api/countries'),
  });

  // Fetch visa requirements
  const requirementsQuery = useQuery({ 
    queryKey: ['/api/nationality-visa-requirements'], 
    queryFn: () => apiRequest('/api/nationality-visa-requirements'),
  });

  // Set up forms
  const visaForm = useForm<z.infer<typeof createVisaSchema>>({
    resolver: zodResolver(createVisaSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      processingTime: "",
      requiredDocuments: [],
      validityPeriod: "",
      entryType: "",
      active: true,
    },
  });

  const requirementForm = useForm<z.infer<typeof createRequirementSchema>>({
    resolver: zodResolver(createRequirementSchema),
    defaultValues: {
      requirementDetails: "",
      additionalDocuments: [],
      fees: undefined,
      processingTime: "",
      notes: "",
      active: true,
    },
  });

  // Handle visa creation
  const onCreateVisa = async (data: z.infer<typeof createVisaSchema>) => {
    try {
      await apiRequest('/api/visas', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast({
        title: "Success",
        description: "Visa created successfully",
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/visas'] });
      visaForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create visa",
        variant: "destructive",
      });
    }
  };

  // Handle visa requirement creation
  const onCreateRequirement = async (data: z.infer<typeof createRequirementSchema>) => {
    try {
      await apiRequest('/api/nationality-visa-requirements', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast({
        title: "Success",
        description: "Visa requirement created successfully",
      });
      setIsRequirementDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/nationality-visa-requirements'] });
      requirementForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create visa requirement",
        variant: "destructive",
      });
    }
  };

  // Delete visa
  const handleDeleteVisa = async (id: number) => {
    if (confirm("Are you sure you want to delete this visa?")) {
      try {
        await apiRequest(`/api/visas/${id}`, {
          method: 'DELETE',
        });
        toast({
          title: "Success",
          description: "Visa deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/visas'] });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete visa",
          variant: "destructive",
        });
      }
    }
  };

  // Delete requirement
  const handleDeleteRequirement = async (id: number) => {
    if (confirm("Are you sure you want to delete this requirement?")) {
      try {
        await apiRequest(`/api/nationality-visa-requirements/${id}`, {
          method: 'DELETE',
        });
        toast({
          title: "Success",
          description: "Requirement deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/nationality-visa-requirements'] });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete requirement",
          variant: "destructive",
        });
      }
    }
  };

  // Filter visas based on search and filters
  const filteredVisas = React.useMemo(() => {
    if (visasQuery.data) {
      return (visasQuery.data as Visa[]).filter(visa => {
        const matchesSearch = 
          searchQuery === "" || 
          visa.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (visa.description && visa.description.toLowerCase().includes(searchQuery.toLowerCase()));
          
        const matchesCountry = 
          countryFilter === null || 
          visa.targetCountryId === countryFilter;
          
        return matchesSearch && matchesCountry;
      });
    }
    return [];
  }, [visasQuery.data, searchQuery, countryFilter]);

  // Filter requirements based on search and filters
  const filteredRequirements = React.useMemo(() => {
    if (requirementsQuery.data) {
      return (requirementsQuery.data as NationalityVisaRequirement[]).filter(req => {
        const visa = (visasQuery.data as Visa[])?.find(v => v.id === req.visaId);
        const nationality = (nationalitiesQuery.data as Nationality[])?.find(n => n.id === req.nationalityId);
        
        const matchesSearch = 
          searchQuery === "" || 
          visa?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nationality?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (req.requirementDetails && req.requirementDetails.toLowerCase().includes(searchQuery.toLowerCase()));
          
        const matchesVisa = 
          selectedVisa === null || 
          req.visaId === selectedVisa.id;
          
        const matchesNationality = 
          nationalityFilter === null || 
          req.nationalityId === nationalityFilter;
          
        return matchesSearch && matchesVisa && matchesNationality;
      });
    }
    return [];
  }, [requirementsQuery.data, visasQuery.data, nationalitiesQuery.data, searchQuery, selectedVisa, nationalityFilter]);

  // Get country name by ID
  const getCountryName = (id: number) => {
    return (countriesQuery.data as Country[])?.find(country => country.id === id)?.name || "Unknown";
  };

  // Get nationality name by ID
  const getNationalityName = (id: number) => {
    return (nationalitiesQuery.data as Nationality[])?.find(nationality => nationality.id === id)?.name || "Unknown";
  };

  // Get visa title by ID
  const getVisaTitle = (id: number) => {
    return (visasQuery.data as Visa[])?.find(visa => visa.id === id)?.title || "Unknown";
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Visa Management</h1>
          <p className="text-muted-foreground">Manage visa information and nationality-specific requirements</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="visas">Visas</TabsTrigger>
          <TabsTrigger value="requirements">Nationality Requirements</TabsTrigger>
          <TabsTrigger value="nationalities">Nationalities</TabsTrigger>
          <TabsTrigger value="management">Management Options</TabsTrigger>
        </TabsList>

        {/* Visas Tab */}
        <TabsContent value="visas">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4 flex-wrap md:flex-nowrap">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search visas..." 
                  className="pl-8 w-full md:w-[300px]" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select 
                value={countryFilter?.toString() || ""} 
                onValueChange={(val) => setCountryFilter(val ? Number(val) : null)}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Countries</SelectItem>
                  {countriesQuery.data && (countriesQuery.data as Country[]).map((country) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Visa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Visa</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new visa
                  </DialogDescription>
                </DialogHeader>
                <Form {...visaForm}>
                  <form onSubmit={visaForm.handleSubmit(onCreateVisa)} className="space-y-4 pt-4">
                    <FormField
                      control={visaForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visa Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Tourist Visa" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={visaForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Enter visa description"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={visaForm.control}
                      name="targetCountryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Country</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countriesQuery.data && (countriesQuery.data as Country[]).map((country) => (
                                <SelectItem key={country.id} value={country.id.toString()}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={visaForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                value={field.value || ""}
                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="0" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={visaForm.control}
                        name="processingTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Processing Time</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                value={field.value || ""}
                                placeholder="e.g., 5-7 business days" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={visaForm.control}
                        name="validityPeriod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Validity Period</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                value={field.value || ""}
                                placeholder="e.g., 3 months" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={visaForm.control}
                        name="entryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entry Type</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                value={field.value || ""}
                                placeholder="e.g., Single entry" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={visaForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Active</FormLabel>
                            <FormDescription>
                              This visa will be available in search results
                            </FormDescription>
                          </div>
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
                      <Button type="submit">Create Visa</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visasQuery.isLoading ? (
              <p className="col-span-full text-center py-10">Loading visas...</p>
            ) : filteredVisas.length === 0 ? (
              <p className="col-span-full text-center py-10">No visas found</p>
            ) : (
              filteredVisas.map((visa) => (
                <Card key={visa.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{visa.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Country: {getCountryName(visa.targetCountryId)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={visa.active ? "default" : "outline"}>
                          {visa.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {visa.description && (
                        <p>{visa.description}</p>
                      )}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {visa.price && (
                          <div>
                            <span className="font-medium">Price:</span> ${visa.price}
                          </div>
                        )}
                        {visa.processingTime && (
                          <div>
                            <span className="font-medium">Processing:</span> {visa.processingTime}
                          </div>
                        )}
                        {visa.validityPeriod && (
                          <div>
                            <span className="font-medium">Validity:</span> {visa.validityPeriod}
                          </div>
                        )}
                        {visa.entryType && (
                          <div>
                            <span className="font-medium">Entry Type:</span> {visa.entryType}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedVisa(visa);
                            setIsRequirementDialogOpen(true);
                            requirementForm.setValue("visaId", visa.id);
                          }}
                        >
                          Add Requirement
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleDeleteVisa(visa.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value="requirements">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4 flex-wrap md:flex-nowrap">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search requirements..." 
                  className="pl-8 w-full md:w-[300px]" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select 
                value={nationalityFilter?.toString() || ""} 
                onValueChange={(val) => setNationalityFilter(val ? Number(val) : null)}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Nationalities</SelectItem>
                  {nationalitiesQuery.data && (nationalitiesQuery.data as Nationality[]).map((nationality) => (
                    <SelectItem key={nationality.id} value={nationality.id.toString()}>
                      {nationality.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isRequirementDialogOpen} onOpenChange={setIsRequirementDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Requirement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create Nationality-Specific Visa Requirement</DialogTitle>
                  <DialogDescription>
                    Enter the requirements for a specific nationality
                  </DialogDescription>
                </DialogHeader>
                <Form {...requirementForm}>
                  <form onSubmit={requirementForm.handleSubmit(onCreateRequirement)} className="space-y-4 pt-4">
                    <FormField
                      control={requirementForm.control}
                      name="visaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visa</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            defaultValue={field.value?.toString()}
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a visa" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {visasQuery.data && (visasQuery.data as Visa[]).map((visa) => (
                                <SelectItem key={visa.id} value={visa.id.toString()}>
                                  {visa.title} ({getCountryName(visa.targetCountryId)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={requirementForm.control}
                      name="nationalityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a nationality" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {nationalitiesQuery.data && (nationalitiesQuery.data as Nationality[]).map((nationality) => (
                                <SelectItem key={nationality.id} value={nationality.id.toString()}>
                                  {nationality.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={requirementForm.control}
                      name="requirementDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requirement Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Enter specific requirements for this nationality"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={requirementForm.control}
                        name="fees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fees</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                value={field.value || ""}
                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="0" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={requirementForm.control}
                        name="processingTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Processing Time</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                value={field.value || ""}
                                placeholder="e.g., 3-5 business days" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={requirementForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Additional notes"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={requirementForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Active</FormLabel>
                            <FormDescription>
                              This requirement will be visible in search results
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsRequirementDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Create Requirement</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {requirementsQuery.isLoading ? (
              <p className="text-center py-10">Loading requirements...</p>
            ) : filteredRequirements.length === 0 ? (
              <p className="text-center py-10">No requirements found</p>
            ) : (
              filteredRequirements.map((req) => (
                <Card key={req.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          {getNationalityName(req.nationalityId)} → {getCountryName((visasQuery.data as Visa[])?.find(v => v.id === req.visaId)?.targetCountryId || 0)}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Visa: {getVisaTitle(req.visaId)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={req.active ? "default" : "outline"}>
                          {req.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {req.requirementDetails && (
                        <div>
                          <h4 className="font-medium mb-1">Requirements:</h4>
                          <p>{req.requirementDetails}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {req.fees !== null && (
                          <div>
                            <span className="font-medium">Fees:</span> ${req.fees}
                          </div>
                        )}
                        {req.processingTime && (
                          <div>
                            <span className="font-medium">Processing:</span> {req.processingTime}
                          </div>
                        )}
                      </div>
                      {req.notes && (
                        <div className="mt-2">
                          <h4 className="font-medium mb-1">Notes:</h4>
                          <p>{req.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-end">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleDeleteRequirement(req.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Nationalities Tab */}
        <TabsContent value="nationalities">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nationalitiesQuery.isLoading ? (
              <p className="col-span-full text-center py-10">Loading nationalities...</p>
            ) : (nationalitiesQuery.data as Nationality[])?.length === 0 ? (
              <p className="col-span-full text-center py-10">No nationalities found</p>
            ) : (
              (nationalitiesQuery.data as Nationality[])?.map((nationality) => (
                <Card key={nationality.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{nationality.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Code: {nationality.code}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={nationality.active ? "default" : "outline"}>
                          {nationality.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {nationality.description && (
                      <p className="text-sm">{nationality.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Management Options Tab */}
        <TabsContent value="management">
          <div className="space-y-6">
            {/* Processing Time Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Time Templates</CardTitle>
                <CardDescription>Set default processing times for different visa types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <FormLabel>Standard Processing</FormLabel>
                    <Input 
                      value={processingTimeTemplate.standard}
                      onChange={(e) => setProcessingTimeTemplate(prev => ({
                        ...prev,
                        standard: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <FormLabel>Express Processing</FormLabel>
                    <Input 
                      value={processingTimeTemplate.express}
                      onChange={(e) => setProcessingTimeTemplate(prev => ({
                        ...prev,
                        express: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <FormLabel>Rush Processing</FormLabel>
                    <Input 
                      value={processingTimeTemplate.rush}
                      onChange={(e) => setProcessingTimeTemplate(prev => ({
                        ...prev,
                        rush: e.target.value
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Document Templates</CardTitle>
                <CardDescription>Configure required and optional documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <FormLabel>Required Documents</FormLabel>
                  <Textarea 
                    value={documentTemplate.required.join(", ")}
                    onChange={(e) => setDocumentTemplate(prev => ({
                      ...prev,
                      required: e.target.value.split(",").map(doc => doc.trim())
                    }))}
                    placeholder="Enter required documents separated by commas"
                  />
                </div>
                <div>
                  <FormLabel>Optional Documents</FormLabel>
                  <Textarea 
                    value={documentTemplate.optional.join(", ")}
                    onChange={(e) => setDocumentTemplate(prev => ({
                      ...prev,
                      optional: e.target.value.split(",").map(doc => doc.trim())
                    }))}
                    placeholder="Enter optional documents separated by commas"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Fee Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
                <CardDescription>Set default fees for different processing types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <FormLabel>Standard Fee</FormLabel>
                    <Input 
                      type="number"
                      value={feeStructure.standardFee}
                      onChange={(e) => setFeeStructure(prev => ({
                        ...prev,
                        standardFee: Number(e.target.value)
                      }))}
                    />
                  </div>
                  <div>
                    <FormLabel>Express Fee</FormLabel>
                    <Input 
                      type="number"
                      value={feeStructure.expressFee}
                      onChange={(e) => setFeeStructure(prev => ({
                        ...prev,
                        expressFee: Number(e.target.value)
                      }))}
                    />
                  </div>
                  <div>
                    <FormLabel>Rush Fee</FormLabel>
                    <Input 
                      type="number"
                      value={feeStructure.rushFee}
                      onChange={(e) => setFeeStructure(prev => ({
                        ...prev,
                        rushFee: Number(e.target.value)
                      }))}
                    />
                  </div>
                </div>
                <div>
                  <FormLabel>Currency</FormLabel>
                  <Select 
                    value={feeStructure.currency}
                    onValueChange={(value) => setFeeStructure(prev => ({
                      ...prev,
                      currency: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure general visa application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="autoApprove"
                    checked={generalSettings.autoApprove}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({
                      ...prev,
                      autoApprove: checked as boolean
                    }))}
                  />
                  <label htmlFor="autoApprove">Enable Auto-Approval</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="requireInterview"
                    checked={generalSettings.requireInterview}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({
                      ...prev,
                      requireInterview: checked as boolean
                    }))}
                  />
                  <label htmlFor="requireInterview">Require Interview</label>
                </div>
                <div>
                  <FormLabel>Maximum Applications Per Day</FormLabel>
                  <Input 
                    type="number"
                    value={generalSettings.maxApplicationsPerDay}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      maxApplicationsPerDay: Number(e.target.value)
                    }))}
                  />
                </div>
                <div>
                  <FormLabel>Notification Email</FormLabel>
                  <Input 
                    type="email"
                    value={generalSettings.notificationEmail}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      notificationEmail: e.target.value
                    }))}
                    placeholder="Enter notification email"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => {
                    // Save all settings
                    toast({
                      title: "Success",
                      description: "Settings saved successfully",
                    });
                  }}
                >
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}