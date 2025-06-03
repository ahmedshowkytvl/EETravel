import React, { useState } from "react";
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
import { 
  Settings, 
  User, 
  Lock, 
  Globe, 
  BellRing, 
  Info, 
  Palette, 
  Smartphone,
  Save,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Validation schema for Profile settings
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
});

// Validation schema for Password settings
const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Validation schema for Notifications settings
const notificationsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  systemNotifications: z.boolean().default(true),
});

// Validation schema for Appearance settings
const appearanceSchema = z.object({
  theme: z.string().default("light"),
  fontSize: z.string().default("medium"),
  colorScheme: z.string().default("blue"),
});

// Type definitions
type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type NotificationsFormValues = z.infer<typeof notificationsSchema>;
type AppearanceFormValues = z.infer<typeof appearanceSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Initialize forms
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      bio: user?.bio || "",
      phoneNumber: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: true,
      marketingEmails: false,
      systemNotifications: true,
    },
  });

  const appearanceForm = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: "light",
      fontSize: "medium",
      colorScheme: "blue",
    },
  });

  // Form submission handlers
  const onProfileSubmit = (data: ProfileFormValues) => {
    console.log("Profile data submitted:", data);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated.",
    });
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    console.log("Password change submitted:", data);
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
    });
    passwordForm.reset();
  };

  const onNotificationsSubmit = (data: NotificationsFormValues) => {
    console.log("Notification settings submitted:", data);
    toast({
      title: "Notifications updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const onAppearanceSubmit = (data: AppearanceFormValues) => {
    console.log("Appearance settings submitted:", data);
    toast({
      title: "Appearance updated",
      description: "Your appearance settings have been saved.",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-zinc-500">Manage your account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            <User size={16} />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            <Lock size={16} />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            <BellRing size={16} />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            <Palette size={16} />
            <span>Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Your email" className="pl-10" {...field} />
                          </div>
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
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description for your profile.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Your phone number" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-4 flex items-center gap-2">
                    <Save size={16} />
                    Save Profile
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Password</CardTitle>
              <CardDescription>
                Change your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-4 flex items-center gap-2">
                    <Save size={16} />
                    Change Password
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-4">
                  <FormField
                    control={notificationsForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Email Notifications</FormLabel>
                          <FormDescription>
                            Receive booking and account notifications via email
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
                  <FormField
                    control={notificationsForm.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Marketing Emails</FormLabel>
                          <FormDescription>
                            Receive emails about new features, offers, and promotions
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
                  <FormField
                    control={notificationsForm.control}
                    name="systemNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">System Notifications</FormLabel>
                          <FormDescription>
                            Receive important system notifications
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
                  <Button type="submit" className="mt-4 flex items-center gap-2">
                    <Save size={16} />
                    Save Preferences
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...appearanceForm}>
                <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)} className="space-y-4">
                  <FormField
                    control={appearanceForm.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme</FormLabel>
                        <div className="grid grid-cols-3 gap-4">
                          <div
                            className={`border p-4 rounded-md cursor-pointer ${
                              field.value === 'light' ? 'border-primary ring-2 ring-primary/20' : ''
                            }`}
                            onClick={() => field.onChange('light')}
                          >
                            <div className="h-20 rounded-md bg-white border mb-2"></div>
                            <p className="text-center font-medium">Light</p>
                          </div>
                          <div
                            className={`border p-4 rounded-md cursor-pointer ${
                              field.value === 'dark' ? 'border-primary ring-2 ring-primary/20' : ''
                            }`}
                            onClick={() => field.onChange('dark')}
                          >
                            <div className="h-20 rounded-md bg-zinc-900 border mb-2"></div>
                            <p className="text-center font-medium">Dark</p>
                          </div>
                          <div
                            className={`border p-4 rounded-md cursor-pointer ${
                              field.value === 'system' ? 'border-primary ring-2 ring-primary/20' : ''
                            }`}
                            onClick={() => field.onChange('system')}
                          >
                            <div className="h-20 rounded-md bg-gradient-to-r from-white to-zinc-900 border mb-2"></div>
                            <p className="text-center font-medium">System</p>
                          </div>
                        </div>
                        <FormDescription>
                          Choose the theme for your dashboard
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={appearanceForm.control}
                    name="colorScheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Scheme</FormLabel>
                        <div className="grid grid-cols-4 gap-4">
                          <div
                            className={`border p-4 rounded-md cursor-pointer ${
                              field.value === 'blue' ? 'border-primary ring-2 ring-primary/20' : ''
                            }`}
                            onClick={() => field.onChange('blue')}
                          >
                            <div className="h-12 rounded-md bg-blue-500 mb-2"></div>
                            <p className="text-center font-medium">Blue</p>
                          </div>
                          <div
                            className={`border p-4 rounded-md cursor-pointer ${
                              field.value === 'green' ? 'border-primary ring-2 ring-primary/20' : ''
                            }`}
                            onClick={() => field.onChange('green')}
                          >
                            <div className="h-12 rounded-md bg-green-500 mb-2"></div>
                            <p className="text-center font-medium">Green</p>
                          </div>
                          <div
                            className={`border p-4 rounded-md cursor-pointer ${
                              field.value === 'purple' ? 'border-primary ring-2 ring-primary/20' : ''
                            }`}
                            onClick={() => field.onChange('purple')}
                          >
                            <div className="h-12 rounded-md bg-purple-500 mb-2"></div>
                            <p className="text-center font-medium">Purple</p>
                          </div>
                          <div
                            className={`border p-4 rounded-md cursor-pointer ${
                              field.value === 'amber' ? 'border-primary ring-2 ring-primary/20' : ''
                            }`}
                            onClick={() => field.onChange('amber')}
                          >
                            <div className="h-12 rounded-md bg-amber-500 mb-2"></div>
                            <p className="text-center font-medium">Amber</p>
                          </div>
                        </div>
                        <FormDescription>
                          Select your preferred color scheme
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="mt-4 flex items-center gap-2">
                    <Save size={16} />
                    Save Appearance
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}