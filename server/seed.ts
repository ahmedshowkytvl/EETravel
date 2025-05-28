import { storage } from './storage';
import { seedMenus } from './seed-menus';
import { seedTranslations } from './seed-translations';
import { seedDictionary } from './seed-dictionary';
import { seedPackageCategories } from './seed-package-categories';
import { seedRoomCategories } from './seed-room-categories';

async function seed() {
  console.log('🌱 Seeding data...');

  // Check if there are already destinations
  const existingDestinations = await storage.listDestinations();
  if (existingDestinations.length > 0) {
    console.log('✅ Data already seeded');
    return;
  }

  try {
    // Seed Countries
    console.log('🌍 Seeding countries...');
    const egypt = await storage.createCountry({
      name: 'Egypt',
      code: 'EG',
      description: 'A country linking northeast Africa with the Middle East, dates to the time of the pharaohs.',
      imageUrl: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    const uae = await storage.createCountry({
      name: 'United Arab Emirates',
      code: 'UAE',
      description: 'A federation of seven emirates on the eastern Arabian Peninsula.',
      imageUrl: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    const jordan = await storage.createCountry({
      name: 'Jordan',
      code: 'JO',
      description: 'An Arab nation on the banks of the Jordan River, known for ancient monuments and nature reserves.',
      imageUrl: 'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    const morocco = await storage.createCountry({
      name: 'Morocco',
      code: 'MA',
      description: 'A North African country with a vibrant culture and landscapes from the Sahara to the Atlas Mountains.',
      imageUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    // Seed Cities
    console.log('🏙️ Seeding cities...');
    const cairoCity = await storage.createCity({
      name: 'Cairo',
      countryId: egypt.id,
      description: 'The capital of Egypt and the largest city in the Arab world.',
      imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    const luxorCity = await storage.createCity({
      name: 'Luxor',
      countryId: egypt.id,
      description: 'A city on the east bank of the Nile River, known for its ancient ruins.',
      imageUrl: 'https://images.unsplash.com/photo-1558685582-2d0d597e6b71?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    const sharmCity = await storage.createCity({
      name: 'Sharm El Sheikh',
      countryId: egypt.id,
      description: 'A resort town between the desert of the Sinai Peninsula and the Red Sea.',
      imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    const dubaiCity = await storage.createCity({
      name: 'Dubai',
      countryId: uae.id,
      description: 'A city known for luxury shopping, ultramodern architecture, and a lively nightlife.',
      imageUrl: 'https://images.unsplash.com/photo-1548813395-e5217e9a3520?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    const abuDhabiCity = await storage.createCity({
      name: 'Abu Dhabi',
      countryId: uae.id,
      description: 'The capital of the UAE, known for its cultural landmarks and high-end shopping.',
      imageUrl: 'https://images.unsplash.com/photo-1551041777-575d3b3a5f8d?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    const ammanCity = await storage.createCity({
      name: 'Amman',
      countryId: jordan.id,
      description: 'The capital and largest city of Jordan, featuring a unique blend of old and new.',
      imageUrl: 'https://images.unsplash.com/photo-1534293230397-c067fc201ebb?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    const petraCity = await storage.createCity({
      name: 'Petra',
      countryId: jordan.id,
      description: 'An archaeological city famous for its rock-cut architecture and water conduit system.',
      imageUrl: 'https://images.unsplash.com/photo-1518368305415-e7e5621e3bef?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    const marrakechCity = await storage.createCity({
      name: 'Marrakech',
      countryId: morocco.id,
      description: 'A major city known for its vibrant markets, gardens, palaces, and mosques.',
      imageUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    const casablancaCity = await storage.createCity({
      name: 'Casablanca',
      countryId: morocco.id,
      description: 'Morocco\'s chief port and one of the largest financial centers in Africa.',
      imageUrl: 'https://images.unsplash.com/photo-1577048982768-5cb3e7ddfa23?q=80&w=800&auto=format&fit=crop',
      active: true,
    });

    // Additional cities for airport test dataset
    const alexandriaCity = await storage.createCity({
      name: 'Alexandria',
      countryId: egypt.id,
      description: 'Egypt\'s Mediterranean port city with a rich history.',
      imageUrl: 'https://images.unsplash.com/photo-1588332652694-9f46b4cfd1af?q=80&w=800&auto=format&fit=crop',
      active: true,
    });
    
    const istanbulCity = await storage.createCity({
      name: 'Istanbul',
      countryId: await (async () => {
        // Create Turkey if it doesn't exist
        const existingTurkey = await storage.getCountryByCode('TR');
        if (existingTurkey) return existingTurkey.id;
        
        const turkey = await storage.createCountry({
          name: 'Turkey',
          code: 'TR',
          description: 'A transcontinental country straddling Europe and Asia.',
          imageUrl: 'https://images.unsplash.com/photo-1545293527-e26058c5b48b?q=80&w=800&auto=format&fit=crop',
          active: true,
        });
        return turkey.id;
      })(),
      description: 'Turkey\'s cultural and economic hub spanning Europe and Asia.',
      imageUrl: 'https://images.unsplash.com/photo-1628940498613-8c4f1b19ce59?q=80&w=800&auto=format&fit=crop',
      active: true,
    });
    
    const londonCity = await storage.createCity({
      name: 'London',
      countryId: await (async () => {
        // Create UK if it doesn't exist
        const existingUK = await storage.getCountryByCode('UK');
        if (existingUK) return existingUK.id;
        
        const uk = await storage.createCountry({
          name: 'United Kingdom',
          code: 'UK',
          description: 'An island nation in northwestern Europe known for its iconic landmarks.',
          imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop',
          active: true,
        });
        return uk.id;
      })(),
      description: 'The capital of England and the UK, a global city with rich history.',
      imageUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=800&auto=format&fit=crop',
      active: true,
    });
    
    const newYorkCity = await storage.createCity({
      name: 'New York',
      countryId: await (async () => {
        // Create USA if it doesn't exist
        const existingUSA = await storage.getCountryByCode('US');
        if (existingUSA) return existingUSA.id;
        
        const usa = await storage.createCountry({
          name: 'United States',
          code: 'US',
          description: 'A diverse country spanning North America with global influence.',
          imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800&auto=format&fit=crop',
          active: true,
        });
        return usa.id;
      })(),
      description: 'A major US city known for its skyscrapers and cultural diversity.',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop',
      active: true,
    });
    
    const parisCity = await storage.createCity({
      name: 'Paris',
      countryId: await (async () => {
        // Create France if it doesn't exist
        const existingFrance = await storage.getCountryByCode('FR');
        if (existingFrance) return existingFrance.id;
        
        const france = await storage.createCountry({
          name: 'France',
          code: 'FR',
          description: 'A Western European country known for its art, culture, and cuisine.',
          imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
          active: true,
        });
        return france.id;
      })(),
      description: 'The capital of France, known for its art, fashion, and landmarks.',
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop',
      active: true,
    });
    
    const romeCity = await storage.createCity({
      name: 'Rome',
      countryId: await (async () => {
        // Create Italy if it doesn't exist
        const existingItaly = await storage.getCountryByCode('IT');
        if (existingItaly) return existingItaly.id;
        
        const italy = await storage.createCountry({
          name: 'Italy',
          code: 'IT',
          description: 'A Mediterranean country with a rich history and beautiful coastlines.',
          imageUrl: 'https://images.unsplash.com/photo-1516108317508-6788f6a160e4?q=80&w=800&auto=format&fit=crop',
          active: true,
        });
        return italy.id;
      })(),
      description: 'The capital of Italy, home to ancient ruins and Renaissance art.',
      imageUrl: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?q=80&w=800&auto=format&fit=crop',
      active: true,
    });
    
    const tokyoCity = await storage.createCity({
      name: 'Tokyo',
      countryId: await (async () => {
        // Create Japan if it doesn't exist
        const existingJapan = await storage.getCountryByCode('JP');
        if (existingJapan) return existingJapan.id;
        
        const japan = await storage.createCountry({
          name: 'Japan',
          code: 'JP',
          description: 'An island nation in East Asia known for its traditional culture and technology.',
          imageUrl: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=800&auto=format&fit=crop',
          active: true,
        });
        return japan.id;
      })(),
      description: 'Japan\'s capital, a blend of traditional culture and cutting-edge technology.',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
      active: true,
    });
    
    const jeddahCity = await storage.createCity({
      name: 'Jeddah',
      countryId: await (async () => {
        // Create Saudi Arabia if it doesn't exist
        const existingSA = await storage.getCountryByCode('SA');
        if (existingSA) return existingSA.id;
        
        const saudiArabia = await storage.createCountry({
          name: 'Saudi Arabia',
          code: 'SA',
          description: 'A desert country encompassing most of the Arabian Peninsula.',
          imageUrl: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?q=80&w=800&auto=format&fit=crop',
          active: true,
        });
        return saudiArabia.id;
      })(),
      description: 'Saudi Arabia\'s commercial center and gateway to Mecca.',
      imageUrl: 'https://images.unsplash.com/photo-1584132967334-72a3e38fabc4?q=80&w=800&auto=format&fit=crop',
      active: true,
    });
    
    // Seed Airports
    console.log('✈️ Seeding airports...');
    // Cairo airports
    await storage.createAirport({
      name: 'Cairo International Airport',
      cityId: cairoCity.id,
      code: 'CAI',
      description: 'The main international airport serving Cairo, Egypt.',
      active: true,
    });
    
    await storage.createAirport({
      name: 'Almaza Airport',
      cityId: cairoCity.id,
      code: 'ALM',
      description: 'A military airport in Cairo with limited civilian operations.',
      active: true,
    });
    
    // Alexandria airports
    await storage.createAirport({
      name: 'Borg El Arab Airport',
      cityId: alexandriaCity.id,
      code: 'HBE',
      description: 'The main airport serving Alexandria, Egypt.',
      active: true,
    });
    
    // Dubai airports
    await storage.createAirport({
      name: 'Dubai International Airport',
      cityId: dubaiCity.id,
      code: 'DXB',
      description: 'One of the busiest international airports in the world.',
      active: true,
    });
    
    await storage.createAirport({
      name: 'Al Maktoum International Airport',
      cityId: dubaiCity.id,
      code: 'DWC',
      description: 'Dubai\'s second international airport, also known as Dubai World Central.',
      active: true,
    });
    
    // Istanbul airports
    await storage.createAirport({
      name: 'Istanbul Airport',
      cityId: istanbulCity.id,
      code: 'IST',
      description: 'The main international airport serving Istanbul, Turkey.',
      active: true,
    });
    
    await storage.createAirport({
      name: 'Sabiha Gökçen International Airport',
      cityId: istanbulCity.id,
      code: 'SAW',
      description: 'Istanbul\'s second international airport located on the Asian side.',
      active: true,
    });
    
    // London airports
    await storage.createAirport({
      name: 'Heathrow Airport',
      cityId: londonCity.id,
      code: 'LHR',
      description: 'One of the busiest airports in Europe and the main hub for London.',
      active: true,
    });
    
    await storage.createAirport({
      name: 'Gatwick Airport',
      cityId: londonCity.id,
      code: 'LGW',
      description: 'London\'s second largest international airport.',
      active: true,
    });
    
    await storage.createAirport({
      name: 'Stansted Airport',
      cityId: londonCity.id,
      code: 'STN',
      description: 'A major base for low-cost carriers serving London and the East of England.',
      active: true,
    });
    
    // New York airports
    await storage.createAirport({
      name: 'John F. Kennedy International Airport',
      cityId: newYorkCity.id,
      code: 'JFK',
      description: 'The primary international airport serving New York City.',
      active: true,
    });
    
    await storage.createAirport({
      name: 'LaGuardia Airport',
      cityId: newYorkCity.id,
      code: 'LGA',
      description: 'An airport in Queens that serves domestic flights to New York City.',
      active: true,
    });
    
    await storage.createAirport({
      name: 'Newark Liberty International Airport',
      cityId: newYorkCity.id,
      code: 'EWR',
      description: 'An international airport serving the New York metropolitan area.',
      active: true,
    });
    
    // Paris airports
    await storage.createAirport({
      name: 'Charles de Gaulle Airport',
      cityId: parisCity.id,
      code: 'CDG',
      description: 'The largest international airport in France.',
      active: true,
    });
    
    await storage.createAirport({
      name: 'Orly Airport',
      cityId: parisCity.id,
      code: 'ORY',
      description: 'The second main airport serving Paris, located south of the city.',
      active: true,
    });
    
    // Rome airports
    await storage.createAirport({
      name: 'Leonardo da Vinci International Airport',
      cityId: romeCity.id,
      code: 'FCO',
      description: 'The main airport serving Rome, also known as Fiumicino Airport.',
      active: true,
    });
    
    await storage.createAirport({
      name: 'Rome Ciampino Airport',
      cityId: romeCity.id,
      code: 'CIA',
      description: 'A secondary international airport serving Rome.',
      active: true,
    });
    
    // Tokyo airports
    await storage.createAirport({
      name: 'Haneda Airport',
      cityId: tokyoCity.id,
      code: 'HND',
      description: 'One of the two primary airports serving the Greater Tokyo Area.',
      active: true,
    });
    
    await storage.createAirport({
      name: 'Narita International Airport',
      cityId: tokyoCity.id,
      code: 'NRT',
      description: 'The main international airport serving the Greater Tokyo Area.',
      active: true,
    });
    
    // Jeddah airports
    await storage.createAirport({
      name: 'King Abdulaziz International Airport',
      cityId: jeddahCity.id,
      code: 'JED',
      description: 'The main airport serving Jeddah, Saudi Arabia.',
      active: true,
    });

    // Destinations
    console.log('📍 Seeding destinations...');
    const cairo = await storage.createDestination({
      name: 'Cairo',
      country: 'Egypt',
      countryId: egypt.id,
      cityId: cairoCity.id,
      description: 'Explore the ancient pyramids and rich history of Cairo.',
      imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800&auto=format&fit=crop',
      featured: true,
    });
    
    const dubai = await storage.createDestination({
      name: 'Dubai',
      country: 'UAE',
      countryId: uae.id,
      cityId: dubaiCity.id,
      description: 'Experience luxury and modern architecture in Dubai.',
      imageUrl: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800&auto=format&fit=crop',
      featured: true,
    });
    
    const sharmElSheikh = await storage.createDestination({
      name: 'Sharm El Sheikh',
      country: 'Egypt',
      countryId: egypt.id,
      cityId: sharmCity.id,
      description: 'Relax on beautiful beaches and dive in crystal-clear waters of the Red Sea.',
      imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800&auto=format&fit=crop',
      featured: true,
    });
    
    const petra = await storage.createDestination({
      name: 'Petra',
      country: 'Jordan',
      countryId: jordan.id,
      cityId: petraCity.id,
      description: 'Discover the hidden city carved into rose-colored stone.',
      imageUrl: 'https://images.unsplash.com/photo-1518368305415-e7e5621e3bef?q=80&w=800&auto=format&fit=crop',
      featured: true,
    });
    
    const marrakech = await storage.createDestination({
      name: 'Marrakech',
      country: 'Morocco',
      countryId: morocco.id,
      cityId: marrakechCity.id,
      description: 'Immerse yourself in the vibrant markets and culture of Marrakech.',
      imageUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=800&auto=format&fit=crop',
      featured: true,
    });

    // Packages
    console.log('📦 Seeding packages...');
    await storage.createPackage({
      title: 'Cairo & Luxor Package',
      description: 'Explore ancient pyramids and cruise the Nile in this 7-day adventure',
      price: 1699,
      discountedPrice: 1359,
      imageUrl: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=800&auto=format&fit=crop',
      duration: 7,
      rating: 45, // 4.5 stars
      destinationId: cairo.id,
      featured: true,
      type: 'Cultural',
      inclusions: ['Flights', 'Hotels', 'Tours', 'Guide'],
    });
    
    await storage.createPackage({
      title: 'Dubai Luxury Weekend',
      description: 'Experience luxury shopping, desert safari, and iconic architecture',
      price: 1199,
      discountedPrice: 999,
      imageUrl: 'https://images.unsplash.com/photo-1548813395-e5217e9a3520?q=80&w=800&auto=format&fit=crop',
      duration: 4,
      rating: 50, // 5.0 stars
      destinationId: dubai.id,
      featured: true,
      type: 'Luxury',
      inclusions: ['Hotels', 'Breakfast', 'Desert Safari'],
    });
    
    await storage.createPackage({
      title: 'Jordan Explorer',
      description: 'Discover Petra, Wadi Rum, and the Dead Sea on this adventure',
      price: 1299,
      discountedPrice: 979,
      imageUrl: 'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?q=80&w=800&auto=format&fit=crop',
      duration: 6,
      rating: 40, // 4.0 stars
      destinationId: petra.id,
      featured: true,
      type: 'Adventure',
      inclusions: ['Hotels', 'Half Board', 'Tour Guide'],
    });
    
    await storage.createPackage({
      title: 'Moroccan Magic',
      description: 'Explore the vibrant markets, historic medinas, and stunning landscapes of Morocco on this unforgettable journey.',
      price: 1249,
      discountedPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=800&auto=format&fit=crop',
      duration: 8,
      rating: 45, // 4.5 stars
      destinationId: marrakech.id,
      featured: false,
      type: 'Cultural',
      inclusions: ['Hotels', 'Breakfast & Dinner', 'Tour Guide'],
    });
    
    await storage.createPackage({
      title: 'Nile Luxury Cruise',
      description: 'Sail the legendary Nile River in style, exploring ancient temples and monuments along the way.',
      price: 1899,
      discountedPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1621690977399-354a6556f243?q=80&w=800&auto=format&fit=crop',
      duration: 8,
      rating: 47, // 4.7 stars
      destinationId: cairo.id,
      featured: false,
      type: 'Luxury',
      inclusions: ['Hotels', 'Full Board', 'Tours', 'Guide'],
    });
    
    // Add a package with visa services
    await storage.createPackage({
      title: 'Red Sea Visa Package',
      description: 'Complete visa service and resort stay in beautiful Sharm El Sheikh, with all formalities handled for you.',
      price: 899,
      discountedPrice: 799,
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
      duration: 5,
      rating: 46, // 4.6 stars
      destinationId: sharmElSheikh.id,
      featured: true,
      type: 'Beach & Relaxation',
      inclusions: ['Visa Processing', 'Hotels', 'Airport Transfers', 'Breakfast'],
    });
    
    // Add a transportation-focused package
    await storage.createPackage({
      title: 'Jordan Transportation Explorer',
      description: 'Premium transportation package covering all your travel needs in Jordan, with private driver and flexible itinerary.',
      price: 1150,
      discountedPrice: 990,
      imageUrl: 'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?q=80&w=800&auto=format&fit=crop',
      duration: 6,
      rating: 48, // 4.8 stars
      destinationId: petra.id,
      featured: true,
      type: 'Transportation',
      inclusions: ['Private Driver', 'Premium Vehicle', 'Fuel', 'Hotels', 'Airport Transfers', 'Breakfast'],
    });
    
    // Add a flight-inclusive package
    await storage.createPackage({
      title: 'Fly & Stay: Dubai Getaway',
      description: 'All-inclusive package with international flights to Dubai, luxury accommodation, and unique experiences.',
      price: 1650,
      discountedPrice: 1495,
      imageUrl: 'https://images.unsplash.com/photo-1548813395-e5217e9a3520?q=80&w=800&auto=format&fit=crop',
      duration: 5,
      rating: 49, // 4.9 stars
      destinationId: dubai.id,
      featured: true,
      type: 'Fly & Stay',
      inclusions: ['International Flights', '4-star Hotel', 'Airport Transfers', 'Dubai City Tour', 'Desert Safari'],
    });

    console.log('✅ Data seeded successfully!');
    
    // Seed menus after main data is seeded
    await seedMenus(true); // Reset menus to apply new structure
    
    // Seed translations
    await seedTranslations();
    
    // Seed dictionary entries
    await seedDictionary();
    
    // Seed package categories
    await seedPackageCategories();
    
    // Seed room categories
    await seedRoomCategories();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

export { seed };