import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LaravelApiService } from "@/lib/laravelApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Server, 
  Database, 
  MapPin, 
  Building, 
  Plane,
  Package,
  RefreshCw,
  Settings,
  AlertTriangle,
  Globe
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface ConnectionStatus {
  isConnected: boolean;
  latency?: number;
  error?: string;
  lastChecked?: Date;
}

export default function LaravelIntegration() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ isConnected: false });
  const [testingConnection, setTestingConnection] = useState(false);

  // Test Laravel API connection
  const testConnection = async () => {
    setTestingConnection(true);
    const startTime = Date.now();
    
    try {
      await LaravelApiService.healthCheck();
      const latency = Date.now() - startTime;
      setConnectionStatus({
        isConnected: true,
        latency,
        lastChecked: new Date()
      });
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        error: error instanceof Error ? error.message : 'Connection failed',
        lastChecked: new Date()
      });
    } finally {
      setTestingConnection(false);
    }
  };

  // Auto-test connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  // Fetch destinations from Laravel API
  const { data: destinations, isLoading: destinationsLoading, error: destinationsError, refetch: refetchDestinations } = useQuery({
    queryKey: ['/destinations'],
    queryFn: () => LaravelApiService.getDestinations(),
    enabled: connectionStatus.isConnected,
    retry: 1,
  });

  // Fetch tours from Laravel API
  const { data: tours, isLoading: toursLoading, error: toursError, refetch: refetchTours } = useQuery({
    queryKey: ['/tours'],
    queryFn: () => LaravelApiService.getTours(),
    enabled: connectionStatus.isConnected,
    retry: 1,
  });

  // Fetch packages from Laravel API
  const { data: packages, isLoading: packagesLoading, error: packagesError, refetch: refetchPackages } = useQuery({
    queryKey: ['/packages'],
    queryFn: () => LaravelApiService.getPackages(),
    enabled: connectionStatus.isConnected,
    retry: 1,
  });

  // Fetch hotels from Laravel API
  const { data: hotels, isLoading: hotelsLoading, error: hotelsError, refetch: refetchHotels } = useQuery({
    queryKey: ['/hotels'],
    queryFn: () => LaravelApiService.getHotels(),
    enabled: connectionStatus.isConnected,
    retry: 1,
  });

  const refreshAllData = () => {
    refetchDestinations();
    refetchTours();
    refetchPackages();
    refetchHotels();
  };

  const getStatusBadge = (isConnected: boolean, isLoading?: boolean) => {
    if (isLoading) {
      return <Badge variant="secondary">Loading...</Badge>;
    }
    return isConnected ? 
      <Badge className="bg-green-100 text-green-800">Connected</Badge> : 
      <Badge variant="destructive">Disconnected</Badge>;
  };

  const getDataStatusCard = (title: string, data: any, isLoading: boolean, error: any, icon: React.ReactNode) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {getStatusBadge(!!data && !error, isLoading)}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
        
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              {error instanceof Error ? error.message : 'Failed to load data'}
            </AlertDescription>
          </Alert>
        )}
        
        {data && !error && !isLoading && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {Array.isArray(data) ? `${data.length} items loaded` : 'Data loaded successfully'}
            </p>
            {Array.isArray(data) && data.length > 0 && (
              <div className="bg-gray-50 rounded p-2">
                <p className="text-xs font-medium text-gray-600 mb-1">Sample:</p>
                <p className="text-xs text-gray-700 truncate">
                  {data[0].name || data[0].title || JSON.stringify(data[0]).substring(0, 50)}...
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('تكامل Laravel API', 'Laravel API Integration')}
        </h1>
        <p className="text-gray-600 mb-6">
          {t('إدارة الاتصال والتكامل بين React Frontend و Laravel Backend', 'Manage connection and integration between React Frontend and Laravel Backend')}
        </p>
      </div>

      <Tabs defaultValue="status" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">{t('حالة الاتصال', 'Connection Status')}</TabsTrigger>
          <TabsTrigger value="data">{t('البيانات', 'Data')}</TabsTrigger>
          <TabsTrigger value="endpoints">{t('نقاط النهاية', 'Endpoints')}</TabsTrigger>
          <TabsTrigger value="settings">{t('الإعدادات', 'Settings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Server className="w-5 h-5" />
                  <span>{t('حالة خادم Laravel', 'Laravel Server Status')}</span>
                </CardTitle>
                <Button 
                  onClick={testConnection} 
                  disabled={testingConnection}
                  variant="outline"
                  size="sm"
                >
                  {testingConnection ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="mb-2">
                    {connectionStatus.isConnected ? (
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500 mx-auto" />
                    )}
                  </div>
                  <p className="font-medium">
                    {connectionStatus.isConnected ? t('متصل', 'Connected') : t('غير متصل', 'Disconnected')}
                  </p>
                </div>
                
                {connectionStatus.latency && (
                  <div className="text-center">
                    <div className="mb-2">
                      <Globe className="w-8 h-8 text-blue-500 mx-auto" />
                    </div>
                    <p className="font-medium">{connectionStatus.latency}ms</p>
                    <p className="text-sm text-gray-500">{t('زمن الاستجابة', 'Latency')}</p>
                  </div>
                )}
                
                {connectionStatus.lastChecked && (
                  <div className="text-center">
                    <div className="mb-2">
                      <RefreshCw className="w-8 h-8 text-gray-500 mx-auto" />
                    </div>
                    <p className="font-medium text-sm">
                      {connectionStatus.lastChecked.toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-500">{t('آخر فحص', 'Last Checked')}</p>
                  </div>
                )}
              </div>
              
              {connectionStatus.error && (
                <Alert className="mt-4 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">
                    {connectionStatus.error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t('بيانات Laravel API', 'Laravel API Data')}</h2>
            <Button onClick={refreshAllData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('تحديث جميع البيانات', 'Refresh All Data')}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getDataStatusCard(
              t('الوجهات', 'Destinations'),
              destinations,
              destinationsLoading,
              destinationsError,
              <MapPin className="w-5 h-5 text-blue-500" />
            )}
            
            {getDataStatusCard(
              t('الجولات', 'Tours'),
              tours,
              toursLoading,
              toursError,
              <Plane className="w-5 h-5 text-green-500" />
            )}
            
            {getDataStatusCard(
              t('الباقات', 'Packages'),
              packages,
              packagesLoading,
              packagesError,
              <Package className="w-5 h-5 text-purple-500" />
            )}
            
            {getDataStatusCard(
              t('الفنادق', 'Hotels'),
              hotels,
              hotelsLoading,
              hotelsError,
              <Building className="w-5 h-5 text-orange-500" />
            )}
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('نقاط النهاية المتاحة', 'Available Endpoints')}</CardTitle>
              <CardDescription>
                {t('جميع نقاط النهاية المتاحة في Laravel API', 'All available endpoints in Laravel API')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { method: 'GET', endpoint: '/api/health', description: t('فحص صحة الخادم', 'Server health check') },
                  { method: 'GET', endpoint: '/api/destinations', description: t('قائمة الوجهات', 'List destinations') },
                  { method: 'GET', endpoint: '/api/destinations/{id}', description: t('تفاصيل وجهة', 'Destination details') },
                  { method: 'GET', endpoint: '/api/tours', description: t('قائمة الجولات', 'List tours') },
                  { method: 'GET', endpoint: '/api/tours/{id}', description: t('تفاصيل جولة', 'Tour details') },
                  { method: 'GET', endpoint: '/api/packages', description: t('قائمة الباقات', 'List packages') },
                  { method: 'GET', endpoint: '/api/packages/{id}', description: t('تفاصيل باقة', 'Package details') },
                  { method: 'GET', endpoint: '/api/hotels', description: t('قائمة الفنادق', 'List hotels') },
                  { method: 'GET', endpoint: '/api/hotels/{id}', description: t('تفاصيل فندق', 'Hotel details') },
                  { method: 'POST', endpoint: '/api/auth/register', description: t('تسجيل حساب جديد', 'Register new account') },
                  { method: 'POST', endpoint: '/api/auth/login', description: t('تسجيل الدخول', 'Login') },
                  { method: 'POST', endpoint: '/api/auth/logout', description: t('تسجيل الخروج', 'Logout') },
                  { method: 'GET', endpoint: '/api/bookings', description: t('قائمة الحجوزات', 'List bookings') },
                  { method: 'POST', endpoint: '/api/bookings', description: t('إنشاء حجز جديد', 'Create new booking') }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <Badge variant={item.method === 'GET' ? 'secondary' : 'default'}>
                        {item.method}
                      </Badge>
                      <code className="text-sm font-mono">{item.endpoint}</code>
                    </div>
                    <span className="text-sm text-gray-600">{item.description}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>{t('إعدادات الاتصال', 'Connection Settings')}</span>
              </CardTitle>
              <CardDescription>
                {t('تكوين إعدادات الاتصال مع Laravel API', 'Configure Laravel API connection settings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-url">{t('رابط API الأساسي', 'Base API URL')}</Label>
                <Input 
                  id="api-url" 
                  defaultValue="http://localhost:8000/api" 
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {t('تأكد من تشغيل خادم Laravel على هذا الرابط', 'Ensure Laravel server is running on this URL')}
                </p>
              </div>
              
              <div>
                <Label htmlFor="timeout">{t('مهلة الاتصال (ثانية)', 'Connection Timeout (seconds)')}</Label>
                <Input 
                  id="timeout" 
                  type="number" 
                  defaultValue="30" 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="retry">{t('عدد المحاولات', 'Retry Attempts')}</Label>
                <Input 
                  id="retry" 
                  type="number" 
                  defaultValue="3" 
                  className="mt-1"
                />
              </div>

              <Button className="w-full">
                {t('حفظ الإعدادات', 'Save Settings')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('معلومات النظام', 'System Information')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t('إصدار React:', 'React Version:')}</span>
                  <span className="ml-2">18.x</span>
                </div>
                <div>
                  <span className="font-medium">{t('إصدار Laravel:', 'Laravel Version:')}</span>
                  <span className="ml-2">10.x</span>
                </div>
                <div>
                  <span className="font-medium">{t('قاعدة البيانات:', 'Database:')}</span>
                  <span className="ml-2">PostgreSQL</span>
                </div>
                <div>
                  <span className="font-medium">{t('المنفذ:', 'Port:')}</span>
                  <span className="ml-2">8000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}