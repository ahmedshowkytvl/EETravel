import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import HotelSearchComponent from "@/components/HotelSearchComponent";
import { Calendar } from "@/components/ui/calendar";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AlertCircle, 
  CalendarIcon, 
  ImagePlus, 
  Loader2, 
  Plus, 
  Trash, 
  Star, 
  X, 
  Package, 
  Hotel, 
  Map as MapIcon, 
  Search,
  LucideProps 
} from "lucide-react";

// A simple component to dynamically use Lucide icons based on string name
// A simple component to render an icon using Lucide
const LucideIcon = ({ 
  name, 
  className, 
  fallback, 
  ...props 
}: { 
  name: string, 
  className?: string, 
  fallback?: React.ReactNode 
} & Omit<LucideProps, 'ref'>) => {
  // If we have an exact match for the icon name, use it
  if (name === 'package') return <Package className={className} {...props} />;
  if (name === 'hotel') return <Hotel className={className} {...props} />;
  if (name === 'map') return <MapIcon className={className} {...props} />;
  if (name === 'trash') return <Trash className={className} {...props} />;
  if (name === 'star') return <Star className={className} {...props} />;
  if (name === 'x') return <X className={className} {...props} />;
  
  // Default fallback
  return <>{fallback || <Package className={className} {...props} />}</>;
};
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { validateForm, validateRequiredFields, validateDateFields, validateNumericFields } from "@/lib/validateForm";
import { FormRequiredFieldsNote, FormValidationAlert } from "@/components/dashboard/FormValidationAlert";
import { useLocation } from "wouter";
import { IconSelector } from "@/components/ui/IconSelector";

// Validation schema - Made more permissive to allow custom validation logic
const packageFormSchema = z.object({
  name: z.string().optional(),
  shortDescription: z.string().optional(),
  overview: z.string().optional(),
  basePrice: z.coerce.number().optional(),
  countryId: z.coerce.number().optional().nullable(),
  cityId: z.coerce.number().optional().nullable(),
  category: z.string().optional(),
  categoryId: z.coerce.number().optional().nullable(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  route: z.string().optional(),
  maxGroupSize: z.coerce.number().min(1, { message: "Group size must be at least 1" }).optional(),
  language: z.string().optional(),
  bestTimeToVisit: z.string().optional(),
  idealFor: z.array(z.string()).optional(),
  whatToPack: z.array(z.object({
    item: z.string(),
    icon: z.string().optional(),
    tooltip: z.string().optional()
  })).optional(),
  itinerary: z.array(z.object({
    day: z.number(),
    title: z.string(),
    description: z.string(),
    image: z.string().optional()
  })).optional(),
  transportation: z.string().optional(),
  transportationPrice: z.coerce.number().optional(),
  accommodationHighlights: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional()
  })).optional(),
  selectedHotels: z.array(z.string()).optional(),
  adultCount: z.coerce.number().min(1, { message: "At least 1 adult is required" }),
  childrenCount: z.coerce.number().min(0, { message: "Cannot be negative" }),
  infantCount: z.coerce.number().min(0, { message: "Cannot be negative" }),
  rooms: z.array(z.object({
    id: z.string(),
    name: z.string(),
    hotelId: z.string(),
    hotelName: z.string(),
    price: z.coerce.number(),
    maxAdults: z.number().optional(),
    maxChildren: z.number().optional(),
    maxInfants: z.number().optional()
  })).optional(),
  pricingMode: z.enum(["per_booking", "per_percentage", "per_amount"]),
  includedFeatures: z.array(z.string()).optional(),
  excludedItems: z.array(z.string()).optional(),
  selectedTourId: z.number().optional(),
});

type PackageFormValues = z.infer<typeof packageFormSchema>;

// We're using the names in the pricingRules directly now, so this array is no longer needed
// Kept for backward compatibility
const pricingOptions = [
  { id: "adult", label: "Adult (12+ years)" },
  { id: "child", label: "Child (2-11 years)" },
  { id: "infant", label: "Infant (0-23 months)" },
];

const hotels = [
  { id: "hotel1", name: "Pyramids View Hotel", rooms: ["Deluxe Room", "Superior Room", "Suite"] },
  { id: "hotel2", name: "Nile Palace Resort", rooms: ["Standard Room", "Executive Room", "Royal Suite"] },
  { id: "hotel3", name: "Desert Oasis Lodge", rooms: ["Garden View", "Pool View", "Presidential Suite"] },
];

const features = [
  { id: "breakfast", label: "Breakfast Included" },
  { id: "lunch", label: "Lunch Included" },
  { id: "dinner", label: "Dinner Included" },
  { id: "airport_transfer", label: "Airport Transfer" },
  { id: "city_tour", label: "City Tour" },
  { id: "wifi", label: "Free Wi-Fi" },
  { id: "excursion", label: "Optional Excursions" },
];

const excludedItems = [
  { id: "meals", label: "Additional Meals" },
  { id: "insurance", label: "Travel Insurance" },
  { id: "drinks", label: "Drinks during meals" },
  { id: "tips", label: "Tips and Gratuities" },
  { id: "personal", label: "Personal Expenses" },
  { id: "visa", label: "Visa Fees" },
  { id: "extras", label: "Optional Activities" },
];

const travellerTypes = [
  { id: "families", label: "Families" },
  { id: "couples", label: "Couples" },
  { id: "solo", label: "Solo Travelers" },
  { id: "seniors", label: "Seniors" },
  { id: "friends", label: "Groups of Friends" },
  { id: "business", label: "Business Travelers" },
  { id: "adventure", label: "Adventure Seekers" },
];

const languages = [
  { id: "english", label: "English" },
  { id: "arabic", label: "Arabic" },
  { id: "french", label: "French" },
  { id: "spanish", label: "Spanish" },
  { id: "german", label: "German" },
  { id: "italian", label: "Italian" },
  { id: "russian", label: "Russian" },
  { id: "chinese", label: "Chinese" },
];

const transportOptions = [
  { id: "private_car", label: "Private Car", priceMultiplier: 1.2 },
  { id: "shared_minivan", label: "Shared Minivan", priceMultiplier: 1 },
  { id: "luxury_car", label: "Luxury Car", priceMultiplier: 1.5 },
  { id: "coach", label: "Coach Bus", priceMultiplier: 0.8 },
  { id: "self_drive", label: "Self Drive", priceMultiplier: 0.7 },
];

// This static array will be replaced by the dynamic data from packageCategories
const categoryOptions = [
  { value: "cultural", label: "Cultural Tours" },
  { value: "beach", label: "Beach Holidays" },
  { value: "adventure", label: "Adventure" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "family", label: "Family Friendly" },
  { value: "luxury", label: "Luxury" },
];

export interface PackageCreatorFormProps {
  packageId?: string; // Optional package ID for edit mode
  onNavigateRequest?: () => void; // Optional callback for navigation requests
}

// Export function with two names
// Define a tour type
interface Tour {
  id: number;
  name: string;
  price: number;
  description: string;
  duration?: number;
  status?: string;
  destination_id?: number;
}

