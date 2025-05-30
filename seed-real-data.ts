import { db, dbPromise } from './server/db';
import { packages, tours, hotels } from './shared/schema';

async function seedRealData() {
  console.log('🌱 Seeding comprehensive travel data...');

  // Wait for database connection to be established
  await dbPromise;

  try {
    // First, let's get the existing countries and cities
    const countriesData = await db.execute(`SELECT id, name FROM countries LIMIT 5`);
    const citiesData = await db.execute(`SELECT id, name, country_id FROM cities LIMIT 10`);

    console.log('📦 Adding travel packages...');
    await db.insert(packages).values([
      {
        title: 'Egyptian Pharaohs Heritage Tour',
        description: 'Experience the wonders of ancient Egypt with visits to the Pyramids of Giza, Valley of the Kings, and Luxor Temple. Includes expert Egyptologist guide and luxury accommodations.',
        price: 129999, // $1299.99 in cents
        discountedPrice: 109999, // $1099.99 in cents
        duration: 8,
        slug: 'egyptian-pharaohs-heritage-tour',
        rating: 5,
        reviewCount: 127,
        featured: true,
        type: 'Cultural Heritage',
        inclusions: JSON.stringify([
          'Professional Egyptologist guide',
          'All entrance fees to monuments',
          'Luxury air-conditioned transport',
          '7 nights accommodation',
          'Daily breakfast and dinner',
          'Nile River cruise'
        ]),
        imageUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d36dc9?w=800',
        galleryUrls: JSON.stringify([
          'https://images.unsplash.com/photo-1539650116574-75c0c6d36dc9?w=800',
          'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800',
          'https://images.unsplash.com/photo-1471919743851-c4df8b6ee014?w=800'
        ])
      },
      {
        title: 'Jordan Petra Adventure Package',
        description: 'Discover the rose-red city of Petra, explore Wadi Rum desert, and float in the Dead Sea. Perfect blend of adventure and history with authentic Bedouin experiences.',
        price: 89999, // $899.99 in cents
        discountedPrice: 79999, // $799.99 in cents
        duration: 6,
        slug: 'jordan-petra-adventure-package',
        rating: 5,
        reviewCount: 89,
        featured: true,
        type: 'Adventure Tours',
        inclusions: JSON.stringify([
          'Expert local guide',
          'Desert camping experience',
          'Jeep safari in Wadi Rum',
          '5 nights accommodation',
          'All meals included',
          'Dead Sea spa treatment'
        ]),
        imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
        galleryUrls: JSON.stringify([
          'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
          'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800',
          'https://images.unsplash.com/photo-1569734222530-1ca0b9e3f6a6?w=800'
        ])
      },
      {
        title: 'Dubai Luxury Experience',
        description: 'Indulge in the ultimate Dubai luxury with stays at 5-star resorts, private yacht tours, and exclusive shopping experiences in the worlds most luxurious city.',
        price: 219999, // $2199.99 in cents
        discountedPrice: 189999, // $1899.99 in cents
        duration: 5,
        slug: 'dubai-luxury-experience',
        rating: 5,
        reviewCount: 156,
        featured: true,
        type: 'Luxury Travel',
        inclusions: JSON.stringify([
          'Luxury 5-star accommodation',
          'Private yacht charter',
          'Personal shopping assistant',
          'Helicopter city tour',
          'Fine dining experiences',
          'Spa treatments'
        ]),
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        galleryUrls: JSON.stringify([
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
          'https://images.unsplash.com/photo-1544161513-0179d3b93daa?w=800'
        ])
      },
      {
        title: 'Morocco Imperial Cities Tour',
        description: 'Journey through Morocco\'s four imperial cities: Marrakech, Fez, Meknes, and Rabat. Experience authentic Moroccan culture, cuisine, and traditional crafts.',
        price: 109999, // $1099.99 in cents
        discountedPrice: 94999, // $949.99 in cents
        duration: 10,
        slug: 'morocco-imperial-cities-tour',
        rating: 4,
        reviewCount: 203,
        featured: false,
        type: 'Cultural Heritage',
        inclusions: JSON.stringify([
          'Traditional riad accommodations',
          'Professional guide',
          'Cooking class experience',
          'Atlas Mountains excursion',
          'Sahara Desert tour',
          'All transportation'
        ]),
        imageUrl: 'https://images.unsplash.com/photo-1444934756214-4db6fa2c1107?w=800',
        galleryUrls: JSON.stringify([
          'https://images.unsplash.com/photo-1444934756214-4db6fa2c1107?w=800',
          'https://images.unsplash.com/photo-1532664189809-02133fee698d?w=800',
          'https://images.unsplash.com/photo-1558646480-c2b45b8b5b8e?w=800'
        ])
      },
      {
        title: 'Lebanon Cultural Heritage Journey',
        description: 'Explore Lebanon\'s rich history from ancient Phoenician ruins to modern Beirut. Includes wine tasting in Bekaa Valley and traditional Lebanese cuisine experiences.',
        price: 79999, // $799.99 in cents
        discountedPrice: 69999, // $699.99 in cents
        duration: 7,
        slug: 'lebanon-cultural-heritage-journey',
        rating: 4,
        reviewCount: 67,
        featured: false,
        type: 'Cultural Heritage',
        inclusions: JSON.stringify([
          'Historical site visits',
          'Wine tasting tours',
          'Traditional Lebanese cuisine',
          'Cedar forest excursion',
          'Beirut city tour',
          'Cultural performances'
        ]),
        imageUrl: 'https://images.unsplash.com/photo-1564909675618-fe01bb0f2823?w=800',
        galleryUrls: JSON.stringify([
          'https://images.unsplash.com/photo-1564909675618-fe01bb0f2823?w=800',
          'https://images.unsplash.com/photo-1572034293005-0676e5e5b2d7?w=800',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
        ])
      }
    ]).onConflictDoNothing();

    console.log('🏨 Adding hotels...');
    await db.insert(hotels).values([
      {
        name: 'Pyramids View Resort Cairo',
        description: 'Luxury resort with stunning views of the Great Pyramids. Features world-class amenities and authentic Egyptian hospitality.',
        address: 'Giza Plateau, Cairo, Egypt',
        rating: 5.0,
        phone: '+20 2 3377 3222',
        email: 'reservations@pyramidsview.com',
        website: 'https://pyramidsviewresort.com',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        galleryUrls: JSON.stringify([
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
        ]),
        pricePerNight: 29999, // $299.99 in cents
        features: JSON.stringify([
          'Pyramid views from rooms',
          'Rooftop pool',
          'Spa and wellness center',
          'Multiple restaurants',
          'Free WiFi',
          'Airport shuttle',
          'Fitness center',
          'Conference facilities'
        ]),
        status: 'active'
      },
      {
        name: 'Petra Moon Hotel',
        description: 'Boutique hotel located at the entrance of Petra. Perfect base for exploring the ancient Nabatean city with traditional Jordanian hospitality.',
        address: 'Wadi Musa, Petra, Jordan',
        rating: 4.5,
        phone: '+962 3 215 6220',
        email: 'info@petramoon.com',
        website: 'https://petramoonhotel.com',
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        galleryUrls: JSON.stringify([
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
          'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
        ]),
        pricePerNight: 14999, // $149.99 in cents
        features: JSON.stringify([
          'Petra entrance proximity',
          'Traditional Jordanian architecture',
          'Restaurant with local cuisine',
          'Free WiFi',
          'Tour booking services',
          'Gift shop',
          'Terrace with mountain views'
        ]),
        status: 'active'
      },
      {
        name: 'Burj Al Arab Dubai',
        description: 'Iconic sail-shaped luxury hotel offering unparalleled service and breathtaking views of the Arabian Gulf. The epitome of luxury hospitality.',
        address: 'Jumeirah Beach, Dubai, UAE',
        rating: 5.0,
        phone: '+971 4 301 7777',
        email: 'baa.reservations@jumeirah.com',
        website: 'https://jumeirah.com/burj-al-arab',
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        galleryUrls: JSON.stringify([
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
          'https://images.unsplash.com/photo-1544161513-0179d3b93daa?w=800'
        ]),
        pricePerNight: 129999, // $1299.99 in cents
        features: JSON.stringify([
          'Private beach access',
          'Helicopter landing pad',
          'Michelin-starred restaurants',
          'Butler service',
          'Spa treatments',
          'Infinity pool',
          'Luxury shopping',
          'Private yacht charter'
        ]),
        status: 'active'
      }
    ]).onConflictDoNothing();

    console.log('🎯 Adding tours...');
    await db.insert(tours).values([
      {
        name: 'Giza Pyramids and Sphinx Private Tour',
        description: 'Private guided tour of the Great Pyramid, Pyramid of Khafre, Pyramid of Menkaure, and the Great Sphinx with professional Egyptologist guide.',
        duration: 4,
        price: 8999, // $89.99 in cents
        maxGroupSize: 8,
        imageUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d36dc9?w=800',
        galleryUrls: JSON.stringify([
          'https://images.unsplash.com/photo-1539650116574-75c0c6d36dc9?w=800',
          'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800',
          'https://images.unsplash.com/photo-1471919743851-c4df8b6ee014?w=800'
        ]),
        inclusions: JSON.stringify([
          'Private Egyptologist guide',
          'Entrance fees included',
          'Transportation',
          'Bottled water',
          'Photo opportunities'
        ])
      },
      {
        name: 'Petra by Night Magical Experience',
        description: 'Walk through the Siq by candlelight to reach the Treasury, illuminated by thousands of candles with traditional Bedouin music and storytelling.',
        duration: 3,
        price: 4599, // $45.99 in cents
        maxGroupSize: 50,
        imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
        galleryUrls: JSON.stringify([
          'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
          'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800',
          'https://images.unsplash.com/photo-1569734222530-1ca0b9e3f6a6?w=800'
        ]),
        inclusions: JSON.stringify([
          'Candlelit walk through Siq',
          'Traditional Bedouin music',
          'Hot tea service',
          'Professional guide',
          'Unforgettable atmosphere'
        ])
      },
      {
        name: 'Dubai Desert Safari with BBQ Dinner',
        description: 'Thrilling dune bashing adventure followed by camel riding, sandboarding, and traditional BBQ dinner with live entertainment under the stars.',
        duration: 6,
        price: 7999, // $79.99 in cents
        maxGroupSize: 30,
        imageUrl: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800',
        galleryUrls: JSON.stringify([
          'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
          'https://images.unsplash.com/photo-1544161513-0179d3b93daa?w=800'
        ]),
        inclusions: JSON.stringify([
          'Dune bashing in 4WD',
          'Camel riding experience',
          'Sandboarding',
          'BBQ dinner buffet',
          'Traditional dance shows',
          'Henna painting'
        ])
      }
    ]).onConflictDoNothing();

    console.log('✅ Comprehensive travel data seeded successfully!');
    console.log('📊 Summary:');
    console.log('   - Travel packages: 5');
    console.log('   - Hotels: 3');
    console.log('   - Tours: 3');

  } catch (error) {
    console.error('❌ Error seeding travel data:', error);
    throw error;
  }
}

// Run the seeding
seedRealData()
  .then(() => {
    console.log('🎉 Travel data seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Travel data seeding failed:', error);
    process.exit(1);
  });