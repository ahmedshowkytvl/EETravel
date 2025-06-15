import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Server, Database } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface ApiResponse {
  status: number;
  data?: any;
  error?: string;
}

export default function ApiTest() {
  const { t } = useLanguage();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{ [key: string]: ApiResponse }>({});

  const testEndpoints = [
    { name: 'Health Check', url: 'http://localhost:8000/api/health', key: 'health' },
    { name: 'Destinations', url: 'http://localhost:8000/api/destinations', key: 'destinations' },
    { name: 'Countries', url: 'http://localhost:8000/api/countries', key: 'countries' },
    { name: 'Tours', url: 'http://localhost:8000/api/tours', key: 'tours' },
    { name: 'Packages', url: 'http://localhost:8000/api/packages', key: 'packages' },
    { name: 'Hotels', url: 'http://localhost:8000/api/hotels', key: 'hotels' }
  ];

  const testApi = async (endpoint: typeof testEndpoints[0]) => {
    try {
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [endpoint.key]: {
          status: response.status,
          data: data
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpoint.key]: {
          status: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  const testAllEndpoints = async () => {
    setTesting(true);
    setResults({});

    for (const endpoint of testEndpoints) {
      await testApi(endpoint);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTesting(false);
  };

  const getStatusIcon = (result: ApiResponse) => {
    if (result.status >= 200 && result.status < 300) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (result.status === 0) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (result: ApiResponse) => {
    if (result.status >= 200 && result.status < 300) {
      return <Badge className="bg-green-100 text-green-800">Success</Badge>;
    } else if (result.status === 0) {
      return <Badge variant="destructive">Connection Failed</Badge>;
    } else {
      return <Badge variant="secondary">HTTP {result.status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('اختبار Laravel API', 'Laravel API Test')}
        </h1>
        <p className="text-gray-600 mb-6">
          {t('اختبار الاتصال بخادم Laravel والتحقق من حالة نقاط النهاية', 'Test Laravel server connection and check endpoint status')}
        </p>
        
        <Button 
          onClick={testAllEndpoints} 
          disabled={testing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('جاري الاختبار...', 'Testing...')}
            </>
          ) : (
            <>
              <Server className="w-4 h-4 mr-2" />
              {t('اختبار جميع النقاط', 'Test All Endpoints')}
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testEndpoints.map((endpoint) => {
          const result = results[endpoint.key];
          
          return (
            <Card key={endpoint.key} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                  {result && getStatusIcon(result)}
                </div>
                <CardDescription className="text-sm text-gray-500">
                  {endpoint.url}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {result && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      {getStatusBadge(result)}
                    </div>
                    
                    {result.error && (
                      <Alert className="border-red-200 bg-red-50">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-800">
                          {result.error}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {result.data && (
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs font-medium text-gray-600 mb-2">Response:</p>
                        <div className="text-xs text-gray-700 max-h-32 overflow-y-auto">
                          {Array.isArray(result.data) ? (
                            <span>{result.data.length} items received</span>
                          ) : typeof result.data === 'object' ? (
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          ) : (
                            <span>{String(result.data)}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {!result && !testing && (
                  <div className="text-center py-6 text-gray-500">
                    <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t('لم يتم الاختبار بعد', 'Not tested yet')}</p>
                  </div>
                )}
                
                {testing && (
                  <div className="text-center py-6">
                    <Loader2 className="w-6 h-6 mx-auto animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500 mt-2">
                      {t('جاري الاختبار...', 'Testing...')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">
              {t('معلومات مهمة', 'Important Information')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <ul className="space-y-2 text-sm">
              <li>• {t('تأكد من تشغيل خادم Laravel على المنفذ 8000', 'Make sure Laravel server is running on port 8000')}</li>
              <li>• {t('استخدم الأمر: php artisan serve --host=0.0.0.0 --port=8000', 'Use command: php artisan serve --host=0.0.0.0 --port=8000')}</li>
              <li>• {t('تحقق من إعدادات CORS في Laravel', 'Check CORS settings in Laravel')}</li>
              <li>• {t('تأكد من وجود البيانات في قاعدة البيانات', 'Ensure data exists in the database')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}