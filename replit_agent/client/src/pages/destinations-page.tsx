import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { Destination } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart, Map, MapPin, GlobeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function DestinationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  
  // Fetch all destinations
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Fetch user's favorites
  const { data: favorites, isLoading: isFavoritesLoading } = useQuery<Destination[]>({
    queryKey: ["/api/favorites"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user, // Only fetch if user is logged in
  });
  
  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: async (destinationId: number) => {
      const res = await apiRequest("POST", "/api/favorites", { destinationId });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Added to favorites",
        description: "Destination has been added to your favorites",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add to favorites",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });
  
  // Remove from favorites mutation
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (destinationId: number) => {
      const res = await apiRequest("DELETE", `/api/favorites/${destinationId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from favorites",
        description: "Destination has been removed from your favorites",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove from favorites",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });
  
  // Check if a destination is in user's favorites
  const isInFavorites = (destinationId: number) => {
    return favorites?.some(fav => fav.id === destinationId) || false;
  };
  
  // Handle toggle favorite
  const handleToggleFavorite = (destinationId: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add destinations to favorites",
        variant: "destructive",
      });
      return;
    }
    
    if (isInFavorites(destinationId)) {
      removeFromFavoritesMutation.mutate(destinationId);
    } else {
      addToFavoritesMutation.mutate(destinationId);
    }
  };
  
  // Filter destinations
  const filteredDestinations = () => {
    if (!destinations) return [];
    if (filter === "favorites" && favorites) {
      return favorites;
    }
    return destinations;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Explore Destinations</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the most breathtaking destinations across the Middle East and find your next adventure
        </p>
      </div>
      
      {/* Filter tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-muted inline-flex rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "all" ? "bg-white shadow-sm" : ""
            }`}
            onClick={() => setFilter("all")}
          >
            <GlobeIcon className="w-4 h-4 inline mr-2" />
            All Destinations
          </button>
          {user && (
            <button
              className={`px-4 py-2 rounded-md ${
                filter === "favorites" ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setFilter("favorites")}
            >
              <Heart className="w-4 h-4 inline mr-2" /> 
              My Favorites
            </button>
          )}
        </div>
      </div>
      
      {user && filter === "favorites" && favorites?.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">
            Start adding destinations to your favorites to see them here
          </p>
          <Button onClick={() => setFilter("all")}>Explore Destinations</Button>
        </div>
      )}
      
      {/* Destinations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations().map((destination) => (
          <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={destination.imageUrl || "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=800"} 
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <Badge className="bg-primary text-white mb-2">{destination.country}</Badge>
                <h3 className="text-xl font-bold">{destination.name}</h3>
              </div>
              
              {/* Favorite button */}
              <button 
                className={`absolute top-4 right-4 p-2 rounded-full ${
                  isInFavorites(destination.id) 
                    ? "bg-primary text-white" 
                    : "bg-white/80 text-gray-800 hover:bg-primary/90 hover:text-white"
                } transition-colors`}
                onClick={() => handleToggleFavorite(destination.id)}
                disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
              >
                <Heart 
                  className={`h-5 w-5 ${isInFavorites(destination.id) ? "fill-white" : ""}`} 
                />
              </button>
            </div>
            
            <CardContent className="pt-6">
              <p className="text-muted-foreground line-clamp-3">{destination.description}</p>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="w-full">
                <MapPin className="mr-2 h-4 w-4" /> Explore Packages
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}