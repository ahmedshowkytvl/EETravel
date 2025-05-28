import { db } from './db';
import { translations, siteLanguageSettings } from '@shared/schema';

/**
 * Script to seed the database with initial translations
 */
export async function seedTranslations() {
  console.log('🌱 Seeding translations...');

  // Check if we already have translations
  const existingTranslations = await db.select().from(translations);
  
  if (existingTranslations.length > 0) {
    console.log('✅ Translations already seeded');
    return;
  }

  try {
    const currentDate = new Date();
    
    // Only seed minimal essential translations to get the app running
    const translationData = [
      // Common UI elements
      { key: 'common.english', enText: 'English', arText: 'الإنجليزية', category: 'common', context: 'Language name in language switcher', createdAt: currentDate, updatedAt: currentDate },
      { key: 'common.arabic', enText: 'Arabic', arText: 'العربية', category: 'common', context: 'Language name in language switcher', createdAt: currentDate, updatedAt: currentDate },
      { key: 'common.loading', enText: 'Loading...', arText: 'جار التحميل...', category: 'common', context: 'Loading state text', createdAt: currentDate, updatedAt: currentDate },
      { key: 'common.save', enText: 'Save', arText: 'حفظ', category: 'common', context: 'Save button text', createdAt: currentDate, updatedAt: currentDate },
      { key: 'common.cancel', enText: 'Cancel', arText: 'إلغاء', category: 'common', context: 'Cancel button text', createdAt: currentDate, updatedAt: currentDate },
      { key: 'common.edit', enText: 'Edit', arText: 'تعديل', category: 'common', context: 'Edit button/action text', createdAt: currentDate, updatedAt: currentDate },
      { key: 'common.delete', enText: 'Delete', arText: 'حذف', category: 'common', context: 'Delete button/action text', createdAt: currentDate, updatedAt: currentDate },
      { key: 'common.search', enText: 'Search', arText: 'بحث', category: 'common', context: 'Search input placeholder/button', createdAt: currentDate, updatedAt: currentDate },
      
      // Navigation
      { key: 'nav.home', enText: 'Home', arText: 'الرئيسية', category: 'navigation', context: 'Main navigation link', createdAt: currentDate, updatedAt: currentDate },
      { key: 'nav.packages', enText: 'Packages', arText: 'الباقات', category: 'navigation', context: 'Main navigation link', createdAt: currentDate, updatedAt: currentDate },
      { key: 'nav.destinations', enText: 'Destinations', arText: 'الوجهات', category: 'navigation', context: 'Main navigation link', createdAt: currentDate, updatedAt: currentDate },
      { key: 'nav.about', enText: 'About', arText: 'عن الشركة', category: 'navigation', context: 'Main navigation link', createdAt: currentDate, updatedAt: currentDate },
      { key: 'nav.contact', enText: 'Contact', arText: 'اتصل بنا', category: 'navigation', context: 'Main navigation link', createdAt: currentDate, updatedAt: currentDate },
      
      // Homepage
      { key: 'home.title', enText: 'Discover the Magic of the Middle East', arText: 'اكتشف سحر الشرق الأوسط', category: 'homepage', context: 'Homepage hero title', createdAt: currentDate, updatedAt: currentDate },
      { key: 'home.featured', enText: 'Featured Destinations', arText: 'وجهات مميزة', category: 'homepage', context: 'Featured destinations section title', createdAt: currentDate, updatedAt: currentDate },
      
      // Authentication
      { key: 'auth.login', enText: 'Log In', arText: 'تسجيل الدخول', category: 'auth', context: 'Login button/page title', createdAt: currentDate, updatedAt: currentDate },
      { key: 'auth.register', enText: 'Register', arText: 'التسجيل', category: 'auth', context: 'Register button/page title', createdAt: currentDate, updatedAt: currentDate },
      { key: 'auth.logout', enText: 'Log Out', arText: 'تسجيل الخروج', category: 'auth', context: 'Logout button', createdAt: currentDate, updatedAt: currentDate }
    ];
    
    // Insert translations using Drizzle ORM
    for (const item of translationData) {
      await db.insert(translations).values(item);
    }
    
    // Set up language settings
    await db.insert(siteLanguageSettings).values({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ar'],
      rtlLanguages: ['ar'],
      createdAt: currentDate,
      updatedAt: currentDate
    });
    
    console.log('✅ Translations and language settings seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding translations:', error);
  }
}

// Run the seed function if this is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTranslations().then(() => {
    console.log('Translations seeding complete');
    process.exit(0);
  }).catch(error => {
    console.error('Error during translations seeding:', error);
    process.exit(1);
  });
}