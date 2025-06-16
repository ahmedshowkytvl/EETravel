import { db } from './server/db.js';
import { 
  translations, 
  heroSlides, 
  tourCategories, 
  countries, 
  cities, 
  menus, 
  destinations,
  packages,
  siteLanguageSettings
} from './shared/schema.js';

async function fixDatabaseComplete() {
  try {
    console.log('🔧 Fixing database schema and adding required data...');

    // 1. Add essential translations
    await db.insert(translations).values([
      {
        key: 'welcome',
        language: 'en',
        value: 'Welcome to Sahara Journeys',
        category: 'common',
        enText: 'Welcome to Sahara Journeys',
        arText: 'مرحباً بكم في رحلات الصحراء'
      },
      {
        key: 'home',
        language: 'en',
        value: 'Home',
        category: 'navigation',
        enText: 'Home',
        arText: 'الرئيسية'
      },
      {
        key: 'packages',
        language: 'en',
        value: 'Packages',
        category: 'navigation',
        enText: 'Packages',
        arText: 'الباقات'
      },
      {
        key: 'tours',
        language: 'en',
        value: 'Tours',
        category: 'navigation',
        enText: 'Tours',
        arText: 'الجولات'
      },
      {
        key: 'about',
        language: 'en',
        value: 'About',
        category: 'navigation',
        enText: 'About',
        arText: 'حول'
      },
      {
        key: 'contact',
        language: 'en',
        value: 'Contact',
        category: 'navigation',
        enText: 'Contact',
        arText: 'اتصل بنا'
      }
    ]).onConflictDoNothing();

    // 2. Add site language settings
    await db.insert(siteLanguageSettings).values({
      id: 1,
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ar'],
      rtlLanguages: ['ar']
    }).onConflictDoNothing();

    // 3. Add hero slides
    await db.insert(heroSlides).values([
      {
        title: 'Discover Ancient Egypt',
        subtitle: 'Explore the mysteries of the pharaohs',
        imageUrl: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=2069',
        buttonText: 'Explore Now',
        buttonLink: '/packages',
        active: true,
        order: 1
      },
      {
        title: 'Luxury Nile Cruises',
        subtitle: 'Experience the magic of the Nile River',
        imageUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=2070',
        buttonText: 'Book Now',
        buttonLink: '/tours',
        active: true,
        order: 2
      }
    ]).onConflictDoNothing();

    // 4. Add tour categories
    await db.insert(tourCategories).values([
      {
        name: 'Cultural Tours',
        description: 'Explore Egypt\'s rich cultural heritage',
        active: true
      },
      {
        name: 'Adventure Tours',
        description: 'Exciting desert and adventure experiences',
        active: true
      },
      {
        name: 'Luxury Tours',
        description: 'Premium travel experiences',
        active: true
      },
      {
        name: 'Family Tours',
        description: 'Perfect for family vacations',
        active: true
      }
    ]).onConflictDoNothing();

    // 5. Add countries
    await db.insert(countries).values([
      {
        name: 'Egypt',
        code: 'EG',
        currency: 'EGP',
        imageUrl: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=400'
      },
      {
        name: 'Jordan',
        code: 'JO',
        currency: 'JOD',
        imageUrl: 'https://images.unsplash.com/photo-1579709251698-98b5a9a8274a?q=80&w=400'
      },
      {
        name: 'Morocco',
        code: 'MA',
        currency: 'MAD',
        imageUrl: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?q=80&w=400'
      }
    ]).onConflictDoNothing();

    // 6. Add cities
    await db.insert(cities).values([
      {
        name: 'Cairo',
        countryId: 1,
        description: 'The capital city of Egypt, home to the pyramids and ancient wonders'
      },
      {
        name: 'Luxor',
        countryId: 1,
        description: 'The ancient city of Thebes, known for its temples and tombs'
      },
      {
        name: 'Aswan',
        countryId: 1,
        description: 'A beautiful Nile city with Nubian culture'
      },
      {
        name: 'Hurghada',
        countryId: 1,
        description: 'Red Sea resort town perfect for diving and relaxation'
      }
    ]).onConflictDoNothing();

    // 7. Add destinations
    await db.insert(destinations).values([
      {
        name: 'Cairo & Giza',
        description: 'Explore the pyramids and Egyptian Museum',
        countryId: 1,
        imageUrl: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=800',
        featured: true
      },
      {
        name: 'Luxor',
        description: 'Visit the Valley of the Kings and Karnak Temple',
        countryId: 1,
        imageUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=800',
        featured: true
      },
      {
        name: 'Red Sea Coast',
        description: 'Relax on beautiful beaches and enjoy water sports',
        countryId: 1,
        imageUrl: 'https://images.unsplash.com/photo-1581335167266-5662e1958b2f?q=80&w=800',
        featured: false
      }
    ]).onConflictDoNothing();

    // 8. Add footer menu
    await db.insert(menus).values([
      {
        name: 'Footer Menu',
        location: 'footer',
        active: true,
        description: 'Main footer navigation menu'
      }
    ]).onConflictDoNothing();

    console.log('✅ Database schema fixed and essential data added successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    throw error;
  }
}

// Run the script
fixDatabaseComplete().catch(console.error);