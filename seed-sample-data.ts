import { db, dbPromise } from './server/db';
import { 
  countries, cities, destinations, packages, tours, hotels, rooms, 
  transportation, transportTypes, transportLocations, transportDurations,
  visas, packageCategories, tourCategories, hotelCategories, roomCategories
} from './shared/schema';

async function seedSampleData() {
  console.log('🌱 Seeding sample data...');

  // Wait for database connection to be established
  await dbPromise;

  try {
    // 1. Seed Countries
    console.log('📍 Adding countries...');
    const countryResults = await db.insert(countries).values([
      {
        name: 'Egypt',
        code: 'EG',
        continent: 'Africa',
        currency: 'EGP',
        language: 'Arabic',
        timezone: 'Africa/Cairo',
        flagUrl: '/flags/egypt.png',
        active: true
      },
      {
        name: 'Jordan',
        code: 'JO',
        continent: 'Asia',
        currency: 'JOD',
        language: 'Arabic',
        timezone: 'Asia/Amman',
        flagUrl: '/flags/jordan.png',
        active: true
      },
      {
        name: 'UAE',
        code: 'AE',
        continent: 'Asia',
        currency: 'AED',
        language: 'Arabic',
        timezone: 'Asia/Dubai',
        flagUrl: '/flags/uae.png',
        active: true
      }
    ]).returning();

    // 2. Seed Cities
    console.log('🏙️ Adding cities...');
    const cityResults = await db.insert(cities).values([
      { name: 'Cairo', countryId: countryResults[0].id, active: true },
      { name: 'Luxor', countryId: countryResults[0].id, active: true },
      { name: 'Aswan', countryId: countryResults[0].id, active: true },
      { name: 'Sharm El Sheikh', countryId: countryResults[0].id, active: true },
      { name: 'Amman', countryId: countryResults[1].id, active: true },
      { name: 'Petra', countryId: countryResults[1].id, active: true },
      { name: 'Dubai', countryId: countryResults[2].id, active: true },
      { name: 'Abu Dhabi', countryId: countryResults[2].id, active: true }
    ]).returning();

    // 3. Seed Destinations
    console.log('🗺️ Adding destinations...');
    const destinationResults = await db.insert(destinations).values([
      {
        name: 'Pyramids of Giza',
        country: 'Egypt',
        description: 'Ancient wonder of the world featuring the Great Pyramid',
        countryId: countryResults[0].id,
        cityId: cityResults[0].id,
        imageUrl: '/destinations/giza-pyramids.jpg',
        featured: true
      },
      {
        name: 'Valley of the Kings',
        country: 'Egypt',
        description: 'Ancient burial ground of Egyptian pharaohs',
        countryId: countryResults[0].id,
        cityId: cityResults[1].id,
        imageUrl: '/destinations/valley-of-kings.jpg',
        featured: true
      },
      {
        name: 'Petra Archaeological Site',
        country: 'Jordan',
        description: 'Rose-red city carved into rock faces',
        countryId: countryResults[1].id,
        cityId: cityResults[5].id,
        imageUrl: '/destinations/petra.jpg',
        featured: true
      },
      {
        name: 'Burj Khalifa',
        country: 'UAE',
        description: 'World\'s tallest building with stunning views',
        countryId: countryResults[2].id,
        cityId: cityResults[6].id,
        imageUrl: '/destinations/burj-khalifa.jpg',
        featured: true
      }
    ]).returning();

    // 4. Seed Categories
    console.log('📂 Adding categories...');
    const packageCatResults = await db.insert(packageCategories).values([
      { name: 'Cultural Tours', description: 'Historical and cultural experiences', active: true },
      { name: 'Adventure', description: 'Exciting adventure activities', active: true },
      { name: 'Luxury', description: 'Premium luxury experiences', active: true },
      { name: 'Family', description: 'Family-friendly packages', active: true }
    ]).returning();

    const tourCatResults = await db.insert(tourCategories).values([
      { name: 'Historical', description: 'Ancient sites and monuments', active: true },
      { name: 'Cultural', description: 'Local culture and traditions', active: true },
      { name: 'Desert', description: 'Desert adventures and experiences', active: true },
      { name: 'City Tours', description: 'Urban exploration tours', active: true }
    ]).returning();

    const hotelCatResults = await db.insert(hotelCategories).values([
      { name: 'Luxury Resort', description: '5-star luxury accommodations', active: true },
      { name: 'Boutique Hotel', description: 'Unique boutique properties', active: true },
      { name: 'Business Hotel', description: 'Corporate and business travelers', active: true },
      { name: 'Budget Hotel', description: 'Affordable accommodation options', active: true }
    ]).returning();

    // 5. Seed Transport Infrastructure
    console.log('🚗 Adding transport infrastructure...');
    const transportTypeResults = await db.insert(transportTypes).values([
      { name: 'Private Car', description: 'Private vehicle with driver', active: true },
      { name: 'Tour Bus', description: 'Group transportation bus', active: true },
      { name: 'Luxury Vehicle', description: 'Premium luxury transport', active: true },
      { name: 'Airport Transfer', description: 'Airport pickup/dropoff service', active: true }
    ]).returning();

    const transportLocationResults = await db.insert(transportLocations).values([
      { name: 'Cairo International Airport', cityId: cityResults[0].id, active: true },
      { name: 'Giza Plateau', cityId: cityResults[0].id, active: true },
      { name: 'Luxor Airport', cityId: cityResults[1].id, active: true },
      { name: 'Karnak Temple', cityId: cityResults[1].id, active: true },
      { name: 'Dubai International Airport', cityId: cityResults[6].id, active: true },
      { name: 'Downtown Dubai', cityId: cityResults[6].id, active: true }
    ]).returning();

    const transportDurationResults = await db.insert(transportDurations).values([
      { duration: '30 minutes', active: true },
      { duration: '1 hour', active: true },
      { duration: '2 hours', active: true },
      { duration: '3 hours', active: true },
      { duration: 'Half day', active: true },
      { duration: 'Full day', active: true }
    ]).returning();

    // 6. Seed Packages
    console.log('📦 Adding travel packages...');
    const packageResults = await db.insert(packages).values([
      {
        title: 'Classic Egypt Adventure',
        description: 'Explore the wonders of ancient Egypt including pyramids, temples, and the Nile',
        price: 129900, // $1,299
        discountedPrice: 99900, // $999
        imageUrl: '/packages/egypt-adventure.jpg',
        galleryUrls: JSON.stringify(['/packages/egypt-1.jpg', '/packages/egypt-2.jpg', '/packages/egypt-3.jpg']),
        duration: '7 days',
        rating: 4.8,
        reviewCount: 156,
        destinationId: destinationResults[0].id,
        countryId: countryResults[0].id,
        cityId: cityResults[0].id,
        featured: true,
        type: 'Cultural',
        inclusions: JSON.stringify([
          'Accommodation in 4-star hotels',
          'All meals included',
          'Professional tour guide',
          'Transportation between cities',
          'Entry fees to all attractions',
          'Nile cruise experience'
        ]),
        slug: 'classic-egypt-adventure'
      },
      {
        title: 'Petra & Jordan Discovery',
        description: 'Discover the rose-red city of Petra and Jordan\'s hidden treasures',
        price: 89900, // $899
        discountedPrice: 69900, // $699
        imageUrl: '/packages/jordan-petra.jpg',
        galleryUrls: JSON.stringify(['/packages/jordan-1.jpg', '/packages/jordan-2.jpg']),
        duration: '5 days',
        rating: 4.7,
        reviewCount: 89,
        destinationId: destinationResults[2].id,
        countryId: countryResults[1].id,
        cityId: cityResults[5].id,
        featured: true,
        type: 'Cultural',
        inclusions: JSON.stringify([
          '4-star hotel accommodation',
          'Daily breakfast',
          'English-speaking guide',
          'Transportation in modern vehicle',
          'Petra entrance fees',
          'Wadi Rum desert experience'
        ]),
        slug: 'petra-jordan-discovery'
      },
      {
        title: 'Dubai Luxury Experience',
        description: 'Experience the height of luxury in the modern marvel of Dubai',
        price: 199900, // $1,999
        discountedPrice: 179900, // $1,799
        imageUrl: '/packages/dubai-luxury.jpg',
        galleryUrls: JSON.stringify(['/packages/dubai-1.jpg', '/packages/dubai-2.jpg', '/packages/dubai-3.jpg']),
        duration: '4 days',
        rating: 4.9,
        reviewCount: 234,
        destinationId: destinationResults[3].id,
        countryId: countryResults[2].id,
        cityId: cityResults[6].id,
        featured: true,
        type: 'Luxury',
        inclusions: JSON.stringify([
          '5-star luxury hotel',
          'Private city tours',
          'Burj Khalifa fast-track tickets',
          'Desert safari with dinner',
          'Shopping mall experiences',
          'Airport transfers in luxury vehicle'
        ]),
        slug: 'dubai-luxury-experience'
      }
    ]).returning();

    // 7. Seed Tours
    console.log('🎯 Adding tours...');
    const tourResults = await db.insert(tours).values([
      {
        name: 'Pyramids & Sphinx Half Day Tour',
        description: 'Visit the iconic Pyramids of Giza and the mysterious Sphinx',
        imageUrl: '/tours/pyramids-tour.jpg',
        galleryUrls: JSON.stringify(['/tours/pyramid-1.jpg', '/tours/pyramid-2.jpg']),
        destinationId: destinationResults[0].id,
        tripType: 'Historical',
        duration: '4 hours',
        date: new Date('2025-06-01'),
        numPassengers: 15,
        price: 4900, // $49
        discountedPrice: 3900, // $39
        included: JSON.stringify(['Professional guide', 'Transportation', 'Entry fees', 'Bottled water']),
        excluded: JSON.stringify(['Lunch', 'Personal expenses', 'Tips']),
        itinerary: JSON.stringify([
          'Pick up from hotel',
          'Visit Great Pyramid of Khufu',
          'Explore Pyramid of Khafre',
          'Visit the Sphinx',
          'Return to hotel'
        ]),
        maxGroupSize: 20,
        featured: true,
        rating: 4.6,
        reviewCount: 312,
        status: 'active'
      },
      {
        name: 'Luxor Valley of Kings Tour',
        description: 'Explore the ancient burial sites of Egyptian pharaohs',
        imageUrl: '/tours/valley-kings-tour.jpg',
        galleryUrls: JSON.stringify(['/tours/valley-1.jpg', '/tours/valley-2.jpg']),
        destinationId: destinationResults[1].id,
        tripType: 'Historical',
        duration: '6 hours',
        date: new Date('2025-06-05'),
        numPassengers: 12,
        price: 7900, // $79
        discountedPrice: 6900, // $69
        included: JSON.stringify(['Expert Egyptologist guide', 'Air-conditioned transport', 'All entrance fees', 'Lunch']),
        excluded: JSON.stringify(['Personal expenses', 'Photography fees', 'Tips']),
        itinerary: JSON.stringify([
          'Morning pickup from Luxor hotels',
          'Visit Valley of the Kings',
          'Explore Tutankhamun\'s tomb',
          'Lunch at local restaurant',
          'Visit Hatshepsut Temple',
          'Return to Luxor'
        ]),
        maxGroupSize: 15,
        featured: true,
        rating: 4.8,
        reviewCount: 198,
        status: 'active'
      }
    ]).returning();

    // 8. Seed Hotels
    console.log('🏨 Adding hotels...');
    const hotelResults = await db.insert(hotels).values([
      {
        name: 'Grand Nile Palace',
        description: 'Luxury hotel overlooking the Nile River with world-class amenities',
        address: '123 Nile Corniche, Cairo, Egypt',
        phone: '+20 2 1234 5678',
        email: 'info@grandnilepalace.com',
        website: 'https://grandnilepalace.com',
        imageUrl: '/hotels/grand-nile-palace.jpg',
        galleryUrls: JSON.stringify(['/hotels/nile-1.jpg', '/hotels/nile-2.jpg', '/hotels/nile-3.jpg']),
        destinationId: destinationResults[0].id,
        countryId: countryResults[0].id,
        cityId: cityResults[0].id,
        starRating: 5,
        pricePerNight: 25000, // $250
        discountedPrice: 20000, // $200
        currency: 'EGP',
        checkInTime: '15:00',
        checkOutTime: '12:00',
        featured: true,
        amenities: JSON.stringify([
          'Free WiFi',
          'Swimming Pool',
          'Spa & Wellness Center',
          'Fitness Center',
          'Restaurant',
          'Room Service',
          'Concierge',
          'Nile View Rooms'
        ]),
        policies: JSON.stringify({
          cancellation: 'Free cancellation up to 48 hours before check-in',
          children: 'Children under 12 stay free',
          pets: 'Pets not allowed'
        }),
        coordinates: JSON.stringify({ lat: 30.0444, lng: 31.2357 }),
        rating: 4.7,
        reviewCount: 1247,
        status: 'active'
      },
      {
        name: 'Petra Heritage Hotel',
        description: 'Boutique hotel near Petra archaeological site with traditional Jordanian hospitality',
        address: 'Wadi Musa, Petra, Jordan',
        phone: '+962 3 215 6789',
        email: 'reservations@petraheritage.com',
        website: 'https://petraheritage.com',
        imageUrl: '/hotels/petra-heritage.jpg',
        galleryUrls: JSON.stringify(['/hotels/petra-1.jpg', '/hotels/petra-2.jpg']),
        destinationId: destinationResults[2].id,
        countryId: countryResults[1].id,
        cityId: cityResults[5].id,
        starRating: 4,
        pricePerNight: 18000, // $180
        discountedPrice: 15000, // $150
        currency: 'EGP',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        featured: true,
        amenities: JSON.stringify([
          'Free WiFi',
          'Traditional Restaurant',
          'Terrace with Petra views',
          'Spa Services',
          'Tour Desk',
          'Airport Shuttle'
        ]),
        policies: JSON.stringify({
          cancellation: 'Free cancellation up to 24 hours before check-in',
          children: 'Children welcome',
          pets: 'Small pets allowed with fee'
        }),
        coordinates: JSON.stringify({ lat: 30.3215, lng: 35.4781 }),
        rating: 4.5,
        reviewCount: 567,
        status: 'active'
      }
    ]).returning();

    // 9. Seed Rooms
    console.log('🛏️ Adding hotel rooms...');
    const roomResults = await db.insert(rooms).values([
      {
        name: 'Deluxe Nile View Room',
        description: 'Spacious room with stunning Nile River views and modern amenities',
        hotelId: hotelResults[0].id,
        roomType: 'Deluxe',
        price: 30000, // $300
        discountedPrice: 25000, // $250
        capacity: 2,
        bedType: 'King Bed',
        size: 35,
        amenities: JSON.stringify([
          'Nile River View',
          'King Size Bed',
          'Mini Bar',
          'Safe',
          'Air Conditioning',
          'Flat Screen TV',
          'Private Bathroom',
          'Balcony'
        ]),
        imageUrl: '/rooms/deluxe-nile-view.jpg',
        galleryUrls: JSON.stringify(['/rooms/nile-room-1.jpg', '/rooms/nile-room-2.jpg']),
        available: true,
        maxOccupancy: 3,
        rating: 4.8,
        reviewCount: 234
      },
      {
        name: 'Standard Desert View Room',
        description: 'Comfortable room with traditional decor and desert mountain views',
        hotelId: hotelResults[1].id,
        roomType: 'Standard',
        price: 20000, // $200
        discountedPrice: 17000, // $170
        capacity: 2,
        bedType: 'Queen Bed',
        size: 28,
        amenities: JSON.stringify([
          'Desert View',
          'Queen Size Bed',
          'Air Conditioning',
          'Private Bathroom',
          'Free WiFi',
          'Traditional Decor'
        ]),
        imageUrl: '/rooms/desert-view-room.jpg',
        galleryUrls: JSON.stringify(['/rooms/petra-room-1.jpg']),
        available: true,
        maxOccupancy: 2,
        rating: 4.4,
        reviewCount: 156
      }
    ]).returning();

    // 10. Seed Transportation
    console.log('🚌 Adding transportation options...');
    const transportResults = await db.insert(transportation).values([
      {
        name: 'Cairo Airport to Hotel Transfer',
        description: 'Comfortable private transfer from Cairo International Airport to your hotel',
        typeId: transportTypeResults[3].id, // Airport Transfer
        destinationId: destinationResults[0].id,
        fromLocationId: transportLocationResults[0].id, // Cairo Airport
        toLocationId: transportLocationResults[1].id, // Giza Plateau
        durationId: transportDurationResults[1].id, // 1 hour
        passengerCapacity: 4,
        baggageCapacity: 6,
        price: 3500, // $35
        discountedPrice: 2500, // $25
        imageUrl: '/transport/cairo-transfer.jpg',
        galleryUrls: JSON.stringify(['/transport/car-1.jpg', '/transport/car-2.jpg']),
        features: JSON.stringify([
          'Air-conditioned vehicle',
          'Professional driver',
          'Flight monitoring',
          'Meet & greet service',
          'Free waiting time',
          'Child seats available'
        ]),
        withDriver: true,
        available: true,
        pickupIncluded: true,
        featured: true,
        rating: 4.6,
        reviewCount: 489,
        status: 'active'
      },
      {
        name: 'Luxury Desert Safari Vehicle',
        description: 'Premium 4x4 vehicle for desert adventures with experienced guide',
        typeId: transportTypeResults[2].id, // Luxury Vehicle
        destinationId: destinationResults[3].id,
        fromLocationId: transportLocationResults[5].id, // Downtown Dubai
        toLocationId: transportLocationResults[5].id, // Downtown Dubai (round trip)
        durationId: transportDurationResults[4].id, // Half day
        passengerCapacity: 6,
        baggageCapacity: 4,
        price: 12000, // $120
        discountedPrice: 10000, // $100
        imageUrl: '/transport/desert-safari.jpg',
        galleryUrls: JSON.stringify(['/transport/4x4-1.jpg', '/transport/4x4-2.jpg']),
        features: JSON.stringify([
          'Luxury 4x4 vehicle',
          'Professional safari guide',
          'Dune bashing experience',
          'Refreshments included',
          'Photography stops',
          'Safety equipment'
        ]),
        withDriver: true,
        available: true,
        pickupIncluded: true,
        featured: true,
        rating: 4.9,
        reviewCount: 167,
        status: 'active'
      }
    ]).returning();

    // 11. Seed Visas
    console.log('📄 Adding visa information...');
    const visaResults = await db.insert(visas).values([
      {
        title: 'Egypt Tourist Visa',
        description: 'Single entry tourist visa for Egypt valid for 30 days',
        targetCountryId: countryResults[0].id, // Egypt
        imageUrl: '/visas/egypt-flag.jpg',
        price: 2500, // $25
        processingTime: '3-5 business days',
        requiredDocuments: JSON.stringify([
          'Valid passport (6 months validity)',
          'Passport-sized photos',
          'Completed application form',
          'Proof of accommodation',
          'Return flight tickets',
          'Bank statements'
        ]),
        validityPeriod: '90 days from issue date',
        entryType: 'Single',
        active: true
      },
      {
        title: 'Jordan Tourist Visa',
        description: 'Multiple entry tourist visa for Jordan valid for 30 days stay',
        targetCountryId: countryResults[1].id, // Jordan
        imageUrl: '/visas/jordan-flag.jpg',
        price: 4000, // $40
        processingTime: '5-7 business days',
        requiredDocuments: JSON.stringify([
          'Valid passport (6 months validity)',
          'Recent passport photos',
          'Visa application form',
          'Hotel reservations',
          'Flight itinerary',
          'Financial proof'
        ]),
        validityPeriod: '3 months from issue date',
        entryType: 'Multiple',
        active: true
      },
      {
        title: 'UAE Tourist Visa',
        description: 'Multiple entry tourist visa for UAE valid for 30 days',
        targetCountryId: countryResults[2].id, // UAE
        imageUrl: '/visas/uae-flag.jpg',
        price: 10000, // $100
        processingTime: '2-4 business days',
        requiredDocuments: JSON.stringify([
          'Valid passport (6 months validity)',
          'Passport photos',
          'Online application form',
          'Hotel booking confirmation',
          'Flight reservations',
          'Bank statements (3 months)',
          'Travel insurance'
        ]),
        validityPeriod: '60 days from issue date',
        entryType: 'Multiple',
        active: true
      }
    ]).returning();

    console.log('✅ Sample data seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   • ${countryResults.length} countries`);
    console.log(`   • ${cityResults.length} cities`);
    console.log(`   • ${destinationResults.length} destinations`);
    console.log(`   • ${packageResults.length} packages`);
    console.log(`   • ${tourResults.length} tours`);
    console.log(`   • ${hotelResults.length} hotels`);
    console.log(`   • ${roomResults.length} rooms`);
    console.log(`   • ${transportResults.length} transportation options`);
    console.log(`   • ${visaResults.length} visa types`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
seedSampleData()
  .then(() => {
    console.log('🎉 Database seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database seeding failed:', error);
    process.exit(1);
  });

export { seedSampleData };