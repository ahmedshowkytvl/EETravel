import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Loader2 } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
}

interface ProfileEditFormProps {
  user: User;
  onSuccess: () => void;
}

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileEditForm({ user, onSuccess }: ProfileEditFormProps) {
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