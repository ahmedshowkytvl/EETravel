import { db } from './server/db';
import { destinations, packages } from './shared/schema';
import { eq } from 'drizzle-orm';

// Helper function to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function seedPackages() {
  console.log('📦 Seeding packages...');
  
  try {
    // Check if packages already exist
    const existingPackages = await db.select().from(packages);
    
    if (existingPackages.length > 0) {
      console.log('✅ Packages already seeded');
      return;
    }
    
    // Get destinations
    const allDestinations = await db.select().from(destinations);
    if (allDestinations.length === 0) {
      console.error('❌ No destinations found. Cannot seed packages without destinations.');
      return;
    }
    
    // Map destinations by name for easier lookup
    const destinationByName: Record<string, any> = {};
    allDestinations.forEach(dest => {
      destinationByName[dest.name] = dest;
    });
    
    // Get Cairo destination
    const cairoDestination = destinationByName['Cairo'] || allDestinations[0];
    
    // Get Dubai destination (or use first destination if not found)
    const dubaiDestination = destinationByName['Dubai'] || allDestinations[0];
    
    // Get Petra destination (or use first destination if not found)
    const petraDestination = destinationByName['Petra'] || allDestinations[0];
    
    // Create packages
    const packageData = [
      {
        title: 'Cairo & Luxor Package',
        slug: 'cairo-luxor-package',
        description: 'Explore ancient pyramids and cruise the Nile in this 7-day adventure',
        price: 1699,
        discountedPrice: 1359,
        imageUrl: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=800&auto=format&fit=crop',
        duration: 7,
        rating: 4.5,
        destinationId: cairoDestination.id,
        featured: true,
        type: 'Cultural',
        inclusions: JSON.stringify(['Flights', 'Hotels', 'Tours', 'Guide']),
      },
      {
        title: 'Dubai Luxury Weekend',
        slug: 'dubai-luxury-weekend',
        description: 'Experience luxury shopping, desert safari, and iconic architecture',
        price: 1199,
        discountedPrice: 999,
        imageUrl: 'https://images.unsplash.com/photo-1548813395-e5217e9a3520?q=80&w=800&auto=format&fit=crop',
        duration: 4,
        rating: 5.0,
        destinationId: dubaiDestination.id,
        featured: true,
        type: 'Luxury',
        inclusions: JSON.stringify(['Hotels', 'Breakfast', 'Desert Safari']),
      },
      {
        title: 'Jordan Explorer',
        slug: 'jordan-explorer',
        description: 'Discover Petra, Wadi Rum, and the Dead Sea on this adventure',
        price: 1299,
        discountedPrice: 979,
        imageUrl: 'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?q=80&w=800&auto=format&fit=crop',
        duration: 6,
        rating: 4.0,
        destinationId: petraDestination.id,
        featured: true,
        type: 'Adventure',
        inclusions: JSON.stringify(['Transportation', 'Guided Tours', 'Accommodation']),
      },
      {
        title: 'Egyptian Nile Cruise',
        slug: 'egyptian-nile-cruise',
        description: 'Sail down the Nile visiting ancient temples and historical sites',
        price: 1899,
        discountedPrice: 1599,
        imageUrl: 'https://images.unsplash.com/photo-1583176927565-7a15e469c9c3?q=80&w=800&auto=format&fit=crop',
        duration: 8,
        rating: 4.7,
        destinationId: cairoDestination.id,
        featured: true,
        type: 'Luxury',
        inclusions: JSON.stringify(['Cruise Accommodation', 'All Meals', 'Guided Tours']),
      }
    ];
    
    for (const pkg of packageData) {
      await db.insert(packages).values({
        title: pkg.title,
        slug: pkg.slug,
        description: pkg.description,
        price: pkg.price,
        discountedPrice: pkg.discountedPrice,
        imageUrl: pkg.imageUrl,
        duration: pkg.duration,
        rating: pkg.rating,
        destinationId: pkg.destinationId,
        featured: pkg.featured,
        type: pkg.type,
        inclusions: pkg.inclusions,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ Created package: ${pkg.title}`);
    }
    
    console.log('✅ All packages created successfully!');
  } catch (error) {
    console.error('❌ Error seeding packages:', error);
  }
}

async function main() {
  try {
    await seedPackages();
    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error in seed-packages.ts:', error);
    process.exit(1);
  }
}

main();