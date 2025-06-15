import { useState, useEffect } from 'react';

export interface LanguageContextValue {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
}

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome to Admin Dashboard',
    'countries.title': 'Countries',
    'countries.add': 'Add Country',
    'countries.edit': 'Edit Country',
    'countries.delete': 'Delete Country',
    'countries.name': 'Country Name',
    'countries.code': 'Country Code',
    'countries.description': 'Description',
    'countries.image': 'Image URL',
    'countries.active': 'Active',
    'cities.title': 'Cities',
    'cities.add': 'Add City',
    'cities.edit': 'Edit City',
    'cities.delete': 'Delete City',
    'cities.name': 'City Name',
    'cities.country': 'Country',
    'cities.description': 'Description',
    'cities.image': 'Image URL',
    'cities.active': 'Active',
    'airports.title': 'Airports',
    'airports.add': 'Add Airport',
    'airports.edit': 'Edit Airport',
    'airports.delete': 'Delete Airport',
    'airports.name': 'Airport Name',
    'airports.code': 'Airport Code',
    'airports.city': 'City',
    'airports.description': 'Description',
    'airports.image': 'Image URL',
    'airports.active': 'Active',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.created': 'Created',
    'common.updated': 'Updated',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'form.required': 'This field is required',
    'form.invalid': 'Invalid format',
    'form.minLength': 'Minimum length is {min} characters',
    'form.maxLength': 'Maximum length is {max} characters',
  },
  ar: {
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcome': 'مرحباً بك في لوحة التحكم الإدارية',
    'countries.title': 'البلدان',
    'countries.add': 'إضافة بلد',
    'countries.edit': 'تعديل البلد',
    'countries.delete': 'حذف البلد',
    'countries.name': 'اسم البلد',
    'countries.code': 'رمز البلد',
    'countries.description': 'الوصف',
    'countries.image': 'رابط الصورة',
    'countries.active': 'نشط',
    'cities.title': 'المدن',
    'cities.add': 'إضافة مدينة',
    'cities.edit': 'تعديل المدينة',
    'cities.delete': 'حذف المدينة',
    'cities.name': 'اسم المدينة',
    'cities.country': 'البلد',
    'cities.description': 'الوصف',
    'cities.image': 'رابط الصورة',
    'cities.active': 'نشط',
    'airports.title': 'المطارات',
    'airports.add': 'إضافة مطار',
    'airports.edit': 'تعديل المطار',
    'airports.delete': 'حذف المطار',
    'airports.name': 'اسم المطار',
    'airports.code': 'رمز المطار',
    'airports.city': 'المدينة',
    'airports.description': 'الوصف',
    'airports.image': 'رابط الصورة',
    'airports.active': 'نشط',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.actions': 'الإجراءات',
    'common.status': 'الحالة',
    'common.created': 'تم الإنشاء',
    'common.updated': 'تم التحديث',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.confirm': 'تأكيد',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'form.required': 'هذا الحقل مطلوب',
    'form.invalid': 'تنسيق غير صحيح',
    'form.minLength': 'الحد الأدنى للطول هو {min} أحرف',
    'form.maxLength': 'الحد الأقصى للطول هو {max} أحرف',
  }
};

export function useLanguage(): LanguageContextValue {
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[language]?.[key] || key;
    
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(`{${paramKey}}`, paramValue);
      }, translation);
    }
    
    return translation;
  };

  const isRTL = language === 'ar';

  return {
    language,
    setLanguage: handleSetLanguage,
    t,
    isRTL,
  };
}