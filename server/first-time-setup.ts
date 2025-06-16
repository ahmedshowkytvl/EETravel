import { db } from './db';
import { 
  countries, cities, destinations, packages, tours, hotels, rooms, visas,
  packageCategories, tourCategories, hotelCategories, roomCategories,
  users
} from '../shared/schema';
import bcrypt from 'bcryptjs';

export async function firstTimeSetup() {
  console.log('🚀 Running first-time setup...');

  try {
    // Check if setup has already been run
    const existingCountries = await db.select().from(countries).limit(1);
    if (existingCountries.length > 0) {
      console.log('✅ Database already contains data, skipping first-time setup');
      return;
    }

    console.log('📊 Setting up initial data...');

    // 1. Create additional users
    console.log('👥 Creating sample users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await db.insert(users).values([
      {
        username: 'johndoe',
        password: hashedPassword,
        email: 'john@example.com',
        fullName: 'John Doe',
        role: 'user',
        status: 'active'
      },
      {
        username: 'manager',
        password: hashedPassword,
        email: 'manager@example.com',
        fullName: 'Travel Manager',
        role: 'manager',
        status: 'active'
      }
    ]);

    // 2. Create countries
    console.log('🌍 Adding countries...');
    const countryData = await db.insert(countries).values([
      {
        name: 'Egypt',
        code: 'EG',
        description: 'Land of ancient pharaohs and pyramids',
        active: true
      },
      {
        name: 'Jordan',
        code: 'JO', 
        description: 'Kingdom with rose-red city of Petra',
        active: true
      },
      {
        name: 'United Arab Emirates',
        code: 'AE',
        description: 'Modern marvel of luxury and innovation',
        active: true
      },
      {
        name: 'Turkey',
        code: 'TR',
        description: 'Bridge between Europe and Asia',
        active: true
      }
    ]).returning();

    // 3. Create cities
    console.log('🏙️ Adding cities...');
    const cityData = await db.insert(cities).values([
      // Egypt cities
      { name: 'Cairo', countryId: countryData[0].id, description: 'Capital of Egypt', active: true },
      { name: 'Luxor', countryId: countryData[0].id, description: 'Ancient Thebes', active: true },
      { name: 'Aswan', countryId: countryData[0].id, description: 'Nubian heritage city', active: true },
      { name: 'Sharm El Sheikh', countryId: countryData[0].id, description: 'Red Sea resort', active: true },
      
      // Jordan cities
      { name: 'Amman', countryId: countryData[1].id, description: 'Capital of Jordan', active: true },
      { name: 'Petra', countryId: countryData[1].id, description: 'Archaeological wonder', active: true },
      { name: 'Aqaba', countryId: countryData[1].id, description: 'Red Sea port city', active: true },
      
      // UAE cities
      { name: 'Dubai', countryId: countryData[2].id, description: 'Global business hub', active: true },
      { name: 'Abu Dhabi', countryId: countryData[2].id, description: 'UAE capital', active: true },
      
      // Turkey cities
      { name: 'Istanbul', countryId: countryData[3].id, description: 'Historic crossroads', active: true },
      { name: 'Cappadocia', countryId: countryData[3].id, description: 'Fairy chimney landscape', active: true }
    ]).returning();

    // 4. Create destinations
    console.log('🗺️ Adding destinations...');
    const destinationData = await db.insert(destinations).values([
      {
        name: 'Pyramids of Giza',
        country: 'Egypt',
        countryId: countryData[0].id,
        cityId: cityData[0].id,
        description: 'Ancient wonder of the world featuring the Great Pyramid',
        imageUrl: '/images/destinations/pyramids.jpg',
        featured: true
      },
      {
        name: 'Valley of the Kings',
        country: 'Egypt', 
        countryId: countryData[0].id,
        cityId: cityData[1].id,
        description: 'Ancient burial ground of pharaohs',
        imageUrl: '/images/destinations/valley-kings.jpg',
        featured: true
      },
      {
        name: 'Petra Archaeological Site',
        country: 'Jordan',
        countryId: countryData[1].id,
        cityId: cityData[5].id,
        description: 'Rose-red city carved into rock',
        imageUrl: '/images/destinations/petra.jpg',
        featured: true
      },
      {
        name: 'Burj Khalifa',
        country: 'United Arab Emirates',
        countryId: countryData[2].id,
        cityId: cityData[7].id,
        description: 'World\'s tallest building',
        imageUrl: '/images/destinations/burj-khalifa.jpg',
        featured: true
      }
    ]).returning();

    // 5. Create categories
    console.log('📂 Creating categories...');
    const packageCats = await db.insert(packageCategories).values([
      { name: 'Cultural Tours', description: 'Historical and cultural experiences', active: true },
      { name: 'Adventure', description: 'Exciting adventure activities', active: true },
      { name: 'Luxury', description: 'Premium luxury experiences', active: true },
      { name: 'Family', description: 'Family-friendly packages', active: true },
      { name: 'Honeymoon', description: 'Romantic getaways', active: true }
    ]).returning();

    const tourCats = await db.insert(tourCategories).values([
      { name: 'Historical', description: 'Ancient sites and monuments', active: true },
      { name: 'Cultural', description: 'Local culture and traditions', active: true },
      { name: 'Desert', description: 'Desert adventures', active: true },
      { name: 'City Tours', description: 'Urban exploration', active: true },
      { name: 'Religious', description: 'Religious and spiritual sites', active: true }
    ]).returning();

    const hotelCats = await db.insert(hotelCategories).values([
      { name: 'Luxury Resort', description: '5-star luxury accommodations', active: true },
      { name: 'Boutique Hotel', description: 'Unique boutique properties', active: true },
      { name: 'Business Hotel', description: 'Corporate travelers', active: true },
      { name: 'Budget Hotel', description: 'Affordable options', active: true }
    ]).returning();

    const roomCats = await db.insert(roomCategories).values([
      { name: 'Standard', description: 'Standard accommodation', active: true },
      { name: 'Deluxe', description: 'Upgraded rooms with premium features', active: true },
      { name: 'Suite', description: 'Spacious suites with separate areas', active: true },
      { name: 'Presidential', description: 'Ultimate luxury accommodation', active: true }
    ]).returning();

    // 6. Create comprehensive travel packages
    console.log('📦 Adding travel packages...');
    await db.insert(packages).values([
      {
        title: 'Classic Egypt Discovery',
        description: 'Explore the wonders of ancient Egypt including pyramids, temples, and the Nile River cruise',
        price: 129900, // $1,299
        discountedPrice: 99900, // $999
        imageUrl: '/images/packages/egypt-classic.jpg',
        duration: 7,
        rating: 48, // 4.8 stored as integer
        reviewCount: 156,
        destinationId: destinationData[0].id,
        countryId: countryData[0].id,
        cityId: cityData[0].id,
        featured: true,
        type: 'Cultural',
        slug: 'classic-egypt-discovery'
      },
      {
        title: 'Luxor & Aswan Nile Cruise',
        description: 'Luxury Nile cruise from Luxor to Aswan visiting ancient temples and tombs',
        price: 159900, // $1,599
        discountedPrice: 139900, // $1,399
        imageUrl: '/images/packages/nile-cruise.jpg',
        duration: 5,
        rating: 47, // 4.7
        reviewCount: 203,
        destinationId: destinationData[1].id,
        countryId: countryData[0].id,
        cityId: cityData[1].id,
        featured: true,
        type: 'Luxury',
        slug: 'luxor-aswan-nile-cruise'
      },
      {
        title: 'Red Sea Diving Adventure',
        description: 'World-class diving experience in the crystal clear waters of the Red Sea',
        price: 89900, // $899
        discountedPrice: 79900, // $799
        imageUrl: '/images/packages/red-sea-diving.jpg',
        duration: 4,
        rating: 46, // 4.6
        reviewCount: 127,
        destinationId: destinationData[0].id,
        countryId: countryData[0].id,
        cityId: cityData[3].id,
        featured: false,
        type: 'Adventure',
        slug: 'red-sea-diving-adventure'
      },
      {
        title: 'Petra & Jordan Adventure',
        description: 'Discover the rose-red city of Petra and Jordan\'s hidden treasures',
        price: 89900, // $899
        discountedPrice: 69900, // $699
        imageUrl: '/images/packages/jordan-petra.jpg',
        duration: 5,
        rating: 47, // 4.7
        reviewCount: 89,
        destinationId: destinationData[2].id,
        countryId: countryData[1].id,
        cityId: cityData[5].id,
        featured: true,
        type: 'Cultural',
        slug: 'petra-jordan-adventure'
      },
      {
        title: 'Jordan Desert & Dead Sea',
        description: 'Experience Wadi Rum desert and relax at the therapeutic Dead Sea',
        price: 119900, // $1,199
        discountedPrice: 99900, // $999
        imageUrl: '/images/packages/jordan-desert.jpg',
        duration: 6,
        rating: 45, // 4.5
        reviewCount: 156,
        destinationId: destinationData[2].id,
        countryId: countryData[1].id,
        cityId: cityData[4].id,
        featured: false,
        type: 'Adventure',
        slug: 'jordan-desert-dead-sea'
      },
      {
        title: 'Dubai Luxury Experience',
        description: 'Experience the height of luxury in modern Dubai with premium accommodations',
        price: 199900, // $1,999
        discountedPrice: 179900, // $1,799
        imageUrl: '/images/packages/dubai-luxury.jpg',
        duration: 4,
        rating: 49, // 4.9
        reviewCount: 234,
        destinationId: destinationData[3].id,
        countryId: countryData[2].id,
        cityId: cityData[7].id,
        featured: true,
        type: 'Luxury',
        slug: 'dubai-luxury-experience'
      },
      {
        title: 'Dubai Family Fun Package',
        description: 'Perfect family vacation with theme parks, beaches, and cultural experiences',
        price: 149900, // $1,499
        discountedPrice: 129900, // $1,299
        imageUrl: '/images/packages/dubai-family.jpg',
        duration: 5,
        rating: 47, // 4.7
        reviewCount: 312,
        destinationId: destinationData[3].id,
        countryId: countryData[2].id,
        cityId: cityData[7].id,
        featured: false,
        type: 'Family',
        slug: 'dubai-family-fun-package'
      },
      {
        title: 'Istanbul & Cappadocia Magic',
        description: 'Explore historic Istanbul and the fairy chimneys of Cappadocia',
        price: 109900, // $1,099
        discountedPrice: 89900, // $899
        imageUrl: '/images/packages/turkey-istanbul.jpg',
        duration: 6,
        rating: 48, // 4.8
        reviewCount: 189,
        destinationId: destinationData[0].id,
        countryId: countryData[3].id,
        cityId: cityData[9].id,
        featured: true,
        type: 'Cultural',
        slug: 'istanbul-cappadocia-magic'
      }
    ]);

    // 7. Create sample tours
    console.log('🎯 Adding tours...');
    await db.insert(tours).values([
      {
        name: 'Pyramids & Sphinx Half Day Tour',
        description: 'Visit the iconic Pyramids of Giza and the mysterious Sphinx',
        imageUrl: '/images/tours/pyramids-tour.jpg',
        destinationId: destinationData[0].id,
        tripType: 'Historical',
        duration: 4,
        date: new Date('2025-06-01'),
        numPassengers: 15,
        price: 4900, // $49
        discountedPrice: 3900, // $39
        maxGroupSize: 20,
        featured: true,
        rating: 46, // 4.6
        reviewCount: 312,
        status: 'active'
      },
      {
        name: 'Petra Treasury Walking Tour',
        description: 'Explore the magnificent Treasury and Siq entrance',
        imageUrl: '/images/tours/petra-treasury.jpg',
        destinationId: destinationData[2].id,
        tripType: 'Historical',
        duration: 6,
        date: new Date('2025-06-05'),
        numPassengers: 12,
        price: 7900, // $79
        discountedPrice: 6900, // $69
        maxGroupSize: 15,
        featured: true,
        rating: 48, // 4.8
        reviewCount: 198,
        status: 'active'
      }
    ]);

    // 8. Create sample hotels
    console.log('🏨 Adding hotels...');
    const hotelData = await db.insert(hotels).values([
      {
        name: 'Grand Nile Palace Cairo',
        description: 'Luxury hotel overlooking the Nile River with world-class amenities',
        address: '123 Nile Corniche, Cairo, Egypt',
        phone: '+20 2 1234 5678',
        email: 'info@grandnilepalace.com',
        imageUrl: '/images/hotels/nile-palace.jpg',
        destinationId: destinationData[0].id,
        countryId: countryData[0].id,
        cityId: cityData[0].id,
        starRating: 5,
        pricePerNight: 25000, // $250
        discountedPrice: 20000, // $200
        currency: 'EGP',
        checkInTime: '15:00',
        checkOutTime: '12:00',
        featured: true,
        rating: 47, // 4.7
        reviewCount: 1247,
        status: 'active'
      },
      {
        name: 'Petra Heritage Hotel',
        description: 'Boutique hotel near Petra with traditional Jordanian hospitality',
        address: 'Wadi Musa, Petra, Jordan',
        phone: '+962 3 215 6789',
        email: 'reservations@petraheritage.com',
        imageUrl: '/images/hotels/petra-heritage.jpg',
        destinationId: destinationData[2].id,
        countryId: countryData[1].id,
        cityId: cityData[5].id,
        starRating: 4,
        pricePerNight: 18000, // $180
        discountedPrice: 15000, // $150
        currency: 'EGP',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        featured: true,
        rating: 45, // 4.5
        reviewCount: 567,
        status: 'active'
      },
      {
        name: 'Burj Al Arab Dubai',
        description: 'World\'s most luxurious 7-star hotel with unparalleled service',
        address: 'Jumeirah Beach Road, Dubai, UAE',
        phone: '+971 4 301 7777',
        email: 'reservations@burjalarab.com',
        imageUrl: '/images/hotels/burj-al-arab.jpg',
        destinationId: destinationData[3].id,
        countryId: countryData[2].id,
        cityId: cityData[7].id,
        starRating: 7,
        pricePerNight: 150000, // $1,500
        discountedPrice: 120000, // $1,200
        currency: 'EGP',
        checkInTime: '15:00',
        checkOutTime: '12:00',
        featured: true,
        rating: 50, // 5.0
        reviewCount: 1456,
        status: 'active'
      },
      {
        name: 'Atlantis The Palm Dubai',
        description: 'Iconic family resort with water park and marine adventures',
        address: 'Palm Jumeirah, Dubai, UAE',
        phone: '+971 4 426 2000',
        email: 'reservations@atlantisthepalm.com',
        imageUrl: '/images/hotels/atlantis-palm.jpg',
        destinationId: destinationData[3].id,
        countryId: countryData[2].id,
        cityId: cityData[7].id,
        starRating: 5,
        pricePerNight: 80000, // $800
        discountedPrice: 65000, // $650
        currency: 'EGP',
        checkInTime: '15:00',
        checkOutTime: '12:00',
        featured: true,
        rating: 47, // 4.7
        reviewCount: 2134,
        status: 'active'
      },
      {
        name: 'Four Seasons Istanbul',
        description: 'Luxury hotel in the heart of historic Istanbul',
        address: 'Sultanahmet Square, Istanbul, Turkey',
        phone: '+90 212 402 3000',
        email: 'reservations.istanbul@fourseasons.com',
        imageUrl: '/images/hotels/four-seasons-istanbul.jpg',
        destinationId: destinationData[0].id,
        countryId: countryData[3].id,
        cityId: cityData[9].id,
        starRating: 5,
        pricePerNight: 45000, // $450
        discountedPrice: 38000, // $380
        currency: 'EGP',
        checkInTime: '15:00',
        checkOutTime: '12:00',
        featured: true,
        rating: 48, // 4.8
        reviewCount: 1876,
        status: 'active'
      }
    ]).returning();

    // 9. Create comprehensive sample rooms
    console.log('🛏️ Adding hotel rooms...');
    await db.insert(rooms).values([
      // Grand Nile Palace Cairo rooms
      {
        name: 'Deluxe Nile View Room',
        description: 'Spacious room with stunning Nile River views and modern amenities',
        hotelId: hotelData[0].id,
        type: 'Deluxe',
        price: 30000, // $300
        discountedPrice: 25000, // $250
        capacity: 2,
        bedType: 'King Bed',
        size: 45,
        imageUrl: '/images/rooms/nile-deluxe.jpg',
        available: true,
        maxOccupancy: 3,
        rating: 47,
        reviewCount: 234
      },
      {
        name: 'Executive Suite',
        description: 'Luxurious suite with separate living area and panoramic city views',
        hotelId: hotelData[0].id,
        type: 'Suite',
        price: 50000, // $500
        discountedPrice: 42000, // $420
        capacity: 4,
        bedType: 'King Bed + Sofa Bed',
        size: 75,
        imageUrl: '/images/rooms/executive-suite.jpg',
        available: true,
        maxOccupancy: 4,
        rating: 48,
        reviewCount: 156
      },
      {
        name: 'Standard City View',
        description: 'Comfortable room with modern furnishings and city views',
        hotelId: hotelData[0].id,
        type: 'Standard',
        price: 20000, // $200
        discountedPrice: 17000, // $170
        capacity: 2,
        bedType: 'Queen Bed',
        size: 35,
        imageUrl: '/images/rooms/standard-city.jpg',
        available: true,
        maxOccupancy: 2,
        rating: 44,
        reviewCount: 389
      },
      // Petra Heritage Hotel rooms
      {
        name: 'Traditional Petra Room',
        description: 'Authentic Jordanian-style room with traditional decor and mountain views',
        hotelId: hotelData[1].id,
        type: 'Standard',
        price: 18000, // $180
        discountedPrice: 15000, // $150
        capacity: 2,
        bedType: 'Twin Beds',
        size: 30,
        imageUrl: '/images/rooms/petra-traditional.jpg',
        available: true,
        maxOccupancy: 3,
        rating: 45,
        reviewCount: 167
      },
      {
        name: 'Heritage Suite',
        description: 'Spacious suite combining traditional charm with modern comfort',
        hotelId: hotelData[1].id,
        type: 'Suite',
        price: 28000, // $280
        discountedPrice: 24000, // $240
        capacity: 3,
        bedType: 'King Bed',
        size: 55,
        imageUrl: '/images/rooms/heritage-suite.jpg',
        available: true,
        maxOccupancy: 4,
        rating: 46,
        reviewCount: 98
      },
      // Burj Al Arab Dubai rooms
      {
        name: 'One Bedroom Suite',
        description: 'Ultra-luxurious suite with panoramic Gulf views and butler service',
        hotelId: hotelData[2].id,
        type: 'Suite',
        price: 200000, // $2,000
        discountedPrice: 180000, // $1,800
        capacity: 2,
        bedType: 'King Bed',
        size: 170,
        imageUrl: '/images/rooms/burj-suite.jpg',
        available: true,
        maxOccupancy: 3,
        rating: 50,
        reviewCount: 89
      },
      {
        name: 'Royal Suite',
        description: 'The pinnacle of luxury with private dining and dedicated butler',
        hotelId: hotelData[2].id,
        type: 'Presidential',
        price: 500000, // $5,000
        discountedPrice: 450000, // $4,500
        capacity: 4,
        bedType: 'King Bed + Additional Bedrooms',
        size: 780,
        imageUrl: '/images/rooms/royal-suite.jpg',
        available: true,
        maxOccupancy: 6,
        rating: 50,
        reviewCount: 23
      },
      // Atlantis The Palm Dubai rooms
      {
        name: 'Ocean View Room',
        description: 'Stylish room with stunning views of the Arabian Gulf',
        hotelId: hotelData[3].id,
        type: 'Deluxe',
        price: 90000, // $900
        discountedPrice: 75000, // $750
        capacity: 2,
        bedType: 'King Bed',
        size: 45,
        imageUrl: '/images/rooms/atlantis-ocean.jpg',
        available: true,
        maxOccupancy: 3,
        rating: 47,
        reviewCount: 445
      },
      {
        name: 'Family Suite',
        description: 'Perfect for families with separate bedrooms and aquarium views',
        hotelId: hotelData[3].id,
        type: 'Suite',
        price: 150000, // $1,500
        discountedPrice: 125000, // $1,250
        capacity: 6,
        bedType: 'King Bed + Bunk Beds',
        size: 90,
        imageUrl: '/images/rooms/atlantis-family.jpg',
        available: true,
        maxOccupancy: 6,
        rating: 48,
        reviewCount: 312
      },
      // Four Seasons Istanbul rooms
      {
        name: 'Historic City View',
        description: 'Elegant room overlooking the historic Sultanahmet district',
        hotelId: hotelData[4].id,
        type: 'Deluxe',
        price: 50000, // $500
        discountedPrice: 42000, // $420
        capacity: 2,
        bedType: 'King Bed',
        size: 40,
        imageUrl: '/images/rooms/istanbul-historic.jpg',
        available: true,
        maxOccupancy: 3,
        rating: 48,
        reviewCount: 245
      },
      {
        name: 'Bosphorus Suite',
        description: 'Premium suite with breathtaking Bosphorus views and marble bathroom',
        hotelId: hotelData[4].id,
        type: 'Suite',
        price: 75000, // $750
        discountedPrice: 65000, // $650
        capacity: 3,
        bedType: 'King Bed',
        size: 85,
        imageUrl: '/images/rooms/bosphorus-suite.jpg',
        available: true,
        maxOccupancy: 4,
        rating: 49,
        reviewCount: 123
      },
      {
        name: 'Premium Bosphorus Suite',
        description: 'Luxury suite with stunning Bosphorus views',
        hotelId: hotelData[0].id,
        type: 'Suite',
        price: 50000, // $500
        discountedPrice: 45000, // $450
        capacity: 4,
        bedType: 'King Bed + Sofa Bed',
        size: 65,
        imageUrl: '/images/rooms/premium-bosphorus.jpg',
        available: true,
        maxOccupancy: 4,
        rating: 48,
        reviewCount: 234
      },
      {
        name: 'Desert View Standard Room',
        description: 'Comfortable room with traditional decor',
        hotelId: hotelData[1].id,
        type: 'Standard',
        price: 20000, // $200
        discountedPrice: 17000, // $170
        capacity: 2,
        bedType: 'Queen Bed',
        size: 28,
        imageUrl: '/images/rooms/desert-view.jpg',
        available: true,
        maxOccupancy: 2,
        rating: 44, // 4.4
        reviewCount: 156
      }
    ]);

    // 10. Create visa information
    console.log('📄 Adding visa information...');
    await db.insert(visas).values([
      {
        title: 'Egypt Tourist Visa',
        description: 'Single entry tourist visa for Egypt valid for 30 days',
        targetCountryId: countryData[0].id,
        imageUrl: '/images/flags/egypt.jpg',
        price: 2500, // $25
        processingTime: '3-5 business days',
        validityPeriod: '90 days from issue date',
        entryType: 'Single',
        active: true
      },
      {
        title: 'Jordan Tourist Visa',
        description: 'Multiple entry tourist visa for Jordan',
        targetCountryId: countryData[1].id,
        imageUrl: '/images/flags/jordan.jpg',
        price: 4000, // $40
        processingTime: '5-7 business days',
        validityPeriod: '3 months from issue date',
        entryType: 'Multiple',
        active: true
      },
      {
        title: 'UAE Tourist Visa',
        description: 'Multiple entry tourist visa for UAE',
        targetCountryId: countryData[2].id,
        imageUrl: '/images/flags/uae.jpg',
        price: 10000, // $100
        processingTime: '2-4 business days',
        validityPeriod: '60 days from issue date',
        entryType: 'Multiple',
        active: true
      }
    ]);

    console.log('✅ First-time setup completed successfully!');
    console.log('📊 Database now contains:');
    console.log('   • Sample users for testing');
    console.log('   • 4 countries with multiple cities');
    console.log('   • Popular travel destinations');
    console.log('   • 3 travel packages');
    console.log('   • 2 guided tours');
    console.log('   • 2 hotels with rooms');
    console.log('   • Visa information for each country');
    console.log('   • All necessary categories');
    console.log('');
    console.log('🎉 Your travel booking system is ready to use!');

  } catch (error) {
    console.error('❌ Error during first-time setup:', error);
    throw error;
  }
}