export interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  departureCity: string;
  departureCountry: string;
  arrivalAirport: string;
  arrivalCity: string;
  arrivalCountry: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
  stopAirport?: string;
  stopCity?: string;
  date: string;
  class: string;
  availableSeats: number;
  amenities: string[];
  airlineImage: string;
}

export interface FlightsFilterState {
  minPrice: number;
  maxPrice: number;
  airlines: string[];
  stops: number[];
  departureTime: string[];
  returnTime?: string[];
  class: string[];
}

export const airlines = [
  { id: 1, name: 'EgyptAir', code: 'MS' },
  { id: 2, name: 'Emirates', code: 'EK' },
  { id: 3, name: 'Lufthansa', code: 'LH' },
  { id: 4, name: 'Turkish Airlines', code: 'TK' },
  { id: 5, name: 'Qatar Airways', code: 'QR' },
  { id: 6, name: 'British Airways', code: 'BA' },
  { id: 7, name: 'Air France', code: 'AF' },
  { id: 8, name: 'KLM', code: 'KL' },
  { id: 9, name: 'Etihad Airways', code: 'EY' },
  { id: 10, name: 'Royal Jordanian', code: 'RJ' }
];

export const airportList = [
  { id: 1, code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt' },
  { id: 2, code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
  { id: 3, code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK' },
  { id: 4, code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
  { id: 5, code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { id: 6, code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { id: 7, code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { id: 8, code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { id: 9, code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
  { id: 10, code: 'AMM', name: 'Queen Alia International Airport', city: 'Amman', country: 'Jordan' },
  { id: 11, code: 'FCO', name: 'Leonardo da Vinci International Airport', city: 'Rome', country: 'Italy' },
  { id: 12, code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain' },
  { id: 13, code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'China' },
  { id: 14, code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  { id: 15, code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
  { id: 16, code: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'UK' },
  { id: 17, code: 'HBE', name: 'Borg El Arab Airport', city: 'Alexandria', country: 'Egypt' }
];

export const flightsData: Flight[] = [
  // Cairo to London Gatwick flight - specifically for April 25, 2025
  {
    id: 300,
    airline: 'EgyptAir',
    flightNumber: 'MS814',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'LGW',
    arrivalCity: 'London',
    arrivalCountry: 'UK',
    departureTime: '8:15 AM',
    arrivalTime: '12:40 PM',
    duration: '5h 25m',
    price: 585,
    currency: 'USD',
    stops: 0,
    date: '2025-04-25',
    class: 'Economy',
    availableSeats: 28,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Egyptair_logo.svg'
  },
  // Alexandria to London Gatwick flight - for testing different airports
  {
    id: 301,
    airline: 'EgyptAir',
    flightNumber: 'MS762',
    departureAirport: 'HBE',
    departureCity: 'Alexandria',
    departureCountry: 'Egypt',
    arrivalAirport: 'LGW',
    arrivalCity: 'London',
    arrivalCountry: 'UK',
    departureTime: '10:45 AM',
    arrivalTime: '3:20 PM',
    duration: '5h 35m',
    price: 625,
    currency: 'USD',
    stops: 0,
    date: '2025-04-25',
    class: 'Economy',
    availableSeats: 22,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Egyptair_logo.svg'
  },
  {
    id: 1,
    airline: 'EgyptAir',
    flightNumber: 'MS777',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'JFK',
    arrivalCity: 'New York',
    arrivalCountry: 'USA',
    departureTime: '10:30 AM',
    arrivalTime: '4:45 PM',
    duration: '14h 15m',
    price: 750,
    currency: 'USD',
    stops: 0,
    date: '2025-05-15',
    class: 'Economy',
    availableSeats: 23,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Egyptair_logo.svg'
  },
  {
    id: 2,
    airline: 'Emirates',
    flightNumber: 'EK927',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'JFK',
    arrivalCity: 'New York',
    arrivalCountry: 'USA',
    departureTime: '1:15 PM',
    arrivalTime: '8:20 PM',
    duration: '13h 05m',
    price: 890,
    currency: 'USD',
    stops: 1,
    stopAirport: 'DXB',
    stopCity: 'Dubai',
    date: '2025-05-15',
    class: 'Economy',
    availableSeats: 12,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging', 'Duty-Free Shopping'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Emirates_logo.svg'
  },
  {
    id: 3,
    airline: 'Lufthansa',
    flightNumber: 'LH583',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'JFK',
    arrivalCity: 'New York',
    arrivalCountry: 'USA',
    departureTime: '3:40 PM',
    arrivalTime: '10:55 PM',
    duration: '13h 15m',
    price: 820,
    currency: 'USD',
    stops: 1,
    stopAirport: 'FRA',
    stopCity: 'Frankfurt',
    date: '2025-05-15',
    class: 'Economy',
    availableSeats: 8,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging', 'Premium Amenity Kit'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Lufthansa_logo.svg'
  },
  {
    id: 4,
    airline: 'Turkish Airlines',
    flightNumber: 'TK864',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'JFK',
    arrivalCity: 'New York',
    arrivalCountry: 'USA',
    departureTime: '5:50 AM',
    arrivalTime: '2:15 PM',
    duration: '14h 25m',
    price: 740,
    currency: 'USD',
    stops: 1,
    stopAirport: 'IST',
    stopCity: 'Istanbul',
    date: '2025-05-15',
    class: 'Economy',
    availableSeats: 15,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging', 'Comfort Kit'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Turkish_Airlines_logo.svg'
  },
  {
    id: 5,
    airline: 'Qatar Airways',
    flightNumber: 'QR812',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'JFK',
    arrivalCity: 'New York',
    arrivalCountry: 'USA',
    departureTime: '7:20 PM',
    arrivalTime: '4:45 AM',
    duration: '15h 25m',
    price: 920,
    currency: 'USD',
    stops: 1,
    stopAirport: 'DOH',
    stopCity: 'Doha',
    date: '2025-05-15',
    class: 'Economy',
    availableSeats: 6,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging', 'Premium Amenity Kit', 'Priority Boarding'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Qatar_Airways_Logo.svg'
  },
  {
    id: 6,
    airline: 'EgyptAir',
    flightNumber: 'MS985',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'LHR',
    arrivalCity: 'London',
    arrivalCountry: 'UK',
    departureTime: '9:15 AM',
    arrivalTime: '1:35 PM',
    duration: '5h 20m',
    price: 580,
    currency: 'USD',
    stops: 0,
    date: '2025-05-16',
    class: 'Economy',
    availableSeats: 32,
    amenities: ['In-flight Entertainment', 'Meal Service', 'USB Charging'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Egyptair_logo.svg'
  },
  {
    id: 7,
    airline: 'British Airways',
    flightNumber: 'BA154',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'LHR',
    arrivalCity: 'London',
    arrivalCountry: 'UK',
    departureTime: '4:20 PM',
    arrivalTime: '8:45 PM',
    duration: '5h 25m',
    price: 620,
    currency: 'USD',
    stops: 0,
    date: '2025-05-16',
    class: 'Economy',
    availableSeats: 18,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging', 'Duty-Free Shopping'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/British_Airways_Speedmarque.svg'
  },
  {
    id: 8,
    airline: 'Air France',
    flightNumber: 'AF566',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'CDG',
    arrivalCity: 'Paris',
    arrivalCountry: 'France',
    departureTime: '2:10 PM',
    arrivalTime: '6:40 PM',
    duration: '5h 30m',
    price: 540,
    currency: 'USD',
    stops: 0,
    date: '2025-05-18',
    class: 'Economy',
    availableSeats: 24,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Air_France_Logo.svg'
  },
  {
    id: 9,
    airline: 'KLM',
    flightNumber: 'KL554',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'AMS',
    arrivalCity: 'Amsterdam',
    arrivalCountry: 'Netherlands',
    departureTime: '3:45 PM',
    arrivalTime: '8:10 PM',
    duration: '5h 25m',
    price: 560,
    currency: 'USD',
    stops: 0,
    date: '2025-05-20',
    class: 'Economy',
    availableSeats: 28,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/KLM_logo.svg'
  },
  {
    id: 10,
    airline: 'Emirates',
    flightNumber: 'EK703',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'DXB',
    arrivalCity: 'Dubai',
    arrivalCountry: 'UAE',
    departureTime: '8:30 AM',
    arrivalTime: '2:00 PM',
    duration: '4h 30m',
    price: 480,
    currency: 'USD',
    stops: 0,
    date: '2025-05-22',
    class: 'Economy',
    availableSeats: 42,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging', 'Duty-Free Shopping'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Emirates_logo.svg'
  },
  {
    id: 11,
    airline: 'Qatar Airways',
    flightNumber: 'QR405',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'DOH',
    arrivalCity: 'Doha',
    arrivalCountry: 'Qatar',
    departureTime: '5:50 PM',
    arrivalTime: '10:35 PM',
    duration: '3h 45m',
    price: 420,
    currency: 'USD',
    stops: 0,
    date: '2025-05-22',
    class: 'Economy',
    availableSeats: 38,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging', 'Premium Amenity Kit'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Qatar_Airways_Logo.svg'
  },
  {
    id: 12,
    airline: 'EgyptAir',
    flightNumber: 'MS503',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'FCO',
    arrivalCity: 'Rome',
    arrivalCountry: 'Italy',
    departureTime: '10:40 AM',
    arrivalTime: '2:30 PM',
    duration: '4h 50m',
    price: 510,
    currency: 'USD',
    stops: 0,
    date: '2025-05-25',
    class: 'Economy',
    availableSeats: 36,
    amenities: ['In-flight Entertainment', 'Meal Service', 'USB Charging'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Egyptair_logo.svg'
  },
  {
    id: 13,
    airline: 'Lufthansa',
    flightNumber: 'LH1585',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'MAD',
    arrivalCity: 'Madrid',
    arrivalCountry: 'Spain',
    departureTime: '7:15 AM',
    arrivalTime: '12:45 PM',
    duration: '6h 30m',
    price: 590,
    currency: 'USD',
    stops: 1,
    stopAirport: 'FRA',
    stopCity: 'Frankfurt',
    date: '2025-05-27',
    class: 'Economy',
    availableSeats: 22,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Lufthansa_logo.svg'
  },
  {
    id: 14,
    airline: 'EgyptAir',
    flightNumber: 'MS871',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'JFK',
    arrivalCity: 'New York',
    arrivalCountry: 'USA',
    departureTime: '11:45 PM',
    arrivalTime: '5:30 AM',
    duration: '13h 45m',
    price: 1150,
    currency: 'USD',
    stops: 0,
    date: '2025-05-15',
    class: 'Business',
    availableSeats: 8,
    amenities: ['Wi-Fi', 'Premium In-flight Entertainment', 'Gourmet Meal Service', 'USB/Power Charging', 'Flatbed Seats', 'Priority Boarding', 'Lounge Access'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Egyptair_logo.svg'
  },
  {
    id: 15,
    airline: 'Emirates',
    flightNumber: 'EK996',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'JFK',
    arrivalCity: 'New York',
    arrivalCountry: 'USA',
    departureTime: '2:20 PM',
    arrivalTime: '9:45 PM',
    duration: '13h 25m',
    price: 1450,
    currency: 'USD',
    stops: 1,
    stopAirport: 'DXB',
    stopCity: 'Dubai',
    date: '2025-05-15',
    class: 'Business',
    availableSeats: 4,
    amenities: ['Wi-Fi', 'Premium In-flight Entertainment', 'Gourmet Meal Service', 'USB/Power Charging', 'Flatbed Seats', 'Priority Boarding', 'Lounge Access', 'Chauffeur Service'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Emirates_logo.svg'
  },
  {
    id: 16,
    airline: 'Qatar Airways',
    flightNumber: 'QR998',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'JFK',
    arrivalCity: 'New York',
    arrivalCountry: 'USA',
    departureTime: '10:15 AM',
    arrivalTime: '8:40 PM',
    duration: '14h 25m',
    price: 1380,
    currency: 'USD',
    stops: 1,
    stopAirport: 'DOH',
    stopCity: 'Doha',
    date: '2025-05-15',
    class: 'Business',
    availableSeats: 6,
    amenities: ['Wi-Fi', 'Premium In-flight Entertainment', 'Gourmet Meal Service', 'USB/Power Charging', 'Flatbed Seats', 'Priority Boarding', 'Lounge Access', 'Premium Amenity Kit'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Qatar_Airways_Logo.svg'
  },
  {
    id: 17,
    airline: 'EgyptAir',
    flightNumber: 'MS649',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'JFK',
    arrivalCity: 'New York',
    arrivalCountry: 'USA',
    departureTime: '6:00 AM',
    arrivalTime: '12:15 PM',
    duration: '14h 15m',
    price: 2350,
    currency: 'USD',
    stops: 0,
    date: '2025-05-15',
    class: 'First',
    availableSeats: 3,
    amenities: ['Wi-Fi', 'Premium In-flight Entertainment', 'Gourmet Meal Service', 'USB/Power Charging', 'Private Suite', 'Priority Boarding', 'Lounge Access', 'Chauffeur Service', 'Concierge Service'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Egyptair_logo.svg'
  }
];

// Add flights from Cairo to Gatwick for April 25, 2025
const cairotoGatwickFlights: Flight[] = [
  {
    id: 18,
    airline: 'EgyptAir',
    flightNumber: 'MS758',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'LGW',
    arrivalCity: 'London',
    arrivalCountry: 'UK',
    departureTime: '8:35 AM',
    arrivalTime: '1:05 PM',
    duration: '5h 30m',
    price: 630,
    currency: 'USD',
    stops: 0,
    date: '2025-04-25',
    class: 'Economy',
    availableSeats: 29,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Egyptair_logo.svg'
  },
  {
    id: 19,
    airline: 'British Airways',
    flightNumber: 'BA784',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'LGW',
    arrivalCity: 'London',
    arrivalCountry: 'UK',
    departureTime: '11:25 AM',
    arrivalTime: '3:50 PM',
    duration: '5h 25m',
    price: 655,
    currency: 'USD',
    stops: 0,
    date: '2025-04-25',
    class: 'Economy',
    availableSeats: 17,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging', 'Duty-Free Shopping'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/British_Airways_Speedmarque.svg'
  },
  {
    id: 20,
    airline: 'Emirates',
    flightNumber: 'EK419',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'LGW',
    arrivalCity: 'London',
    arrivalCountry: 'UK',
    departureTime: '2:15 PM',
    arrivalTime: '8:30 PM',
    duration: '7h 15m',
    price: 690,
    currency: 'USD',
    stops: 1,
    stopAirport: 'DXB',
    stopCity: 'Dubai',
    date: '2025-04-25',
    class: 'Economy',
    availableSeats: 22,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging', 'Duty-Free Shopping'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Emirates_logo.svg'
  },
  {
    id: 21,
    airline: 'Turkish Airlines',
    flightNumber: 'TK589',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'LGW',
    arrivalCity: 'London',
    arrivalCountry: 'UK',
    departureTime: '7:10 AM',
    arrivalTime: '2:40 PM',
    duration: '8h 30m',
    price: 605,
    currency: 'USD',
    stops: 1,
    stopAirport: 'IST',
    stopCity: 'Istanbul',
    date: '2025-04-25',
    class: 'Economy',
    availableSeats: 15,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meal Service', 'USB Charging', 'Comfort Kit'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Turkish_Airlines_logo.svg'
  },
  {
    id: 22,
    airline: 'British Airways',
    flightNumber: 'BA786',
    departureAirport: 'CAI',
    departureCity: 'Cairo',
    departureCountry: 'Egypt',
    arrivalAirport: 'LGW',
    arrivalCity: 'London',
    arrivalCountry: 'UK',
    departureTime: '4:30 PM',
    arrivalTime: '9:00 PM',
    duration: '5h 30m',
    price: 1180,
    currency: 'USD',
    stops: 0,
    date: '2025-04-25',
    class: 'Business',
    availableSeats: 8,
    amenities: ['Wi-Fi', 'Premium In-flight Entertainment', 'Gourmet Meal Service', 'USB/Power Charging', 'Flatbed Seats', 'Priority Boarding', 'Lounge Access'],
    airlineImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/British_Airways_Speedmarque.svg'
  }
];

// Add the new flights to the flight data
flightsData.push(...cairotoGatwickFlights);

export const defaultFlightsFilter: FlightsFilterState = {
  minPrice: 300,
  maxPrice: 2500,
  airlines: [],
  stops: [],
  departureTime: [],
  class: []
};

export const filterFlights = (flights: Flight[], filters: FlightsFilterState): Flight[] => {
  return flights.filter(flight => {
    // Price filter
    if (flight.price < filters.minPrice || flight.price > filters.maxPrice) {
      return false;
    }
    
    // Airlines filter
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
      return false;
    }
    
    // Stops filter
    if (filters.stops.length > 0 && !filters.stops.includes(flight.stops)) {
      return false;
    }
    
    // Departure time filter
    if (filters.departureTime.length > 0) {
      const hour = parseInt(flight.departureTime.split(':')[0]);
      const isPM = flight.departureTime.includes('PM');
      const hour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
      
      let matchesTimeFilter = false;
      for (const timeRange of filters.departureTime) {
        if (timeRange === 'morning' && hour24 >= 6 && hour24 < 12) {
          matchesTimeFilter = true;
          break;
        } else if (timeRange === 'afternoon' && hour24 >= 12 && hour24 < 18) {
          matchesTimeFilter = true;
          break;
        } else if (timeRange === 'evening' && ((hour24 >= 18 && hour24 <= 23) || (hour24 >= 0 && hour24 < 6))) {
          matchesTimeFilter = true;
          break;
        }
      }
      
      if (!matchesTimeFilter) {
        return false;
      }
    }
    
    // Class filter
    if (filters.class.length > 0 && !filters.class.includes(flight.class)) {
      return false;
    }
    
    return true;
  });
};

export const searchFlights = (
  flights: Flight[],
  departureCity: string,
  arrivalCity: string,
  date: string,
  passengers: number = 1,
  flightClass: string = 'Economy'
): Flight[] => {
  return flights.filter(flight => {
    const departureCityMatch = flight.departureCity.toLowerCase().includes(departureCity.toLowerCase());
    const arrivalCityMatch = flight.arrivalCity.toLowerCase().includes(arrivalCity.toLowerCase());
    const dateMatch = flight.date === date;
    const classMatch = flightClass === 'Any' || flight.class === flightClass;
    const hasEnoughSeats = flight.availableSeats >= passengers;
    
    return departureCityMatch && arrivalCityMatch && dateMatch && classMatch && hasEnoughSeats;
  });
};