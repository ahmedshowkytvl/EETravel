import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Building, 
  Plane,
  Package,
  Settings,
  Database,
  TestTube,
  Server,
  ArrowRight,
  Globe,
  Code
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface ApiFeature {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  path: string;
  icon: React.ReactNode;
  status: 'ready' | 'testing' | 'development';
  features: string[];
  featuresAr: string[];
}

export default function LaravelApiMenu() {
  const { t } = useLanguage();
  const [location] = useLocation();

  const apiFeatures: ApiFeature[] = [
    {
      title: "Destinations Explorer",
      titleAr: "استكشاف الوجهات",
      description: "Browse destinations with Laravel backend integration",
      descriptionAr: "تصفح الوجهات مع تكامل Laravel backend",
      path: "/laravel-destinations",
      icon: <MapPin className="w-6 h-6 text-blue-500" />,
      status: "ready",
      features: ["Real-time data", "Country relationships", "Featured destinations"],
      featuresAr: ["بيانات فورية", "علاقات البلدان", "وجهات مميزة"]
    },
    {
      title: "API Integration Dashboard",
      titleAr: "لوحة تحكم التكامل",
      description: "Comprehensive Laravel API management and monitoring",
      descriptionAr: "إدارة ومراقبة شاملة لـ Laravel API",
      path: "/laravel-integration",
      icon: <Settings className="w-6 h-6 text-purple-500" />,
      status: "ready",
      features: ["Connection status", "Data management", "Endpoint monitoring"],
      featuresAr: ["حالة الاتصال", "إدارة البيانات", "مراقبة النقاط"]
    },
    {
      title: "API Testing Suite",
      titleAr: "مجموعة اختبار API",
      description: "Test and validate Laravel API endpoints",
      descriptionAr: "اختبار والتحقق من نقاط نهاية Laravel API",
      path: "/api-test",
      icon: <TestTube className="w-6 h-6 text-green-500" />,
      status: "ready",
      features: ["Endpoint testing", "Response validation", "Performance metrics"],
      featuresAr: ["اختبار النقاط", "التحقق من الاستجابة", "مقاييس الأداء"]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'testing':
        return <Badge className="bg-yellow-100 text-yellow-800">Testing</Badge>;
      case 'development':
        return <Badge className="bg-blue-100 text-blue-800">Development</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Server className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">
            {t('Laravel API المتكامل', 'Laravel API Integration')}
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          {t(
            'استكشف واختبر التكامل الكامل بين React Frontend و Laravel Backend مع قاعدة بيانات PostgreSQL',
            'Explore and test the complete integration between React Frontend and Laravel Backend with PostgreSQL database'
          )}
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="outline" className="text-sm">
            <Code className="w-4 h-4 mr-1" />
            React + TypeScript
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Database className="w-4 h-4 mr-1" />
            Laravel + PostgreSQL
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Globe className="w-4 h-4 mr-1" />
            REST API
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {apiFeatures.map((feature, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-3">
                {feature.icon}
                {getStatusBadge(feature.status)}
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                {t(feature.titleAr, feature.title)}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {t(feature.descriptionAr, feature.description)}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    {t('المميزات:', 'Features:')}
                  </h4>
                  <ul className="space-y-1">
                    {feature.features.map((feat, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                        {t(feature.featuresAr[idx], feat)}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href={feature.path}>
                  <Button className="w-full group/btn bg-primary hover:bg-primary/90 text-white">
                    {t('افتح الصفحة', 'Open Page')}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('نظام متكامل وشامل', 'Complete Integrated System')}
          </h2>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            {t(
              'يوفر هذا النظام تكاملاً كاملاً بين تقنيات React الحديثة و Laravel الموثوق مع قاعدة بيانات PostgreSQL، مما يضمن أداءً عالياً وموثوقية في إدارة بيانات السفر والسياحة',
              'This system provides complete integration between modern React technologies and reliable Laravel with PostgreSQL database, ensuring high performance and reliability in travel and tourism data management'
            )}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm mb-3 inline-block">
                <Server className="w-8 h-8 text-blue-500 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('خادم Laravel', 'Laravel Server')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('40+ نقطة نهاية API', '40+ API endpoints')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm mb-3 inline-block">
                <Database className="w-8 h-8 text-green-500 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('قاعدة البيانات', 'Database')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('بيانات حقيقية مع علاقات', 'Real data with relationships')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm mb-3 inline-block">
                <Globe className="w-8 h-8 text-purple-500 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('واجهة المستخدم', 'Frontend')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('React مع TypeScript', 'React with TypeScript')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}