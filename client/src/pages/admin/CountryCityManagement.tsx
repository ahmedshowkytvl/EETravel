import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
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
import { Separator } from "@/components/ui/separator";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Search, Edit, Trash2, Loader2, GlobeIcon, Landmark, Plane, Check, X, AlertCircle, Sparkles, Brain } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { validateForm, validateRequiredFields } from "@/lib/validateForm";
import { FormRequiredFieldsNote, FormValidationAlert } from "@/components/dashboard/FormValidationAlert";

// Interfaces matching our schema
interface Country {
  id: number;
  name: string;
  code: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface City {
  id: number;
  name: string;
  countryId: number;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface Airport {
  id: number;
  name: string;
  code: string;
  cityId: number;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Country validation schema
const countrySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  code: z.string().min(2, { message: "Code must be at least 2 characters" }).max(3),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  active: z.boolean().default(true),
});

// City validation schema
const citySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  countryId: z.number({ message: "Country is required" }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  active: z.boolean().default(true),
});

// Airport validation schema
const airportSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  code: z.string().min(2, { message: "Code must be at least 2 characters" }).max(4),
  cityId: z.number({ message: "City is required" }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  active: z.boolean().default(true),
});

type CountryFormValues = z.infer<typeof countrySchema>;
type CityFormValues = z.infer<typeof citySchema>;
type AirportFormValues = z.infer<typeof airportSchema>;

