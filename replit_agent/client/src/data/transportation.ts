export interface Transportation {
  id: number;
  type: string;
  subtype: string;
  company: string;
  model: string;
  capacity: number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
  duration: string;
  price: number;
  currency: string;
  pricePerDay: boolean;
  image: string;
  features: string[];
  rating: number;
  reviewCount: number;
  available: number;
  cancellationPolicy: string;
  insuranceIncluded: boolean;
  additionalDriverAllowed: boolean;
  minimumAge: number;
  driverRequirements: string[];
  mileagePolicy: string;
  fuelPolicy: string;
}

export interface TransportationFilterState {
  minPrice: number;
  maxPrice: number;
  types: string[];
  companies: string[];
  capacity: number[];
  features: string[];
  rentalDuration?: number;
}

export const transportationTypes = [
  { id: 1, name: 'Car', subtypes: ['Economy', 'Compact', 'Midsize', 'Standard', 'Full-size', 'Premium', 'Luxury', 'SUV', 'Minivan'] },
  { id: 2, name: 'Bus', subtypes: ['Standard', 'Luxury', 'Mini Bus', 'Double-decker'] },
  { id: 3, name: 'Private Transfer', subtypes: ['Sedan', 'SUV', 'Van', 'Luxury'] },
  { id: 4, name: 'Shuttle', subtypes: ['Airport', 'Hotel', 'Shared'] },
  { id: 5, name: 'Limousine', subtypes: ['Standard', 'Stretch', 'SUV'] },
];

