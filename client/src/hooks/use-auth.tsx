import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
  updateProfileMutation: UseMutationResult<User, Error, UpdateProfileData>;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
  fullName?: string;
};

type UpdateProfileData = {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // Get user from localStorage on initial load
  const getStoredUser = (): User | null => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  };

  // Fetch current user data
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    initialData: getStoredUser(),
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      try {
        return await apiRequest<User>('/api/login', {
          method: 'POST',
          body: JSON.stringify(credentials)
        });
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Login failed: Please check your credentials");
      }
    },
    onSuccess: (userData: User) => {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${userData.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      try {
        return await apiRequest<User>('/api/register', {
          method: 'POST',
          body: JSON.stringify(userData)
        });
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Registration failed: Please try again");
      }
    },
    onSuccess: (userData: User) => {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Registration successful",
        description: `Welcome to Sahara Travel, ${userData.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try a different username",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await apiRequest('/api/logout', {
          method: 'POST',
        });
        return;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Logout failed: Please try again");
      }
    },
    onSuccess: () => {
      // Clear user data from localStorage
      localStorage.removeItem('user');
      // Clear all user-related data from cache immediately
      queryClient.setQueryData(["/api/user"], null);
      queryClient.clear(); // Clear all cache for faster logout
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out",
      });
      
      // Use faster navigation instead of window.location
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: UpdateProfileData) => {
      try {
        return await apiRequest<User>('/api/user', {
          method: 'PATCH',
          body: JSON.stringify(profileData)
        });
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Profile update failed: Please try again");
      }
    },
    onSuccess: (userData: User) => {
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        updateProfileMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}