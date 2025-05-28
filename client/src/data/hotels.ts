export interface Hotel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  pricePerNight: boolean;
  distance: string;
  image: string;
  images: string[];
  amenities: string[];
  availableRooms: number;
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
  starRating: number;
  hotelType: string;
  latitude?: number;
  longitude?: number;
}

export interface HotelsFilterState {
  minPrice: number;
  maxPrice: number;
  starRating: number[];
  amenities: string[];
  distanceFromCenter: number; // km
  hotelType: string[];
  reviewScore: number;
}

export const hotelsData: Hotel[] = [
  {
    id: 1,
    name: 'Cairo Marriott Hotel & Omar Khayyam Casino',
    description: 'Luxurious 5-star hotel with a casino, located on an island in the Nile River. It offers landscaped gardens, an outdoor pool, and 14 restaurants and bars.',
    address: '16 Saray El Gezira, Zamalek, Cairo 11211',
    city: 'Cairo',
    country: 'Egypt',
    rating: 4.5,
    reviewCount: 3752,
    price: 210,
    currency: 'USD',
    pricePerNight: true,
    distance: '0.8 km from city center',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2070',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074'
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service', 'Casino', 'Business Center', 'Airport Shuttle', 'Bar/Lounge'],
    availableRooms: 16,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    starRating: 5,
    hotelType: 'Luxury',
    latitude: 30.0571,
    longitude: 31.2272
  },
  {
    id: 2,
    name: 'Four Seasons Hotel Cairo at Nile Plaza',
    description: 'Set in the heart of Cairo, this 5-star hotel offers elegant accommodations with panoramic views of the Nile River. It features a full-service spa, an outdoor pool, and 9 restaurants.',
    address: '1089 Corniche El Nil, Garden City, Cairo 11519',
    city: 'Cairo',
    country: 'Egypt',
    rating: 4.8,
    reviewCount: 1850,
    price: 280,
    currency: 'USD',
    pricePerNight: true,
    distance: '0.5 km from city center',
    image: 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?q=80&w=2074',
    images: [
      'https://images.unsplash.com/photo-1587874522487-fe10e9d4eaf5?q=80&w=2070',
      'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?q=80&w=2065',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070'
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service', 'Business Center', 'Airport Shuttle', 'Bar/Lounge', 'Concierge Service'],
    availableRooms: 8,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    starRating: 5,
    hotelType: 'Luxury',
    latitude: 30.0410,
    longitude: 31.2290
  },
  {
    id: 3,
    name: 'Steigenberger Hotel El Tahrir Cairo',
    description: 'Modern hotel located in the heart of Cairo, just a short walk from the Egyptian Museum. It offers comfortable rooms, a rooftop pool, and dining options.',
    address: '2 Kasr El Nil St, Downtown, Cairo 11599',
    city: 'Cairo',
    country: 'Egypt',
    rating: 4.3,
    reviewCount: 2145,
    price: 120,
    currency: 'USD',
    pricePerNight: true,
    distance: '0.2 km from city center',
    image: 'https://images.unsplash.com/photo-1562790351-d273a961e0e9?q=80&w=2065',
    images: [
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=2074',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070'
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Fitness Center', 'Restaurant', 'Room Service', 'Business Center', 'Bar/Lounge'],
    availableRooms: 22,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    starRating: 4,
    hotelType: 'Business',
    latitude: 30.0444,
    longitude: 31.2357
  },
  {
    id: 4,
    name: 'Kempinski Nile Hotel Cairo',
    description: 'Luxury boutique hotel situated on the banks of the Nile River. It offers spacious rooms with balconies, a rooftop pool, a spa, and various dining options.',
    address: 'Corniche El Nil, 12 Ahmed Ragheb Street, Garden City, Cairo 11519',
    city: 'Cairo',
    country: 'Egypt',
    rating: 4.7,
    reviewCount: 1480,
    price: 240,
    currency: 'USD',
    pricePerNight: true,
    distance: '0.7 km from city center',
    image: 'https://images.unsplash.com/photo-1519449556851-5720b33024e7?q=80&w=2071',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2080',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070'
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service', 'Business Center', 'Airport Shuttle', 'Bar/Lounge', 'Private Balconies'],
    availableRooms: 12,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    starRating: 5,
    hotelType: 'Luxury',
    latitude: 30.0377,
    longitude: 31.2287
  },
  {
    id: 5,
    name: 'Cairo Pyramids Hotel',
    description: 'Located near the Giza Pyramids, this hotel offers comfortable accommodations with views of the pyramids. It features an outdoor pool, restaurants, and a shuttle service.',
    address: 'Alexandria Desert Road, Giza 12556',
    city: 'Giza',
    country: 'Egypt',
    rating: 3.9,
    reviewCount: 2950,
    price: 85,
    currency: 'USD',
    pricePerNight: true,
    distance: '1.2 km from Pyramids',
    image: 'https://images.unsplash.com/photo-1549109786-eb80da56e693?q=80&w=2069',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2080',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=2071'
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Room Service', 'Shuttle Service', 'Bar/Lounge', 'Garden'],
    availableRooms: 25,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    starRating: 3,
    hotelType: 'Resort',
    latitude: 29.9773,
    longitude: 31.1325
  },
  {
    id: 6,
    name: 'Sofitel Cairo Nile El Gezirah',
    description: 'Luxury hotel on the southern tip of El Gezirah Island. It offers panoramic views of the Nile, an infinity pool, a spa, and multiple dining options.',
    address: '3 El Thawra Council St, Zamalek, Cairo 11518',
    city: 'Cairo',
    country: 'Egypt',
    rating: 4.6,
    reviewCount: 2240,
    price: 230,
    currency: 'USD',
    pricePerNight: true,
    distance: '0.6 km from city center',
    image: 'https://images.unsplash.com/photo-1606046604972-77cc76aee944?q=80&w=2065',
    images: [
      'https://images.unsplash.com/photo-1606046604972-77cc76aee944?q=80&w=2065',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2089'
    ],
    amenities: ['Free WiFi', 'Infinity Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service', 'Business Center', 'Airport Shuttle', 'Bar/Lounge', 'Casino'],
    availableRooms: 14,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    starRating: 5,
    hotelType: 'Luxury',
    latitude: 30.0427,
    longitude: 31.2249
  },
  {
    id: 7,
    name: 'Le Méridien Pyramids Hotel & Spa',
    description: 'Located near the Giza Pyramids, this 5-star hotel offers well-appointed rooms with views of the pyramids or the swimming pool. It features a spa, restaurants, and bars.',
    address: 'El Remaya Square, Pyramids Road, Giza 12561',
    city: 'Giza',
    country: 'Egypt',
    rating: 4.2,
    reviewCount: 2670,
    price: 140,
    currency: 'USD',
    pricePerNight: true,
    distance: '0.8 km from Pyramids',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1576675784201-0e142b423952?q=80&w=2952',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070'
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service', 'Pyramids View', 'Bar/Lounge'],
    availableRooms: 18,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    starRating: 5,
    hotelType: 'Resort',
    latitude: 29.9878,
    longitude: 31.1400
  },
  {
    id: 8,
    name: 'Fairmont Nile City, Cairo',
    description: 'Modern luxury hotel situated on the banks of the Nile River with panoramic views of the city and the pyramids. It offers a rooftop pool, a spa, and dining options.',
    address: 'Nile City Towers, 2005 B Corniche El Nil, Ramlet Beaulac, Cairo 11221',
    city: 'Cairo',
    country: 'Egypt',
    rating: 4.5,
    reviewCount: 1850,
    price: 220,
    currency: 'USD',
    pricePerNight: true,
    distance: '1.2 km from city center',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1559841644-08984562005a?q=80&w=2074',
      'https://images.unsplash.com/photo-1601565415267-74dafc7d9a53?q=80&w=2071',
      'https://images.unsplash.com/photo-1521783988139-89397d761dce?q=80&w=2070'
    ],
    amenities: ['Free WiFi', 'Rooftop Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service', 'Business Center', 'Airport Shuttle', 'Bar/Lounge'],
    availableRooms: 10,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    starRating: 5,
    hotelType: 'Luxury',
    latitude: 30.0719,
    longitude: 31.2247
  },
  {
    id: 9,
    name: 'The Nile Ritz-Carlton, Cairo',
    description: 'Historic luxury hotel overlooking the Nile River and Tahrir Square. It offers spacious rooms, multiple dining options, an outdoor pool, and a spa.',
    address: 'Corniche El Nil, 1113 Corniche El Nil, Cairo 11221',
    city: 'Cairo',
    country: 'Egypt',
    rating: 4.7,
    reviewCount: 1580,
    price: 260,
    currency: 'USD',
    pricePerNight: true,
    distance: '0.3 km from city center',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?q=80&w=2070',
      'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=2070',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070'
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service', 'Business Center', 'Airport Shuttle', 'Bar/Lounge', 'Nile View'],
    availableRooms: 6,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    starRating: 5,
    hotelType: 'Luxury',
    latitude: 30.0456,
    longitude: 31.2328
  },
  {
    id: 10,
    name: 'InterContinental Cairo Semiramis',
    description: 'Located on the banks of the Nile River, this luxury hotel offers spacious rooms with river views, a casino, a spa, and multiple restaurants and bars.',
    address: 'Corniche El Nil, Garden City, Cairo 11511',
    city: 'Cairo',
    country: 'Egypt',
    rating: 4.4,
    reviewCount: 2180,
    price: 190,
    currency: 'USD',
    pricePerNight: true,
    distance: '0.4 km from city center',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1559599238-308793637427?q=80&w=2069',
      'https://images.unsplash.com/photo-1559841644-08984562005a?q=80&w=2074',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025'
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service', 'Business Center', 'Casino', 'Bar/Lounge', 'Nile View'],
    availableRooms: 15,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    starRating: 5,
    hotelType: 'Luxury',
    latitude: 30.0436,
    longitude: 31.2322
  },
  {
    id: 11,
    name: 'Talisman Hotel de Charme',
    description: 'Boutique hotel in the heart of Downtown Cairo. It offers distinctive rooms with traditional décor, a good restaurant, and personalized service.',
    address: '39 Talaat Harb Street, Downtown, Cairo 11511',
    city: 'Cairo',
    country: 'Egypt',
    rating: 4.3,
    reviewCount: 980,
    price: 75,
    currency: 'USD',
    pricePerNight: true,
    distance: '0.3 km from city center',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1585244759837-7e94d5fa890d?q=80&w=2070',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069'
    ],
    amenities: ['Free WiFi', 'Restaurant', 'Room Service', 'Airport Shuttle', 'Bar/Lounge', 'Traditional Décor'],
    availableRooms: 8,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    starRating: 3,
    hotelType: 'Boutique',
    latitude: 30.0471,
    longitude: 31.2390
  },
  {
    id: 12,
    name: 'Safir Hotel Cairo',
    description: 'Centrally located hotel in Cairo offering comfortable rooms, an outdoor pool, restaurants, and easy access to attractions.',
    address: 'El-Mesaha Square, Dokki, Cairo 12311',
    city: 'Cairo',
    country: 'Egypt',
    rating: 3.8,
    reviewCount: 1420,
    price: 65,
    currency: 'USD',
    pricePerNight: true,
    distance: '1.5 km from city center',
    image: 'https://images.unsplash.com/photo-1561049933-c8fbef47b329?q=80&w=2069',
    images: [
      'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=2127',
      'https://images.unsplash.com/photo-1521783988139-89397d761dce?q=80&w=2070',
      'https://images.unsplash.com/photo-1554009975-d83a4232d221?q=80&w=2127'
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Fitness Center', 'Restaurant', 'Room Service', 'Business Center', 'Bar/Lounge'],
    availableRooms: 28,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    starRating: 3,
    hotelType: 'Business',
    latitude: 30.0367,
    longitude: 31.2088
  },
  {
    id: 13,
    name: 'Conrad Cairo',
    description: 'Luxury hotel on the banks of the Nile River. It offers spacious rooms with Nile views, a casino, a health club, and dining options.',
    address: '1191 Corniche El Nil, Cairo 11221',
    city: 'Cairo',
    country: 'Egypt',
    rating: 4.4,
    reviewCount: 1950,
    price: 170,
    currency: 'USD',
    pricePerNight: true,
    distance: '1.8 km from city center',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2089',
    images: [
      'https://images.unsplash.com/photo-1587874522487-fe10e9d4eaf5?q=80&w=2070',
      'https://images.unsplash.com/photo-1576675784201-0e142b423952?q=80&w=2952',
      'https://images.unsplash.com/photo-1606046604972-77cc76aee944?q=80&w=2065'
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Health Club', 'Fitness Center', 'Restaurant', 'Room Service', 'Business Center', 'Casino', 'Bar/Lounge', 'Nile View'],
    availableRooms: 16,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    starRating: 5,
    hotelType: 'Luxury',
    latitude: 30.0653,
    longitude: 31.2241
  },
  {
    id: 14,
    name: 'St. John\'s Boutique Hotel',
    description: 'Cozy boutique hotel located in a quiet area of Cairo. It offers comfortable rooms, a garden, and good breakfast.',
    address: '27 Al Sarayat St, Abbassia, Cairo 11517',
    city: 'Cairo',
    country: 'Egypt',
    rating: 4.1,
    reviewCount: 720,
    price: 55,
    currency: 'USD',
    pricePerNight: true,
    distance: '3.2 km from city center',
    image: 'https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1576675784483-df976cd4ef7c?q=80&w=2952',
      'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?q=80&w=2070',
      'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=2068'
    ],
    amenities: ['Free WiFi', 'Garden', 'Breakfast Included', 'Room Service', 'Airport Shuttle'],
    availableRooms: 12,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    starRating: 3,
    hotelType: 'Boutique',
    latitude: 30.0656,
    longitude: 31.2812
  },
  {
    id: 15,
    name: 'Pyramids View Inn',
    description: 'Budget-friendly hotel offering rooms with views of the Giza Pyramids. It features a rooftop terrace, breakfast, and friendly service.',
    address: '10 Sphinx Street, Nazlet El-Semman, Giza 12556',
    city: 'Giza',
    country: 'Egypt',
    rating: 3.9,
    reviewCount: 860,
    price: 45,
    currency: 'USD',
    pricePerNight: true,
    distance: '0.5 km from Pyramids',
    image: 'https://images.unsplash.com/photo-1549109786-eb80da56e693?q=80&w=2069',
    images: [
      'https://images.unsplash.com/photo-1609611596267-48f6c779038e?q=80&w=2070',
      'https://images.unsplash.com/photo-1577739575256-bf98d3c38041?q=80&w=2070',
      'https://images.unsplash.com/photo-1504283244095-c5ad9a79aa21?q=80&w=2073'
    ],
    amenities: ['Free WiFi', 'Rooftop Terrace', 'Breakfast Included', 'Airport Shuttle', 'Pyramids View'],
    availableRooms: 15,
    checkIn: '2025-05-15',
    checkOut: '2025-05-18',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    starRating: 2,
    hotelType: 'Budget',
    latitude: 29.9772,
    longitude: 31.1367
  }
];

export const defaultHotelsFilter: HotelsFilterState = {
  minPrice: 40,
  maxPrice: 300,
  starRating: [],
  amenities: [],
  distanceFromCenter: 5,
  hotelType: [],
  reviewScore: 0
};

export const filterHotels = (hotels: Hotel[], filters: HotelsFilterState): Hotel[] => {
  return hotels.filter(hotel => {
    // Price filter
    if (hotel.price < filters.minPrice || hotel.price > filters.maxPrice) {
      return false;
    }
    
    // Star rating filter
    if (filters.starRating.length > 0 && !filters.starRating.includes(hotel.starRating)) {
      return false;
    }
    
    // Amenities filter
    if (filters.amenities.length > 0) {
      let hasAllAmenities = true;
      for (const amenity of filters.amenities) {
        if (!hotel.amenities.includes(amenity)) {
          hasAllAmenities = false;
          break;
        }
      }
      if (!hasAllAmenities) {
        return false;
      }
    }
    
    // Distance filter (simplified calculation for demo)
    const distanceValue = parseFloat(hotel.distance.split(' ')[0]);
    if (distanceValue > filters.distanceFromCenter) {
      return false;
    }
    
    // Hotel type filter
    if (filters.hotelType.length > 0 && !filters.hotelType.includes(hotel.hotelType)) {
      return false;
    }
    
    // Review score filter
    if (hotel.rating < filters.reviewScore) {
      return false;
    }
    
    return true;
  });
};

export const searchHotels = (
  hotels: Hotel[],
  city: string,
  checkIn: string,
  checkOut: string,
  guests: number = 2,
  rooms: number = 1
): Hotel[] => {
  return hotels.filter(hotel => {
    const cityMatch = hotel.city.toLowerCase().includes(city.toLowerCase()) || 
                    hotel.country.toLowerCase().includes(city.toLowerCase());
    const checkInMatch = hotel.checkIn === checkIn;
    const checkOutMatch = hotel.checkOut === checkOut;
    const hasEnoughRooms = hotel.availableRooms >= rooms;
    
    return cityMatch && checkInMatch && checkOutMatch && hasEnoughRooms;
  });
};

export const popularAmenities = [
  'Free WiFi', 
  'Swimming Pool', 
  'Breakfast Included', 
  'Spa', 
  'Fitness Center',
  'Restaurant',
  'Room Service',
  'Airport Shuttle',
  'Bar/Lounge',
  'Parking'
];

export const hotelTypes = [
  'Luxury',
  'Business',
  'Boutique',
  'Resort',
  'Budget'
];