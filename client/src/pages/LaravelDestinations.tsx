import { useQuery } from "@tanstack/react-query";
import { LaravelApiService } from "@/lib/laravelApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Users } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface Country {
  id: number;
  name: string;
  code: string;
  currency: string;
}

interface Destination {
  id: number;
  name: string;
  description: string;
  country_id: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  country: Country;
}

export default function LaravelDestinations() {
  const { t } = useLanguage();
  
  const { data: destinations, isLoading, error } = useQuery({
    queryKey: ['/destinations'],
    queryFn: () => LaravelApiService.getDestinations(),
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              {t('خطأ في تحميل الوجهات', 'Error Loading Destinations')}
            </h2>
            <p className="text-red-600 mb-4">
              {error instanceof Error ? error.message : t('حدث خطأ غير متوقع', 'An unexpected error occurred')}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-200 text-red-800 hover:bg-red-100"
            >
              {t('إعادة المحاولة', 'Try Again')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('وجهات رحلات الصحراء', 'Sahara Journey Destinations')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t(
            'اكتشف الوجهات الساحرة في الشرق الأوسط مع باقاتنا المميزة',
            'Discover magical destinations in the Middle East with our exclusive packages'
          )}
        </p>
        <Badge variant="secondary" className="mt-4">
          {t('مدعوم بـ Laravel API', 'Powered by Laravel API')}
        </Badge>
      </div>

      {destinations && destinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination: Destination) => (
            <Card key={destination.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  {destination.is_featured && (
                    <Badge className="bg-amber-500 hover:bg-amber-600">
                      <Star className="w-3 h-3 mr-1" />
                      {t('مميز', 'Featured')}
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{destination.country.name}</span>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {destination.name}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-2">
                  {destination.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{t('متاح على مدار السنة', 'Available year-round')}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {destination.country.currency}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    {t('استكشف الوجهة', 'Explore Destination')}
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      {t('الجولات', 'Tours')}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      {t('الفنادق', 'Hotels')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t('لا توجد وجهات متاحة', 'No Destinations Available')}
            </h3>
            <p className="text-gray-500">
              {t('سيتم إضافة وجهات جديدة قريباً', 'New destinations will be added soon')}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-12 bg-amber-50 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('جاهز لبدء رحلتك؟', 'Ready to Start Your Journey?')}
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t(
              'احجز الآن واستمتع بتجربة لا تُنسى مع فريقنا المتخصص في رحلات الشرق الأوسط',
              'Book now and enjoy an unforgettable experience with our specialized Middle East travel team'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              {t('احجز رحلتك الآن', 'Book Your Trip Now')}
            </Button>
            <Button size="lg" variant="outline">
              {t('تواصل معنا', 'Contact Us')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}