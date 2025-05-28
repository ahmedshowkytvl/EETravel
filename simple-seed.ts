import { db } from './server/db';
import { countries, cities, destinations, packages, tours, hotels, rooms, visas } from './shared/schema';

async function addSampleData() {
  console.log('🌱 Adding essential sample data...');

  try {
    // Add core countries and cities
    console.log('📍 Adding countries and cities...');
    const egyptResult = await db.insert(countries).values({
      name: 'Egypt',
      code: 'EG',
      description: 'Land of the Pharaohs',
      active: true
    }).returning();

    const cairoResult = await db.insert(cities).values({
      name: 'Cairo',
      countryId: egyptResult[0].id,
      description: 'Capital of Egypt',
      active: true
    }).returning();

    // Add a key destination
    console.log('🗺️ Adding destination...');
    const pyramidsResult = await db.insert(destinations).values({
      name: 'Pyramids of Giza',
      country: 'Egypt',
      countryId: egyptResult[0].id,
      cityId: cairoResult[0].id,
      description: 'Ancient wonder of the world',
      imageUrl: '/destinations/pyramids.jpg',
      featured: true
    }).returning();

    // Add sample package
    console.log('📦 Adding travel package...');
    const packageResult = await db.insert(packages).values({
      title: 'Classic Egypt Tour',
      description: 'Explore ancient Egypt with this comprehensive tour package',
      price: 129900,
      discountedPrice: 99900,
      imageUrl: '/packages/egypt-tour.jpg',
      duration: 7,
      rating: 4.8,
      reviewCount: 156,
      destinationId: pyramidsResult[0].id,
      countryId: egyptResult[0].id,
      cityId: cairoResult[0].id,
      featured: true,
      type: 'Cultural',
      slug: 'classic-egypt-tour'
    }).returning();

    // Add sample tour
    console.log('🎯 Adding tour...');
    const tourResult = await db.insert(tours).values({
      name: 'Pyramids Half Day Tour',
      description: 'Visit the iconic Pyramids of Giza',
      imageUrl: '/tours/pyramids-tour.jpg',
      destinationId: pyramidsResult[0].id,
      tripType: 'Historical',
      duration: 4,
      date: new Date('2025-06-01'),
      numPassengers: 15,
      price: 4900,
      discountedPrice: 3900,
      maxGroupSize: 20,
      featured: true,
      rating: 4.6,
      reviewCount: 312,
      status: 'active'
    }).returning();

    // Add sample hotel
    console.log('🏨 Adding hotel...');
    const hotelResult = await db.insert(hotels).values({
      name: 'Cairo Palace Hotel',
      description: 'Luxury hotel in the heart of Cairo',
      address: '123 Tahrir Square, Cairo, Egypt',
      phone: '+20 2 1234 5678',
      email: 'info@cairopalace.com',
      imageUrl: '/hotels/cairo-palace.jpg',
      destinationId: pyramidsResult[0].id,
      countryId: egyptResult[0].id,
      cityId: cairoResult[0].id,
      starRating: 5,
      pricePerNight: 25000,
      discountedPrice: 20000,
      currency: 'USD',
      checkInTime: '15:00',
      checkOutTime: '12:00',
      featured: true,
      rating: 4.7,
      reviewCount: 1247,
      status: 'active'
    }).returning();

    // Add sample room
    console.log('🛏️ Adding hotel room...');
    const roomResult = await db.insert(rooms).values({
      name: 'Deluxe City View Room',
      description: 'Spacious room with city views',
      hotelId: hotelResult[0].id,
      roomType: 'Deluxe',
      price: 30000,
      discountedPrice: 25000,
      capacity: 2,
      bedType: 'King Bed',
      size: 35,
      imageUrl: '/rooms/deluxe-room.jpg',
      available: true,
      maxOccupancy: 3,
      rating: 4.8,
      reviewCount: 234
    }).returning();

    // Add sample visa
    console.log('📄 Adding visa information...');
    const visaResult = await db.insert(visas).values({
      title: 'Egypt Tourist Visa',
      description: 'Single entry tourist visa for Egypt',
      targetCountryId: egyptResult[0].id,
      imageUrl: '/visas/egypt-flag.jpg',
      price: 2500,
      processingTime: '3-5 business days',
      validityPeriod: '90 days from issue date',
      entryType: 'Single',
      active: true
    }).returning();

    console.log('✅ Sample data added successfully!');
    console.log('📊 Summary:');
    console.log(`   • 1 country (Egypt)`);
    console.log(`   • 1 city (Cairo)`);
    console.log(`   • 1 destination (Pyramids of Giza)`);
    console.log(`   • 1 package (Classic Egypt Tour)`);
    console.log(`   • 1 tour (Pyramids Half Day Tour)`);
    console.log(`   • 1 hotel (Cairo Palace Hotel)`);
    console.log(`   • 1 room (Deluxe City View Room)`);
    console.log(`   • 1 visa (Egypt Tourist Visa)`);
    console.log('');
    console.log('🎉 You can now test cart and checkout functionality!');

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    throw error;
  }
}

// Run the seeding
addSampleData()
  .then(() => {
    console.log('🎉 Database seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database seeding failed:', error);
    process.exit(1);
  });

export { addSampleData };