import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ScrollButton } from "@/components/ScrollButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, Translation } from "@/hooks/use-language";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Search, Edit, Trash2, Save, Globe, FileText, RefreshCw, Check, AlertCircle, BarChart, Download, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Validation schema for translation form
const translationSchema = z.object({
  key: z.string().min(1, "Translation key is required"),
  enText: z.string().min(1, "English text is required"),
  arText: z.string().nullable(),
  category: z.string().nullable(),
  context: z.string().nullable(),
});

// Validation schema for language settings form
const languageSettingsSchema = z.object({
  defaultLanguage: z.string().min(1, "Default language is required"),
  availableLanguages: z.array(z.string()).min(1, "At least one language must be available"),
  rtlLanguages: z.array(z.string()),
});

// Type definitions
type TranslationFormValues = z.infer<typeof translationSchema>;
type LanguageSettingsFormValues = z.infer<typeof languageSettingsSchema>;

export default function TranslationManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, languageSettings } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("translations");
  const [translationStatus, setTranslationStatus] = useState<"all" | "translated" | "untranslated">("all");
  
  // Batch translation states
  const [batchFilterType, setBatchFilterType] = useState<'all' | 'untranslated' | 'category'>('untranslated');
  const [batchLimit, setBatchLimit] = useState<number>(10);

  // Fetch translations
  const { data: translations = [], isLoading: isLoadingTranslations } = useQuery<Translation[]>({
    queryKey: ['translations', selectedCategory],
    queryFn: async () => {
      const response = await apiRequest<Translation[]>(
        selectedCategory 
          ? `/api/translations?category=${selectedCategory}`
          : '/api/translations'
      );
      return response;
    },
  });

  // Fetch categories (unique from all translations)
  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ['translationCategories'],
    queryFn: async () => {
      const allTranslations = await apiRequest<Translation[]>('/api/translations');
      const allCategories = allTranslations
        .map((t: Translation) => t.category)
        .filter((category: string | null, index: number, self: (string | null)[]) => 
          category !== null && self.indexOf(category) === index
        ) as string[];
      return allCategories;
    },
  });

  // Translation form
  const translationForm = useForm<TranslationFormValues>({
    resolver: zodResolver(translationSchema),
    defaultValues: {
      key: "",
      enText: "",
      arText: "",
      category: "",
      context: "",
    },
  });

  // Language settings form
  const languageSettingsForm = useForm<LanguageSettingsFormValues>({
    resolver: zodResolver(languageSettingsSchema),
    defaultValues: {
      defaultLanguage: languageSettings?.defaultLanguage || "en",
      availableLanguages: Array.isArray(languageSettings?.availableLanguages) 
        ? languageSettings.availableLanguages 
        : ["en", "ar"],
      rtlLanguages: Array.isArray(languageSettings?.rtlLanguages) 
        ? languageSettings.rtlLanguages 
        : ["ar"],
    },
  });

  // Create translation mutation
  const createTranslationMutation = useMutation({
    mutationFn: async (data: TranslationFormValues) => {
      return await apiRequest<Translation>('/api/admin/translations', {
        method: 'POST',
        body: JSON.stringify(data),
      } as RequestInit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      queryClient.invalidateQueries({ queryKey: ['translationCategories'] });
      toast({
        title: "Translation created",
        description: "New translation has been added successfully.",
      });
      translationForm.reset();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create translation.",
        variant: "destructive",
      });
      console.error("Translation creation error:", error);
    },
  });

  // Update translation mutation
  const updateTranslationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TranslationFormValues> }) => {
      return await apiRequest<Translation>(`/api/admin/translations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      } as RequestInit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast({
        title: "Translation updated",
        description: "Translation has been updated successfully.",
      });
      setEditingTranslation(null);
      translationForm.reset();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update translation.",
        variant: "destructive",
      });
      console.error("Translation update error:", error);
    },
  });

  // Delete translation mutation
  const deleteTranslationMutation = useMutation({
    mutationFn: async (id: number) => {
      // Using fetch directly for DELETE requests to handle 204 status correctly
      const response = await fetch(`/api/admin/translations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed with status: ${response.status}`);
      }
      
      // Return true for success instead of trying to parse the response
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      queryClient.invalidateQueries({ queryKey: ['translationCategories'] });
      toast({
        title: "Translation deleted",
        description: "Translation has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete translation.",
        variant: "destructive",
      });
      console.error("Translation deletion error:", error);
    },
  });
  
  // Sync translations mutation - scans codebase for new translation keys
  const syncTranslationsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/admin/translations/sync', {
        method: 'POST',
      } as RequestInit);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      queryClient.invalidateQueries({ queryKey: ['translationCategories'] });
      toast({
        title: "Translations synced",
        description: data.message || "Codebase has been scanned and translations have been synced successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Sync Error",
        description: "Failed to sync translations from codebase.",
        variant: "destructive",
      });
      console.error("Translation sync error:", error);
    },
  });

  // Update language settings mutation
  const updateLanguageSettingsMutation = useMutation({
    mutationFn: async (data: LanguageSettingsFormValues) => {
      return await apiRequest<{ defaultLanguage: string, availableLanguages: string[], rtlLanguages: string[] }>(
        '/api/admin/translations/settings', 
        {
          method: 'PUT',
          body: JSON.stringify(data),
        } as RequestInit
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languageSettings'] });
      toast({
        title: "Settings updated",
        description: "Language settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update language settings.",
        variant: "destructive",
      });
      console.error("Language settings update error:", error);
    },
  });
  
  // Machine translate a single item
  const machineTranslateMutation = useMutation({
    mutationFn: async ({ id, force = false }: { id: number; force?: boolean }) => {
      return await apiRequest(`/api/admin/translations/${id}/translate`, {
        method: 'POST',
        body: JSON.stringify({ force }),
      } as RequestInit);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast({
        title: "Translation complete",
        description: data.message || "Item translated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Translation Error",
        description: "Failed to machine translate this item.",
        variant: "destructive",
      });
      console.error("Machine translation error:", error);
    },
  });
  
  // Batch translate multiple items
  const batchTranslateMutation = useMutation({
    mutationFn: async (params: { 
      filter: 'all' | 'untranslated' | 'category';
      category?: string;
      limit: number;
      force?: boolean;
    }) => {
      return await apiRequest('/api/admin/translations/batch-translate', {
        method: 'POST',
        body: JSON.stringify(params),
      } as RequestInit);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast({
        title: "Batch translation complete",
        description: data.message || `Processed ${data.processed} translations.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Batch Translation Error",
        description: "Failed to process batch translation.",
        variant: "destructive",
      });
      console.error("Batch translation error:", error);
    },
  });

  // Handle form submission
  const onTranslationSubmit = (data: TranslationFormValues) => {
    if (editingTranslation) {
      updateTranslationMutation.mutate({ id: editingTranslation.id, data });
    } else {
      createTranslationMutation.mutate(data);
    }
  };

  // Handle language settings form submission
  const onLanguageSettingsSubmit = (data: LanguageSettingsFormValues) => {
    updateLanguageSettingsMutation.mutate(data);
  };

  // Add/Edit Translation Dialog
  const handleOpenDialog = (translation?: Translation) => {
    if (translation) {
      setEditingTranslation(translation);
      translationForm.reset({
        key: translation.key,
        enText: translation.enText,
        arText: translation.arText || "",
        category: translation.category || "",
        context: translation.context || "",
      });
    } else {
      setEditingTranslation(null);
      translationForm.reset({
        key: "",
        enText: "",
        arText: "",
        category: selectedCategory || "",
        context: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Handle delete translation
  const handleDeleteTranslation = (id: number) => {
    if (confirm("Are you sure you want to delete this translation?")) {
      deleteTranslationMutation.mutate(id);
    }
  };

  // Filter translations based on search term and translation status
  const filteredTranslations = translations.filter(translation => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search filter
    const matchesSearch = (
      translation.key.toLowerCase().includes(searchLower) ||
      translation.enText.toLowerCase().includes(searchLower) ||
      (translation.arText && translation.arText.includes(searchTerm)) ||
      (translation.category && translation.category.toLowerCase().includes(searchLower))
    );
    
    // Translation status filter
    let matchesStatus = true;
    if (translationStatus === "translated") {
      matchesStatus = translation.arText !== null && translation.arText.trim() !== '';
    } else if (translationStatus === "untranslated") {
      matchesStatus = !translation.arText || translation.arText.trim() === '';
    }
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      {/* Add scroll button */}
      <ScrollButton threshold={300} variant="secondary" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('admin.translations.title', 'Translation Management')}</h1>
        <p className="text-zinc-500">{t('admin.translations.description', 'Manage translations and language settings')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger
            value="translations"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            <FileText size={16} />
            <span>{t('admin.translations.tabs.translations', 'Translations')}</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
          >
            <Globe size={16} />
            <span>{t('admin.translations.tabs.settings', 'Language Settings')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Translations Tab */}
        <TabsContent value="translations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('admin.translations.list.title', 'Translation List')}</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => syncTranslationsMutation.mutate()}
                    className="flex items-center gap-2"
                    variant="outline"
                    disabled={syncTranslationsMutation.isPending}
                  >
                    <RefreshCw size={16} className={syncTranslationsMutation.isPending ? "animate-spin" : ""} />
                    {t('admin.translations.actions.sync', 'Auto-Sync Translations')}
                  </Button>
                  <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
                    <Plus size={16} />
                    {t('admin.translations.actions.add', 'Add Translation')}
                  </Button>
                </div>
              </div>
              <CardDescription>
                {t('admin.translations.list.description', 'View and manage all translations. Use Auto-Sync to scan the codebase and automatically add missing translation keys.')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              {/* Filters & Search Area with Improved Responsive Design */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder={t('admin.translations.search', 'Search translations...')}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                      <div className="shrink-0 text-sm text-muted-foreground w-24">
                        {t('admin.translations.filter.categoryLabel', 'Category:')}
                      </div>
                      <Select
                        value={selectedCategory || "all"}
                        onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
                      >
                        <SelectTrigger className="w-full border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder={t('admin.translations.filter.category', 'Filter by category')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {t('admin.translations.filter.all', 'All Categories')}
                          </SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                      <div className="shrink-0 text-sm text-muted-foreground w-24">
                        {t('admin.translations.filter.statusLabel', 'Status:')}
                      </div>
                      <Select
                        value={translationStatus}
                        onValueChange={(value) => setTranslationStatus(value as "all" | "translated" | "untranslated")}
                      >
                        <SelectTrigger className="w-full border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder={t('admin.translations.filter.status', 'Translation Status')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {t('admin.translations.filter.allTranslations', 'All Translations')}
                          </SelectItem>
                          <SelectItem value="translated">
                            {t('admin.translations.filter.translated', 'Translated Only')}
                          </SelectItem>
                          <SelectItem value="untranslated">
                            {t('admin.translations.filter.untranslated', 'Untranslated Only')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Active Filters Summary */}
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 text-sm rounded-full px-3 py-1">
                      <span className="mr-1">{t('admin.translations.filter.category', 'Category')}:</span>
                      <span className="font-medium">{selectedCategory}</span>
                    </div>
                  )}
                  
                  {translationStatus !== "all" && (
                    <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 text-sm rounded-full px-3 py-1">
                      <span className="mr-1">{t('admin.translations.filter.statusLabel', 'Status')}:</span>
                      <span className="font-medium">
                        {translationStatus === "translated" 
                          ? t('admin.translations.filter.translated', 'Translated Only')
                          : t('admin.translations.filter.untranslated', 'Untranslated Only')}
                      </span>
                    </div>
                  )}
                  
                  {(searchTerm || selectedCategory || translationStatus !== "all") && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory(null);
                        setTranslationStatus("all");
                      }}
                      className="text-sm h-7"
                    >
                      {t('admin.translations.filter.clearAll', 'Clear All Filters')}
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Translation Stats Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="border-2 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('admin.translations.stats.translated', 'Translated')}
                        </p>
                        <h4 className="text-2xl font-bold">
                          {translations.filter(t => t.arText && t.arText.trim() !== '').length}
                        </h4>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {Math.round((translations.filter(t => t.arText && t.arText.trim() !== '').length / translations.length) * 100)}% {t('admin.translations.stats.complete', 'complete')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-amber-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('admin.translations.stats.untranslated', 'Untranslated')}
                        </p>
                        <h4 className="text-2xl font-bold">
                          {translations.filter(t => !t.arText || t.arText.trim() === '').length}
                        </h4>
                      </div>
                      <div className="bg-amber-100 p-3 rounded-full">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {Math.round((translations.filter(t => !t.arText || t.arText.trim() === '').length / translations.length) * 100)}% {t('admin.translations.stats.remaining', 'remaining')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('admin.translations.stats.total', 'Total Keys')}
                        </p>
                        <h4 className="text-2xl font-bold">
                          {translations.length}
                        </h4>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {categories.length} {t('admin.translations.stats.categories', 'categories')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('admin.translations.stats.progress', 'Translation Progress')}
                        </p>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-2xl font-bold">
                            {Math.round((translations.filter(t => t.arText && t.arText.trim() !== '').length / translations.length) * 100)}%
                          </h4>
                        </div>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <BarChart className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.round((translations.filter(t => t.arText && t.arText.trim() !== '').length / translations.length) * 100)}%` }}>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Translations Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.translations.table.key', 'Key')}</TableHead>
                      <TableHead>{t('admin.translations.table.english', 'English')}</TableHead>
                      <TableHead>{t('admin.translations.table.arabic', 'Arabic')}</TableHead>
                      <TableHead>{t('admin.translations.table.category', 'Category')}</TableHead>
                      <TableHead className="text-right">{t('admin.translations.table.actions', 'Actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingTranslations ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {t('admin.translations.loading', 'Loading translations...')}
                        </TableCell>
                      </TableRow>
                    ) : filteredTranslations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {t('admin.translations.empty', 'No translations found.')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTranslations.map((translation) => (
                        <TableRow key={translation.id}>
                          <TableCell className="font-medium">{translation.key}</TableCell>
                          <TableCell>{translation.enText}</TableCell>
                          <TableCell>
                            <span dir="rtl" className="font-arabic">
                              {translation.arText || "-"}
                            </span>
                          </TableCell>
                          <TableCell>{translation.category || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {/* Machine Translation Button - Only show for untranslated items */}
                              {(!translation.arText || translation.arText.trim() === '') && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => machineTranslateMutation.mutate({ id: translation.id })}
                                  title={t('admin.translations.actions.machineTranslate', 'Machine Translate')}
                                  disabled={machineTranslateMutation.isPending}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <Globe size={16} className={machineTranslateMutation.isPending ? "animate-spin" : ""} />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDialog(translation)}
                                title={t('admin.translations.actions.edit', 'Edit')}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTranslation(translation.id)}
                                title={t('admin.translations.actions.delete', 'Delete')}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Advanced Translation Features Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">{t('admin.translations.features.title', 'Translation Tools & Features')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Machine Translation Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe size={18} className="text-blue-500" />
                    {t('admin.translations.features.machineTranslation', 'Machine Translation')}
                    <span className="ml-auto text-xs bg-green-100 text-green-800 font-semibold px-2 py-1 rounded-full">
                      {t('admin.translations.features.active', 'Active')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('admin.translations.features.machineTranslationActiveDesc', 'Machine translation is enabled using Google Gemini AI. Individually translate items or use batch translation below.')}
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md mb-4">
                    <h4 className="font-medium text-sm mb-2">{t('admin.translations.batch.title', 'Batch Translation')}</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      {t('admin.translations.batch.description', 'Automatically translate multiple items at once.')}
                    </p>
                    
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Select 
                          defaultValue="untranslated"
                          onValueChange={(value) => {
                            setBatchFilterType(value as 'all' | 'untranslated' | 'category');
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('admin.translations.batch.filterType', 'Filter type')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="untranslated">{t('admin.translations.batch.untranslated', 'Untranslated Only')}</SelectItem>
                            <SelectItem value="all">{t('admin.translations.batch.all', 'All Items')}</SelectItem>
                            <SelectItem value="category">{t('admin.translations.batch.category', 'By Category')}</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          defaultValue="10"
                          onValueChange={(value) => {
                            setBatchLimit(parseInt(value));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('admin.translations.batch.limit', 'Item limit')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 {t('admin.translations.batch.items', 'items')}</SelectItem>
                            <SelectItem value="10">10 {t('admin.translations.batch.items', 'items')}</SelectItem>
                            <SelectItem value="25">25 {t('admin.translations.batch.items', 'items')}</SelectItem>
                            <SelectItem value="50">50 {t('admin.translations.batch.items', 'items')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => batchTranslateMutation.mutate({ 
                          filter: batchFilterType, 
                          category: batchFilterType === 'category' ? selectedCategory || undefined : undefined,
                          limit: batchLimit,
                          force: false 
                        })}
                        disabled={batchTranslateMutation.isPending}
                      >
                        {batchTranslateMutation.isPending ? (
                          <span className="flex items-center gap-2">
                            <Globe size={16} className="animate-spin" />
                            {t('admin.translations.batch.translating', 'Translating...')}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Globe size={16} />
                            {t('admin.translations.batch.translateBatch', 'Translate Batch')}
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground italic">
                    {t('admin.translations.features.poweredBy', 'Powered by Google Gemini 2.0 Flash Model for Arabic translations')}
                  </div>
                </CardContent>
              </Card>
              
              {/* Translation Import/Export Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Download size={18} />
                    {t('admin.translations.features.importExport', 'Import & Export')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('admin.translations.features.importExportDesc', 'Export translations to a file for backup or transfer between environments. Import translations from a file to restore them on a new host.')}
                  </p>
                  
                  <div className="flex flex-col space-y-3">
                    <a 
                      href="/api/admin/translations/export" 
                      download="sahara-translations.json"
                      className="inline-flex"
                    >
                      <Button variant="outline" className="w-full">
                        <span className="flex items-center gap-2">
                          <Download size={16} />
                          {t('admin.translations.features.exportTranslations', 'Export All Translations')}
                        </span>
                      </Button>
                    </a>
                    
                    <div className="relative">
                      <input
                        type="file"
                        id="translation-import"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".json"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = async (event) => {
                              try {
                                const content = JSON.parse(event.target?.result as string);
                                
                                // Send the import request
                                const response = await fetch('/api/admin/translations/import', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify(content),
                                });
                                
                                const result = await response.json();
                                
                                if (response.ok) {
                                  toast({
                                    title: "Import Successful",
                                    description: `Imported ${result.stats.imported} new and updated ${result.stats.updated} existing translations.`,
                                  });
                                  
                                  // Refresh the translations data
                                  queryClient.invalidateQueries({ queryKey: ['translations'] });
                                  queryClient.invalidateQueries({ queryKey: ['languageSettings'] });
                                } else {
                                  toast({
                                    title: "Import Failed",
                                    description: result.message || "Failed to import translations",
                                    variant: "destructive",
                                  });
                                }
                              } catch (error) {
                                console.error('Import error:', error);
                                toast({
                                  title: "Import Failed",
                                  description: "Invalid file format or data structure",
                                  variant: "destructive",
                                });
                              }
                              
                              // Reset the file input
                              e.target.value = '';
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                      <Button variant="outline" className="w-full">
                        <span className="flex items-center gap-2">
                          <Upload size={16} />
                          {t('admin.translations.features.importTranslations', 'Import Translations')}
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Translation Memory Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <RefreshCw size={18} />
                    {t('admin.translations.features.translationMemory', 'Translation Memory')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('admin.translations.features.translationMemoryDesc', 'Implement a translation memory system that suggests translations based on previously translated similar content.')}
                  </p>
                  <Button variant="outline" className="w-full">
                    {t('admin.translations.features.enableFeature', 'Enable Feature')}
                  </Button>
                </CardContent>
              </Card>
              
              {/* Bulk Operations Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Save size={18} className="text-blue-500" />
                    {t('admin.translations.features.bulkTranslations', 'Bulk Operations')}
                    <span className="ml-auto text-xs bg-green-100 text-green-800 font-semibold px-2 py-1 rounded-full">
                      {t('admin.translations.features.active', 'Active')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('admin.translations.features.bulkOperationsActiveDesc', 'Bulk operations are enabled. Use the category and status filters above to work with multiple translations at once.')}
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md flex flex-col gap-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // Toggle the translation status to show only untranslated items
                        setTranslationStatus('untranslated');
                      }}
                    >
                      <AlertCircle size={16} className="mr-2" />
                      {t('admin.translations.bulk.viewUntranslated', 'View Untranslated Items')}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // Toggle the translation status to show only translated items
                        setTranslationStatus('translated');
                      }}
                    >
                      <Check size={16} className="mr-2" />
                      {t('admin.translations.bulk.viewTranslated', 'View Translated Items')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Missing Translations Overview Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart size={18} className="text-blue-500" />
                    {t('admin.translations.features.missingKeysHighlight', 'Missing Translations Overview')}
                    <span className="ml-auto text-xs bg-green-100 text-green-800 font-semibold px-2 py-1 rounded-full">
                      {t('admin.translations.features.active', 'Active')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('admin.translations.features.missingTranslationsActiveDesc', 'Translation progress dashboard is enabled. Track your progress in adding Arabic translations.')}
                  </p>
                  
                  {/* Translation Progress Stats */}
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                    <h4 className="font-medium text-sm mb-2">
                      {t('admin.translations.stats.title', 'Translation Progress')}
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>
                            {t('admin.translations.stats.translated', 'Translated')}:
                            <span className="font-medium ml-1">
                              {translations.filter(t => t.arText && t.arText.trim() !== '').length}
                            </span>
                          </span>
                          <span>
                            {t('admin.translations.stats.total', 'Total')}: 
                            <span className="font-medium ml-1">{translations.length}</span>
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ 
                              width: `${Math.round((translations.filter(t => t.arText && t.arText.trim() !== '').length / translations.length) * 100)}%` 
                            }}
                          />
                        </div>
                        <div className="text-xs text-right mt-1">
                          {Math.round((translations.filter(t => t.arText && t.arText.trim() !== '').length / translations.length) * 100)}% {t('admin.translations.stats.complete', 'complete')}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Language Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.translations.settings.title', 'Language Settings')}</CardTitle>
              <CardDescription>
                {t('admin.translations.settings.description', 'Configure language options for the site')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...languageSettingsForm}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = languageSettingsForm.getValues();
                  onLanguageSettingsSubmit(formData);
                }} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={languageSettingsForm.control}
                      name="defaultLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.translations.settings.defaultLanguage', 'Default Language')}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select default language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="ar">Arabic</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t('admin.translations.settings.defaultLanguageDesc', 'The default language for new visitors')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{t('admin.translations.settings.availableLanguages', 'Available Languages')}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('admin.translations.settings.availableLanguagesDesc', 'Languages that users can switch between')}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded-md flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            id="lang-en"
                            checked={languageSettingsForm.watch('availableLanguages').includes('en')}
                            onChange={(e) => {
                              const current = languageSettingsForm.watch('availableLanguages');
                              if (e.target.checked) {
                                languageSettingsForm.setValue('availableLanguages', [...current, 'en']);
                              } else {
                                languageSettingsForm.setValue('availableLanguages', current.filter(l => l !== 'en'));
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <label htmlFor="lang-en" className="text-sm font-medium">English</label>
                        </div>
                        <div className="p-4 border rounded-md flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            id="lang-ar"
                            checked={languageSettingsForm.watch('availableLanguages').includes('ar')}
                            onChange={(e) => {
                              const current = languageSettingsForm.watch('availableLanguages');
                              if (e.target.checked) {
                                languageSettingsForm.setValue('availableLanguages', [...current, 'ar']);
                              } else {
                                languageSettingsForm.setValue('availableLanguages', current.filter(l => l !== 'ar'));
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <label htmlFor="lang-ar" className="text-sm font-medium">Arabic</label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{t('admin.translations.settings.rtlLanguages', 'RTL Languages')}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('admin.translations.settings.rtlLanguagesDesc', 'Languages that use right-to-left text direction')}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded-md flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            id="rtl-ar"
                            checked={languageSettingsForm.watch('rtlLanguages').includes('ar')}
                            onChange={(e) => {
                              const current = languageSettingsForm.watch('rtlLanguages');
                              if (e.target.checked) {
                                languageSettingsForm.setValue('rtlLanguages', [...current, 'ar']);
                              } else {
                                languageSettingsForm.setValue('rtlLanguages', current.filter(l => l !== 'ar'));
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <label htmlFor="rtl-ar" className="text-sm font-medium">Arabic</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="mt-6 flex items-center gap-2">
                    <Save size={16} />
                    {t('admin.translations.actions.saveSettings', 'Save Settings')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for adding/editing translations */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingTranslation 
                ? t('admin.translations.dialog.editTitle', 'Edit Translation') 
                : t('admin.translations.dialog.addTitle', 'Add New Translation')}
            </DialogTitle>
            <DialogDescription>
              {editingTranslation 
                ? t('admin.translations.dialog.editDesc', 'Update translation details below') 
                : t('admin.translations.dialog.addDesc', 'Enter translation details below')}
            </DialogDescription>
          </DialogHeader>
          <Form {...translationForm}>
            <form onSubmit={translationForm.handleSubmit(onTranslationSubmit)} className="space-y-4">
              <FormField
                control={translationForm.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.translations.form.key', 'Key')}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., common.button.submit" {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('admin.translations.form.keyDesc', 'Unique identifier for this translation')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={translationForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.translations.form.category', 'Category')}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., common, auth, homepage" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>
                      {t('admin.translations.form.categoryDesc', 'Group translations by category')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={translationForm.control}
                  name="enText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.translations.form.english', 'English Text')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="English translation text"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={translationForm.control}
                  name="arText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.translations.form.arabic', 'Arabic Text')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Arabic translation text"
                          className="min-h-[100px] font-arabic text-right"
                          dir="rtl"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={translationForm.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.translations.form.context', 'Context (Optional)')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Context or notes about this translation"
                        className="min-h-[80px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('admin.translations.form.contextDesc', 'Additional information for translators')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t('admin.translations.actions.cancel', 'Cancel')}
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <Save size={16} />
                  {t('admin.translations.actions.save', 'Save Translation')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}