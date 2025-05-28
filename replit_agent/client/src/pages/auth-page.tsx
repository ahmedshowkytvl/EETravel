import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Mail, Key, LogIn, UserPlus, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
    },
  });
  
  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Form Column */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Welcome to Sahara Travel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative input-icon-container">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground input-icon" />
                              <Input
                                placeholder="Your username"
                                className="pl-10 placeholder:text-muted-foreground hover:placeholder:text-muted-foreground focus:placeholder:text-muted-foreground"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative input-icon-container">
                              <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground input-icon" />
                              <Input
                                type={showLoginPassword ? "text" : "password"}
                                placeholder="Your password"
                                className="pl-10 pr-10 placeholder:text-muted-foreground hover:placeholder:text-muted-foreground focus:placeholder:text-muted-foreground"
                                {...field}
                              />
                              <button 
                                type="button"
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground input-icon"
                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                              >
                                {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogIn className="mr-2 h-4 w-4" />
                      )}
                      Login
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative input-icon-container">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground input-icon" />
                              <Input
                                placeholder="Choose a username"
                                className="pl-10 placeholder:text-muted-foreground hover:placeholder:text-muted-foreground focus:placeholder:text-muted-foreground"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative input-icon-container">
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground input-icon" />
                              <Input
                                type="email"
                                placeholder="Your email address"
                                className="pl-10 placeholder:text-muted-foreground hover:placeholder:text-muted-foreground focus:placeholder:text-muted-foreground"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative input-icon-container">
                              <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground input-icon" />
                              <Input
                                type={showRegisterPassword ? "text" : "password"}
                                placeholder="Create a password"
                                className="pl-10 pr-10 placeholder:text-muted-foreground hover:placeholder:text-muted-foreground focus:placeholder:text-muted-foreground"
                                {...field}
                              />
                              <button 
                                type="button"
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground input-icon"
                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                              >
                                {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative input-icon-container">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground input-icon" />
                              <Input
                                placeholder="Your full name"
                                className="pl-10 placeholder:text-muted-foreground hover:placeholder:text-muted-foreground focus:placeholder:text-muted-foreground"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                      )}
                      Create Account
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Hero Column */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/80 to-primary text-white">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">
            Explore the Wonders of the Middle East
          </h1>
          <p className="text-lg mb-8">
            Sign in to discover breathtaking destinations, exclusive travel packages,
            and personalized recommendations for your next adventure.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-left">Create and manage your travel favorites</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-left">
                Access exclusive deals on luxury accommodations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-left">
                Personalize your travel profile for better recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}