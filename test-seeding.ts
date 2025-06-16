import { db } from './server/db';
import { storage } from './server/storage';

async function testSeeding() {
  try {
    console.log('Starting comprehensive seeding test...');
    
    // Test database connection
    console.log('Testing database connection...');
    const result = await db.execute('SELECT 1 as test');
    console.log('Database connected successfully');

    // Get existing data counts
    const existingCountries = await storage.listCountries();
    const existingCities = await storage.listCities();
    const existingHotels = await storage.listHotels();
    
    console.log(`Existing data - Countries: ${existingCountries.length}, Cities: ${existingCities.length}, Hotels: ${existingHotels.length}`);

    let seedResults = {
      countries: 0,
      cities: 0,
      hotels: 0,
      rooms: 0
    };

    // Seed Countries if needed
    if (existingCountries.length < 5) {
      console.log('Seeding countries...');
      const countries = [
        { name: 'Egypt', code: 'EG', description: 'Ancient civilization with pyramids and rich cultural heritage' },
        { name: 'United Arab Emirates', code: 'AE', description: 'Modern Middle Eastern destination with luxury and innovation' },
        { name: 'Jordan', code: 'JO', description: 'Historical kingdom with Petra and desert landscapes' },
        { name: 'Morocco', code: 'MA', description: 'North African gem with vibrant souks and Atlas Mountains' },
        { name: 'Turkey', code: 'TR', description: 'Transcontinental country bridging Europe and Asia' }
      ];

      for (const country of countries) {
        const existing = existingCountries.find(c => c.code === country.code);
        if (!existing) {
          await storage.createCountry({
            ...country,
            imageUrl: `https://images.unsplash.com/400x300/?${country.name.replace(' ', '+')}`,
            active: true
          });
          seedResults.countries++;
          console.log(`Added country: ${country.name}`);
        }
      }
    }

    // Get updated countries list
    const allCountries = await storage.listCountries();
    console.log(`Total countries after seeding: ${allCountries.length}`);

    // Seed Cities
    if (existingCities.length < 10) {
      console.log('Seeding cities...');
      const cityData = [
        { name: 'Cairo', countryCode: 'EG', description: 'Capital of Egypt, home to ancient pyramids' },
        { name: 'Dubai', countryCode: 'AE', description: 'Modern metropolis with stunning architecture' },
        { name: 'Amman', countryCode: 'JO', description: 'Capital of Jordan, gateway to Petra' },
        { name: 'Marrakech', countryCode: 'MA', description: 'Imperial city with vibrant souks' },
        { name: 'Istanbul', countryCode: 'TR', description: 'Historic city bridging two continents' }
      ];

      for (const cityInfo of cityData) {
        const country = allCountries.find(c => c.code === cityInfo.countryCode);
        if (country) {
          const existing = existingCities.find(c => c.name === cityInfo.name);
          if (!existing) {
            await storage.createCity({
              name: cityInfo.name,
              countryId: country.id,
              description: cityInfo.description,
              imageUrl: `https://images.unsplash.com/400x300/?${cityInfo.name.replace(' ', '+')}`,
              active: true
            });
            seedResults.cities++;
            console.log(`Added city: ${cityInfo.name}`);
          }
        }
      }
    }

    // Get updated cities list
    const allCities = await storage.listCities();
    console.log(`Total cities after seeding: ${allCities.length}`);

    // Seed Hotels with proper data
    if (existingHotels.length < 5 && allCities.length > 0) {
      console.log('Seeding hotels...');
      const hotelNames = [
        'Cairo Pyramid Resort',
        'Dubai Marina Luxury', 
        'Amman Palace Hotel',
        'Marrakech Riad Boutique',
        'Istanbul Grand Hotel'
      ];

      for (let i = 0; i < Math.min(5, hotelNames.length); i++) {
        const randomCity = allCities[Math.floor(Math.random() * allCities.length)];
        const country = allCountries.find(c => c.id === randomCity.countryId);
        
        try {
          const hotel = await storage.createHotel({
            name: hotelNames[i],
            description: `Premium accommodation in the heart of ${randomCity.name}`,
            shortDescription: `Luxury hotel in ${randomCity.name}`,
            address: `${Math.floor(Math.random() * 999) + 1} Main Street, ${randomCity.name}`,
            phone: `+${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            email: `info@${hotelNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
            website: `https://${hotelNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
            stars: Math.floor(Math.random() * 3) + 3,
            city: randomCity.name,
            country: country?.name || 'Unknown',
            cityId: randomCity.id,
            countryId: country?.id,
            imageUrl: `https://images.unsplash.com/400x300/?hotel+${randomCity.name.replace(' ', '+')}`,
            rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
            guestRating: Math.round((Math.random() * 2 + 3) * 10) / 10,
            reviewCount: Math.floor(Math.random() * 500) + 50,
            amenities: '["WiFi", "Pool", "Restaurant", "Spa"]',
            checkInTime: '15:00',
            checkOutTime: '11:00',
            featured: Math.random() > 0.7,
            basePrice: Math.floor(Math.random() * 30000) + 10000,
            currency: 'EGP',
            totalRooms: Math.floor(Math.random() * 200) + 50,
            totalFloors: Math.floor(Math.random() * 20) + 3,
            wifiAvailable: true,
            parkingAvailable: Math.random() > 0.3,
            airportTransferAvailable: Math.random() > 0.5,
            carRentalAvailable: Math.random() > 0.6,
            shuttleAvailable: Math.random() > 0.4,
            petFriendly: Math.random() > 0.7,
            accessibleFacilities: Math.random() > 0.5,
            status: 'active'
          });
          
          seedResults.hotels++;
          console.log(`Added hotel: ${hotelNames[i]} (ID: ${hotel.id})`);

          // Add rooms for each hotel
          const roomTypes = ['Standard', 'Deluxe', 'Suite'];
          for (let j = 0; j < 3; j++) {
            await storage.createRoom({
              name: `${roomTypes[j]} Room`,
              description: `Comfortable ${roomTypes[j].toLowerCase()} accommodation with modern amenities`,
              price: Math.floor(Math.random() * 20000) + 5000,
              type: roomTypes[j],
              maxOccupancy: j < 2 ? 2 : 4,
              maxAdults: j < 2 ? 2 : 4,
              maxChildren: j === 0 ? 0 : 2,
              size: `${Math.floor(Math.random() * 30) + 25} sqm`,
              bedType: j === 0 ? 'single' : j === 1 ? 'double' : 'king',
              amenities: ['WiFi', 'Air Conditioning', 'Minibar', 'TV', 'Safe'].slice(0, Math.floor(Math.random() * 3) + 3),
              hotelId: hotel.id,
              imageUrl: `https://images.unsplash.com/400x300/?hotel+room+${roomTypes[j].replace(' ', '+')}`,
              status: 'active'
            });
            seedResults.rooms++;
            console.log(`Added room: ${roomTypes[j]} for ${hotelNames[i]}`);
          }
        } catch (error) {
          console.error(`Error creating hotel ${hotelNames[i]}:`, error);
        }
      }
    }

    console.log('\n=== Seeding Results ===');
    console.log(`Countries added: ${seedResults.countries}`);
    console.log(`Cities added: ${seedResults.cities}`);
    console.log(`Hotels added: ${seedResults.hotels}`);
    console.log(`Rooms added: ${seedResults.rooms}`);
    console.log('Seeding completed successfully!');

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

testSeeding().then(() => {
  console.log('Test seeding completed!');
  process.exit(0);
}).catch(error => {
  console.error('Test seeding failed:', error);
  process.exit(1);
});