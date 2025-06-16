import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Plus, Edit, Trash2, MoveUp, MoveDown, Image, Eye, EyeOff, Upload, Link2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HeroSlide, insertHeroSlideSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function SliderManagement() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [imageTab, setImageTab] = useState<"upload" | "url">("url");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch slides
  const { data: slides = [], isLoading } = useQuery<HeroSlide[]>({
    queryKey: ["/api/hero-slides"],
  });

  // Form setup
  const form = useForm({
    resolver: zodResolver(insertHeroSlideSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      buttonText: "",
      buttonLink: "",
      secondaryButtonText: "",
      secondaryButtonLink: "",
      order: 0,
      active: true,
    },
  });

  // Create slide mutation
  const createSlideMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/hero-slides", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-slides"] });
      toast({ title: "Slide created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create slide", description: error.message, variant: "destructive" });
    },
  });

  // Update slide mutation
  const updateSlideMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest(`/api/hero-slides/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-slides"] });
      toast({ title: "Slide updated successfully" });
      setIsDialogOpen(false);
      setEditingSlide(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update slide", description: error.message, variant: "destructive" });
    },
  });

  // Delete slide mutation
  const deleteSlideMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/hero-slides/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-slides"] });
      toast({ title: "Slide deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete slide", description: error.message, variant: "destructive" });
    },
  });

  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      return await apiRequest(`/api/hero-slides/${id}`, {
        method: "PUT",
        body: JSON.stringify({ active }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-slides"] });
      toast({ title: "Slide status updated" });
    },
  });

  // Reorder slides
  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: number; newOrder: number }) => {
      return await apiRequest(`/api/hero-slides/${id}`, {
        method: "PUT",
        body: JSON.stringify({ order: newOrder }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-slides"] });
      toast({ title: "Slide order updated" });
    },
  });

  // Handle file upload using base64 conversion
  const handleFileUpload = async (file: File) => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({ title: "Please select an image file", variant: "destructive" });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Image too large. Please select a file under 5MB", variant: "destructive" });
        return;
      }
      
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      setUploadedImage(base64);
      form.setValue('imageUrl', base64);
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      toast({ title: "Failed to upload image", variant: "destructive" });
    }
  };

  // Handle preset image selection
  const handlePresetImage = (imageUrl: string) => {
    form.setValue('imageUrl', imageUrl);
    setUploadedImage(imageUrl);
  };

  const onSubmit = (data: any) => {
    if (editingSlide) {
      updateSlideMutation.mutate({ id: editingSlide.id, data });
    } else {
      createSlideMutation.mutate(data);
    }
    setIsDialogOpen(false);
    setUploadedImage(null);
    setImageTab("url");
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    form.reset({
      title: slide.title,
      subtitle: slide.subtitle || "",
      description: slide.description || "",
      imageUrl: slide.imageUrl,
      buttonText: slide.buttonText || "",
      buttonLink: slide.buttonLink || "",
      secondaryButtonText: slide.secondaryButtonText || "",
      secondaryButtonLink: slide.secondaryButtonLink || "",
      order: slide.order || 0,
      active: slide.active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      deleteSlideMutation.mutate(id);
    }
  };

  const handleReorder = (id: number, direction: "up" | "down") => {
    const slide = slides.find(s => s.id === id);
    if (!slide) return;

    const newOrder = direction === "up" ? (slide.order || 0) - 1 : (slide.order || 0) + 1;
    reorderMutation.mutate({ id, newOrder });
  };

  const sortedSlides = [...slides].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Slider Management</h1>
          <p className="text-muted-foreground">Manage homepage hero slides and offers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingSlide(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSlide ? "Edit Slide" : "Create New Slide"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter slide title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter slide subtitle" {...field} />
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
                        <Textarea placeholder="Enter slide description" {...field} />
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
                      <FormLabel>Slide Image *</FormLabel>
                      <div className="space-y-3">
                        <Tabs value={imageTab} onValueChange={(value) => setImageTab(value as "upload" | "url")}>
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="url" className="flex items-center gap-2">
                              <Link2 className="h-4 w-4" />
                              URL
                            </TabsTrigger>
                            <TabsTrigger value="upload" className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Upload
                            </TabsTrigger>
                            <TabsTrigger value="preset" className="flex items-center gap-2">
                              <Image className="h-4 w-4" />
                              Gallery
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="url" className="space-y-2">
                            <FormControl>
                              <Input placeholder="Enter image URL or @assets/filename.png" {...field} />
                            </FormControl>
                          </TabsContent>
                          
                          <TabsContent value="upload" className="space-y-2">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(file);
                                }}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2"
                              >
                                <Upload className="h-4 w-4" />
                                Choose Image File
                              </Button>
                              <p className="text-sm text-gray-500 mt-2">
                                Upload JPG, PNG, or WebP images
                              </p>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="preset" className="space-y-2">
                            <div className="grid grid-cols-2 gap-3">
                              <div 
                                className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => handlePresetImage("@assets/image_1749538801049.png")}
                              >
                                <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 rounded mb-2"></div>
                                <p className="text-xs text-center">New Desert Scene</p>
                              </div>
                              <div 
                                className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => handlePresetImage("@assets/image_1749021857355.png")}
                              >
                                <div className="aspect-video bg-gradient-to-r from-amber-500 to-orange-600 rounded mb-2"></div>
                                <p className="text-xs text-center">Middle East Adventure</p>
                              </div>
                              <div 
                                className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => handlePresetImage("@assets/image_1748956434230.png")}
                              >
                                <div className="aspect-video bg-gradient-to-r from-green-500 to-teal-600 rounded mb-2"></div>
                                <p className="text-xs text-center">Cultural Heritage</p>
                              </div>
                              <div 
                                className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => handlePresetImage("@assets/image_1748956880136.png")}
                              >
                                <div className="aspect-video bg-gradient-to-r from-red-500 to-pink-600 rounded mb-2"></div>
                                <p className="text-xs text-center">Ancient Wonders</p>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                        
                        {field.value && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                            <div className="relative aspect-video w-full max-w-md border rounded-lg overflow-hidden">
                              {field.value.startsWith('@assets/') ? (
                                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                  <p className="text-sm">Asset: {field.value.split('/').pop()}</p>
                                </div>
                              ) : (
                                <img 
                                  src={field.value} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="buttonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Explore Destinations" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buttonLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., /destinations" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="secondaryButtonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., View Special Offers" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryButtonLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., /packages" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 pt-6">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Active</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createSlideMutation.isPending || updateSlideMutation.isPending}>
                    {editingSlide ? "Update Slide" : "Create Slide"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedSlides.map((slide, index) => (
            <Card key={slide.id} className={!slide.active ? "opacity-60" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {slide.imageUrl ? (
                      <img 
                        src={slide.imageUrl} 
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{slide.title}</h3>
                        {slide.subtitle && (
                          <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                        )}
                        {slide.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{slide.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">Order: {slide.order || 0}</Badge>
                          <Badge variant={slide.active ? "default" : "secondary"}>
                            {slide.active ? "Active" : "Inactive"}
                          </Badge>
                          {slide.buttonText && (
                            <Badge variant="outline">{slide.buttonText}</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActiveMutation.mutate({ id: slide.id, active: !slide.active })}
                        >
                          {slide.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(slide.id, "up")}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(slide.id, "down")}
                          disabled={index === sortedSlides.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(slide)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(slide.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && slides.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No slides found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first hero slide to get started with the homepage slider.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Slide
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}