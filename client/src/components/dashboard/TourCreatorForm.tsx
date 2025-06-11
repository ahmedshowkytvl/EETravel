import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest, getQueryFn } from "@/lib/queryClient";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { AlertCircle, Calendar as CalendarIcon, Loader2, Upload, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormRequiredFieldsNote } from "./FormRequiredFieldsNote";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const tourSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(20, { message: "Description should be at least 20 characters" }),
  destinationId: z.coerce.number().positive({ message: "Please select a destination" }),
  tripType: z.string().min(1, { message: "Please select a trip type" }),
  duration: z.coerce.number().min(1, { message: "Duration is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  numPassengers: z.coerce.number().min(1, { message: "At least 1 passenger is required" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  discountedPrice: z.coerce.number().min(0, { message: "Discounted price must be a positive number" }).optional().nullable(),
  included: z.array(z.string()).default([]),
  excluded: z.array(z.string()).default([]),
  itinerary: z.string().min(20, { message: "Itinerary should provide sufficient details" }),
  maxGroupSize: z.coerce.number().min(1, { message: "Group size must be at least 1" }).optional().nullable(),
  featured: z.boolean().default(false),
  status: z.string().default("active"),
});

type TourFormValues = z.infer<typeof tourSchema>;

export interface TourCreatorFormProps {
  tourId?: string;
}