export const transportationCompanies = [
  { id: 1, name: 'Hertz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/HERTZ_LOGO.svg/2560px-HERTZ_LOGO.svg.png' },
  { id: 2, name: 'Avis', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Avis_Budget_Group_logo.svg/2560px-Avis_Budget_Group_logo.svg.png' },
  { id: 3, name: 'Budget', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Budget_Car_Rental_logo.svg/2560px-Budget_Car_Rental_logo.svg.png' },
  { id: 4, name: 'Enterprise', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Enterprise_Holdings_logo.svg/2560px-Enterprise_Holdings_logo.svg.png' },
  { id: 5, name: 'Sixt', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Sixt_logo.svg/2560px-Sixt_logo.svg.png' },
  { id: 6, name: 'Cairo Limousine', logo: '' },
  { id: 7, name: 'Egypt Transit', logo: '' },
  { id: 8, name: 'Go Bus', logo: 'https://gobus.egmalls.com/files/company/1578231945GOBUS_LOGO_STRAP_W-01_%281%29.png' },
  { id: 9, name: 'Blue Bus', logo: '' },
  { id: 10, name: 'Cairo Airport Shuttle', logo: '' }
];

export const transportationData: Transportation[] = [
  {
    id: 1,
    type: 'Car',
    subtype: 'Economy',
    company: 'Hertz',
    model: 'Toyota Yaris or similar',
    capacity: 4,
    pickupLocation: 'Cairo International Airport',
    dropoffLocation: 'Cairo International Airport',
    pickupDate: '2025-05-15',
    pickupTime: '10:00 AM',
    returnDate: '2025-05-18',
    returnTime: '2:00 PM',
    duration: '3 days',
    price: 35,
    currency: 'USD',
    pricePerDay: true,
    image: 'https://images.unsplash.com/photo-1591439657848-9f6b9a0690b4?q=80&w=2076',
    features: ['Air Conditioning', 'Automatic Transmission', 'Bluetooth', 'USB Port'],
    rating: 4.2,
    reviewCount: 285,
    available: 7,
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
    insuranceIncluded: true,
    additionalDriverAllowed: true,
    minimumAge: 21,
    driverRequirements: ['Valid Driver\'s License', 'Credit Card', 'Passport'],
    mileagePolicy: 'Unlimited',
    fuelPolicy: 'Full to Full'
  },
  {
    id: 2,
    type: 'Car',
    subtype: 'Standard',
    company: 'Avis',
    model: 'Hyundai Elantra or similar',
    capacity: 5,
    pickupLocation: 'Cairo International Airport',
    dropoffLocation: 'Cairo International Airport',
    pickupDate: '2025-05-15',
    pickupTime: '11:30 AM',
    returnDate: '2025-05-18',
    returnTime: '3:30 PM',
    duration: '3 days',
    price: 45,
    currency: 'USD',
    pricePerDay: true,
    image: 'https://images.unsplash.com/photo-1560009521-5e1b643ae0f4?q=80&w=2069',
    features: ['Air Conditioning', 'Automatic Transmission', 'Bluetooth', 'USB Port', 'GPS Navigation'],
    rating: 4.3,
    reviewCount: 320,
    available: 5,
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
    insuranceIncluded: true,
    additionalDriverAllowed: true,
    minimumAge: 21,
    driverRequirements: ['Valid Driver\'s License', 'Credit Card', 'Passport'],
    mileagePolicy: 'Unlimited',
    fuelPolicy: 'Full to Full'
  },
  {
    id: 3,
    type: 'Car',
    subtype: 'SUV',
    company: 'Enterprise',
    model: 'Hyundai Tucson or similar',
    capacity: 5,
    pickupLocation: 'Cairo International Airport',
    dropoffLocation: 'Cairo International Airport',
    pickupDate: '2025-05-15',
    pickupTime: '9:15 AM',
    returnDate: '2025-05-18',
    returnTime: '6:00 PM',
    duration: '3 days',
    price: 65,
    currency: 'USD',
    pricePerDay: true,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070',
    features: ['Air Conditioning', 'Automatic Transmission', 'Bluetooth', 'USB Port', 'GPS Navigation', 'Backup Camera', 'Luggage Space'],
    rating: 4.5,
    reviewCount: 245,
    available: 3,
    cancellationPolicy: 'Free cancellation up to 48 hours before pickup',
    insuranceIncluded: true,
    additionalDriverAllowed: true,
    minimumAge: 23,
    driverRequirements: ['Valid Driver\'s License', 'Credit Card', 'Passport'],
    mileagePolicy: 'Unlimited',
    fuelPolicy: 'Full to Full'
  },
  {
    id: 4,
    type: 'Car',
    subtype: 'Luxury',
    company: 'Sixt',
    model: 'BMW 5 Series or similar',
    capacity: 5,
    pickupLocation: 'Cairo International Airport',
    dropoffLocation: 'Cairo International Airport',
    pickupDate: '2025-05-15',
    pickupTime: '12:00 PM',
    returnDate: '2025-05-18',
    returnTime: '12:00 PM',
    duration: '3 days',
    price: 120,
    currency: 'USD',
    pricePerDay: true,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2064',
    features: ['Air Conditioning', 'Automatic Transmission', 'Leather Seats', 'Bluetooth', 'USB Port', 'GPS Navigation', 'Backup Camera', 'Sunroof', 'Premium Sound System'],
    rating: 4.7,
    reviewCount: 180,
    available: 2,
    cancellationPolicy: 'Free cancellation up to 48 hours before pickup',
    insuranceIncluded: true,
    additionalDriverAllowed: true,
    minimumAge: 25,
    driverRequirements: ['Valid Driver\'s License', 'Credit Card', 'Passport'],
    mileagePolicy: 'Unlimited',
    fuelPolicy: 'Full to Full'
  },
  {
    id: 5,
    type: 'Car',
    subtype: 'Minivan',
    company: 'Budget',
    model: 'Kia Carnival or similar',
    capacity: 7,
    pickupLocation: 'Cairo International Airport',
    dropoffLocation: 'Cairo International Airport',
    pickupDate: '2025-05-15',
    pickupTime: '10:30 AM',
    returnDate: '2025-05-18',
    returnTime: '4:30 PM',
    duration: '3 days',
    price: 80,
    currency: 'USD',
    pricePerDay: true,
    image: 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?q=80&w=2065',
    features: ['Air Conditioning', 'Automatic Transmission', 'Bluetooth', 'USB Port', 'GPS Navigation', 'Backup Camera', 'Luggage Space', 'Sliding Doors'],
    rating: 4.4,
    reviewCount: 210,
    available: 2,
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
    insuranceIncluded: true,
    additionalDriverAllowed: true,
    minimumAge: 23,
    driverRequirements: ['Valid Driver\'s License', 'Credit Card', 'Passport'],
    mileagePolicy: 'Unlimited',
    fuelPolicy: 'Full to Full'
  },
  {
    id: 6,
    type: 'Bus',
    subtype: 'Luxury',
    company: 'Go Bus',
    model: 'Mercedes Travego',
    capacity: 45,
    pickupLocation: 'Cairo Downtown Terminal',
    dropoffLocation: 'Hurghada Bus Station',
    pickupDate: '2025-05-15',
    pickupTime: '8:00 AM',
    duration: '6 hours',
    price: 25,
    currency: 'USD',
    pricePerDay: false,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071',
    features: ['Air Conditioning', 'Reclining Seats', 'Free Wi-Fi', 'Restroom', 'Snacks and Beverages', 'Entertainment System'],
    rating: 4.3,
    reviewCount: 520,
    available: 28,
    cancellationPolicy: 'Free cancellation up to 24 hours before departure',
    insuranceIncluded: true,
    additionalDriverAllowed: false,
    minimumAge: 0,
    driverRequirements: [],
    mileagePolicy: 'N/A',
    fuelPolicy: 'N/A'
  },
  {
    id: 7,
    type: 'Bus',
    subtype: 'Standard',
    company: 'Blue Bus',
    model: 'Mercedes Travego',
    capacity: 45,
    pickupLocation: 'Cairo Downtown Terminal',
    dropoffLocation: 'Alexandria Bus Station',
    pickupDate: '2025-05-15',
    pickupTime: '9:30 AM',
    duration: '3 hours',
    price: 15,
    currency: 'USD',
    pricePerDay: false,
    image: 'https://images.unsplash.com/photo-1564694202883-46e7448c1b26?q=80&w=2080',
    features: ['Air Conditioning', 'Reclining Seats', 'Free Wi-Fi'],
    rating: 4.0,
    reviewCount: 380,
    available: 32,
    cancellationPolicy: 'Free cancellation up to 24 hours before departure',
    insuranceIncluded: true,
    additionalDriverAllowed: false,
    minimumAge: 0,
    driverRequirements: [],
    mileagePolicy: 'N/A',
    fuelPolicy: 'N/A'
  },
  {
    id: 8,
    type: 'Private Transfer',
    subtype: 'Sedan',
    company: 'Cairo Limousine',
    model: 'Mercedes E-Class',
    capacity: 3,
    pickupLocation: 'Cairo International Airport',
    dropoffLocation: 'Downtown Cairo Hotels',
    pickupDate: '2025-05-15',
    pickupTime: '11:00 AM',
    duration: '45 minutes',
    price: 35,
    currency: 'USD',
    pricePerDay: false,
    image: 'https://images.unsplash.com/photo-1631793984613-1bedf4e8a5cd?q=80&w=2071',
    features: ['Air Conditioning', 'Professional Driver', 'Meet & Greet', 'Flight Monitoring', 'Bottled Water'],
    rating: 4.6,
    reviewCount: 320,
    available: 8,
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
    insuranceIncluded: true,
    additionalDriverAllowed: false,
    minimumAge: 0,
    driverRequirements: [],
    mileagePolicy: 'N/A',
    fuelPolicy: 'N/A'
  },
  {
    id: 9,
    type: 'Private Transfer',
    subtype: 'SUV',
    company: 'Cairo Limousine',
    model: 'BMW X5',
    capacity: 5,
    pickupLocation: 'Cairo International Airport',
    dropoffLocation: 'Giza Pyramids Hotels',
    pickupDate: '2025-05-15',
    pickupTime: '1:30 PM',
    duration: '1 hour',
    price: 50,
    currency: 'USD',
    pricePerDay: false,
    image: 'https://images.unsplash.com/photo-1613758235402-745ec602e2b1?q=80&w=2073',
    features: ['Air Conditioning', 'Professional Driver', 'Meet & Greet', 'Flight Monitoring', 'Bottled Water', 'Wi-Fi', 'Child Seats Available'],
    rating: 4.7,
    reviewCount: 280,
    available: 4,
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
    insuranceIncluded: true,
    additionalDriverAllowed: false,
    minimumAge: 0,
    driverRequirements: [],
    mileagePolicy: 'N/A',
    fuelPolicy: 'N/A'
  },
  {
    id: 10,
    type: 'Private Transfer',
    subtype: 'Van',
    company: 'Egypt Transit',
    model: 'Mercedes Vito',
    capacity: 8,
    pickupLocation: 'Cairo International Airport',
    dropoffLocation: 'Alexandria Hotels',
    pickupDate: '2025-05-15',
    pickupTime: '2:45 PM',
    duration: '2.5 hours',
    price: 85,
    currency: 'USD',
    pricePerDay: false,
    image: 'https://images.unsplash.com/photo-1593465678167-7a528eeab30c?q=80&w=2070',
    features: ['Air Conditioning', 'Professional Driver', 'Meet & Greet', 'Flight Monitoring', 'Bottled Water', 'Wi-Fi', 'Luggage Space'],
    rating: 4.5,
    reviewCount: 210,
    available: 3,
    cancellationPolicy: 'Free cancellation up to 48 hours before pickup',
    insuranceIncluded: true,
    additionalDriverAllowed: false,
    minimumAge: 0,
    driverRequirements: [],
    mileagePolicy: 'N/A',
    fuelPolicy: 'N/A'
  },
  {
    id: 11,
    type: 'Shuttle',
    subtype: 'Airport',
    company: 'Cairo Airport Shuttle',
    model: 'Toyota Hiace',
    capacity: 10,
    pickupLocation: 'Cairo International Airport',
    dropoffLocation: 'Major Cairo Hotels',
    pickupDate: '2025-05-15',
    pickupTime: 'Hourly departures',
    duration: '1-1.5 hours',
    price: 12,
    currency: 'USD',
    pricePerDay: false,
    image: 'https://images.unsplash.com/photo-1546706887-a24528987a2a?q=80&w=2070',
    features: ['Air Conditioning', 'Shared Service', 'Multiple Hotel Drop-offs'],
    rating: 3.9,
    reviewCount: 450,
    available: 45,
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
    insuranceIncluded: true,
    additionalDriverAllowed: false,
    minimumAge: 0,
    driverRequirements: [],
    mileagePolicy: 'N/A',
    fuelPolicy: 'N/A'
  },
  {
    id: 12,
    type: 'Limousine',
    subtype: 'Stretch',
    company: 'Cairo Limousine',
    model: 'Lincoln Town Car Stretch',
    capacity: 8,
    pickupLocation: 'Custom Address',
    dropoffLocation: 'Custom Address',
    pickupDate: '2025-05-15',
    pickupTime: '8:00 PM',
    duration: '4 hours',
    price: 200,
    currency: 'USD',
    pricePerDay: false,
    image: 'https://images.unsplash.com/photo-1533559662493-65dd3ab00cc1?q=80&w=2069',
    features: ['Air Conditioning', 'Professional Chauffeur', 'Complimentary Drinks', 'Premium Entertainment System', 'Red Carpet Service', 'VIP Treatment'],
    rating: 4.8,
    reviewCount: 120,
    available: 1,
    cancellationPolicy: 'Free cancellation up to 48 hours before pickup',
    insuranceIncluded: true,
    additionalDriverAllowed: false,
    minimumAge: 0,
    driverRequirements: [],
    mileagePolicy: 'N/A',
    fuelPolicy: 'N/A'
  },
  {
    id: 13,
    type: 'Bus',
    subtype: 'Mini Bus',
    company: 'Egypt Transit',
    model: 'Toyota Coaster',
    capacity: 18,
    pickupLocation: 'Cairo Downtown Terminal',
    dropoffLocation: 'Luxor Bus Station',
    pickupDate: '2025-05-15',
    pickupTime: '10:00 PM',
    duration: '9 hours',
    price: 40,
    currency: 'USD',
    pricePerDay: false,
    image: 'https://images.unsplash.com/photo-1534445967719-8164faa1126a?q=80&w=2033',
    features: ['Air Conditioning', 'Reclining Seats', 'Free Wi-Fi', 'Overnight Travel', 'Bottled Water'],
    rating: 4.2,
    reviewCount: 280,
    available: 12,
    cancellationPolicy: 'Free cancellation up to 24 hours before departure',
    insuranceIncluded: true,
    additionalDriverAllowed: false,
    minimumAge: 0,
    driverRequirements: [],
    mileagePolicy: 'N/A',
    fuelPolicy: 'N/A'
  },
  {
    id: 14,
    type: 'Car',
    subtype: 'Economy',
    company: 'Budget',
    model: 'Chevrolet Aveo or similar',
    capacity: 4,
    pickupLocation: 'Downtown Cairo',
    dropoffLocation: 'Downtown Cairo',
    pickupDate: '2025-05-15',
    pickupTime: '9:00 AM',
    returnDate: '2025-05-18',
    returnTime: '5:00 PM',
    duration: '3 days',
    price: 30,
    currency: 'USD',
    pricePerDay: true,
    image: 'https://images.unsplash.com/photo-1590346125843-907f17c2ce7f?q=80&w=2088',
    features: ['Air Conditioning', 'Manual Transmission', 'Radio', 'Power Windows'],
    rating: 3.9,
    reviewCount: 190,
    available: 8,
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
    insuranceIncluded: true,
    additionalDriverAllowed: false,
    minimumAge: 21,
    driverRequirements: ['Valid Driver\'s License', 'Credit Card', 'Passport'],
    mileagePolicy: 'Unlimited',
    fuelPolicy: 'Full to Full'
  },
  {
    id: 15,
    type: 'Car',
    subtype: 'Compact',
    company: 'Hertz',
    model: 'Kia Rio or similar',
    capacity: 5,
    pickupLocation: 'Cairo International Airport',
    dropoffLocation: 'Alexandria Downtown',
    pickupDate: '2025-05-15',
    pickupTime: '11:00 AM',
    returnDate: '2025-05-18',
    returnTime: '11:00 AM',
    duration: '3 days',
    price: 42,
    currency: 'USD',
    pricePerDay: true,
    image: 'https://images.unsplash.com/photo-1549286614-c4af4aa1d223?q=80&w=2070',
    features: ['Air Conditioning', 'Automatic Transmission', 'Bluetooth', 'USB Port', 'One-way rental'],
    rating: 4.1,
    reviewCount: 210,
    available: 5,
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
    insuranceIncluded: true,
    additionalDriverAllowed: true,
    minimumAge: 21,
    driverRequirements: ['Valid Driver\'s License', 'Credit Card', 'Passport'],
    mileagePolicy: 'Unlimited',
    fuelPolicy: 'Full to Full'
  }
];

export const defaultTransportationFilter: TransportationFilterState = {
  minPrice: 10,
  maxPrice: 250,
  types: [],
  companies: [],
  capacity: [],
  features: []
};

export const filterTransportation = (transportation: Transportation[], filters: TransportationFilterState): Transportation[] => {
  return transportation.filter(item => {
    // Price filter
    if (item.price < filters.minPrice || item.price > filters.maxPrice) {
      return false;
    }
    
    // Types filter
    if (filters.types.length > 0 && !filters.types.includes(item.type)) {
      return false;
    }
    
    // Companies filter
    if (filters.companies.length > 0 && !filters.companies.includes(item.company)) {
      return false;
    }
    
    // Capacity filter
    if (filters.capacity.length > 0) {
      let matchesCapacity = false;
      for (const cap of filters.capacity) {
        if (item.capacity >= cap) {
          matchesCapacity = true;
          break;
        }
      }
      if (!matchesCapacity) {
        return false;
      }
    }
    
    // Features filter
    if (filters.features.length > 0) {
      let hasAllFeatures = true;
      for (const feature of filters.features) {
        if (!item.features.includes(feature)) {
          hasAllFeatures = false;
          break;
        }
      }
      if (!hasAllFeatures) {
        return false;
      }
    }
    
    // Rental duration filter (for cars and similar)
    if (filters.rentalDuration && item.pricePerDay) {
      const startDate = new Date(item.pickupDate);
      const endDate = new Date(item.returnDate || item.pickupDate);
      const actualDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (actualDuration < filters.rentalDuration) {
        return false;
      }
    }
    
    return true;
  });
};

export const searchTransportation = (
  transportation: Transportation[],
  type: string,
  pickupLocation: string,
  dropoffLocation: string,
  pickupDate: string,
  returnDate?: string,
  capacity: number = 1
): Transportation[] => {
  return transportation.filter(item => {
    const typeMatch = type === 'All' || item.type === type;
    const pickupLocationMatch = item.pickupLocation.toLowerCase().includes(pickupLocation.toLowerCase());
    const dropoffLocationMatch = item.dropoffLocation.toLowerCase().includes(dropoffLocation.toLowerCase());
    const pickupDateMatch = item.pickupDate === pickupDate;
    const returnDateMatch = !returnDate || !item.returnDate || item.returnDate === returnDate;
    const capacityMatch = item.capacity >= capacity;
    
    return typeMatch && pickupLocationMatch && dropoffLocationMatch && pickupDateMatch && returnDateMatch && capacityMatch;
  });
};

export const popularFeatures = [
  'Air Conditioning',
  'Automatic Transmission',
  'GPS Navigation',
  'Bluetooth',
  'Free Wi-Fi',
  'USB Port',
  'Professional Driver',
  'Meet & Greet',
  'Luggage Space',
  'Child Seats Available'
];