export function PackageCreatorForm({ packageId, onNavigateRequest }: PackageCreatorFormProps) {
  const isEditMode = !!packageId;
  const [, setLocation] = useLocation();

  const { toast } = useToast();
  const [pricingRules, setPricingRules] = useState([
    { id: "adult", value: 100, percentage: true, name: "Adult (12+ years)" },
    { id: "child", value: 75, percentage: true, name: "Child (2-11 years)" },
    { id: "infant", value: 0, percentage: true, name: "Infant (0-23 months)" },
  ]);
  const [images, setImages] = useState<{ id: string; file: File | null; preview: string; isMain: boolean }[]>([]);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [selectedHotelRooms, setSelectedHotelRooms] = useState<any[]>([]);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Tour selection variables
  const [tourSearchQuery, setTourSearchQuery] = useState<string>('');
  const [showTourDropdown, setShowTourDropdown] = useState<boolean>(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const tourSearchRef = useRef<HTMLDivElement>(null);

  // Track whether we're submitting an update or create
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  
  // For validation hints
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({});
  const [showValidationHints, setShowValidationHints] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("basic");
  
  // Package feature states with user-friendly names
  const [excludedItemsList, setExcludedItemsList] = useState<string[]>([]);
  const [selectedTravellerTypes, setSelectedTravellerTypes] = useState<string[]>([]);
  const [optionalExcursions, setOptionalExcursions] = useState<string[]>([]);
  const [travelRouteItems, setTravelRouteItems] = useState<string[]>([]);
  
  // Packing list section
  const [packItems, setPackItems] = useState<{ item: string, icon: string, tooltip: string }[]>([]);
  const [newPackItem, setNewPackItem] = useState({ item: "", icon: "Luggage", tooltip: "" });
  
  // Day-by-day itinerary
  const [itineraryItems, setItineraryItems] = useState<{ day: number, title: string, description: string, image: string }[]>([]);
  const [newItineraryDay, setNewItineraryDay] = useState({ day: 1, title: "", description: "", image: "" });
  
  // Hotel and accommodation features
  const [accommodationHighlights, setAccommodationHighlights] = useState<{ title: string, description: string, icon: string }[]>([]);
  const [newHighlight, setNewHighlight] = useState({ title: "", description: "", icon: "Hotel" });
  
  // For transportation options
  const [selectedTransport, setSelectedTransport] = useState("");
  const [transportPrice, setTransportPrice] = useState(0);
  const [allowFormSubmission, setAllowFormSubmission] = useState(false);
  
  // Track form changes for unsaved changes warning
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialFormData, setInitialFormData] = useState<PackageFormValues | null>(null);

  // Function to check for unsaved changes and warn user
  const handleNavigateWithWarning = (destination: string) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
      );
      if (confirmLeave) {
        if (onNavigateRequest) {
          onNavigateRequest();
        } else {
          setLocation(destination);
        }
      }
    } else {
      if (onNavigateRequest) {
        onNavigateRequest();
      } else {
        setLocation(destination);
      }
    }
  };

  // Fetch destinations for the dropdown
  const { data: destinations = [] } = useQuery<any[]>({
    queryKey: ['/api/destinations'],
  });

  // Fetch package categories for the dropdown
  const { data: packageCategories = [] } = useQuery<any[]>({
    queryKey: ['/api/package-categories'],
  });
  
  // Fetch tours for the tour search feature
  const { data: tours = [] } = useQuery<Tour[]>({
    queryKey: ['/api/admin/tours'],
  });

  // Mock rooms data with capacity info - in a real app, this would come from your API
  const allRooms = [
    { id: "room1", name: "Deluxe Room", hotelId: "hotel1", hotelName: "Pyramids View Hotel", maxAdults: 2, maxChildren: 1, maxInfants: 1, price: 150 },
    { id: "room2", name: "Superior Room", hotelId: "hotel1", hotelName: "Pyramids View Hotel", maxAdults: 3, maxChildren: 2, maxInfants: 1, price: 200 },
    { id: "room3", name: "Suite", hotelId: "hotel1", hotelName: "Pyramids View Hotel", maxAdults: 4, maxChildren: 2, maxInfants: 2, price: 300 },
    { id: "room4", name: "Standard Room", hotelId: "hotel2", hotelName: "Nile Palace Resort", maxAdults: 2, maxChildren: 1, maxInfants: 1, price: 140 },
    { id: "room5", name: "Executive Room", hotelId: "hotel2", hotelName: "Nile Palace Resort", maxAdults: 2, maxChildren: 2, maxInfants: 1, price: 220 },
    { id: "room6", name: "Royal Suite", hotelId: "hotel2", hotelName: "Nile Palace Resort", maxAdults: 4, maxChildren: 3, maxInfants: 2, price: 400 },
    { id: "room7", name: "Garden View", hotelId: "hotel3", hotelName: "Desert Oasis Lodge", maxAdults: 2, maxChildren: 0, maxInfants: 1, price: 120 },
    { id: "room8", name: "Pool View", hotelId: "hotel3", hotelName: "Desert Oasis Lodge", maxAdults: 3, maxChildren: 1, maxInfants: 1, price: 180 },
    { id: "room9", name: "Presidential Suite", hotelId: "hotel3", hotelName: "Desert Oasis Lodge", maxAdults: 6, maxChildren: 4, maxInfants: 2, price: 500 },
  ];

  // Fetch countries for the dropdown
  const { data: countries = [] } = useQuery<any[]>({
    queryKey: ['/api/countries'],
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Fetch cities based on selected country
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const { data: cities = [] } = useQuery<any[]>({
    queryKey: ['/api/cities'],
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Memoize filtered cities to prevent unnecessary re-calculations
  const filteredCities = useMemo(() => {
    if (!selectedCountryId) return cities;
    return cities.filter(city => city.countryId === selectedCountryId);
  }, [cities, selectedCountryId]);

  // Fetch the package data if in edit mode
  const { data: existingPackageData, isLoading: isLoadingPackage } = useQuery<any>({
    queryKey: ['/api/packages'],
    select: (packages) => {
      // Find the package with matching ID from the packages array
      if (packageId && Array.isArray(packages)) {
        console.log('Finding package with ID:', packageId);
        const pkg = packages.find(p => p.id === parseInt(packageId));
        console.log('Found package:', pkg);
        return pkg;
      }
      return undefined;
    },
    enabled: isEditMode,
  });

  // Handle click outside tour search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tourSearchRef.current && !tourSearchRef.current.contains(event.target as Node)) {
        setShowTourDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tourSearchRef]);

  // Initialize form with empty values (will be updated when editing)
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: false,
    shouldUseNativeValidation: false,
    defaultValues: {
      name: "",
      shortDescription: "",
      overview: "",
      basePrice: 0,
      countryId: undefined,
      cityId: undefined,
      category: undefined,
      categoryId: undefined,
      route: "",
      maxGroupSize: 15,
      language: "english", // Match the ID in languages array
      bestTimeToVisit: "",
      idealFor: [],
      whatToPack: [],
      itinerary: [],
      transportation: "shared_minivan", // Default to standard option
      transportationPrice: 0,
      accommodationHighlights: [],
      pricingMode: "per_booking",
      includedFeatures: [],
      excludedItems: [],
      selectedHotels: [],
      adultCount: 2,
      childrenCount: 0,
      infantCount: 0,
      rooms: [],
      selectedTourId: undefined,
    },
  });

  // Package mutation (handles both create and update)
  const packageMutation = useMutation({
    mutationFn: async (formData: PackageFormValues) => {
      // Get the main image URL (or a default if none is set)
      const mainImage = images.find(img => img.isMain);
      // If the preview URL is a blob URL, use a placeholder or existing image
      let mainImageUrl = mainImage ? mainImage.preview : "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800";
      if (mainImageUrl && mainImageUrl.startsWith('blob:')) {
        // For edit mode, if we have existing data, use the existing image URL
        if (isEditMode && existingPackageData && existingPackageData.imageUrl) {
          mainImageUrl = existingPackageData.imageUrl;
        } else {
          // Otherwise use placeholder
          mainImageUrl = "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800";
        }
      }

      // Handle gallery URLs
      let galleryUrls: string[] = [];

      if (isEditMode && existingPackageData && existingPackageData.galleryUrls) {
        // For edit mode, if we already have gallery URLs in the database, start with those
        try {
          // Parse the existing gallery URLs
          const existingGalleryUrls: string[] = typeof existingPackageData.galleryUrls === 'string' 
            ? JSON.parse(existingPackageData.galleryUrls) 
            : (existingPackageData.galleryUrls as string[] || []);

          // Then add all non-blob URLs from the images array
          const validNewUrls = images
            .map(img => img.preview)
            .filter(url => !url.startsWith('blob:'));

          // Merge the two lists, filtering out duplicates
          // Use Array.from to properly handle the Set to Array conversion for TypeScript
          galleryUrls = Array.from(new Set([...existingGalleryUrls, ...validNewUrls]));
        } catch (e) {
          console.error("Error parsing galleryUrls:", e);
          galleryUrls = [];
        }
      } else {
        // For new packages, just use valid URLs
        galleryUrls = images
          .map(img => img.preview)
          .filter(url => !url.startsWith('blob:'));
      }

      // Transform the form data to match the API schema
      // Log current form values for debugging
      console.log('Form submission values:', {
        name: formData.name,
        overview: formData.overview,
        basePrice: formData.basePrice,
        countryId: formData.countryId,
        cityId: formData.cityId,
        category: formData.category,
        categoryId: formData.categoryId,
      });

      // Ensure countryId and cityId are valid numbers
      const countryId = formData.countryId ? Number(formData.countryId) : null;
      const cityId = formData.cityId ? Number(formData.cityId) : null;

      console.log('Parsed countryId:', countryId, 'cityId:', cityId);

      const packagePayload = {
        // Basic package information
        name: formData.name, // Map to title on server
        title: formData.name,
        shortDescription: formData.shortDescription || "",
        overview: formData.overview, // Map to description on server  
        description: formData.overview,
        basePrice: formData.basePrice || 0, // Map to price on server
        price: formData.basePrice || 0,
        discountedPrice: Math.round((formData.basePrice || 0) * 0.9),
        
        // Media
        imageUrl: mainImageUrl,
        galleryUrls: galleryUrls,
        
        // Location and categorization
        destinationId: formData.category ? parseInt(formData.category) : null,
        category: formData.category, // Map to categoryId on server
        categoryId: formData.categoryId,
        countryId: countryId,
        cityId: cityId,
        
        // Route and itinerary information
        route: formData.route || "",
        itinerary: itineraryItems,
        
        // Travel details
        duration: formData.startDate && formData.endDate 
          ? Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 3600 * 24)) 
          : 7,
        startDate: formData.startDate?.toISOString() || new Date().toISOString(),
        endDate: formData.endDate?.toISOString() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        
        // Traveler information
        idealFor: selectedTravellerTypes,
        adultCount: formData.adultCount,
        childrenCount: formData.childrenCount,
        infantCount: formData.infantCount,
        maxGroupSize: formData.maxGroupSize || 15,
        
        // Package features and inclusions
        includedFeatures: formData.includedFeatures || [],
        inclusions: formData.includedFeatures || [],
        excludedFeatures: excludedItemsList,
        excludedItems: excludedItemsList,
        optionalExcursions: optionalExcursions,
        
        // Accommodation and packing
        accommodationHighlights: accommodationHighlights,
        whatToPack: packItems,
        travelRoute: travelRouteItems,
        
        // Tour selection
        tourSelection: selectedTour?.id || formData.selectedTourId,
        selectedTourId: selectedTour?.id || formData.selectedTourId,
        
        // Pricing and metadata
        pricingMode: formData.pricingMode || "per_booking",
        language: formData.language || "english",
        bestTimeToVisit: formData.bestTimeToVisit || "",
        
        // Additional metadata
        rating: 45,
        featured: true,
        type: categoryOptions.find(c => c.value === formData.category)?.label || "Tour Package"
      };

      // Log final payload for debugging
      console.log('Package payload:', packagePayload);

      // Determine if this is an update or create
      const isUpdate = isEditMode && packageId;
      const url = isUpdate 
        ? `/api/admin/packages/${packageId}` 
        : '/api/admin/packages';

      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packagePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isUpdate ? 'update' : 'create'} package`);
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });

      // Show success message
      const action = isEditMode ? "Updated" : "Created";
      toast({
        title: `Package ${action}`,
        description: `The package was ${action.toLowerCase()} successfully`,
        variant: "default",
      });

      if (!isEditMode) {
        // Reset form after successful creation (not after update)
        form.reset();

        // Reset any component state
        setImages([]);
        setPricingRules([
          { id: "adult", value: 100, percentage: true, name: "Adult (12+ years)" },
          { id: "child", value: 75, percentage: true, name: "Child (2-11 years)" },
          { id: "infant", value: 0, percentage: true, name: "Infant (0-23 months)" },
        ]);
      }
    },
    onError: (error: Error) => {
      toast({
        title: `Error ${isEditMode ? 'updating' : 'creating'} package`,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = useCallback((data: PackageFormValues) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form submitted", data);
    console.log("allowFormSubmission state:", allowFormSubmission);
    
    // CRITICAL: Block all automatic submissions
    if (!allowFormSubmission) {
      console.log("🚫 FORM SUBMISSION BLOCKED - Manual trigger required");
      setAllowFormSubmission(false); // Reset to ensure it stays false
      return false;
    }
    
    console.log("✅ Form submission allowed - proceeding");

    // Check for missing required fields
    const errors = validateFormFields();
    console.log("=== VALIDATION COMPLETE ===");
    
    if (Object.keys(errors).length > 0) {
      // Show validation hints
      setValidationErrors(errors);
      setShowValidationHints(true);
      
      // Switch to the first tab with errors
      const firstErrorTab = getFirstTabWithErrors(errors);
      setActiveTab(firstErrorTab);
      
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      return;
    }

    // Hide validation hints if all fields are valid
    setShowValidationHints(false);
    setValidationErrors({});

    // Use our validation utilities for better error handling

    // 1. Required fields validation
    const requiredFieldsValid = validateRequiredFields(
      data,
      ['name', 'overview', 'countryId', 'cityId', 'category', 'startDate', 'endDate', 'basePrice'],
      {
        name: 'Package Name',
        overview: 'Overview',
        countryId: 'Country',
        cityId: 'City',
        category: 'Destination',
        startDate: 'Start Date',
        endDate: 'End Date',
        basePrice: 'Base Price'
      }
    );

    if (!requiredFieldsValid) return;

    // 2. Numeric fields validation
    const numericFieldsValid = validateNumericFields(
      data,
      [
        { field: 'basePrice', label: 'Base Price', min: 0.01 },
        { field: 'adultCount', label: 'Adult Count', min: 1, integer: true },
        { field: 'childrenCount', label: 'Children Count', min: 0, integer: true },
        { field: 'infantCount', label: 'Infant Count', min: 0, integer: true }
      ]
    );

    if (!numericFieldsValid) return;

    // 3. Date fields validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateFieldsValid = validateDateFields(
      data,
      [
        { 
          field: 'startDate', 
          label: 'Start Date', 
          notInPast: true 
        },
        { 
          field: 'endDate', 
          label: 'End Date', 
          notInPast: true 
        }
      ],
      [
        {
          startField: 'startDate',
          endField: 'endDate',
          startLabel: 'Start Date',
          endLabel: 'End Date'
        }
      ]
    );

    if (!dateFieldsValid) return;

    // 4. Custom validations
    const customValidationsValid = validateForm(data, [
      {
        condition: (data.endDate && data.startDate) ? data.endDate.getTime() === data.startDate.getTime() : false,
        errorMessage: {
          title: "Invalid Duration",
          description: "The package must have at least 1 day duration"
        },
        variant: "destructive"
      },
      {
        condition: data.includedFeatures === undefined || (data.includedFeatures && data.includedFeatures.length === 0),
        errorMessage: {
          title: "No Features Selected",
          description: "Please select at least one included feature for the package"
        },
        variant: "destructive"
      }
    ]);

    if (!customValidationsValid) {
      setAllowFormSubmission(false);
      return;
    }

    // All validations passed, proceed with submission
    packageMutation.mutate(data);
    
    // Reset the permission flag after submission
    setAllowFormSubmission(false);
  }, [allowFormSubmission]);

  // Effect to load package data when in edit mode
  useEffect(() => {
    if (isEditMode && existingPackageData && !isInitialized) {
      console.log('Initializing edit form with package data:', existingPackageData);

      // Parse JSON strings into arrays if needed
      const inclusions = typeof existingPackageData.inclusions === 'string' 
        ? JSON.parse(existingPackageData.inclusions) 
        : existingPackageData.inclusions || [];

      // Handle gallery URLs, ensuring we have a non-null array even if no images
      let galleryUrls: string[] = [];
      if (existingPackageData.galleryUrls) {
        galleryUrls = typeof existingPackageData.galleryUrls === 'string' 
          ? JSON.parse(existingPackageData.galleryUrls) 
          : (existingPackageData.galleryUrls as string[] || []);
      }

      // If galleryUrls is still null or undefined, use an empty array
      if (!galleryUrls) galleryUrls = [];

      // If we don't have any gallery images but we have a main image, add it to the gallery
      if (galleryUrls.length === 0 && existingPackageData.imageUrl) {
        galleryUrls = [existingPackageData.imageUrl];
      }

      // Find the destination data for this package to get country and city
      const destinationId = existingPackageData.destinationId;
      const destination = destinations.find(d => d.id === destinationId);
      console.log('Found destination for package:', destination);

      // Determine country ID from the destination
      let countryId = existingPackageData.countryId;
      if (!countryId && destination) {
        // Try to find the country from the country name
        const country = countries.find(c => c.name === destination.country);
        if (country) {
          countryId = country.id;
          console.log('Auto-detected country ID:', countryId);
        }
      }

      // Set the country ID first to load cities
      if (countryId) {
        setSelectedCountryId(countryId);
      }

      // Ensure we have the main image loaded
      const mainImageUrl = existingPackageData.imageUrl || "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800";

      // Create a default gallery with the main image if no gallery exists
      if (galleryUrls.length === 0 && mainImageUrl) {
        galleryUrls = [mainImageUrl];
      }

      // Make sure the main image is included in the gallery
      if (mainImageUrl && !galleryUrls.includes(mainImageUrl)) {
        galleryUrls.unshift(mainImageUrl);
      }

      // Log image information for debugging
      console.log('Package main image URL:', mainImageUrl);
      console.log('Gallery URLs:', galleryUrls);

      // Create image objects from galleryUrls
      const imageObjects = galleryUrls.map((url: string, index: number) => ({
        id: `existing-${index}`,
        file: null, 
        preview: url,
        isMain: url === mainImageUrl // Set main image flag
      }));

      // Ensure at least one image is marked as main
      if (imageObjects.length > 0 && !imageObjects.some((img: {isMain: boolean}) => img.isMain)) {
        console.log('No main image found, setting first image as main');
        imageObjects[0].isMain = true;
      }

      // Log the created image objects
      console.log('Created image objects:', imageObjects);

      // Set state values
      setImages(imageObjects);
      setIsInitialized(true);

      // Calculate dates based on duration if not provided
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7); // Default to 1 week from now
      const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7 + (existingPackageData.duration || 7)); // Default to 1 week duration

      // Try to detect city ID based on the destination name matching a city name
      let cityId = existingPackageData.cityId;
      if (!cityId && destination) {
        if (destination.city_id) {
          cityId = destination.city_id;
        } else {
          // Try to find a city with the same name as the destination
          const matchedCity = cities.find(city => 
            city.name === destination.name && 
            (!countryId || city.countryId === countryId)
          );

          if (matchedCity) {
            cityId = matchedCity.id;
            console.log('Matched city by name:', matchedCity.name, 'ID:', cityId);
          } else {
            // Hard-coded mappings based on known destination-to-city relationships
            const destinationCityMap: Record<number, number> = {
              1: 1,  // Cairo destination → Cairo city
              2: 4,  // Dubai destination → Dubai city
              3: 3,  // Sharm El Sheikh destination → Sharm El Sheikh city
              4: 7,  // Petra destination → Petra city
              5: 8,  // Marrakech destination → Marrakech city
            };

            if (destinationCityMap[destination.id]) {
              cityId = destinationCityMap[destination.id];
              console.log('Applied city mapping for destination ID:', destination.id, 'City ID:', cityId);
            }
          }
        }
      }

      // Log what we found for debugging
      console.log('Setting form values with:', {
        countryId,
        cityId,
        destinationId: existingPackageData.destinationId,
        category: existingPackageData.destinationId?.toString()
      });

      // Wait for the country to load cities before setting the form values
      setTimeout(() => {
        // Log the available cities for the selected country
        console.log('Available cities for country ID', countryId, ':', cities);

        // Parse additional field data
        const parsedShortDescription = existingPackageData.shortDescription || "";
        const parsedCategoryId = existingPackageData.categoryId || null;
        const parsedIdealFor = existingPackageData.idealFor 
          ? (typeof existingPackageData.idealFor === 'string' 
              ? JSON.parse(existingPackageData.idealFor) 
              : existingPackageData.idealFor)
          : [];
        const parsedRoute = existingPackageData.route || "";
        const parsedWhatToPack = existingPackageData.whatToPack 
          ? (typeof existingPackageData.whatToPack === 'string' 
              ? JSON.parse(existingPackageData.whatToPack) 
              : existingPackageData.whatToPack)
          : [];
        const parsedItinerary = existingPackageData.itinerary 
          ? (typeof existingPackageData.itinerary === 'string' 
              ? JSON.parse(existingPackageData.itinerary) 
              : existingPackageData.itinerary)
          : [];
        const parsedExcludedItems = existingPackageData.excludedItems 
          ? (typeof existingPackageData.excludedItems === 'string' 
              ? JSON.parse(existingPackageData.excludedItems) 
              : existingPackageData.excludedItems)
          : [];
        const parsedAccommodationHighlights = existingPackageData.accommodationHighlights 
          ? (typeof existingPackageData.accommodationHighlights === 'string' 
              ? JSON.parse(existingPackageData.accommodationHighlights) 
              : existingPackageData.accommodationHighlights)
          : [];

        // Set component state for complex fields
        setSelectedTravellerTypes(parsedIdealFor);
        setPackItems(parsedWhatToPack);
        setItineraryItems(parsedItinerary);
        setExcludedItemsList(parsedExcludedItems);
        setAccommodationHighlights(parsedAccommodationHighlights);
        
        // Set selected tour if exists
        if (existingPackageData.selectedTourId) {
          const tour = tours.find(t => t.id === existingPackageData.selectedTourId);
          if (tour) {
            setSelectedTour(tour);
          }
        }

        // Set form values
        form.reset({
          name: existingPackageData.title || "",
          shortDescription: parsedShortDescription,
          overview: existingPackageData.description || "",
          basePrice: existingPackageData.price || 0,
          countryId: countryId,
          cityId: cityId,
          category: existingPackageData.destinationId?.toString() || undefined,
          categoryId: parsedCategoryId,
          route: parsedRoute,
          // Set dates with sensible defaults
          startDate: startDate,
          endDate: endDate,
          pricingMode: "per_booking", // Default if not available
          includedFeatures: inclusions,
          excludedItems: parsedExcludedItems,
          idealFor: parsedIdealFor,
          whatToPack: parsedWhatToPack,
          itinerary: parsedItinerary,
          accommodationHighlights: parsedAccommodationHighlights,
          selectedTourId: existingPackageData.selectedTourId,
          adultCount: 2,
          childrenCount: 0,
          infantCount: 0,
        });

        // Force update the form control values directly as a backup
        form.setValue('countryId', countryId);
        form.setValue('cityId', cityId);
        form.setValue('categoryId', parsedCategoryId);
        form.setValue('shortDescription', parsedShortDescription);
        form.setValue('route', parsedRoute);

        // Set initial form data for change tracking
        const currentFormData = form.getValues();
        setInitialFormData(currentFormData);

        console.log('Form values set:', currentFormData);
      }, 800); // Give a longer delay to ensure cities are loaded
    }
  }, [existingPackageData, isEditMode, form, isInitialized, destinations, countries, cities]);

  // Watch form changes to track unsaved changes (after form is initialized)
  const formValues = form.watch();
  
  useEffect(() => {
    if (initialFormData) {
      const hasChanges = JSON.stringify(formValues) !== JSON.stringify(initialFormData);
      setHasUnsavedChanges(hasChanges);
    }
  }, [formValues, initialFormData]);

  // Listen for navigate requests from the parent component
  useEffect(() => {
    const handleNavigateRequest = () => {
      handleNavigateWithWarning("/admin/packages");
    };

    window.addEventListener('navigate-request', handleNavigateRequest);
    return () => {
      window.removeEventListener('navigate-request', handleNavigateRequest);
    };
  }, [hasUnsavedChanges]);

  // Effect to initialize rooms when component loads
  useEffect(() => {
    // This would normally be an API call in a real app
    const adultCount = form.getValues("adultCount") || 2;
    const childrenCount = form.getValues("childrenCount") || 0;
    const infantCount = form.getValues("infantCount") || 0;

    setAvailableRooms(allRooms);
    filterRoomsByCapacity(allRooms, adultCount, childrenCount, infantCount);
  }, []);

  const handleHotelSelectionChange = (selectedHotelIds: string[]) => {
    form.setValue("selectedHotels", selectedHotelIds);
    updateAvailableRooms(selectedHotelIds);
  };

  const updateAvailableRooms = (selectedHotelIds: string[]) => {
    const hotelRooms = allRooms.filter(room => 
      selectedHotelIds.includes(room.hotelId)
    );
    setAvailableRooms(hotelRooms);

    const adultCount = form.getValues("adultCount") || 2;
    const childrenCount = form.getValues("childrenCount") || 0;
    const infantCount = form.getValues("infantCount") || 0;
    
    filterRoomsByCapacity(hotelRooms, adultCount, childrenCount, infantCount);
  };
  
  // Function to handle tour selection
  const handleTourSelection = (tour: Tour) => {
    setSelectedTour(tour);
    form.setValue("selectedTourId", tour.id);
    setShowTourDropdown(false);
    setTourSearchQuery(tour.name);
  };
  
  // Function to filter tours based on search query
  const getFilteredTours = () => {
    if (!tourSearchQuery.trim()) {
      // If empty query, return the most recent 10 tours
      return [...tours].sort((a, b) => b.id - a.id).slice(0, 10);
    }
    
    // Otherwise filter by name match
    return tours.filter(tour => 
      tour.name.toLowerCase().includes(tourSearchQuery.toLowerCase())
    );
  };
  
  const filterRoomsByCapacity = (rooms: any[], adults: number, children: number, infants: number) => {
    const filtered = rooms.filter(room => 
      room.maxAdults >= adults && 
      room.maxChildren >= children && 
      room.maxInfants >= infants
    );
    setFilteredRooms(filtered);

    // Clear selected rooms that no longer match criteria
    const currentSelectedRooms = form.getValues("rooms") || [];
    const validRoomIds = filtered.map(room => room.id);
    const validSelectedRooms = currentSelectedRooms.filter(
      room => validRoomIds.includes(room.id)
    );
    form.setValue("rooms", validSelectedRooms);
  };

  const handlePricingRuleChange = (id: string, field: "value" | "percentage", value: number | boolean) => {
    setPricingRules(prev => 
      prev.map(rule => 
        rule.id === id 
          ? { 
              ...rule, 
              [field]: field === "percentage" ? value : Number(value)
            } 
          : rule
      )
    );
  };

  // Reference to hidden file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Create a temporary URL for preview until upload completes
      const tempPreview = URL.createObjectURL(file);

      // Read the file as base64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        try {
          // Upload the image to the server
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: reader.result,
              type: file.name.split('.').pop() || 'jpeg'
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to upload image');
          }

          const data = await response.json();
          const serverUrl = data.imageUrl; // URL to the uploaded image on the server

          // Set as main image if this is the first image
          const isFirstImage = images.length === 0;

          // Add to images array with the permanent server URL
          const newImage = {
            id: Math.random().toString(36).substring(7),
            file: null, // We don't need to keep the file object anymore
            preview: serverUrl, // Use the server URL instead of blob URL
            isMain: isFirstImage
          };

          setImages(prev => [...prev, newImage]);

          // Clean up the temporary blob URL
          URL.revokeObjectURL(tempPreview);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Error uploading image",
            description: "Failed to upload image to server",
            variant: "destructive",
          });
        }
      };

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const setMainImage = (id: string) => {
    setImages(prev => 
      prev.map(image => ({
        ...image,
        isMain: image.id === id
      }))
    );
  };

  const addImage = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Validation helper functions
  const validateFormFields = useCallback(() => {
    const formData = form.getValues();
    const errors: {[key: string]: string[]} = {};

    // Basic Info tab validation
    const basicErrors: string[] = [];
    if (!formData.name || formData.name.trim().length < 3) {
      basicErrors.push("Package Name");
    }
    if (!formData.shortDescription || formData.shortDescription.trim().length < 10) {
      basicErrors.push("Short Description");
    }
    if (!formData.countryId || formData.countryId === null || formData.countryId === 0) {
      basicErrors.push("Country");
    }
    if (!formData.cityId || formData.cityId === null || formData.cityId === 0) {
      basicErrors.push("City");
    }
    if (!formData.categoryId || formData.categoryId === null || formData.categoryId === 0) {
      basicErrors.push("Package Category");
    }
    if (!formData.overview || formData.overview.trim().length < 10) {
      basicErrors.push("Overview");
    }
    if (basicErrors.length > 0) {
      errors["Basic Info"] = basicErrors;
    }

    // Pricing Rules tab validation
    const pricingErrors: string[] = [];
    if (!formData.basePrice || formData.basePrice <= 0) {
      pricingErrors.push("Base Price");
    }
    if (!formData.startDate) {
      pricingErrors.push("Start Date");
    }
    if (!formData.endDate) {
      pricingErrors.push("End Date");
    }
    if (pricingErrors.length > 0) {
      errors["Pricing Rules"] = pricingErrors;
    }

    return errors;
  }, [form]);

  const getFirstTabWithErrors = (errors: {[key: string]: string[]}) => {
    const tabOrder = ["basic", "pricing", "accommodation", "features", "itinerary", "packing", "route"];
    const errorTabs = Object.keys(errors);
    
    for (const tab of tabOrder) {
      if (tab === "basic" && errorTabs.includes("Basic Info")) return "basic";
      if (tab === "pricing" && errorTabs.includes("Pricing Rules")) return "pricing";
      if (tab === "accommodation" && errorTabs.includes("Hotel & Rooms")) return "accommodation";
      if (tab === "features" && errorTabs.includes("Features")) return "features";
      if (tab === "itinerary" && errorTabs.includes("Itinerary")) return "itinerary";
      if (tab === "packing" && errorTabs.includes("What to Pack")) return "packing";
      if (tab === "route" && errorTabs.includes("Travel Route")) return "route";
    }
    return "basic";
  };

  const removeImage = (id: string) => {
    // Find the image to remove
    const imageToRemove = images.find(img => img.id === id);
    const wasMainImage = imageToRemove?.isMain || false;

    // Revoke object URL to prevent memory leaks
    if (imageToRemove && imageToRemove.preview && !imageToRemove.preview.startsWith('https://placehold.co')) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    // Remove from state
    const updatedImages = images.filter(image => image.id !== id);

    // If we removed the main image and there are other images, set the first one as main
    if (wasMainImage && updatedImages.length > 0) {
      updatedImages[0].isMain = true;
    }

    setImages(updatedImages);
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!allowFormSubmission) {
          console.log("🚫 BLOCKED: Form auto-submission prevented");
          return false;
        }
        
        console.log("✅ ALLOWED: Manual form submission proceeding");
        onSubmit(form.getValues());
      }} className="space-y-8">
        <div className="mb-6">
          <FormRequiredFieldsNote />
          {packageMutation.isError && (
            <FormValidationAlert 
              status="error" 
              title={isEditMode ? "Package Update Failed" : "Package Creation Failed"} 
              message={packageMutation.error?.message || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the package.`} 
              className="mt-3"
            />
          )}
          
          {/* Validation Hints Box */}
          {showValidationHints && Object.keys(validationErrors).length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <h4 className="text-sm font-medium text-red-800 mb-2">You are missing info in:</h4>
              <div className="space-y-2">
                {Object.entries(validationErrors).map(([tabName, errors]) => (
                  <div key={tabName} className="text-sm">
                    <div className="font-medium text-red-700">• {tabName}:</div>
                    <div className="ml-4 space-y-1">
                      {errors.map((error, index) => (
                        <div key={index} className="text-red-600">- {error}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
            <TabsTrigger value="accommodation">Hotel & Rooms</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="whatTopack">What to Pack</TabsTrigger>
            <TabsTrigger value="travelRoute">Travel Route</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        id="package-name"
                        className="package-name-input admin-input"
                        placeholder="Enter package name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Short Description */}
              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        id="package-short-description"
                        className="package-short-description-input admin-input"
                        placeholder="Brief description for package listings" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A short summary that will appear in package listings (max 200 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country Selection */}
              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        const countryId = parseInt(value);
                        console.log('Country selection changed to:', countryId);
                        field.onChange(countryId);
                        setSelectedCountryId(countryId);
                        // Reset cityId when country changes
                        form.setValue("cityId", null as any);

                        // Log available cities for the selected country
                        const filteredCities = Array.isArray(cities) ? 
                          cities.filter(city => city.countryId === countryId) : [];
                        console.log('Available cities for country', countryId, ':', filteredCities);
                      }} 
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger 
                          id="package-country"
                          className="country-select admin-select"
                        >
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country: any) => (
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

              {/* City Selection */}
              <FormField
                control={form.control}
                name="cityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(parseInt(value));
                      }} 
                      value={field.value?.toString()}
                      disabled={!selectedCountryId}
                    >
                      <FormControl>
                        <SelectTrigger 
                          id="package-city"
                          className="city-select admin-select"
                        >
                          <SelectValue placeholder={selectedCountryId ? "Select a city" : "Select a country first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.isArray(cities) && cities
                          .filter((city: any) => city.countryId === selectedCountryId)
                          .map((city: any) => (
                            <SelectItem key={city.id} value={city.id.toString()}>
                              {city.name}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Destination Selection */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger 
                          id="package-destination"
                          className="destination-select admin-select"
                        >
                          <SelectValue placeholder="Select a destination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {destinations.map((destination: any) => (
                          <SelectItem key={destination.id} value={destination.id.toString()}>
                            {destination.name}, {destination.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the destination for this package
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Category <span className="text-destructive">*</span></FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger 
                          id="package-category"
                          className="category-select admin-select"
                        >
                          <SelectValue placeholder="Select a package category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {packageCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the category that best describes this package.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      id="package-short-description"
                      className="min-h-[80px] package-short-description-input admin-textarea"
                      placeholder="Enter a brief description (max 200 characters)" 
                      maxLength={200}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A brief summary that appears in package listings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overview</FormLabel>
                  <FormControl>
                    <Textarea 
                      id="package-overview"
                      className="min-h-[120px] package-description-input admin-textarea"
                      placeholder="Enter package overview" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-zinc-500">$</span>
                      <Input 
                        id="package-base-price"
                        className="pl-7 package-price-input admin-currency-input" 
                        type="number" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The base price for this package
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language Selection */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.id} value={language.id}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Primary language for this package tour.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Max Group Size */}
            <FormField
              control={form.control}
              name="maxGroupSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Group Size</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" placeholder="15" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum number of travelers in the group.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Best Time to Visit */}
            <FormField
              control={form.control}
              name="bestTimeToVisit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Best Time to Visit</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., October to April" {...field} />
                  </FormControl>
                  <FormDescription>
                    Recommended season or months for this tour.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Location/Route */}
            <FormField
              control={form.control}
              name="route"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route/Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cairo to Aswan" {...field} />
                  </FormControl>
                  <FormDescription>
                    The specific route or location of this tour.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ideal For */}
            <FormField
              control={form.control}
              name="idealFor"
              render={() => (
                <FormItem>
                  <FormLabel>Ideal For</FormLabel>
                  <div className="space-y-2">
                    {travellerTypes.map((type) => (
                      <div className="flex items-center space-x-2" key={type.id}>
                        <Checkbox
                          id={`ideal-for-${type.id}`}
                          checked={selectedTravellerTypes.includes(type.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTravellerTypes([...selectedTravellerTypes, type.id]);
                              form.setValue('idealFor', [...selectedTravellerTypes, type.id]);
                            } else {
                              const filtered = selectedTravellerTypes.filter(id => id !== type.id);
                              setSelectedTravellerTypes(filtered);
                              form.setValue('idealFor', filtered);
                            }
                          }}
                        />
                        <label
                          htmlFor={`ideal-for-${type.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Select all traveler types this package is suitable for.
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Gallery Images</h3>

              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map(image => (
                  <div key={image.id} className={`relative ${image.isMain ? 'ring-2 ring-primary' : ''}`}>
                    <img 
                      src={image.preview} 
                      alt="Gallery preview" 
                      className="w-full h-32 object-cover rounded-md border" 
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {!image.isMain && (
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-6 w-6 rounded-full bg-white"
                          onClick={() => setMainImage(image.id)}
                          title="Set as main image"
                        >
                          <Star size={14} className="text-amber-500" />
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => removeImage(image.id)}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                    {image.isMain && (
                      <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
                        Main Photo
                      </div>
                    )}
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addImage}
                    className="h-32 border-dashed flex flex-col items-center justify-center gap-2"
                  >
                    <ImagePlus size={24} />
                    <span className="text-sm">Add Image</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-32 border-dashed flex flex-col items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10"
                    onClick={() => {
                      // Get values from form
                      const overview = form.getValues('overview');
                      const cityName = cities.find(city => city.id === form.getValues('cityId'))?.name || 'Cairo';

                      if (!overview || overview.length < 10) {
                        toast({
                          title: "Missing Information",
                          description: "Please enter a package overview first (minimum 10 characters)",
                          variant: "destructive"
                        });
                        return;
                      }

                      setAiGenerating(true);

                      // Call the API
                      fetch('/api/admin/packages/generate-image', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ overview, city: cityName }),
                      })
                        .then(response => {
                          if (!response.ok) {
                            throw new Error('Failed to generate image');
                          }
                          return response.json();
                        })
                        .then(data => {
                          if (data.imageUrl) {
                            // Create a new image object
                            const newImage = {
                              id: Math.random().toString(36).substring(7),
                              file: null, // AI generated images don't have a file
                              preview: data.imageUrl,
                              isMain: images.length === 0 // Make it main if it's the first image
                            };

                            setImages(prev => [...prev, newImage]);

                            toast({
                              title: "Image Generated",
                              description: "AI has generated a new image for your package",
                              variant: "default"
                            });
                          }
                        })
                        .catch(error => {
                          console.error('Error generating image:', error);
                          toast({
                            title: "Generation Failed",
                            description: error.message || "Failed to generate image",
                            variant: "destructive"
                          });
                        })
                        .finally(() => {
                          setAiGenerating(false);
                        });
                    }}
                    disabled={aiGenerating}
                  >
                    {aiGenerating ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        <span className="text-sm">Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <path d="M12 2c1.5 0 3 1.5 3 3 0 1.4-.7 2.7-1.8 3.2.6.2 1.2.5 1.8.8 1 .5 1.3 1.8.8 2.7-.5.9-1.8 1.3-2.7.8-.7-.4-1.3-.6-2.1-.6s-1.4.2-2.1.6c-1 .5-2.2.2-2.7-.8-.5-1-.2-2.2.8-2.7.6-.3 1.2-.6 1.8-.8C7.7 7.7 7 6.4 7 5c0-1.5 1.5-3 3-3Z" />
                          <path d="M19 16.1c-1.1.6-2.5.1-3.1-1.1-.6-1.1-.2-2.5.9-3.1 1.1-.6 2.5-.1 3.1 1.1.7 1.1.2 2.5-.9 3.1Z" />
                          <path d="M9 14c.3 2.1-1.1 4-3 4-1.5 0-3-1.5-3-3 0-1.4.7-2.7 1.8-3.2-.6-.2-1.2-.5-1.8-.8-1-.5-1.3-1.8-.8-2.7.5-.9 1.7-1.3 2.7-.8.7.4 1.3.6 2.1.6" />
                          <path d="M21 12c0 4.4-3.6 8-8 8" />
                          <path d="M14 19c-1.9 1.9-5.1 2-7 0" />
                        </svg>
                        <span className="text-sm">AI Generate Image</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Pricing Rules Tab */}
          <TabsContent value="pricing" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="pricingMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Mode</FormLabel>
                  <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="per_booking"
                          value="per_booking"
                          checked={field.value === "per_booking"}
                          onChange={() => field.onChange("per_booking")}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="per_booking" className="text-sm font-medium">
                          Per Booking
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="per_percentage"
                          value="per_percentage"
                          checked={field.value === "per_percentage"}
                          onChange={() => field.onChange("per_percentage")}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="per_percentage" className="text-sm font-medium">
                          Per Percentage
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="per_amount"
                          value="per_amount"
                          checked={field.value === "per_amount"}
                          onChange={() => field.onChange("per_amount")}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="per_amount" className="text-sm font-medium">
                          Per Amount
                        </label>
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hotel Room Pricing Section */}
            {filteredRooms.length > 0 && (
              <div className="mb-6 border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-2">Hotel Room Pricing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure pricing for each selected room based on capacity
                </p>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Name</TableHead>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Price/Night</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>{room.name}</TableCell>
                        <TableCell>{room.hotelName}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {room.maxAdults} Adults
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {room.maxChildren} Children
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {room.maxInfants} Infants
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            defaultValue={room.price}
                            onChange={(e) => {
                              const currentRooms = form.getValues("rooms") || [];
                              const updatedRooms = currentRooms.map(r => 
                                r.id === room.id ? {...r, price: Number(e.target.value)} : r
                              );
                              form.setValue("rooms", updatedRooms);
                            }}
                            className="w-24"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="text-sm text-muted-foreground mt-4">
                  <span className="font-medium">Note:</span> Room prices will be adjusted based on the selected pricing mode and traveler rules below
                </div>
              </div>
            )}
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2 mb-4">
                  <h3 className="text-base font-medium">Traveler Pricing Rules</h3>
                  <p className="text-sm text-muted-foreground">Set prices per traveler type using either a percentage of the base price or a fixed amount in L.E.</p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Traveler Type</TableHead>
                      <TableHead>Price Value</TableHead>
                      <TableHead>Pricing Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          {rule.name}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={rule.value}
                            onChange={(e) => handlePricingRuleChange(rule.id, "value", e.target.value ? parseInt(e.target.value) : 0)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={rule.percentage}
                                onCheckedChange={(checked) => handlePricingRuleChange(rule.id, "percentage", checked)}
                              />
                              <span className="text-sm font-medium">
                                {rule.percentage ? "%" : "L.E"}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {rule.percentage 
                                ? `(${rule.value}% of base price)` 
                                : `(Fixed amount: ${rule.value} L.E)`}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={(filteredRooms?.length || 0) > 0 && (form.getValues("rooms")?.length || 0) > 0}
                    onClick={() => {
                      // In a real app, you would add a new pricing rule here
                      const newRule = { 
                        id: "infant", 
                        value: 50, 
                        percentage: true,
                        name: "Infant Discount"
                      };
                      setPricingRules(prev => [...prev, newRule]);
                    }}
                  >
                    <Plus size={16} className="mr-2" />
                    Add Pricing Rule
                  </Button>
                  
                  {(filteredRooms?.length || 0) > 0 && (form.getValues("rooms")?.length || 0) > 0 && (
                    <p className="text-xs text-amber-600 mt-2">
                      Adding new pricing rules is disabled when room pricing is configured
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accommodation Tab */}
          <TabsContent value="accommodation" className="space-y-6 pt-4">
            {/* New Hotel Search Component */}
            <HotelSearchComponent 
              onSelectionChange={(selectedRooms) => {
                setSelectedHotelRooms(selectedRooms);
              }}
              initialSelection={selectedHotelRooms}
              guestBreakdown={{
                adults: 2,
                children: 0,
                infants: 0
              }}
              nights={3}
              // Completely isolated from main form
            />


            {/* Guest Breakdown */}
            <div className="space-y-4 border rounded-md p-4">
              <h3 className="text-lg font-semibold">Guest Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="adultCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adults (12+ years)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field} 
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(value);
                            const selectedHotels = form.getValues("selectedHotels") || [];
                            if (selectedHotels.length > 0) {
                              updateAvailableRooms(selectedHotels);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="childrenCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Children (2-11 years)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(value);
                            const selectedHotels = form.getValues("selectedHotels") || [];
                            if (selectedHotels.length > 0) {
                              updateAvailableRooms(selectedHotels);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="infantCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Infants (0-23 months)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(value);
                            const selectedHotels = form.getValues("selectedHotels") || [];
                            if (selectedHotels.length > 0) {
                              updateAvailableRooms(selectedHotels);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Available Rooms */}
            {Array.isArray(form.watch("selectedHotels")) && (form.watch("selectedHotels")?.length || 0) > 0 && (
              <FormField
                control={form.control}
                name="rooms"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Available Rooms</h3>
                      <FormDescription>
                        Only rooms that can accommodate your specified guest count are shown.
                      </FormDescription>
                    </div>

                    {filteredRooms.length === 0 ? (
                      <div className="text-center p-8 border border-dashed rounded-md">
                        <p className="text-muted-foreground">No rooms match the selected criteria. Try adjusting your guest count or selecting different hotels.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {hotels
                          .filter(hotel => Array.isArray(form.watch("selectedHotels")) && form.watch("selectedHotels")?.includes(hotel.id))
                          .map(hotel => (
                            <div key={hotel.id} className="border rounded-md p-4">
                              <h4 className="font-medium text-md mb-3">{hotel.name}</h4>
                              <div className="grid grid-cols-1 gap-3">
                                {filteredRooms
                                  .filter(room => room.hotelId === hotel.id)
                                  .map((room) => (
                                    <FormItem
                                      key={room.id}
                                      className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3 rounded-md border p-4"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <FormControl>
                                          <Checkbox
                                            checked={Array.isArray(form.watch("rooms")) && form.watch("rooms")?.some(r => r.id === room.id)}
                                            onCheckedChange={(checked) => {
                                              const currentRooms = form.watch("rooms") || [];
                                              if (checked) {
                                                form.setValue("rooms", [...currentRooms, {
                                                  id: room.id,
                                                  name: room.name,
                                                  hotelId: room.hotelId,
                                                  hotelName: room.hotelName,
                                                  price: room.price
                                                }]);
                                              } else {
                                                form.setValue(
                                                  "rooms",
                                                  currentRooms.filter((r) => r.id !== room.id)
                                                );
                                              }
                                            }}
                                          />
                                        </FormControl>
                                        <div>
                                          <FormLabel className="font-medium cursor-pointer block">
                                            {room.name}
                                          </FormLabel>
                                          <div className="flex gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                              {room.maxAdults} Adults
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                              {room.maxChildren} Children
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                              {room.maxInfants} Infants
                                            </Badge>
                                          </div>
                                          <div className="text-sm text-muted-foreground mt-1">
                                            Room pricing moved to Pricing Rules section
                                          </div>
                                        </div>
                                      </div>

                                      <div className="ml-auto flex items-center space-x-4">
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                          <FormLabel>Price: </FormLabel>
                                          <Input 
                                            className="w-24"
                                            type="number" 
                                            min="0"
                                            value={room.price}
                                            onChange={(e) => {
                                              // Update price in local rooms data
                                              const newRooms = filteredRooms.map(r => {
                                                if (r.id === room.id) {
                                                  return {...r, price: parseInt(e.target.value)};
                                                }
                                                return r;
                                              });
                                              setFilteredRooms(newRooms);

                                              // If this room is already selected, update it in form
                                              const currentRooms = form.getValues("rooms") || [];
                                              const roomIndex = currentRooms.findIndex(r => r.id === room.id);
                                              if (roomIndex !== -1) {
                                                const updatedRooms = [...currentRooms];
                                                updatedRooms[roomIndex] = {
                                                  ...updatedRooms[roomIndex],
                                                  price: parseInt(e.target.value)
                                                };
                                                form.setValue("rooms", updatedRooms);
                                              }
                                            }}
                                          />
                                        </FormItem>
                                      </div>
                                    </FormItem>
                                  ))}

                                {filteredRooms.filter(room => room.hotelId === hotel.id).length === 0 && (
                                  <div className="text-center p-4 border border-dashed rounded-md">
                                    <p className="text-muted-foreground">No rooms in this hotel match the selected guest criteria.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6 pt-4">
            {/* Tour Search Component */}
            <div className="p-4 border rounded-md mb-6">
              <h3 className="text-lg font-semibold mb-2">Tour Selection</h3>
              <FormDescription className="mb-4">
                Search and select available tours to include in this package
              </FormDescription>
              
              <div className="relative mb-4" ref={tourSearchRef}>
                <div className="flex items-center relative">
                  <Input
                    type="text"
                    placeholder="Search for tours by name or click to view recent"
                    value={tourSearchQuery}
                    onChange={(e) => setTourSearchQuery(e.target.value)}
                    onFocus={() => setShowTourDropdown(true)}
                    onClick={() => setShowTourDropdown(true)}
                    className="pr-10"
                  />
                  <Search className="w-4 h-4 absolute right-3 text-gray-500" />
                </div>
                
                {showTourDropdown && (
                  <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
                    {!tourSearchQuery.trim() && (
                      <div className="px-4 py-2 text-sm text-zinc-500 border-b">
                        Showing 10 most recently added tours
                      </div>
                    )}
                    
                    {getFilteredTours().length > 0 ? (
                      getFilteredTours().map((tour) => (
                        <div
                          key={tour.id}
                          className="p-3 cursor-pointer hover:bg-zinc-100 border-b last:border-0"
                          onClick={() => handleTourSelection(tour)}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">{tour.name}</span>
                            <span className="text-sm font-semibold text-green-700">${tour.price}</span>
                          </div>
                          {tour.description && (
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              {tour.description.substring(0, 80)}...
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No tours found</div>
                    )}
                  </div>
                )}
              </div>
              
              {selectedTour && (
                <div className="mt-6 p-4 border rounded-md bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-zinc-900 text-lg">{selectedTour.name}</h4>
                      <p className="text-xs text-zinc-500 mt-1">Selected tour information (read-only)</p>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      ID: {selectedTour.id}
                    </Badge>
                  </div>
                  
                  <div className="bg-zinc-50 p-3 rounded-md mt-3 border border-zinc-100">
                    <h5 className="text-sm font-medium text-zinc-700 mb-2">Tour Description</h5>
                    <p className="text-sm text-zinc-600">{selectedTour.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-zinc-50 rounded-md border border-zinc-100">
                      <h5 className="text-xs font-medium text-zinc-700 mb-1">Base Price</h5>
                      <p className="text-lg font-semibold text-emerald-600">${selectedTour.price}</p>
                    </div>
                    
                    <div className="p-3 bg-zinc-50 rounded-md border border-zinc-100">
                      <h5 className="text-xs font-medium text-zinc-700 mb-1">Duration</h5>
                      <p className="text-lg font-semibold text-zinc-700">
                        {selectedTour.duration ? `${selectedTour.duration} hours` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedTour(null);
                        setTourSearchQuery('');
                      }}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove Tour
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="includedFeatures"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Included Features</FormLabel>
                    <FormDescription>
                      Select the features that are included in this package
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature) => (
                      <FormItem
                        key={feature.id}
                        className="flex items-center space-x-3 space-y-0 rounded-md border p-4"
                      >
                        <FormControl>
                          <Checkbox
                            checked={Array.isArray(form.watch("includedFeatures")) && form.watch("includedFeatures")?.includes(feature.id)}
                            onCheckedChange={(checked) => {
                              const currentFeatures = form.watch("includedFeatures") || [];
                              if (checked) {
                                form.setValue("includedFeatures", [...currentFeatures, feature.id]);
                              } else {
                                form.setValue(
                                  "includedFeatures",
                                  currentFeatures.filter((value) => value !== feature.id)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {feature.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Excluded Features */}
            <FormField
              control={form.control}
              name="excludedItems"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Excluded Features</FormLabel>
                    <FormDescription>
                      Select the features that are NOT included in this package
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {excludedItems.map((item) => (
                      <FormItem
                        key={item.id}
                        className="flex items-center space-x-3 space-y-0 rounded-md border p-4 border-red-200 bg-red-50"
                      >
                        <FormControl>
                          <Checkbox
                            checked={Array.isArray(form.watch("excludedItems")) && form.watch("excludedItems")?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              const currentItems = form.watch("excludedItems") || [];
                              if (checked) {
                                form.setValue("excludedItems", [...currentItems, item.id]);
                              } else {
                                form.setValue(
                                  "excludedItems",
                                  currentItems.filter((value) => value !== item.id)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer text-red-700">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6 pt-4">
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-medium">Day-by-Day Itinerary</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create a day-by-day breakdown of the tour itinerary.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {itineraryItems.map((item, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10">Day {item.day}</Badge>
                        <h4 className="font-medium">{item.title}</h4>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        type="button"
                        onClick={() => {
                          const updatedItems = itineraryItems.filter((_, i) => i !== index);
                          setItineraryItems(updatedItems);
                          form.setValue('itinerary', updatedItems);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    {item.image && (
                      <div className="mt-2">
                        <img 
                          src={item.image} 
                          alt={`Day ${item.day}: ${item.title}`}
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-4">Add New Day</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label htmlFor="day-number">Day #</Label>
                    <Input 
                      id="day-number" 
                      type="number"
                      min="1"
                      value={newItineraryDay.day}
                      onChange={(e) => setNewItineraryDay({...newItineraryDay, day: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Label htmlFor="day-title">Title</Label>
                    <Input 
                      id="day-title" 
                      value={newItineraryDay.title}
                      onChange={(e) => setNewItineraryDay({...newItineraryDay, title: e.target.value})}
                      placeholder="e.g., Arrival in Cairo"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="day-description">Description</Label>
                  <Textarea 
                    id="day-description" 
                    value={newItineraryDay.description}
                    onChange={(e) => setNewItineraryDay({...newItineraryDay, description: e.target.value})}
                    placeholder="Describe the activities and experiences for this day..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="day-image">Image URL (optional)</Label>
                  <Input 
                    id="day-image" 
                    value={newItineraryDay.image}
                    onChange={(e) => setNewItineraryDay({...newItineraryDay, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button 
                  type="button"
                  onClick={() => {
                    if (!newItineraryDay.title || !newItineraryDay.description) {
                      toast({
                        title: "Required fields missing",
                        description: "Please enter a title and description for this day",
                        variant: "destructive"
                      });
                      return;
                    }
                    
                    const updatedItems = [...itineraryItems, newItineraryDay];
                    // Sort by day number
                    updatedItems.sort((a, b) => a.day - b.day);
                    
                    setItineraryItems(updatedItems);
                    form.setValue('itinerary', updatedItems);
                    
                    // Reset the new day form but increment the day number
                    setNewItineraryDay({ 
                      day: Math.max(...updatedItems.map(item => item.day), 0) + 1, 
                      title: "", 
                      description: "", 
                      image: "" 
                    });
                  }}
                >
                  Add Itinerary Day
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* What to Pack Tab */}
          <TabsContent value="whatTopack" className="space-y-6 pt-4">
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-medium">What to Pack</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add recommended items for travelers to pack for this tour.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {packItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {/* Use an icon component if available */}
                      <LucideIcon name={item.icon} className="h-5 w-5 text-primary" fallback={<Package className="h-5 w-5 text-primary" />} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.item}</h4>
                      {item.tooltip && <p className="text-sm text-muted-foreground">{item.tooltip}</p>}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-auto"
                      type="button"
                      onClick={() => {
                        const updatedItems = packItems.filter((_, i) => i !== index);
                        setPackItems(updatedItems);
                        form.setValue('whatToPack', updatedItems);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input 
                    id="item-name" 
                    value={newPackItem.item}
                    onChange={(e) => setNewPackItem({...newPackItem, item: e.target.value})}
                    placeholder="e.g., Sunscreen"
                  />
                </div>
                <div>
                  <Label htmlFor="item-icon">Icon</Label>
                  <Input 
                    id="item-icon" 
                    value={newPackItem.icon}
                    onChange={(e) => setNewPackItem({...newPackItem, icon: e.target.value})}
                    placeholder="e.g., sun"
                  />
                </div>
                <div>
                  <Label htmlFor="item-tooltip">Tooltip/Description</Label>
                  <Input 
                    id="item-tooltip" 
                    value={newPackItem.tooltip}
                    onChange={(e) => setNewPackItem({...newPackItem, tooltip: e.target.value})}
                    placeholder="e.g., SPF 30+ recommended"
                  />
                </div>
              </div>

              <Button 
                type="button"
                onClick={() => {
                  if (!newPackItem.item) {
                    toast({
                      title: "Item name required",
                      description: "Please enter a name for the item",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  const updatedItems = [...packItems, newPackItem];
                  setPackItems(updatedItems);
                  form.setValue('whatToPack', updatedItems);
                  
                  // Reset the new item form
                  setNewPackItem({ item: "", icon: "suitcase", tooltip: "" });
                }}
              >
                Add Item
              </Button>
            </div>
          </TabsContent>

          {/* Travel Route Tab */}
          <TabsContent value="travelRoute" className="space-y-6 pt-4">
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-medium">Travel Route Map</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Define the travel route for this package tour.
              </p>
            </div>

            <div className="space-y-6">
              <div className="h-[400px] bg-slate-100 rounded-md flex items-center justify-center border">
                <div className="text-center p-4">
                  <MapIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <h3 className="text-lg font-medium mb-1">Map Integration</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    This section will display a map where the route can be pinned. 
                    Integration with a mapping service (Google Maps, Mapbox, etc.) is required.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the travel route (e.g., Cairo → Luxor → Aswan)" 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a clear description of the travel route.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="transportation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transportation Option</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedTransport(value);
                            
                            // Update price based on selection
                            const option = transportOptions.find(opt => opt.id === value);
                            if (option) {
                              const basePrice = form.getValues('basePrice') || 0;
                              const newPrice = basePrice * (option.priceMultiplier - 1);
                              form.setValue('transportationPrice', Math.round(newPrice));
                              setTransportPrice(Math.round(newPrice));
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transportation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {transportOptions.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.label} {option.priceMultiplier > 1 ? "(Premium)" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the transportation type for this package.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormField
                    control={form.control}
                    name="transportationPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transportation Price Adjustment</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-zinc-500">$</span>
                            <Input 
                              className="pl-7" 
                              type="number" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                setTransportPrice(parseFloat(e.target.value));
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Additional cost for premium transportation options.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Accommodation Highlights</h4>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {accommodationHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-md">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                        <LucideIcon name={highlight.icon} className="h-5 w-5 text-primary" fallback={<Hotel className="h-5 w-5 text-primary" />} />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{highlight.title}</h4>
                        <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-auto"
                        type="button"
                        onClick={() => {
                          const updatedHighlights = accommodationHighlights.filter((_, i) => i !== index);
                          setAccommodationHighlights(updatedHighlights);
                          form.setValue('accommodationHighlights', updatedHighlights);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="highlight-title">Title</Label>
                      <Input 
                        id="highlight-title" 
                        value={newHighlight.title}
                        onChange={(e) => setNewHighlight({...newHighlight, title: e.target.value})}
                        placeholder="e.g., Luxury Hotels"
                      />
                    </div>
                    <div>
                      <Label htmlFor="highlight-icon">Icon</Label>
                      <Input 
                        id="highlight-icon" 
                        value={newHighlight.icon}
                        onChange={(e) => setNewHighlight({...newHighlight, icon: e.target.value})}
                        placeholder="e.g., hotel"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Label htmlFor="highlight-description">Description</Label>
                      <Textarea 
                        id="highlight-description" 
                        value={newHighlight.description}
                        onChange={(e) => setNewHighlight({...newHighlight, description: e.target.value})}
                        placeholder="e.g., Stay at 5-star hotels with Nile views"
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>

                  <Button 
                    type="button"
                    onClick={() => {
                      if (!newHighlight.title || !newHighlight.description) {
                        toast({
                          title: "Required fields missing",
                          description: "Please enter a title and description for this highlight",
                          variant: "destructive"
                        });
                        return;
                      }
                      
                      const updatedHighlights = [...accommodationHighlights, newHighlight];
                      setAccommodationHighlights(updatedHighlights);
                      form.setValue('accommodationHighlights', updatedHighlights);
                      
                      // Reset the form
                      setNewHighlight({ title: "", description: "", icon: "home" });
                    }}
                  >
                    Add Accommodation Highlight
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-2">
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => handleNavigateWithWarning("/admin/packages")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={packageMutation.isPending}
              onClick={() => setAllowFormSubmission(true)}
            >
              {packageMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? "Update Package" : "Create Package"}
            </Button>
          </div>

          {packageMutation.isError && (
            <div className="text-sm text-destructive flex items-center gap-2 mt-2 justify-end">
              <AlertCircle className="h-4 w-4" />
              <span>{packageMutation.error?.message || "An error occurred"}</span>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}

// Export the same component as SimplePackageForm for use in PackageCreatorPage
export const SimplePackageForm = PackageCreatorForm;