export default function CountryCityManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("countries");
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [airportSearchQuery, setAirportSearchQuery] = useState("");
  const [isCreateCountryDialogOpen, setIsCreateCountryDialogOpen] = useState(false);
  const [isCreateCityDialogOpen, setIsCreateCityDialogOpen] = useState(false);
  const [isCreateAirportDialogOpen, setIsCreateAirportDialogOpen] = useState(false);
  const [isEditCountryDialogOpen, setIsEditCountryDialogOpen] = useState(false);
  const [isEditCityDialogOpen, setIsEditCityDialogOpen] = useState(false);
  const [isEditAirportDialogOpen, setIsEditAirportDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [deleteCountryConfirmOpen, setDeleteCountryConfirmOpen] = useState(false);
  const [deleteCityConfirmOpen, setDeleteCityConfirmOpen] = useState(false);
  const [deleteAirportConfirmOpen, setDeleteAirportConfirmOpen] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isGeneratingAiData, setIsGeneratingAiData] = useState(false);
  const [aiCountryInput, setAiCountryInput] = useState("");

  // AI-powered country and cities generation
  const generateCountryAndCities = useMutation({
    mutationFn: async (countryName: string) => {
      const response = await fetch('/api/admin/ai-generate-country-cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryName }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate country and cities data');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/countries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cities'] });
      setIsAiDialogOpen(false);
      setAiCountryInput("");
      toast({
        title: "AI Generation Complete! 🎉",
        description: `Successfully added ${data.country.name} with ${data.cities.length} major cities using AI`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "AI Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAiGeneration = () => {
    if (!aiCountryInput.trim()) {
      toast({
        title: "Country Name Required",
        description: "Please enter a country name to generate cities",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingAiData(true);
    generateCountryAndCities.mutate(aiCountryInput.trim());
  };

  // Query countries
  const { data: countries = [], isLoading: isLoadingCountries } = useQuery<Country[]>({
    queryKey: ['/api/admin/countries'],
  });

  // Query cities
  const { data: cities = [], isLoading: isLoadingCities } = useQuery<City[]>({
    queryKey: ['/api/admin/cities'],
  });
  
  // Query airports
  const { data: airports = [], isLoading: isLoadingAirports } = useQuery<Airport[]>({
    queryKey: ['/api/admin/airports'],
  });

  // Filter countries based on search
  const filteredCountries = countries.filter(
    country => country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
               country.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  // Filter cities based on search
  const filteredCities = cities.filter(
    city => city.name.toLowerCase().includes(citySearchQuery.toLowerCase())
  );
  
  // Filter airports based on search
  const filteredAirports = airports.filter(
    airport => airport.name.toLowerCase().includes(airportSearchQuery.toLowerCase()) ||
               airport.code.toLowerCase().includes(airportSearchQuery.toLowerCase())
  );

  // Country form
  const countryForm = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      imageUrl: "",
      active: true,
    },
  });

  // City form
  const cityForm = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: "",
      countryId: 0,
      description: "",
      imageUrl: "",
      active: true,
    },
  });
  
  // Airport form
  const airportForm = useForm<AirportFormValues>({
    resolver: zodResolver(airportSchema),
    defaultValues: {
      name: "",
      code: "",
      cityId: 0,
      description: "",
      imageUrl: "",
      active: true,
    },
  });

  // Create Country Mutation
  const createCountryMutation = useMutation({
    mutationFn: async (country: CountryFormValues) => {
      const response = await fetch('/api/admin/countries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(country),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create country');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/countries'] });
      setIsCreateCountryDialogOpen(false);
      countryForm.reset();
      toast({
        title: "Success",
        description: "Country created successfully",
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

  // Create City Mutation
  const createCityMutation = useMutation({
    mutationFn: async (city: CityFormValues) => {
      const response = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(city),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create city');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cities'] });
      setIsCreateCityDialogOpen(false);
      cityForm.reset();
      toast({
        title: "Success",
        description: "City created successfully",
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

  // Update Country Mutation
  const updateCountryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CountryFormValues }) => {
      const response = await fetch(`/api/admin/countries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update country');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/countries'] });
      setIsEditCountryDialogOpen(false);
      setSelectedCountry(null);
      toast({
        title: "Success",
        description: "Country updated successfully",
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

  // Update City Mutation
  const updateCityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CityFormValues }) => {
      const response = await fetch(`/api/admin/cities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update city');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cities'] });
      setIsEditCityDialogOpen(false);
      setSelectedCity(null);
      toast({
        title: "Success",
        description: "City updated successfully",
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

  // Delete Country Mutation
  const deleteCountryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/countries/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete country');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/countries'] });
      setDeleteCountryConfirmOpen(false);
      setSelectedCountry(null);
      toast({
        title: "Success",
        description: "Country deleted successfully",
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

  // Delete City Mutation
  const deleteCityMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/cities/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete city');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cities'] });
      setDeleteCityConfirmOpen(false);
      setSelectedCity(null);
      toast({
        title: "Success",
        description: "City deleted successfully",
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
  
  // Create Airport Mutation
  const createAirportMutation = useMutation({
    mutationFn: async (airport: AirportFormValues) => {
      const response = await fetch('/api/admin/airports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(airport),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create airport');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/airports'] });
      setIsCreateAirportDialogOpen(false);
      airportForm.reset();
      toast({
        title: "Success",
        description: "Airport created successfully",
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
  
  // Update Airport Mutation
  const updateAirportMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: AirportFormValues }) => {
      const response = await fetch(`/api/admin/airports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update airport');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/airports'] });
      setIsEditAirportDialogOpen(false);
      setSelectedAirport(null);
      toast({
        title: "Success",
        description: "Airport updated successfully",
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
  
  // Delete Airport Mutation
  const deleteAirportMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/airports/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete airport');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/airports'] });
      setDeleteAirportConfirmOpen(false);
      setSelectedAirport(null);
      toast({
        title: "Success",
        description: "Airport deleted successfully",
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
  const onCreateCountrySubmit = (values: CountryFormValues) => {
    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ['name', 'code'],
      {
        name: 'Country Name',
        code: 'Country Code'
      }
    );
    
    if (!requiredFieldsValid) return;
    
    // Additional validation for image URL
    const customValidationsValid = validateForm(values, [
      {
        condition: !!values.imageUrl && !values.imageUrl.startsWith('http'),
        errorMessage: {
          title: "Invalid Image URL",
          description: "Please provide a valid URL starting with http:// or https://"
        },
        variant: "destructive"
      },
      {
        condition: values.code.length < 2 || values.code.length > 3,
        errorMessage: {
          title: "Invalid Country Code",
          description: "Country code should be 2-3 characters (e.g., US, EG, UAE)"
        },
        variant: "destructive"
      }
    ]);
    
    if (!customValidationsValid) return;
    
    // All validations passed, proceed with submission
    createCountryMutation.mutate(values);
  };

  const onCreateCitySubmit = (values: CityFormValues) => {
    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ['name', 'countryId'],
      {
        name: 'City Name',
        countryId: 'Country'
      }
    );
    
    if (!requiredFieldsValid) return;
    
    // Additional validation for country selection and image URL
    const customValidationsValid = validateForm(values, [
      {
        condition: values.countryId === 0,
        errorMessage: {
          title: "Country Required",
          description: "Please select a country for this city"
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
    createCityMutation.mutate(values);
  };
  
  const onCreateAirportSubmit = (values: AirportFormValues) => {
    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ['name', 'code', 'cityId'],
      {
        name: 'Airport Name',
        code: 'Airport Code',
        cityId: 'City'
      }
    );
    
    if (!requiredFieldsValid) return;
    
    // Additional validation for city selection, code format, and image URL
    const customValidationsValid = validateForm(values, [
      {
        condition: values.cityId === 0,
        errorMessage: {
          title: "City Required",
          description: "Please select a city for this airport"
        },
        variant: "destructive"
      },
      {
        condition: values.code.length < 2 || values.code.length > 4,
        errorMessage: {
          title: "Invalid Airport Code",
          description: "Airport code should be 2-4 characters (e.g., CAI, JFK, DXB)"
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
    createAirportMutation.mutate(values);
  };

  const onUpdateCountrySubmit = (values: CountryFormValues) => {
    if (!selectedCountry) {
      toast({
        title: "Update Error",
        description: "No country selected for update",
        variant: "destructive",
      });
      return;
    }
    
    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ['name', 'code'],
      {
        name: 'Country Name',
        code: 'Country Code'
      }
    );
    
    if (!requiredFieldsValid) return;
    
    // Additional validation for image URL
    const customValidationsValid = validateForm(values, [
      {
        condition: !!values.imageUrl && !values.imageUrl.startsWith('http'),
        errorMessage: {
          title: "Invalid Image URL",
          description: "Please provide a valid URL starting with http:// or https://"
        },
        variant: "destructive"
      },
      {
        condition: values.code.length < 2 || values.code.length > 3,
        errorMessage: {
          title: "Invalid Country Code",
          description: "Country code should be 2-3 characters (e.g., US, EG, UAE)"
        },
        variant: "destructive"
      }
    ]);
    
    if (!customValidationsValid) return;
    
    // All validations passed, proceed with submission
    updateCountryMutation.mutate({ id: selectedCountry.id, data: values });
  };

  const onUpdateCitySubmit = (values: CityFormValues) => {
    if (!selectedCity) {
      toast({
        title: "Update Error",
        description: "No city selected for update",
        variant: "destructive",
      });
      return;
    }
    
    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ['name', 'countryId'],
      {
        name: 'City Name',
        countryId: 'Country'
      }
    );
    
    if (!requiredFieldsValid) return;
    
    // Additional validation for country selection and image URL
    const customValidationsValid = validateForm(values, [
      {
        condition: values.countryId === 0,
        errorMessage: {
          title: "Country Required",
          description: "Please select a country for this city"
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
    updateCityMutation.mutate({ id: selectedCity.id, data: values });
  };
  
  const onUpdateAirportSubmit = (values: AirportFormValues) => {
    if (!selectedAirport) {
      toast({
        title: "Update Error",
        description: "No airport selected for update",
        variant: "destructive",
      });
      return;
    }
    
    // Validate required fields
    const requiredFieldsValid = validateRequiredFields(
      values,
      ['name', 'code', 'cityId'],
      {
        name: 'Airport Name',
        code: 'Airport Code',
        cityId: 'City'
      }
    );
    
    if (!requiredFieldsValid) return;
    
    // Additional validation for city selection, code format, and image URL
    const customValidationsValid = validateForm(values, [
      {
        condition: values.cityId === 0,
        errorMessage: {
          title: "City Required",
          description: "Please select a city for this airport"
        },
        variant: "destructive"
      },
      {
        condition: values.code.length < 2 || values.code.length > 4,
        errorMessage: {
          title: "Invalid Airport Code",
          description: "Airport code should be 2-4 characters (e.g., CAI, JFK, DXB)"
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
    updateAirportMutation.mutate({ id: selectedAirport.id, data: values });
  };

  // Open edit dialog and prefill form
  const handleEditCountry = (country: Country) => {
    setSelectedCountry(country);
    countryForm.reset({
      name: country.name,
      code: country.code,
      description: country.description || "",
      imageUrl: country.imageUrl || "",
      active: country.active,
    });
    setIsEditCountryDialogOpen(true);
  };

  const handleEditCity = (city: City) => {
    setSelectedCity(city);
    cityForm.reset({
      name: city.name,
      countryId: city.countryId,
      description: city.description || "",
      imageUrl: city.imageUrl || "",
      active: city.active,
    });
    setIsEditCityDialogOpen(true);
  };
  
  const handleEditAirport = (airport: Airport) => {
    setSelectedAirport(airport);
    airportForm.reset({
      name: airport.name,
      code: airport.code,
      cityId: airport.cityId,
      description: airport.description || "",
      imageUrl: airport.imageUrl || "",
      active: airport.active,
    });
    setIsEditAirportDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteCountry = (country: Country) => {
    setSelectedCountry(country);
    setDeleteCountryConfirmOpen(true);
  };

  const handleDeleteCity = (city: City) => {
    setSelectedCity(city);
    setDeleteCityConfirmOpen(true);
  };
  
  const handleDeleteAirport = (airport: Airport) => {
    setSelectedAirport(airport);
    setDeleteAirportConfirmOpen(true);
  };

  const confirmDeleteCountry = () => {
    if (selectedCountry) {
      deleteCountryMutation.mutate(selectedCountry.id);
    }
  };

  const confirmDeleteCity = () => {
    if (selectedCity) {
      deleteCityMutation.mutate(selectedCity.id);
    }
  };
  
  const confirmDeleteAirport = () => {
    if (selectedAirport) {
      deleteAirportMutation.mutate(selectedAirport.id);
    }
  };

  // Reset forms when dialogs close
  const handleCreateCountryDialogClose = (open: boolean) => {
    setIsCreateCountryDialogOpen(open);
    if (!open) {
      countryForm.reset();
    }
  };

  const handleCreateCityDialogClose = (open: boolean) => {
    setIsCreateCityDialogOpen(open);
    if (!open) {
      cityForm.reset();
    }
  };

  const handleEditCountryDialogClose = (open: boolean) => {
    setIsEditCountryDialogOpen(open);
    if (!open) {
      setSelectedCountry(null);
    }
  };

  const handleEditCityDialogClose = (open: boolean) => {
    setIsEditCityDialogOpen(open);
    if (!open) {
      setSelectedCity(null);
    }
  };
  
  const handleCreateAirportDialogClose = (open: boolean) => {
    setIsCreateAirportDialogOpen(open);
    if (!open) {
      airportForm.reset();
    }
  };
  
  const handleEditAirportDialogClose = (open: boolean) => {
    setIsEditAirportDialogOpen(open);
    if (!open) {
      setSelectedAirport(null);
    }
  };

  return (
    <DashboardLayout location="/admin/countries-cities">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Travel Locations Management</h1>
          <div className="flex space-x-2">
            {/* AI Generate Button */}
            <Button 
              onClick={() => setIsAiDialogOpen(true)}
              variant="outline"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generate
            </Button>
            <Button 
              onClick={() => setActiveTab('countries')}
              variant={activeTab === 'countries' ? 'default' : 'outline'}
            >
              <GlobeIcon className="w-4 h-4 mr-2" />
              Countries
            </Button>
            <Button 
              onClick={() => setActiveTab('cities')}
              variant={activeTab === 'cities' ? 'default' : 'outline'}
            >
              <Landmark className="w-4 h-4 mr-2" />
              Cities
            </Button>
            <Button 
              onClick={() => setActiveTab('airports')}
              variant={activeTab === 'airports' ? 'default' : 'outline'}
            >
              <Plane className="w-4 h-4 mr-2" />
              Airports
            </Button>
          </div>
        </div>

        {activeTab === 'countries' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Countries</CardTitle>
                <CardDescription>Manage countries available in the system</CardDescription>
              </div>
              <Dialog open={isCreateCountryDialogOpen} onOpenChange={handleCreateCountryDialogClose}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Add Country
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Country</DialogTitle>
                    <DialogDescription>
                      Create a new country that will be available in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <FormRequiredFieldsNote />
                  {createCountryMutation.isError && (
                    <FormValidationAlert 
                      status="error" 
                      title="Failed to Create Country" 
                      message={createCountryMutation.error?.message || "An error occurred while creating the country."}
                      className="mt-3" 
                    />
                  )}
                  <Form {...countryForm}>
                    <form onSubmit={countryForm.handleSubmit(onCreateCountrySubmit)} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={countryForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Egypt" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={countryForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country Code</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. EG" {...field} />
                              </FormControl>
                              <FormDescription>2-3 letter ISO code</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={countryForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Brief description of the country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={countryForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormDescription>URL to an image representing the country</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={countryForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Active Status</FormLabel>
                              <FormDescription>
                                When a country is inactive, it will not be visible to users on the site.
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
                        <Button type="button" variant="outline" onClick={() => setIsCreateCountryDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createCountryMutation.isPending}>
                          {createCountryMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Country"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search countries..."
                    className="pl-8"
                    value={countrySearchQuery}
                    onChange={(e) => setCountrySearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-neutral-100 p-3 font-medium">
                  <div>Name</div>
                  <div>Code</div>
                  <div>Description</div>
                  <div className="text-center">Status</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {isLoadingCountries ? (
                    <div className="flex justify-center items-center p-4">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading countries...
                    </div>
                  ) : filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <div key={country.id} className="grid grid-cols-5 p-3 hover:bg-neutral-50">
                        <div className="font-medium">{country.name}</div>
                        <div>{country.code}</div>
                        <div className="truncate">{country.description || "—"}</div>
                        <div className="text-center">
                          {country.active ? (
                            <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-100 rounded-full px-2.5 py-1">
                              <Check className="mr-1 h-3 w-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-100 rounded-full px-2.5 py-1">
                              <X className="mr-1 h-3 w-3" /> Inactive
                            </span>
                          )}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCountry(country)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCountry(country)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No countries found. Try adjusting your search or add a new country.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'cities' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cities</CardTitle>
                <CardDescription>Manage cities available in the system</CardDescription>
              </div>
              <Dialog open={isCreateCityDialogOpen} onOpenChange={handleCreateCityDialogClose}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Add City
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New City</DialogTitle>
                    <DialogDescription>
                      Create a new city that will be available in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <FormRequiredFieldsNote />
                  {createCityMutation.isError && (
                    <FormValidationAlert 
                      status="error" 
                      title="Failed to Create City" 
                      message={createCityMutation.error?.message || "An error occurred while creating the city."}
                      className="mt-3" 
                    />
                  )}
                  <Form {...cityForm}>
                    <form onSubmit={cityForm.handleSubmit(onCreateCitySubmit)} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={cityForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Cairo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={cityForm.control}
                          name="countryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                defaultValue={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countries.map((country) => (
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
                      </div>
                      <FormField
                        control={cityForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Brief description of the city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cityForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormDescription>URL to an image representing the city</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cityForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Active Status</FormLabel>
                              <FormDescription>
                                When a city is inactive, it will not be visible to users on the site.
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
                        <Button type="button" variant="outline" onClick={() => setIsCreateCityDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createCityMutation.isPending}>
                          {createCityMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create City"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cities..."
                    className="pl-8"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-neutral-100 p-3 font-medium">
                  <div>Name</div>
                  <div>Country</div>
                  <div>Description</div>
                  <div className="text-center">Status</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {isLoadingCities ? (
                    <div className="flex justify-center items-center p-4">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading cities...
                    </div>
                  ) : filteredCities.length > 0 ? (
                    filteredCities.map((city) => {
                      const country = countries.find((c) => c.id === city.countryId);
                      return (
                        <div key={city.id} className="grid grid-cols-5 p-3 hover:bg-neutral-50">
                          <div className="font-medium">{city.name}</div>
                          <div>{country?.name || "—"}</div>
                          <div className="truncate">{city.description || "—"}</div>
                          <div className="text-center">
                            {city.active ? (
                              <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-100 rounded-full px-2.5 py-1">
                                <Check className="mr-1 h-3 w-3" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-100 rounded-full px-2.5 py-1">
                                <X className="mr-1 h-3 w-3" /> Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCity(city)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteCity(city)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No cities found. Try adjusting your search or add a new city.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Country Dialog */}
        <Dialog open={isEditCountryDialogOpen} onOpenChange={handleEditCountryDialogClose}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Country</DialogTitle>
              <DialogDescription>
                Update country information.
              </DialogDescription>
            </DialogHeader>
            <FormRequiredFieldsNote />
            {updateCountryMutation.isError && (
              <FormValidationAlert 
                status="error" 
                title="Failed to Update Country" 
                message={updateCountryMutation.error?.message || "An error occurred while updating the country."}
                className="mt-3" 
              />
            )}
            <Form {...countryForm}>
              <form onSubmit={countryForm.handleSubmit(onUpdateCountrySubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={countryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Egypt" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={countryForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. EG" {...field} />
                        </FormControl>
                        <FormDescription>2-3 letter ISO code</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={countryForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of the country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={countryForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>URL to an image representing the country</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={countryForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          When a country is inactive, it will not be visible to users on the site.
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
                  <Button type="button" variant="outline" onClick={() => setIsEditCountryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateCountryMutation.isPending}>
                    {updateCountryMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Country"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit City Dialog */}
        <Dialog open={isEditCityDialogOpen} onOpenChange={handleEditCityDialogClose}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit City</DialogTitle>
              <DialogDescription>
                Update city information.
              </DialogDescription>
            </DialogHeader>
            <FormRequiredFieldsNote />
            {updateCityMutation.isError && (
              <FormValidationAlert 
                status="error" 
                title="Failed to Update City" 
                message={updateCityMutation.error?.message || "An error occurred while updating the city."}
                className="mt-3" 
              />
            )}
            <Form {...cityForm}>
              <form onSubmit={cityForm.handleSubmit(onUpdateCitySubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={cityForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cairo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={cityForm.control}
                    name="countryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
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
                </div>
                <FormField
                  control={cityForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of the city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={cityForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>URL to an image representing the city</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={cityForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          When a city is inactive, it will not be visible to users on the site.
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
                  <Button type="button" variant="outline" onClick={() => setIsEditCityDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateCityMutation.isPending}>
                    {updateCityMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update City"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Country Confirmation Dialog */}
        <Dialog open={deleteCountryConfirmOpen} onOpenChange={setDeleteCountryConfirmOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedCountry?.name}? This action cannot be undone.
                <br /><br />
                <span className="font-semibold text-red-600">Warning:</span> Deleting a country will fail if there are cities associated with it. You must delete or reassign those cities first.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteCountryConfirmOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteCountry}
                disabled={deleteCountryMutation.isPending}
              >
                {deleteCountryMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Country"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete City Confirmation Dialog */}
        <Dialog open={deleteCityConfirmOpen} onOpenChange={setDeleteCityConfirmOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedCity?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteCityConfirmOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteCity}
                disabled={deleteCityMutation.isPending}
              >
                {deleteCityMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete City"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Airports Tab */}
        {activeTab === 'airports' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Airports</CardTitle>
                <CardDescription>Manage airports available in the system</CardDescription>
              </div>
              <Dialog open={isCreateAirportDialogOpen} onOpenChange={handleCreateAirportDialogClose}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Add Airport
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Airport</DialogTitle>
                    <DialogDescription>
                      Create a new airport that will be available in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <FormRequiredFieldsNote />
                  {createAirportMutation.isError && (
                    <FormValidationAlert 
                      status="error" 
                      title="Failed to Create Airport" 
                      message={createAirportMutation.error?.message || "An error occurred while creating the airport."}
                      className="mt-3" 
                    />
                  )}
                  <Form {...airportForm}>
                    <form onSubmit={airportForm.handleSubmit(onCreateAirportSubmit)} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={airportForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Airport Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Cairo International Airport" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={airportForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Airport Code</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. CAI" {...field} />
                              </FormControl>
                              <FormDescription>3-4 letter IATA/ICAO code</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={airportForm.control}
                        name="cityId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value ? String(field.value) : undefined}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {cities.map((city) => (
                                  <SelectItem key={city.id} value={String(city.id)}>
                                    {city.name} ({countries.find(c => c.id === city.countryId)?.name || 'Unknown Country'})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={airportForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Brief description of the airport" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={airportForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormDescription>URL to an image representing the airport</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={airportForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Active Status</FormLabel>
                              <FormDescription>
                                When an airport is inactive, it will not be visible to users on the site.
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
                        <Button type="button" variant="outline" onClick={() => setIsCreateAirportDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createAirportMutation.isPending}>
                          {createAirportMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Airport"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search airports..."
                    className="pl-8"
                    value={airportSearchQuery}
                    onChange={(e) => setAirportSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 bg-neutral-100 p-3 font-medium">
                  <div>Name</div>
                  <div>Code</div>
                  <div>City</div>
                  <div>Description</div>
                  <div className="text-center">Status</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {isLoadingAirports ? (
                    <div className="flex justify-center items-center p-4">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading airports...
                    </div>
                  ) : filteredAirports.length > 0 ? (
                    filteredAirports.map((airport) => {
                      const city = cities.find(c => c.id === airport.cityId);
                      const country = countries.find(c => c.id === city?.countryId);
                      return (
                        <div key={airport.id} className="grid grid-cols-6 p-3 hover:bg-neutral-50">
                          <div className="font-medium">{airport.name}</div>
                          <div>{airport.code}</div>
                          <div>{city?.name || "—"} ({country?.name || "—"})</div>
                          <div className="truncate">{airport.description || "—"}</div>
                          <div className="text-center">
                            {airport.active ? (
                              <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-100 rounded-full px-2.5 py-1">
                                <Check className="mr-1 h-3 w-3" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-100 rounded-full px-2.5 py-1">
                                <X className="mr-1 h-3 w-3" /> Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAirport(airport)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteAirport(airport)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No airports found. Try adjusting your search or add a new airport.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Edit Airport Dialog */}
        <Dialog open={isEditAirportDialogOpen} onOpenChange={handleEditAirportDialogClose}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Airport</DialogTitle>
              <DialogDescription>
                Update the airport details.
              </DialogDescription>
            </DialogHeader>
            <FormRequiredFieldsNote />
            {updateAirportMutation.isError && (
              <FormValidationAlert 
                status="error" 
                title="Failed to Update Airport" 
                message={updateAirportMutation.error?.message || "An error occurred while updating the airport."}
                className="mt-3" 
              />
            )}
            <Form {...airportForm}>
              <form onSubmit={airportForm.handleSubmit(onUpdateAirportSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={airportForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Airport Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cairo International Airport" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={airportForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Airport Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. CAI" {...field} />
                        </FormControl>
                        <FormDescription>3-4 letter IATA/ICAO code</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={airportForm.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value ? String(field.value) : undefined}
                        value={field.value ? String(field.value) : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={String(city.id)}>
                              {city.name} ({countries.find(c => c.id === city.countryId)?.name || 'Unknown Country'})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={airportForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of the airport" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={airportForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>URL to an image representing the airport</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={airportForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          When an airport is inactive, it will not be visible to users on the site.
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
                  <Button type="button" variant="outline" onClick={() => setIsEditAirportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateAirportMutation.isPending}>
                    {updateAirportMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Airport"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Airport Confirmation Dialog */}
        <AlertDialog open={deleteAirportConfirmOpen} onOpenChange={setDeleteAirportConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the airport
                {selectedAirport && <strong> {selectedAirport.name}</strong>} from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteAirport}
                disabled={deleteAirportMutation.isPending}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {deleteAirportMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* AI Generation Dialog */}
        <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                AI Country & Cities Generator
              </DialogTitle>
              <DialogDescription>
                Enter a country name and AI will automatically generate the country entry with its major cities for your travel platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="ai-country" className="text-sm font-medium">
                  Country Name
                </label>
                <Input
                  id="ai-country"
                  placeholder="e.g., Japan, France, Morocco..."
                  value={aiCountryInput}
                  onChange={(e) => setAiCountryInput(e.target.value)}
                  disabled={isGeneratingAiData}
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  AI will generate the country with its ISO code, description, and automatically add 10-15 major cities with proper details.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAiDialogOpen(false)}
                disabled={isGeneratingAiData}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAiGeneration}
                disabled={isGeneratingAiData || !aiCountryInput.trim()}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isGeneratingAiData ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}