export function TourCreatorForm({ tourId }: TourCreatorFormProps) {
  const isEditMode = !!tourId;
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All hooks defined consistently at the top
  const { data: destinations = [] } = useQuery<any[]>({
    queryKey: ['/api/destinations'],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  const { data: tourCategories = [] } = useQuery<any[]>({
    queryKey: ['/api/tour-categories'],
    queryFn: getQueryFn({ on401: "throw" }),
    select: (data) => 
      data
        .filter((category) => category.active)
        .map((category) => ({
          value: category.name,
          label: category.name
        }))
  });

  const { data: existingTour, isLoading: tourLoading } = useQuery({
    queryKey: ['/api/tours', tourId],
    queryFn: async () => {
      if (!tourId) return null;
      return await apiRequest(`/api/tours/${tourId}`);
    },
    enabled: isEditMode,
  });

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      name: "",
      description: "",
      destinationId: 0,
      tripType: "",
      duration: 1,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      numPassengers: 1,
      price: 0,
      discountedPrice: null,
      included: [],
      excluded: [],
      itinerary: "",
      maxGroupSize: 10,
      featured: false,
      status: "active",
    },
  });

  const tourMutation = useMutation({
    mutationFn: async (data: any) => {
      setIsSubmitting(true);
      
      let imageUrl = "";
      const mainImage = images.find(img => img.isMain && img.file);
      
      if (mainImage?.file) {
        const formData = new FormData();
        formData.append('image', mainImage.file);
        
        try {
          const uploadResponse = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          });
          
          const responseText = await uploadResponse.text();
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload main image');
          }
          
          const uploadResult = JSON.parse(responseText);
          imageUrl = uploadResult.url;
        } catch (error) {
          throw new Error('Failed to upload image');
        }
      }
      
      let galleryUrls: string[] = [];
      
      if (galleryImages.length > 0) {
        const galleryUploadPromises = galleryImages
          .filter(img => img.file)
          .map(async (img) => {
            if (!img.file) return null;
            
            const formData = new FormData();
            formData.append('image', img.file);
            
            try {
              const uploadResponse = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
              });
              
              const responseText = await uploadResponse.text();
              
              if (!uploadResponse.ok) {
                throw new Error('Failed to upload gallery image');
              }
              
              const uploadResult = JSON.parse(responseText);
              return uploadResult.url;
            } catch (error) {
              return null;
            }
          });
        
        const uploadedUrls = await Promise.all(galleryUploadPromises);
        galleryUrls = uploadedUrls.filter(Boolean) as string[];
      }
      
      const finalData = {
        ...data,
        imageUrl: imageUrl || (existingTour?.imageUrl || ""),
        galleryUrls: galleryUrls.length > 0 ? galleryUrls : (existingTour?.galleryUrls || []),
        date: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      };
      
      const url = isEditMode 
        ? `/api/admin/tours/${tourId}` 
        : '/api/admin/tours';
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(finalData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'An error occurred');
        } catch (parseError) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tours'] });
      toast({
        title: isEditMode ? "تم تحديث الرحلة" : "تم إنشاء الرحلة",
        description: isEditMode 
          ? "تم تحديث الرحلة بنجاح" 
          : "تم إنشاء الرحلة بنجاح",
      });
      setLocation('/admin/tours');
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  useEffect(() => {
    if (existingTour && isEditMode) {
      form.reset({
        name: existingTour.name || "",
        description: existingTour.description || "",
        destinationId: existingTour.destinationId || 0,
        tripType: existingTour.tripType || "",
        duration: existingTour.duration || 1,
        startDate: existingTour.date ? new Date(existingTour.date) : new Date(),
        endDate: existingTour.endDate ? new Date(existingTour.endDate) : new Date(),
        numPassengers: existingTour.numPassengers || 1,
        price: existingTour.price || 0,
        discountedPrice: existingTour.discountedPrice || null,
        included: Array.isArray(existingTour.included) ? existingTour.included : [],
        excluded: Array.isArray(existingTour.excluded) ? existingTour.excluded : [],
        itinerary: existingTour.itinerary || "",
        maxGroupSize: existingTour.maxGroupSize || 10,
        featured: existingTour.featured || false,
        status: existingTour.status || "active",
      });

      if (existingTour.imageUrl) {
        setImages([{
          id: 'main-existing',
          preview: existingTour.imageUrl,
          isMain: true,
          file: null
        }]);
      }

      if (existingTour.galleryUrls && Array.isArray(existingTour.galleryUrls)) {
        const galleryImgs = existingTour.galleryUrls.map((url: string, index: number) => ({
          id: `gallery-existing-${index}`,
          preview: url,
          file: null
        }));
        setGalleryImages(galleryImgs);
      }
    }
  }, [existingTour, isEditMode, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'startDate' || name === 'endDate') {
        const startDate = value.startDate as Date;
        const endDate = value.endDate as Date;
        
        if (startDate && endDate && startDate <= endDate) {
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          form.setValue('duration', diffDays + 1);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const id = Date.now().toString();
      const preview = URL.createObjectURL(file);
      
      setImages([
        ...images.filter(img => !img.isMain),
        { id, file, preview, isMain: true }
      ]);
    }
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      const newGalleryImages = files.map(file => {
        const id = `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const preview = URL.createObjectURL(file);
        return { id, file, preview };
      });
      
      setGalleryImages(prev => [...prev, ...newGalleryImages]);
    }
  };

  const handleRemoveGalleryImage = (id: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
  };

  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      const currentInclusions = form.getValues().included || [];
      form.setValue('included', [...currentInclusions, newInclusion.trim()]);
      setNewInclusion("");
    }
  };

  const handleAddExclusion = () => {
    if (newExclusion.trim()) {
      const currentExclusions = form.getValues().excluded || [];
      form.setValue('excluded', [...currentExclusions, newExclusion.trim()]);
      setNewExclusion("");
    }
  };

  const removeInclusion = (index: number) => {
    const currentInclusions = form.getValues().included || [];
    form.setValue('included', currentInclusions.filter((_, i) => i !== index));
  };

  const removeExclusion = (index: number) => {
    const currentExclusions = form.getValues().excluded || [];
    form.setValue('excluded', currentExclusions.filter((_, i) => i !== index));
  };

  const onSubmit = (data: TourFormValues) => {
    tourMutation.mutate(data);
  };

  if (isEditMode && tourLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">جاري تحميل بيانات الرحلة...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {tourMutation.isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>
              {tourMutation.error?.message || `حدث خطأ أثناء ${isEditMode ? 'تحديث' : 'إنشاء'} الرحلة.`} 
            </AlertDescription>
          </Alert>
        )}
        
        <FormRequiredFieldsNote />
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
            <TabsTrigger value="dates">التواريخ والأسعار</TabsTrigger>
            <TabsTrigger value="itinerary">برنامج الرحلة</TabsTrigger>
            <TabsTrigger value="media">الصور والمميزات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">
                        اسم الرحلة <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="أدخل اسم الرحلة"
                        {...field}
                        className={error ? "border-red-500" : ""}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="destinationId"
                  control={form.control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Label htmlFor="destination" className="text-sm font-medium">
                        الوجهة <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <SelectTrigger className={error ? "border-red-500" : ""}>
                          <SelectValue placeholder="اختر الوجهة" />
                        </SelectTrigger>
                        <SelectContent>
                          {destinations.map((dest) => (
                            <SelectItem key={dest.id} value={dest.id.toString()}>
                              {dest.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="tripType"
                  control={form.control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Label htmlFor="tripType" className="text-sm font-medium">
                        نوع الرحلة <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={error ? "border-red-500" : ""}>
                          <SelectValue placeholder="اختر نوع الرحلة" />
                        </SelectTrigger>
                        <SelectContent>
                          {tourCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-6">
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">
                        الوصف <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="أدخل وصف الرحلة"
                        rows={6}
                        {...field}
                        className={error ? "border-red-500" : ""}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <div className="flex items-center space-x-4">
                  <Controller
                    name="featured"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="featured" className="text-sm font-medium">
                          رحلة مميزة
                        </Label>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dates" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Controller
                  name="startDate"
                  control={form.control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Label className="text-sm font-medium">
                        تاريخ البداية <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                              error && "border-red-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "اختر التاريخ"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="endDate"
                  control={form.control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Label className="text-sm font-medium">
                        تاريخ النهاية <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                              error && "border-red-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "اختر التاريخ"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="price"
                  control={form.control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Label htmlFor="price" className="text-sm font-medium">
                        السعر ($) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="أدخل السعر"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={error ? "border-red-500" : ""}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-6">
                <Controller
                  name="duration"
                  control={form.control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Label htmlFor="duration" className="text-sm font-medium">
                        المدة (أيام) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        placeholder="أدخل المدة"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className={error ? "border-red-500" : ""}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="numPassengers"
                  control={form.control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Label htmlFor="numPassengers" className="text-sm font-medium">
                        عدد المسافرين <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="numPassengers"
                        type="number"
                        min="1"
                        placeholder="أدخل عدد المسافرين"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className={error ? "border-red-500" : ""}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-4 pt-4">
            <Controller
              name="itinerary"
              control={form.control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Label htmlFor="itinerary" className="text-sm font-medium">
                    برنامج الرحلة التفصيلي <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="itinerary"
                    placeholder="أدخل البرنامج التفصيلي للرحلة"
                    rows={10}
                    {...field}
                    className={error ? "border-red-500" : ""}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </div>
              )}
            />

            <div>
              <Label className="text-sm font-medium">ما يشمله</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="أضف ما يشمله"
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInclusion()}
                />
                <Button type="button" onClick={handleAddInclusion}>إضافة</Button>
              </div>
              <div className="mt-2 space-y-1">
                {form.watch('included')?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                    <span className="text-sm">{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInclusion(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">ما لا يشمله</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="أضف ما لا يشمله"
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddExclusion()}
                />
                <Button type="button" onClick={handleAddExclusion}>إضافة</Button>
              </div>
              <div className="mt-2 space-y-1">
                {form.watch('excluded')?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-red-50 p-2 rounded">
                    <span className="text-sm">{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExclusion(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4 pt-4">
            <div>
              <Label className="text-sm font-medium">الصورة الرئيسية للرحلة</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="main-image-upload"
                />
                <Label htmlFor="main-image-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">انقر لرفع الصورة الرئيسية</p>
                  </div>
                </Label>
                {images.find(img => img.isMain) && (
                  <div className="mt-4">
                    <img
                      src={images.find(img => img.isMain)?.preview}
                      alt="Main tour image"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">معرض الصور</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImageUpload}
                  className="hidden"
                  id="gallery-images-upload"
                />
                <Label htmlFor="gallery-images-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">انقر لرفع صور معرض الصور</p>
                  </div>
                </Label>
                {galleryImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {galleryImages.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.preview}
                          alt="Gallery image"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => handleRemoveGalleryImage(image.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation('/admin/tours')}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || tourMutation.isPending}
          >
            {isSubmitting || tourMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "جاري التحديث..." : "جاري الإنشاء..."}
              </>
            ) : isEditMode ? "تحديث الرحلة" : "إنشاء الرحلة"}
          </Button>
        </div>
      </form>
    </Form>
  );
}