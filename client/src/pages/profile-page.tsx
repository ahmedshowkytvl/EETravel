import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Destination } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Settings,
  Heart,
  Map,
  Loader2,
  Edit,
  MapPin,
  Calendar,
  Plus,
  X,
  Save,
  Mail,
  Check,
  Trash
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Form schema for profile update
const profileSchema = z.object({
  fullName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

// Form schema for travel goal
const travelGoalSchema = z.object({
  destination: z.string().min(3, "Destination must be at least 3 characters"),
  targetDate: z.string().optional(),
  notes: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type TravelGoalFormValues = z.infer<typeof travelGoalSchema>;

// A simple interface for travel goals (in a real app, this would be stored in the database)
interface TravelGoal {
  id: number;
  destination: string;
  targetDate?: string;
  notes?: string;
  completed: boolean;
}

export default function ProfilePage() {
  const { user, updateProfileMutation } = useAuth();
  const [travelGoals, setTravelGoals] = useState<TravelGoal[]>([
    {
      id: 1,
      destination: "Pyramids of Giza, Egypt",
      targetDate: "2025-06-15",
      notes: "Visit during the summer solstice",
      completed: false,
    },
    {
      id: 2,
      destination: "Petra, Jordan",
      targetDate: "2025-09-10",
      notes: "Explore the ancient city and nearby Wadi Rum",
      completed: false,
    },
  ]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [nextGoalId, setNextGoalId] = useState(3);

  // Fetch user's favorite destinations
  const { data: favorites, isLoading: isFavoritesLoading } = useQuery<Destination[]>({
    queryKey: ["/api/favorites"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  // Profile update form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      bio: user?.bio || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  // Travel goal form
  const goalForm = useForm<TravelGoalFormValues>({
    resolver: zodResolver(travelGoalSchema),
    defaultValues: {
      destination: "",
      targetDate: "",
      notes: "",
    },
  });

  // Update profile handler
  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  // Add travel goal handler
  const onAddGoalSubmit = (data: TravelGoalFormValues) => {
    const newGoal: TravelGoal = {
      id: nextGoalId,
      destination: data.destination,
      targetDate: data.targetDate,
      notes: data.notes,
      completed: false,
    };

    setTravelGoals([...travelGoals, newGoal]);
    setNextGoalId(nextGoalId + 1);
    setIsAddingGoal(false);
    goalForm.reset();
  };

  // Toggle goal completion
  const toggleGoalCompletion = (id: number) => {
    setTravelGoals(
      travelGoals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  // Remove goal
  const removeGoal = (id: number) => {
    setTravelGoals(travelGoals.filter((goal) => goal.id !== id));
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return user?.username.slice(0, 2).toUpperCase() || "U";
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Profile Not Available</h1>
        <p className="text-muted-foreground mb-6">
          Please log in to view and edit your profile.
        </p>
        <Button asChild>
          <a href="/auth">Go to Login</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* User info sidebar */}
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatarUrl || ""} alt={user.username} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">{user.fullName || user.username}</CardTitle>
                <CardDescription>Member since {new Date(user.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                {user.bio && (
                  <div className="mb-4">
                    <p className="text-muted-foreground">{user.bio}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.username}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="favorites">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="favorites">
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="goals">
                  <Map className="h-4 w-4 mr-2" />
                  Travel Goals
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Favorite Destinations</CardTitle>
                    <CardDescription>
                      Places you've saved to plan your future adventures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isFavoritesLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : favorites && favorites.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {favorites.map((destination) => (
                          <Card key={destination.id} className="overflow-hidden">
                            <div className="h-32 w-full relative">
                              <img
                                src={destination.imageUrl || "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=800"}
                                alt={destination.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-2 left-2 text-white">
                                <Badge className="bg-primary mb-1">{destination.country}</Badge>
                                <h3 className="font-bold">{destination.name}</h3>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Start exploring destinations and save your favorites!
                        </p>
                        <Button asChild>
                          <a href="/destinations">Browse Destinations</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Travel Goals Tab */}
              <TabsContent value="goals" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Your Travel Goals</CardTitle>
                        <CardDescription>
                          Keep track of places you want to visit
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setIsAddingGoal(true)}
                        disabled={isAddingGoal}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Goal
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isAddingGoal && (
                      <Card className="mb-6 border-primary/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">New Travel Goal</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Form {...goalForm}>
                            <form
                              onSubmit={goalForm.handleSubmit(onAddGoalSubmit)}
                              className="space-y-4"
                            >
                              <FormField
                                control={goalForm.control}
                                name="destination"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Destination</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. Dubai, UAE" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                  control={goalForm.control}
                                  name="targetDate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Target Date (Optional)</FormLabel>
                                      <FormControl>
                                        <Input type="date" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={goalForm.control}
                                  name="notes"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Notes (Optional)</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Any special plans?"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="flex justify-end space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsAddingGoal(false)}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit">Save Goal</Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    )}

                    <ScrollArea className="h-[400px] pr-4">
                      {travelGoals.length > 0 ? (
                        <div className="space-y-4">
                          {travelGoals.map((goal) => (
                            <div
                              key={goal.id}
                              className={`p-4 border rounded-lg flex items-start ${
                                goal.completed
                                  ? "bg-muted border-muted"
                                  : "bg-white border-border"
                              }`}
                            >
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <MapPin
                                    className={`h-4 w-4 mr-2 ${
                                      goal.completed
                                        ? "text-muted-foreground"
                                        : "text-primary"
                                    }`}
                                  />
                                  <h3
                                    className={`font-medium ${
                                      goal.completed
                                        ? "text-muted-foreground line-through"
                                        : ""
                                    }`}
                                  >
                                    {goal.destination}
                                  </h3>
                                </div>

                                {goal.targetDate && (
                                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                                    <Calendar className="h-3 w-3 mr-2" />
                                    <span>
                                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}

                                {goal.notes && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {goal.notes}
                                  </p>
                                )}
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => toggleGoalCompletion(goal.id)}
                                >
                                  {goal.completed ? (
                                    <X className="h-4 w-4" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => removeGoal(goal.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Map className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">No travel goals yet</h3>
                          <p className="text-muted-foreground mb-6">
                            Start adding places you want to visit!
                          </p>
                          <Button onClick={() => setIsAddingGoal(true)}>
                            Add Your First Goal
                          </Button>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Update your profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form
                        onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={profileForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about yourself"
                                  className="resize-none"
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="avatarUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile Picture URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com/your-image.jpg"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Save Changes
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-8">
                      <h3 className="font-medium mb-2">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p>Promotional emails</p>
                            <p className="text-sm text-muted-foreground">
                              Receive emails about special offers and deals
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p>Travel updates</p>
                            <p className="text-sm text-muted-foreground">
                              Get notified about new destinations and packages
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Privacy Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p>Profile visibility</p>
                            <p className="text-sm text-muted-foreground">
                              Show your profile to other users
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" className="mr-2">
                      Reset Preferences
                    </Button>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}