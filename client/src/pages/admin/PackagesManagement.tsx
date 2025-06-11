import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Clock, 
  Edit, 
  Eye, 
  MoreVertical, 
  Package, 
  Plus, 
  Star, 
  Trash,
  CircleSlash,
  Check,
  Loader2,
  Globe
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

type Package = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  duration: number;
  destinationId?: number;
  imageUrl?: string;
  featured?: boolean;
  type?: string;
  inclusions?: string | string[];
  rating?: number;
  reviewCount?: number;
  slug?: string;
};

export default function PackagesManagement() {
  const [location, setLocation] = useLocation();
  // Extract the filter value from URL if available
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const filterParam = urlParams.get('filter') || 'all';
  const [selectedTab, setSelectedTab] = useState(filterParam);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [slugPackageId, setSlugPackageId] = useState<number | null>(null);
  const [slugValue, setSlugValue] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  // Fetch packages
  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
    retry: 1,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete package');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      toast({
        title: "Package Deleted",
        description: "The package was successfully deleted",
        variant: "default",
      });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update slug mutation
  const updateSlugMutation = useMutation({
    mutationFn: async ({ id, slug }: { id: number, slug: string }) => {
      const response = await fetch(`/api/packages/${id}/slug`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update package URL');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      toast({
        title: "URL Updated",
        description: "The package URL was successfully updated",
        variant: "default",
      });
      setSlugPackageId(null);
      setSlugValue("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Filter packages based on tab
  const filteredPackages = packages.filter(pkg => {
    if (selectedTab === "all") return true;
    if (selectedTab === "featured") return pkg.featured;
    return pkg.type?.toLowerCase() === selectedTab;
  });

  // Get unique package types for tabs
  const packageTypes = Array.from(new Set(packages.map(pkg => pkg.type?.toLowerCase() || "unknown")));

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };
  
  const handleSlugEdit = (id: number, title: string) => {
    // Find the package and get suggested slug based on title
    const pkg = packages.find(p => p.id === id);
    const suggestedSlug = pkg?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    setSlugPackageId(id);
    setSlugValue(suggestedSlug);
  };
  
  const confirmSlugUpdate = () => {
    if (slugPackageId && slugValue.trim()) {
      updateSlugMutation.mutate({ 
        id: slugPackageId, 
        slug: slugValue.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') 
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{t('admin.packages.title', 'Packages')}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setLocation("/admin/packages/create-manual")}>
            <Plus size={16} />
            <span>{t('admin.packages.manualPackage', 'Manual Package')}</span>
          </Button>
          <Button size="sm" className="gap-1" onClick={() => setLocation("/admin/packages/create")}>
            <Plus size={16} />
            <span>{t('admin.packages.createPackage', 'Create Package')}</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <Tabs defaultValue={selectedTab} className="w-full" onValueChange={(value) => {
              setSelectedTab(value);
              // Update URL with filter parameter
              const newParams = new URLSearchParams(window.location.search);
              if (value === 'all') {
                newParams.delete('filter');
              } else {
                newParams.set('filter', value);
              }
              const newSearch = newParams.toString();
              const newPath = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
              setLocation(newPath, { replace: true });
            }}>
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="text-sm">
                {t('admin.packages.allPackages', 'All Packages')}
              </TabsTrigger>
              <TabsTrigger value="featured" className="text-sm">
                {t('admin.packages.featured', 'Featured')}
              </TabsTrigger>
              {packageTypes.map(type => (
                <TabsTrigger key={type} value={type} className="text-sm capitalize">
                  {t(`admin.packages.types.${type}`, type)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {filteredPackages.length === 0 ? (
                <div className="bg-white border rounded-md p-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-zinc-300 mb-3" />
                  <h3 className="text-lg font-medium text-zinc-800 mb-1">{t('admin.packages.noPackages', 'No Packages Found')}</h3>
                  <p className="text-zinc-500 mb-4">{t('admin.packages.noPackagesDescription', 'There are no packages in this category yet.')}</p>
                  <Button onClick={() => setLocation("/admin/packages/create")}>
                    <Plus size={16} className="mr-2" />
                    {t('admin.packages.createPackage', 'Create Package')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPackages.map((pkg) => (
                    <Card key={pkg.id} className="overflow-hidden bg-white border border-[#F1F1F1] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                      <div className="flex flex-col h-full">
                        <div className="relative">
                          {pkg.imageUrl ? (
                            <img
                              src={pkg.imageUrl}
                              alt={pkg.title}
                              className="h-48 w-full object-cover"
                            />
                          ) : (
                            <div className="h-48 w-full bg-zinc-100 flex items-center justify-center">
                              <Package className="h-16 w-16 text-zinc-300" />
                            </div>
                          )}
                          
                          {/* Price tag */}
                          <div className="absolute top-0 right-0 bg-primary text-white px-4 py-2 rounded-bl-lg font-bold shadow-md">
                            {pkg.discountedPrice && pkg.discountedPrice < pkg.price ? (
                              <div className="text-right">
                                <span className="line-through text-white/70 text-sm mr-2">${pkg.price}</span>
                                <span>${pkg.discountedPrice}</span>
                              </div>
                            ) : (
                              <span>${pkg.price}</span>
                            )}
                          </div>
                          
                          {/* Badges */}
                          <div className="absolute bottom-2 left-2 flex gap-2">
                            {pkg.featured && (
                              <Badge className="bg-amber-500 hover:bg-amber-600">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {pkg.type && (
                              <Badge variant="secondary" className="bg-white/90 text-primary">
                                {pkg.type}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <CardContent className="p-4 flex-grow">
                          <div className="mb-3">
                            <h3 className="font-bold text-lg text-zinc-800 mb-2">{pkg.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <Clock className="h-4 w-4 mr-1 text-primary" />
                              <span>{pkg.duration} days</span>
                            </div>
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                              {pkg.description}
                            </p>
                          </div>
                          
                          <Separator className="my-3" />
                          
                          {/* Inclusions */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-1.5" />
                              Inclusions
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {pkg.inclusions && (() => {
                                // Parse inclusions if it's a string
                                let inclusionsArray: string[] = [];
                                try {
                                  if (typeof pkg.inclusions === 'string') {
                                    inclusionsArray = JSON.parse(pkg.inclusions);
                                  } else if (Array.isArray(pkg.inclusions)) {
                                    inclusionsArray = pkg.inclusions;
                                  }
                                } catch (e) {
                                  console.error('Failed to parse inclusions', e);
                                  return null;
                                }
                                
                                // Only show first 3 inclusions
                                return inclusionsArray.length > 0 && (
                                  <>
                                    {inclusionsArray.slice(0, 3).map((inclusion: string, index: number) => (
                                      <div key={index} className="flex items-center text-xs">
                                        <Check className="h-3 w-3 text-green-500 mr-1" />
                                        <span>{inclusion}</span>
                                      </div>
                                    ))}
                                    {inclusionsArray.length > 3 && (
                                      <span className="text-xs text-primary cursor-pointer hover:underline">
                                        +{inclusionsArray.length - 3} more
                                      </span>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-col gap-2 mt-auto">
                            {/* First row of buttons */}
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => handleSlugEdit(pkg.id, pkg.title)}
                              >
                                <Globe className="h-4 w-4 mr-2" />
                                Friendly URL
                              </Button>
                              <Button 
                                className="flex-1"
                                onClick={() => setLocation(`/admin/packages/edit/${pkg.id}`)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleDelete(pkg.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {/* Second row for the View button */}
                            <div>
                              {pkg.slug ? (
                                <Button 
                                  variant="secondary" 
                                  className="w-full"
                                  onClick={() => setLocation(`/packages/${pkg.slug}`)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              ) : (
                                <Button 
                                  variant="secondary" 
                                  className="w-full"
                                  onClick={() => setLocation(`/packages/${pkg.id}`)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this package. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Friendly URL Dialog */}
      <AlertDialog open={slugPackageId !== null} onOpenChange={(open) => !open && setSlugPackageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Set Friendly URL</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a custom URL slug for this package. This will be used in the URL path.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">{window.location.origin}/packages/</div>
              <input
                type="text"
                value={slugValue}
                onChange={(e) => setSlugValue(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="custom-url-slug"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    confirmSlugUpdate();
                  }
                }}
              />
            </div>
            
            <p className="mt-2 text-xs text-muted-foreground">
              Use only lowercase letters, numbers, and hyphens. Spaces will be converted to hyphens.
            </p>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSlugUpdate}
              disabled={updateSlugMutation.isPending || !slugValue.trim()}
            >
              {updateSlugMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Save"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
