import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText,
  Database,
  Hotel,
  Package,
  Users,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportResult {
  success: boolean;
  count?: number;
  results?: any[];
  errors?: Array<{
    itemIndex: number;
    item: any;
    error: string;
  }>;
  summary?: {
    total: number;
    imported: number;
    failed: number;
  };
  message?: string;
  details?: string;
}

export default function EnhancedDataImportPage() {
  const [importProgress, setImportProgress] = useState<{[key: string]: ImportResult}>({});
  const [isImporting, setIsImporting] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const importTypes = [
    { 
      key: 'hotels', 
      name: 'Hotels', 
      icon: Hotel, 
      endpoint: '/api/admin/hotels/import',
      description: 'Import hotel data with facilities and amenities',
      sampleFormat: {
        name: 'Hotel Name',
        description: 'Hotel description',
        address: 'Hotel address',
        phone: '+1234567890',
        email: 'hotel@example.com',
        destinationId: 1,
        countryId: 1,
        cityId: 1,
        starRating: 4,
        pricePerNight: 15000
      }
    },
    { 
      key: 'packages', 
      name: 'Packages', 
      icon: Package, 
      endpoint: '/api/admin/packages/import',
      description: 'Import travel packages and tours',
      sampleFormat: {
        title: 'Package Title',
        description: 'Package description',
        price: 50000,
        duration: 7,
        destinationId: 1
      }
    },
    { 
      key: 'rooms', 
      name: 'Rooms', 
      icon: Database, 
      endpoint: '/api/admin/rooms/import',
      description: 'Import hotel rooms and accommodations',
      sampleFormat: {
        name: 'Room Name',
        type: 'Standard',
        price: 12000,
        capacity: 2,
        hotelId: 1
      }
    },
    { 
      key: 'destinations', 
      name: 'Destinations', 
      icon: MapPin, 
      endpoint: '/api/admin/destinations/import',
      description: 'Import travel destinations',
      sampleFormat: {
        name: 'Destination Name',
        description: 'Destination description',
        countryId: 1
      }
    }
  ];

  const handleFileImport = async (type: string, endpoint: string) => {
    const fileInput = document.getElementById(`file-${type}`) as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a JSON file to import",
        variant: "destructive"
      });
      return;
    }

    if (!file.name.endsWith('.json')) {
      toast({
        title: "Invalid file format",
        description: "Please select a valid JSON file",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(prev => ({ ...prev, [type]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result: ImportResult = await response.json();

      setImportProgress(prev => ({ ...prev, [type]: result }));

      if (result.success) {
        toast({
          title: "Import successful",
          description: result.message || `Successfully imported ${result.count || 0} items`,
        });
      } else {
        toast({
          title: "Import failed",
          description: result.message || "Failed to import data",
          variant: "destructive"
        });
      }
    } catch (error) {
      const errorResult: ImportResult = {
        success: false,
        message: 'Network error occurred during import'
      };
      setImportProgress(prev => ({ ...prev, [type]: errorResult }));
      
      toast({
        title: "Import error",
        description: "A network error occurred during import",
        variant: "destructive"
      });
    } finally {
      setIsImporting(prev => ({ ...prev, [type]: false }));
    }
  };

  const downloadSampleFile = (type: string, sampleFormat: any) => {
    const sampleData = [sampleFormat, { ...sampleFormat, name: `${sampleFormat.name || 'Sample'} 2` }];
    const jsonString = JSON.stringify(sampleData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample-${type}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (result: ImportResult) => {
    if (result.success) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enhanced Data Import</h1>
            <p className="text-muted-foreground">
              Import data with advanced validation and error reporting
            </p>
          </div>
        </div>

        <Tabs defaultValue="import" className="space-y-4">
          <TabsList>
            <TabsTrigger value="import">Import Data</TabsTrigger>
            <TabsTrigger value="results">Import Results</TabsTrigger>
            <TabsTrigger value="samples">Sample Files</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {importTypes.map((importType) => {
                const IconComponent = importType.icon;
                const isCurrentlyImporting = isImporting[importType.key];
                const result = importProgress[importType.key];

                return (
                  <Card key={importType.key} className="relative">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        {importType.name}
                      </CardTitle>
                      <CardDescription>{importType.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`file-${importType.key}`}>Select JSON file</Label>
                        <Input
                          id={`file-${importType.key}`}
                          type="file"
                          accept=".json"
                          disabled={isCurrentlyImporting}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleFileImport(importType.key, importType.endpoint)}
                          disabled={isCurrentlyImporting}
                          className="flex-1"
                        >
                          {isCurrentlyImporting ? (
                            <>
                              <Upload className="mr-2 h-4 w-4 animate-spin" />
                              Importing...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Import
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => downloadSampleFile(importType.key, importType.sampleFormat)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Sample
                        </Button>
                      </div>

                      {result && (
                        <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result)}
                            <AlertDescription>
                              {result.message}
                              {result.summary && (
                                <div className="mt-2 text-sm">
                                  Total: {result.summary.total} | 
                                  Imported: {result.summary.imported} | 
                                  Failed: {result.summary.failed}
                                </div>
                              )}
                            </AlertDescription>
                          </div>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Import Results Summary</CardTitle>
                <CardDescription>Detailed results from recent import operations</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(importProgress).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No import operations performed yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(importProgress).map(([type, result]) => (
                      <div key={type} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold capitalize">{type} Import</h3>
                          <Badge variant={result.success ? "default" : "destructive"}>
                            {result.success ? "Success" : "Failed"}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {result.message}
                        </p>

                        {result.summary && (
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Total:</span> {result.summary.total}
                            </div>
                            <div className="text-green-600">
                              <span className="font-medium">Imported:</span> {result.summary.imported}
                            </div>
                            <div className="text-red-600">
                              <span className="font-medium">Failed:</span> {result.summary.failed}
                            </div>
                          </div>
                        )}

                        {result.errors && result.errors.length > 0 && (
                          <div className="mt-3">
                            <h4 className="font-medium text-sm mb-2">Errors:</h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {result.errors.slice(0, 5).map((error, index) => (
                                <div key={index} className="text-xs bg-red-50 p-2 rounded border-l-2 border-red-200">
                                  <span className="font-medium">Item {error.itemIndex}:</span> {error.error}
                                </div>
                              ))}
                              {result.errors.length > 5 && (
                                <div className="text-xs text-muted-foreground">
                                  ... and {result.errors.length - 5} more errors
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="samples" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {importTypes.map((importType) => {
                const IconComponent = importType.icon;
                
                return (
                  <Card key={importType.key}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        {importType.name} Sample
                      </CardTitle>
                      <CardDescription>Download sample JSON format</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto mb-4">
{JSON.stringify(importType.sampleFormat, null, 2)}
                      </pre>
                      <Button
                        variant="outline"
                        onClick={() => downloadSampleFile(importType.key, importType.sampleFormat)}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Sample
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}