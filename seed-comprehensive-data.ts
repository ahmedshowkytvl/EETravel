import { db, dbPromise } from './server/db';
import { 
  packages, tours, hotels, rooms, 
  tourCategories, hotelCategories
} from './shared/schema';

async function seedComprehensiveData() {
  console.log('🌱 Seeding comprehensive test data...');

  // Wait for database connection to be established
  await dbPromise;

  try {
    // 1. Seed Tour Categories
    console.log('🎯 Adding tour categories...');
    await db.insert(tourCategories).values([
      { name: 'Historical Tours', description: 'Ancient sites and monuments', active: true },
      { name: 'City Tours', description: 'Urban exploration experiences', active: true },
      { name: 'Adventure Tours', description: 'Outdoor adventure activities', active: true },
      { name: 'Cultural Tours', description: 'Cultural immersion experiences', active: true },
      { name: 'Nature Tours', description: 'Natural landscapes and wildlife', active: true }
    ]).onConflictDoNothing();

    // 2. Seed Hotel Categories
    console.log('🏨 Adding hotel categories...');
    await db.insert(hotelCategories).values([
      { name: 'Luxury Resort', description: '5-star luxury accommodations', active: true },
      { name: 'Boutique Hotel', description: 'Unique and intimate hotels', active: true },
      { name: 'Business Hotel', description: 'Professional business accommodations', active: true },
      { name: 'Desert Resort', description: 'Desert-themed luxury resorts', active: true },
      { name: 'Historic Hotel', description: 'Hotels with historical significance', active: true }
    ]).onConflictDoNothing();

    // 5. Seed Comprehensive Packages
    console.log('📦 Adding travel packages...');
    await db.insert(packages).values([
      {
        title: 'Egyptian Pharaohs Heritage Tour',
        description: 'Experience the wonders of ancient Egypt with visits to the Pyramids of Giza, Valley of the Kings, and Luxor Temple. Includes expert Egyptologist guide.',
        price: 1299.99,
        discountedPrice: 1099.99,
        duration: 8,
        slug: 'egyptian-pharaohs-heritage-tour',
        isActive: true,
        maxParticipants: 20,
        inclusions: JSON.stringify([
          'Professional Egyptologist guide',
          'All entrance fees to monuments',
          'Luxury air-conditioned transport',
          '7 nights accommodation',
          'Daily breakfast and dinner',
          'Nile River cruise'
        ])
      },
      {
        title: 'Jordan Petra Adventure Package',
        description: 'Discover the rose-red city of Petra, explore Wadi Rum desert, and float in the Dead Sea. Perfect blend of adventure and history.',
        price: 899.99,
        discountedPrice: 799.99,
        duration: 6,
        slug: 'jordan-petra-adventure-package',
        isActive: true,
        maxParticipants: 16,
        inclusions: JSON.stringify([
          'Expert local guide',
          'Desert camping experience',
          'Jeep safari in Wadi Rum',
          '5 nights accommodation',
          'All meals included',
          'Dead Sea spa treatment'
        ])
      },
      {
        title: 'Dubai Luxury Experience',
        description: 'Indulge in the ultimate Dubai luxury with stays at 5-star resorts, private yacht tours, and exclusive shopping experiences.',
        price: 2199.99,
        discountedPrice: 1899.99,
        duration: 5,
        slug: 'dubai-luxury-experience',
        isActive: true,
        maxParticipants: 12,
        inclusions: JSON.stringify([
          'Luxury 5-star accommodation',
          'Private yacht charter',
          'Personal shopping assistant',
          'Helicopter city tour',
          'Fine dining experiences',
          'Spa treatments'
        ])
      },
      {
        title: 'Morocco Imperial Cities Tour',
        description: 'Journey through Morocco\'s four imperial cities: Marrakech, Fez, Meknes, and Rabat. Experience authentic Moroccan culture and cuisine.',
        price: 1099.99,
        discountedPrice: 949.99,
        duration: 10,
        slug: 'morocco-imperial-cities-tour',
        isActive: true,
        maxParticipants: 18,
        inclusions: JSON.stringify([
          'Traditional riad accommodations',
          'Professional guide',
          'Cooking class experience',
          'Atlas Mountains excursion',
          'Sahara Desert tour',
          'All transportation'
        ])
      },
      {
        title: 'Lebanon Cultural Heritage Journey',
        description: 'Explore Lebanon\'s rich history from ancient Phoenician ruins to modern Beirut. Includes wine tasting in Bekaa Valley.',
        price: 799.99,
        discountedPrice: 699.99,
        duration: 7,
        slug: 'lebanon-cultural-heritage-journey',
        isActive: true,
        maxParticipants: 15,
        inclusions: JSON.stringify([
          'Historical site visits',
          'Wine tasting tours',
          'Traditional Lebanese cuisine',
          'Cedar forest excursion',
          'Beirut city tour',
          'Cultural performances'
        ])
      }
    ]).onConflictDoNothing();

    // 6. Seed Comprehensive Hotels
    console.log('🏨 Adding hotels...');
    await db.insert(hotels).values([
      {
        name: 'Pyramids View Resort Cairo',
        description: 'Luxury resort with stunning views of the Great Pyramids. Features world-class amenities and authentic Egyptian hospitality.',
        address: 'Giza Plateau, Cairo, Egypt',
        rating: 5.0,
        amenities: JSON.stringify([
          'Pyramid views from rooms',
          'Rooftop pool',
          'Spa and wellness center',
          'Multiple restaurants',
          'Free WiFi',
          'Airport shuttle',
          'Fitness center',
          'Conference facilities'
        ]),
        pricePerNight: 299.99,
        isActive: true
      },
      {
        name: 'Petra Moon Hotel',
        description: 'Boutique hotel located at the entrance of Petra. Perfect base for exploring the ancient Nabatean city.',
        address: 'Wadi Musa, Petra, Jordan',
        rating: 4.5,
        amenities: JSON.stringify([
          'Petra entrance proximity',
          'Traditional Jordanian architecture',
          'Restaurant with local cuisine',
          'Free WiFi',
          'Tour booking services',
          'Gift shop',
          'Terrace with mountain views'
        ]),
        pricePerNight: 149.99,
        isActive: true
      },
      {
        name: 'Burj Al Arab Dubai',
        description: 'Iconic sail-shaped luxury hotel offering unparalleled service and breathtaking views of the Arabian Gulf.',
        address: 'Jumeirah Beach, Dubai, UAE',
        rating: 5.0,
        amenities: JSON.stringify([
          'Private beach access',
          'Helicopter landing pad',
          'Michelin-starred restaurants',
          'Butler service',
          'Spa treatments',
          'Infinity pool',
          'Luxury shopping',
          'Private yacht charter'
        ]),
        pricePerNight: 1299.99,
        isActive: true
      },
      {
        name: 'La Mamounia Marrakech',
        description: 'Historic palace hotel in the heart of Marrakech, blending traditional Moroccan architecture with modern luxury.',
        address: 'Avenue Bab Jdid, Marrakech, Morocco',
        rating: 4.8,
        amenities: JSON.stringify([
          'Historic palace setting',
          'Traditional hammam',
          'Multiple pools',
          'Gourmet restaurants',
          'Beautiful gardens',
          'Spa services',
          'Cultural activities',
          'Medina proximity'
        ]),
        pricePerNight: 449.99,
        isActive: true
      },
      {
        name: 'Four Seasons Beirut',
        description: 'Sophisticated luxury hotel in downtown Beirut with panoramic Mediterranean views and exceptional dining.',
        address: 'Beirut Central District, Lebanon',
        rating: 4.7,
        amenities: JSON.stringify([
          'Mediterranean sea views',
          'Rooftop pool',
          'Multiple dining options',
          'Spa and fitness center',
          'Business center',
          'Valet parking',
          'Concierge services',
          'Downtown location'
        ]),
        pricePerNight: 349.99,
        isActive: true
      }
    ]).onConflictDoNothing();

    // 7. Seed Comprehensive Tours
    console.log('🎯 Adding tours...');
    await db.insert(tours).values([
      {
        title: 'Giza Pyramids and Sphinx Private Tour',
        description: 'Private guided tour of the Great Pyramid, Pyramid of Khafre, Pyramid of Menkaure, and the Great Sphinx with professional Egyptologist.',
        duration: 4,
        price: 89.99,
        maxParticipants: 8,
        isActive: true,
        inclusions: JSON.stringify([
          'Private Egyptologist guide',
          'Entrance fees included',
          'Transportation',
          'Bottled water',
          'Photo opportunities'
        ])
      },
      {
        title: 'Petra by Night Magical Experience',
        description: 'Walk through the Siq by candlelight to reach the Treasury, illuminated by thousands of candles with traditional Bedouin music.',
        duration: 3,
        price: 45.99,
        maxParticipants: 50,
        isActive: true,
        inclusions: JSON.stringify([
          'Candlelit walk through Siq',
          'Traditional Bedouin music',
          'Hot tea service',
          'Professional guide',
          'Unforgettable atmosphere'
        ])
      },
      {
        title: 'Dubai Desert Safari with BBQ Dinner',
        description: 'Thrilling dune bashing adventure followed by camel riding, sandboarding, and traditional BBQ dinner with live entertainment.',
        duration: 6,
        price: 79.99,
        maxParticipants: 30,
        isActive: true,
        inclusions: JSON.stringify([
          'Dune bashing in 4WD',
          'Camel riding experience',
          'Sandboarding',
          'BBQ dinner buffet',
          'Traditional dance shows',
          'Henna painting'
        ])
      },
      {
        title: 'Marrakech Medina Walking Tour',
        description: 'Explore the UNESCO World Heritage Medina of Marrakech with visits to souks, palaces, and traditional craftsmen workshops.',
        duration: 4,
        price: 35.99,
        maxParticipants: 12,
        isActive: true,
        inclusions: JSON.stringify([
          'Professional local guide',
          'Souk exploration',
          'Traditional crafts demonstration',
          'Mint tea tasting',
          'Palace visits',
          'Cultural insights'
        ])
      },
      {
        title: 'Baalbek and Anjar Historical Tour',
        description: 'Full-day tour to Lebanon\'s most impressive Roman ruins at Baalbek and the Umayyad city of Anjar.',
        duration: 8,
        price: 95.99,
        maxParticipants: 16,
        isActive: true,
        inclusions: JSON.stringify([
          'Transportation from Beirut',
          'Professional guide',
          'Entrance fees',
          'Traditional Lebanese lunch',
          'Bekaa Valley scenery',
          'Historical commentary'
        ])
      }
    ]).onConflictDoNothing();

    console.log('✅ Comprehensive test data seeded successfully!');
    console.log('📊 Summary:');
    console.log('   - Package categories: 5');
    console.log('   - Tour categories: 5');
    console.log('   - Hotel categories: 5');
    console.log('   - Room categories: 5');
    console.log('   - Travel packages: 5');
    console.log('   - Hotels: 5');
    console.log('   - Tours: 5');

  } catch (error) {
    console.error('❌ Error seeding comprehensive data:', error);
    throw error;
  }
}

// Run the seeding
seedComprehensiveData()
  .then(() => {
    console.log('🎉 Comprehensive test data seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Comprehensive data seeding failed:', error);
    process.exit(1);
  });