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
import { User, Settings, LogOut, Edit } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { ProfileEditForm } from "./ProfileEditForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: string;
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
          <ProfileEditForm 
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