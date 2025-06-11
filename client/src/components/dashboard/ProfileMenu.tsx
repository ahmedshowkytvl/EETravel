import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, Edit, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
}

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfileEditFormInline({ user, onSuccess }: { user: User; onSuccess: () => void }) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName || "",
      email: user.email || "",
      bio: user.bio || "",
      avatarUrl: user.avatarUrl || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) =>
      apiRequest(`/api/user`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: t('profile.updateSuccess', 'Profile updated'),
        description: t('profile.updateSuccessDescription', 'Your profile has been updated successfully.'),
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: t('profile.updateError', 'Update failed'),
        description: error.message || t('profile.updateErrorDescription', 'Failed to update profile. Please try again.'),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profile.fullName', 'Full Name')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('profile.fullNamePlaceholder', 'Enter your full name')} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profile.email', 'Email')}</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder={t('profile.emailPlaceholder', 'Enter your email')} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profile.bio', 'Bio')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('profile.bioPlaceholder', 'Tell us about yourself')} 
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profile.avatarUrl', 'Avatar URL')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('profile.avatarUrlPlaceholder', 'Enter avatar image URL')} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={updateProfileMutation.isPending}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {updateProfileMutation.isPending 
              ? t('profile.updating', 'Updating...') 
              : t('profile.saveChanges', 'Save Changes')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ProfileMenu() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Get current user data
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user"],
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("/api/logout", { method: "POST" }),
    onSuccess: () => {
      toast({
        title: t('auth.logout.success', 'Logged out successfully'),
        description: t('auth.logout.description', 'You have been logged out'),
      });
      // Refresh the page to redirect to login
      window.location.href = '/';
    },
    onError: () => {
      toast({
        title: t('auth.logout.error', 'Logout failed'),
        description: t('auth.logout.errorDescription', 'Failed to logout. Please try again.'),
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading || !user) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User size={18} />
      </Button>
    );
  }

  const userInitials = user.fullName 
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.username.substring(0, 2).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.fullName || user.username} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.fullName || user.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <p className="text-xs leading-none text-muted-foreground capitalize">
                {t(`roles.${user.role}`, user.role)}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>{t('profile.edit', 'Edit Profile')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('profile.settings', 'Settings')}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="text-red-600 hover:text-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>
              {logoutMutation.isPending 
                ? t('auth.logout.pending', 'Logging out...') 
                : t('auth.logout.button', 'Log out')
              }
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('profile.edit', 'Edit Profile')}</DialogTitle>
            <DialogDescription>
              {t('profile.editDescription', 'Make changes to your profile here. Click save when you\'re done.')}
            </DialogDescription>
          </DialogHeader>
          <ProfileEditFormInline 
            user={user} 
            onSuccess={() => {
              setShowEditDialog(false);
              queryClient.invalidateQueries({ queryKey: ["/api/user"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}