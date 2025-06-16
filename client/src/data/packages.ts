export interface Package {
  id: number;
  name: string;
  locations: string[];
  mainLocation: string;
  duration: string;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  pricePerPerson: boolean;
  image: string;
  images: string[];
  highlights: string[];
  includes: string[];
  accommodationLevel: string;
  packageDates: {
    date: string;
    availability: string;
    spotsLeft: number;
  }[];
  description: string;
  activities: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    meals: string[];
    accommodation: string;
  }[];
  featured: boolean;
  specialOffer?: {
    discount: number;
    validUntil: string;
  };
  tags: string[];
  minimumPeople: number;
  maximumPeople: number;
  ageRestrictions?: {
    minimum: number;
    maximum?: number;
  };
  difficulty: string;
  cancellationPolicy: string;
}

export interface PackagesFilterState {
  minPrice: number;
  maxPrice: number;
  duration: string[];
  accommodationLevel: string[];
  activities: string[];
  rating: number;
}

export const packageActivities = [
  'Sightseeing',
  'Cultural Tours',
  'Beach Activities',
  'River Cruise',
  'Desert Safari',
  'Historical Tours',
  'Water Sports',
  'Relaxation',
  'Shopping',
  'Food Experiences'
];

export const accommodationLevels = [
  '3-star',
  '4-star',
  '5-star',
  'Luxury',
  'Cruise',
  'Resort',
  'Boutique'
];

export const packageDurations = [
  '1-3 days',
  '4-7 days',
  '8-14 days',
  '15+ days'
];

export const packagesData: Package[] = [
  {
    id: 1,
    name: 'Egypt Pyramids & Nile Cruise',
    locations: ['Cairo', 'Luxor', 'Aswan'],
    mainLocation: 'Cairo, Egypt',
    duration: '8 days, 7 nights',
    rating: 4.8,
    reviewCount: 324,
    price: 60000,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=2069',
    images: [
      'https://images.unsplash.com/photo-1552250575-e508473b090f?q=80&w=2070',
      'https://images.unsplash.com/photo-1626688445657-94ae5c93d5d8?q=80&w=2074',
      'https://images.unsplash.com/photo-1585156509520-b1eb85b10d11?q=80&w=2075'
    ],
    highlights: [
      'Guided tour of the Great Pyramids of Giza',
      'Luxury Nile cruise from Luxor to Aswan',
      'Valley of the Kings exploration',
      'Visit to Abu Simbel temples'
    ],
    includes: ['Flights', 'Accommodation', 'All Meals', 'Transportation', 'Tour Guide', 'Entry Fees'],
    accommodationLevel: '4-star hotels & 5-star cruise',
    packageDates: [
      { date: 'May 15-22, 2025', availability: 'Available', spotsLeft: 12 },
      { date: 'June 10-17, 2025', availability: 'Limited', spotsLeft: 4 },
      { date: 'July 5-12, 2025', availability: 'Available', spotsLeft: 16 }
    ],
    description: 'Experience the best of Egypt with this comprehensive package covering Cairo\'s famous pyramids and a luxury cruise along the Nile River.',
    activities: ['Sightseeing', 'Cultural Tours', 'River Cruise', 'Historical Tours'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Cairo',
        description: 'Arrive at Cairo International Airport. Meet and greet by our representative who will assist you with the airport formalities. Transfer to your hotel in Cairo. Rest of the day at leisure. Overnight in Cairo.',
        meals: ['Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 2,
        title: 'Pyramids & Sphinx Tour',
        description: 'After breakfast, start a full-day tour visiting the Great Pyramids of Giza and the Sphinx. Continue to the Egyptian Museum to see the treasures of King Tutankhamun. Optional evening sound and light show at the pyramids (extra cost). Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 3,
        title: 'Cairo to Luxor',
        description: 'Morning flight to Luxor. Transfer to your Nile cruise ship for embarkation. After lunch onboard, visit the magnificent Karnak and Luxor Temples. Dinner and overnight aboard the cruise in Luxor.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star cruise'
      },
      {
        day: 4,
        title: 'Luxor West Bank',
        description: 'Morning visit to the West Bank of Luxor including the Valley of the Kings, Temple of Queen Hatshepsut, and the Colossi of Memnon. Afternoon sailing to Edfu via Esna Lock. Dinner and overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star cruise'
      },
      {
        day: 5,
        title: 'Edfu & Kom Ombo',
        description: 'Visit the Temple of Horus in Edfu, then continue sailing to Kom Ombo. Visit the unique double temple dedicated to both Sobek and Horus. Sail to Aswan. Dinner and overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star cruise'
      },
      {
        day: 6,
        title: 'Aswan & Abu Simbel',
        description: 'Early morning optional excursion to Abu Simbel temples (included in package). Return to Aswan and visit the High Dam, the Unfinished Obelisk, and the Temple of Philae. Evening at leisure. Dinner and overnight aboard the cruise in Aswan.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star cruise'
      },
      {
        day: 7,
        title: 'Aswan to Cairo',
        description: 'Disembarkation after breakfast. Transfer to Aswan airport for your flight back to Cairo. Arrival and transfer to your hotel. Free afternoon for shopping or optional activities. Overnight in Cairo.',
        meals: ['Breakfast'],
        accommodation: '4-star hotel'
      },
      {
        day: 8,
        title: 'Departure',
        description: 'After breakfast, transfer to Cairo International Airport for final departure.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: true,
    specialOffer: {
      discount: 15,
      validUntil: '2025-06-30'
    },
    tags: ['Pyramids', 'Nile Cruise', 'Luxor', 'Aswan', 'Cairo'],
    minimumPeople: 2,
    maximumPeople: 20,
    ageRestrictions: {
      minimum: 8
    },
    difficulty: 'Easy',
    cancellationPolicy: 'Free cancellation up to 30 days before departure. 50% charge within 30-15 days. No refund within 14 days.'
  },
  {
    id: 2,
    name: 'Cairo & Red Sea Adventure',
    locations: ['Cairo', 'Hurghada'],
    mainLocation: 'Cairo & Hurghada, Egypt',
    duration: '7 days, 6 nights',
    rating: 4.6,
    reviewCount: 187,
    price: 47500,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1581335167266-5662e1958b2f?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1599584721530-ec447bf2bf01?q=80&w=2070',
      'https://images.unsplash.com/photo-1611811146928-0a1f6c1576ae?q=80&w=2069',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070'
    ],
    highlights: [
      'Cairo city tour and pyramids visit',
      'Red Sea resort stay in Hurghada',
      'Snorkeling and diving excursions',
      'Desert safari adventure'
    ],
    includes: ['Flights', 'Accommodation', 'Some Meals', 'Transportation', 'Some Activities'],
    accommodationLevel: '4-star hotels',
    packageDates: [
      { date: 'May 18-24, 2025', availability: 'Available', spotsLeft: 10 },
      { date: 'June 15-21, 2025', availability: 'Limited', spotsLeft: 3 },
      { date: 'July 10-16, 2025', availability: 'Available', spotsLeft: 14 }
    ],
    description: 'Combine history and relaxation with this perfect blend of Cairo sightseeing and Red Sea beach resort stay in Hurghada.',
    activities: ['Sightseeing', 'Beach Activities', 'Water Sports', 'Desert Safari'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Cairo',
        description: 'Arrive at Cairo International Airport where you\'ll be met by our representative. Transfer to your hotel for check-in. Evening at leisure. Overnight in Cairo.',
        meals: ['None'],
        accommodation: '4-star hotel'
      },
      {
        day: 2,
        title: 'Pyramids & Egyptian Museum',
        description: 'Full-day tour visiting the Great Pyramids of Giza, the Sphinx, and the Egyptian Museum. Optional evening activities available. Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 3,
        title: 'Cairo to Hurghada',
        description: 'After breakfast, transfer to Cairo Airport for your flight to Hurghada. Upon arrival, transfer to your beach resort. Afternoon at leisure to enjoy the beach and resort facilities. Overnight in Hurghada.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star resort'
      },
      {
        day: 4,
        title: 'Snorkeling Excursion',
        description: 'Enjoy a full-day snorkeling trip to explore the vibrant coral reefs of the Red Sea. The boat will stop at 2-3 different snorkeling sites. Lunch served onboard. Return to your resort in the late afternoon. Overnight in Hurghada.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '4-star resort'
      },
      {
        day: 5,
        title: 'Desert Safari Adventure',
        description: 'Morning desert safari by quad bike or jeep. Visit a Bedouin village and enjoy traditional tea. Return to the resort for a free afternoon to relax on the beach. Optional activities available. Overnight in Hurghada.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star resort'
      },
      {
        day: 6,
        title: 'Leisure Day in Hurghada',
        description: 'Free day to enjoy the resort facilities, beach activities, or optional excursions (such as diving, fishing, or city tour). Overnight in Hurghada.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star resort'
      },
      {
        day: 7,
        title: 'Departure',
        description: 'After breakfast, transfer to Hurghada Airport for your departure flight.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: true,
    tags: ['Cairo', 'Red Sea', 'Beach', 'Pyramids', 'Snorkeling'],
    minimumPeople: 1,
    maximumPeople: 20,
    ageRestrictions: {
      minimum: 6
    },
    difficulty: 'Easy',
    cancellationPolicy: 'Free cancellation up to 30 days before departure. 50% charge within 30-15 days. No refund within 14 days.'
  },
  {
    id: 3,
    name: 'Egypt Full Experience',
    locations: ['Cairo', 'Alexandria', 'Luxor', 'Aswan', 'Hurghada'],
    mainLocation: 'Multiple Cities, Egypt',
    duration: '14 days, 13 nights',
    rating: 4.9,
    reviewCount: 156,
    price: 105000,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1552250575-e508473b090f?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1579709251698-98b5a9a8274a?q=80&w=2070',
      'https://images.unsplash.com/photo-1610633389918-c85e5c1d9fcf?q=80&w=2070',
      'https://images.unsplash.com/photo-1536384701454-006d49ca2e8e?q=80&w=2071'
    ],
    highlights: [
      'Comprehensive Egypt tour covering 5 major destinations',
      'Pyramids of Giza and Cairo Museum',
      'Alexandria Library and Qaitbay Citadel',
      'Luxury Nile cruise with all temples',
      'Red Sea resort relaxation'
    ],
    includes: ['Flights', 'Accommodation', 'All Meals', 'Transportation', 'Tour Guide', 'Entry Fees', 'Activities'],
    accommodationLevel: '5-star hotels & cruise',
    packageDates: [
      { date: 'May 20-June 2, 2025', availability: 'Limited', spotsLeft: 5 },
      { date: 'June 18-July 1, 2025', availability: 'Available', spotsLeft: 8 },
      { date: 'July 15-28, 2025', availability: 'Available', spotsLeft: 10 }
    ],
    description: 'The ultimate Egypt experience covering all major sites and experiences from historic Cairo to relaxing beaches of the Red Sea.',
    activities: ['Sightseeing', 'Cultural Tours', 'River Cruise', 'Beach Activities', 'Desert Safari', 'Historical Tours'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Cairo',
        description: 'Welcome to Egypt! Arrive at Cairo International Airport where you\'ll be met by our representative who will assist with airport formalities. Transfer to your luxury hotel in Cairo. Rest of the day at leisure. Overnight in Cairo.',
        meals: ['Dinner'],
        accommodation: '5-star hotel'
      },
      {
        day: 2,
        title: 'Pyramids & Sphinx',
        description: 'Full-day tour visiting the iconic Pyramids of Giza, the enigmatic Sphinx, and the Valley Temple. Afternoon visit to Memphis, the ancient capital of Egypt, and Saqqara to see the Step Pyramid. Evening at leisure with optional sound and light show. Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '5-star hotel'
      },
      {
        day: 3,
        title: 'Cairo Museum & Islamic Cairo',
        description: 'Morning visit to the Egyptian Museum with its treasures of Tutankhamun. Afternoon exploration of Islamic Cairo including the Citadel of Saladin, Mohammed Ali Alabaster Mosque, and Khan el-Khalili bazaar. Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '5-star hotel'
      },
      {
        day: 4,
        title: 'Cairo to Alexandria',
        description: 'Drive to Alexandria after breakfast (approximately 3 hours). Lunch at a seafood restaurant on the Mediterranean. Afternoon tour including the Catacombs of Kom el-Shoqafa, Pompey\'s Pillar, and the Roman Amphitheater. Overnight in Alexandria.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '5-star hotel'
      },
      {
        day: 5,
        title: 'Alexandria Highlights',
        description: 'Full day in Alexandria visiting the modern Bibliotheca Alexandrina, the Citadel of Qaitbay, and the Montazah Palace Gardens. Enjoy a walk along the famous Corniche. Overnight in Alexandria.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '5-star hotel'
      },
      {
        day: 6,
        title: 'Alexandria to Cairo to Luxor',
        description: 'Return to Cairo in the morning. Afternoon flight to Luxor. Transfer to your 5-star Nile cruise ship. Evening visit to Luxor Temple. Dinner and overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star cruise'
      },
      {
        day: 7,
        title: 'Luxor West Bank',
        description: 'Morning visit to the West Bank of Luxor including the Valley of the Kings, Temple of Queen Hatshepsut, and the Colossi of Memnon. Afternoon visit to Karnak Temple. Dinner and overnight aboard the cruise in Luxor.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star cruise'
      },
      {
        day: 8,
        title: 'Edfu & Kom Ombo',
        description: 'Sail to Edfu and visit the Temple of Horus. Continue sailing to Kom Ombo and visit the unique double temple dedicated to Sobek and Horus. Dinner and overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star cruise'
      },
      {
        day: 9,
        title: 'Aswan Highlights',
        description: 'Visit the High Dam, the Unfinished Obelisk, and the Temple of Philae. Afternoon felucca ride around Elephantine Island and the Botanical Gardens. Dinner and overnight aboard the cruise in Aswan.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star cruise'
      },
      {
        day: 10,
        title: 'Abu Simbel Excursion',
        description: 'Early morning excursion to Abu Simbel temples. Return to Aswan. Late afternoon flight to Cairo, then connect to Hurghada. Transfer to your beach resort. Overnight in Hurghada.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '5-star resort'
      },
      {
        day: 11,
        title: 'Red Sea Relaxation',
        description: 'Free day to enjoy the beach and resort facilities. Optional activities available including snorkeling, diving, or spa treatments. Overnight in Hurghada.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star resort'
      },
      {
        day: 12,
        title: 'Snorkeling Trip',
        description: 'Full-day boat trip to the best snorkeling spots in the Red Sea. Explore vibrant coral reefs and see colorful marine life. Lunch served onboard. Return to the resort for dinner. Overnight in Hurghada.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star resort'
      },
      {
        day: 13,
        title: 'Desert Safari',
        description: 'Morning desert safari by jeep or quad bike. Visit a Bedouin village and enjoy traditional tea and bread. Return to the resort for a free afternoon. Farewell dinner at the resort. Overnight in Hurghada.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star resort'
      },
      {
        day: 14,
        title: 'Departure',
        description: 'After breakfast, transfer to Hurghada Airport for your departure flight.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: true,
    specialOffer: {
      discount: 10,
      validUntil: '2025-07-31'
    },
    tags: ['Comprehensive', 'Nile Cruise', 'Alexandria', 'Red Sea', 'Luxury'],
    minimumPeople: 2,
    maximumPeople: 20,
    ageRestrictions: {
      minimum: 10
    },
    difficulty: 'Easy to Moderate',
    cancellationPolicy: 'Free cancellation up to 45 days before departure. 50% charge within 45-30 days. No refund within 30 days.'
  },
  {
    id: 4,
    name: 'Egyptian Family Adventure',
    locations: ['Cairo', 'Luxor', 'Aswan', 'Hurghada'],
    mainLocation: 'Multiple Cities, Egypt',
    duration: '10 days, 9 nights',
    rating: 4.7,
    reviewCount: 132,
    price: 70000,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1577739575256-bf98d3c38041?q=80&w=2070',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070'
    ],
    highlights: [
      'Family-friendly activities at all destinations',
      'Interactive museum tours for children',
      'Camel rides at the pyramids',
      'Nile cruise with entertainment',
      'Beach and water activities in Hurghada'
    ],
    includes: ['Flights', 'Family-friendly Accommodation', 'Most Meals', 'Transportation', 'Family Guide', 'Activities', 'Entry Fees'],
    accommodationLevel: '4-star family hotels & cruise',
    packageDates: [
      { date: 'May 25-June 3, 2025', availability: 'Available', spotsLeft: 6 },
      { date: 'June 22-July 1, 2025', availability: 'Limited', spotsLeft: 4 },
      { date: 'July 20-29, 2025', availability: 'Available', spotsLeft: 8 }
    ],
    description: 'A perfect family vacation combining education and fun with child-friendly tours, activities, and plenty of swimming opportunities.',
    activities: ['Sightseeing', 'Family Activities', 'River Cruise', 'Beach Activities', 'Educational Tours'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Cairo',
        description: 'Arrive in Cairo where you\'ll be met by our family-friendly guide. Transfer to your hotel with welcome gift bags for children. Overnight in Cairo.',
        meals: ['Dinner'],
        accommodation: '4-star family hotel'
      },
      {
        day: 2,
        title: 'Pyramids Adventure',
        description: 'Visit the Pyramids of Giza with a special interactive tour designed for families. Enjoy camel rides (optional) and a specially designed scavenger hunt for children. Afternoon visit to the Egyptian Museum with a child-oriented guided tour focusing on mummies and King Tut\'s treasures. Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star family hotel'
      },
      {
        day: 3,
        title: 'Cairo to Luxor',
        description: 'Morning flight to Luxor. Transfer to your family-friendly Nile cruise ship. Afternoon visit to Karnak Temple with a special "temple detective" activity for kids. Evening entertainment onboard. Overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '4-star family cruise'
      },
      {
        day: 4,
        title: 'Valley of the Kings',
        description: 'Morning visit to the Valley of the Kings with child-friendly explanations of ancient Egyptian beliefs and customs. Visit the Temple of Hatshepsut. Afternoon sailing to Edfu with family activities onboard. Overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '4-star family cruise'
      },
      {
        day: 5,
        title: 'Edfu & Kom Ombo',
        description: 'Morning visit to Edfu Temple with a special "chariot and falcon" story for children. Sail to Kom Ombo for a visit to the Crocodile Temple with tales of Sobek. Evening Nubian-themed party onboard. Overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '4-star family cruise'
      },
      {
        day: 6,
        title: 'Aswan',
        description: 'Visit the High Dam and take a boat ride to Philae Temple. Afternoon visit to a Nubian village with henna painting for kids and traditional music. Evening free time. Overnight aboard the cruise in Aswan.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '4-star family cruise'
      },
      {
        day: 7,
        title: 'Aswan to Hurghada',
        description: 'Disembark from the cruise. Morning flight to Hurghada. Transfer to your family-friendly beach resort. Afternoon at leisure to enjoy the beach and pool facilities. Overnight in Hurghada.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star family resort'
      },
      {
        day: 8,
        title: 'Red Sea Adventure',
        description: 'Family snorkeling trip suitable for beginners. Special guide for children to teach them about marine life. Afternoon at leisure for beach activities. Evening mini-disco for kids. Overnight in Hurghada.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '4-star family resort'
      },
      {
        day: 9,
        title: 'Desert Safari',
        description: 'Morning family-friendly desert safari by jeep. Visit a Bedouin camp with camel rides for kids, traditional tea, and bread making. Free afternoon at the resort. Farewell dinner. Overnight in Hurghada.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '4-star family resort'
      },
      {
        day: 10,
        title: 'Departure',
        description: 'After breakfast, transfer to Hurghada Airport for your departure flight.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: false,
    tags: ['Family', 'Kid-Friendly', 'Educational', 'Beach', 'Activities'],
    minimumPeople: 2,
    maximumPeople: 20,
    ageRestrictions: {
      minimum: 5
    },
    difficulty: 'Easy',
    cancellationPolicy: 'Free cancellation up to 30 days before departure. 50% charge within 30-15 days. No refund within 14 days.'
  },
  {
    id: 5,
    name: 'Luxury Egypt Escape',
    locations: ['Cairo', 'Luxor', 'Aswan'],
    mainLocation: 'Cairo, Egypt',
    duration: '9 days, 8 nights',
    rating: 4.9,
    reviewCount: 98,
    price: 175000,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2064',
      'https://images.unsplash.com/photo-1631793984613-1bedf4e8a5cd?q=80&w=2071',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2080'
    ],
    highlights: [
      'Private tours with expert Egyptologists',
      'Luxury accommodations throughout',
      'VIP airport services',
      'Gourmet dining experiences',
      'Exclusive access to sites normally closed to the public'
    ],
    includes: ['Business Class Flights', 'Luxury Accommodation', 'All Meals', 'Private Transportation', 'Private Guide', 'VIP Entry', 'Exclusive Experiences'],
    accommodationLevel: '5-star luxury hotels & Nile cruise',
    packageDates: [
      { date: 'May 10-18, 2025', availability: 'Limited', spotsLeft: 3 },
      { date: 'June 5-13, 2025', availability: 'Available', spotsLeft: 6 },
      { date: 'July 1-9, 2025', availability: 'Available', spotsLeft: 6 }
    ],
    description: 'Experience Egypt at its finest with this exclusive luxury package featuring VIP access, private guides, and the finest accommodations.',
    activities: ['Private Tours', 'Gourmet Dining', 'River Cruise', 'Cultural Experiences', 'Exclusive Access'],
    itinerary: [
      {
        day: 1,
        title: 'VIP Arrival in Cairo',
        description: 'Arrive at Cairo International Airport where you\'ll be met by a VIP representative who will assist with fast-track immigration and customs. Private luxury transfer to your 5-star luxury hotel. Welcome dinner at a fine-dining restaurant overlooking the Nile. Overnight in Cairo.',
        meals: ['Dinner'],
        accommodation: '5-star luxury hotel'
      },
      {
        day: 2,
        title: 'Private Pyramids Experience',
        description: 'Private morning tour of the Pyramids of Giza with an expert Egyptologist. Special access to the paws of the Sphinx (not open to general public). Private lunch at the historic Mena House. Afternoon private tour of the Egyptian Museum with early access to the Royal Mummy Room. Evening at leisure. Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '5-star luxury hotel'
      },
      {
        day: 3,
        title: 'Old Cairo & Luxury Dining',
        description: 'Morning private tour of Old Cairo, including the Citadel, Alabaster Mosque, and Coptic Cairo. Private lunch at an exclusive club. Afternoon at leisure or optional private shopping tour with a personal shopper. Evening gourmet dinner cruise on the Nile. Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star luxury hotel'
      },
      {
        day: 4,
        title: 'Cairo to Luxor',
        description: 'Private transfer to Cairo Airport for your flight to Luxor. VIP meet and assist service. Transfer to your luxury Nile cruise vessel. Private afternoon tour of Luxor Temple. Welcome cocktail reception followed by gourmet dinner onboard. Overnight aboard the luxury cruise in Luxor.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star luxury cruise'
      },
      {
        day: 5,
        title: 'Luxor\'s West Bank',
        description: 'Private early morning visit to the Valley of the Kings before it opens to the public. Special access to tombs not open to general visitors. Visit the Temple of Hatshepsut and the Colossi of Memnon. Private lunch onboard. Afternoon visit to Karnak Temple with special access to the sacred lake area. Gourmet dinner and entertainment onboard. Overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star luxury cruise'
      },
      {
        day: 6,
        title: 'Edfu & Kom Ombo',
        description: 'Private morning visit to the Temple of Horus in Edfu. Sail to Kom Ombo while enjoying a gourmet lunch onboard. Private afternoon visit to the Temple of Kom Ombo. Special Egyptian-themed dinner and entertainment. Overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star luxury cruise'
      },
      {
        day: 7,
        title: 'Aswan Exploration',
        description: 'Private tour of Aswan including the High Dam, the Unfinished Obelisk, and the Temple of Philae. Private lunch at the historic Old Cataract Hotel. Afternoon felucca ride around Elephantine Island with champagne service. Special farewell dinner onboard. Overnight aboard the cruise in Aswan.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star luxury cruise'
      },
      {
        day: 8,
        title: 'Abu Simbel & Return to Cairo',
        description: 'Private early morning flight to Abu Simbel. Exclusive tour of the temples before the crowds arrive. Return to Aswan for your flight to Cairo. Private transfer to your luxury hotel. Afternoon at leisure. Special farewell dinner at a renowned restaurant. Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star luxury hotel'
      },
      {
        day: 9,
        title: 'VIP Departure',
        description: 'After breakfast, private transfer to Cairo International Airport with VIP departure assistance.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: false,
    specialOffer: {
      discount: 5,
      validUntil: '2025-06-30'
    },
    tags: ['Luxury', 'Exclusive', 'VIP', 'Gourmet', 'Private Tours'],
    minimumPeople: 2,
    maximumPeople: 10,
    ageRestrictions: {
      minimum: 12
    },
    difficulty: 'Easy',
    cancellationPolicy: 'Free cancellation up to 45 days before departure. 50% charge within 45-30 days. No refund within 30 days.'
  },
  {
    id: 6,
    name: 'Jordan & Egypt Discovered',
    locations: ['Amman', 'Petra', 'Wadi Rum', 'Cairo', 'Luxor', 'Aswan'],
    mainLocation: 'Amman, Jordan & Cairo, Egypt',
    duration: '12 days, 11 nights',
    rating: 4.8,
    reviewCount: 142,
    price: 110000,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1579709251698-98b5a9a8274a?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=2071',
      'https://images.unsplash.com/photo-1548781279-5c4a94526d30?q=80&w=2080',
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=2070'
    ],
    highlights: [
      'Visit two incredible countries in one journey',
      'Explore the ancient city of Petra',
      'Camp in the desert landscapes of Wadi Rum',
      'See the Great Pyramids of Giza',
      'Cruise the Nile River'
    ],
    includes: ['International & Domestic Flights', 'Accommodation', 'Most Meals', 'Transportation', 'Guide', 'Entry Fees'],
    accommodationLevel: '4-star hotels, desert camp & Nile cruise',
    packageDates: [
      { date: 'May 5-16, 2025', availability: 'Available', spotsLeft: 10 },
      { date: 'June 2-13, 2025', availability: 'Limited', spotsLeft: 4 },
      { date: 'July 7-18, 2025', availability: 'Available', spotsLeft: 12 }
    ],
    description: 'A spectacular journey through two ancient lands, combining the wonders of Jordan with the treasures of Egypt.',
    activities: ['Sightseeing', 'Desert Experience', 'River Cruise', 'Historical Tours', 'Cultural Experiences'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Amman',
        description: 'Arrive at Queen Alia International Airport in Amman, Jordan. Meet and greet by our representative. Transfer to your hotel in Amman. Welcome dinner at a local restaurant. Overnight in Amman.',
        meals: ['Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 2,
        title: 'Amman & Jerash',
        description: 'Morning city tour of Amman including the Citadel and Roman Theater. Afternoon excursion to Jerash, one of the best-preserved Roman provincial cities. Return to Amman for dinner. Overnight in Amman.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 3,
        title: 'Madaba & Mount Nebo to Petra',
        description: 'Drive to Madaba to see the famous Byzantine mosaic map. Continue to Mount Nebo, where Moses viewed the Promised Land. Proceed along the King\'s Highway to Petra. Evening free to rest or explore. Overnight in Petra.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 4,
        title: 'Petra Exploration',
        description: 'Full day exploring the rose-red city of Petra, one of the New Seven Wonders of the World. Walk through the Siq to the Treasury, then explore the Royal Tombs, the Theater, and other monuments. Optional Petra by Night experience (extra cost). Overnight in Petra.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 5,
        title: 'Wadi Rum Desert Experience',
        description: 'Morning drive to Wadi Rum, the stunning desert landscape made famous by Lawrence of Arabia. Enjoy a 4x4 jeep tour through the desert to see rock formations and ancient inscriptions. Sunset camel ride. Dinner and overnight at a Bedouin-style desert camp.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Desert camp'
      },
      {
        day: 6,
        title: 'Jordan to Egypt',
        description: 'Transfer to Amman Airport for your flight to Cairo. Arrive in Cairo where you\'ll be met by our Egyptian representative. Transfer to your hotel. Evening at leisure. Overnight in Cairo.',
        meals: ['Breakfast'],
        accommodation: '4-star hotel'
      },
      {
        day: 7,
        title: 'Pyramids & Cairo Treasures',
        description: 'Full-day tour visiting the Great Pyramids of Giza, the Sphinx, and the Egyptian Museum. Evening sound and light show at the pyramids (included). Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 8,
        title: 'Cairo to Luxor',
        description: 'Morning flight to Luxor. Transfer to your Nile cruise ship. Afternoon visit to the Temple of Karnak and Luxor Temple. Dinner and overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star cruise'
      },
      {
        day: 9,
        title: 'Luxor West Bank',
        description: 'Visit the West Bank of Luxor including the Valley of the Kings, Temple of Hatshepsut, and the Colossi of Memnon. Afternoon sailing to Edfu. Dinner and overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star cruise'
      },
      {
        day: 10,
        title: 'Edfu & Kom Ombo',
        description: 'Visit the Temple of Horus in Edfu. Continue sailing to Kom Ombo and visit the unique double temple. Sail to Aswan. Dinner and overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star cruise'
      },
      {
        day: 11,
        title: 'Aswan to Cairo',
        description: 'Visit the High Dam, the Unfinished Obelisk, and the Temple of Philae. Optional excursion to Abu Simbel (extra cost). Afternoon flight back to Cairo. Farewell dinner at a local restaurant. Overnight in Cairo.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 12,
        title: 'Departure',
        description: 'After breakfast, transfer to Cairo International Airport for your departure flight.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: false,
    tags: ['Jordan', 'Egypt', 'Petra', 'Wadi Rum', 'Nile Cruise'],
    minimumPeople: 4,
    maximumPeople: 20,
    ageRestrictions: {
      minimum: 10
    },
    difficulty: 'Moderate',
    cancellationPolicy: 'Free cancellation up to 45 days before departure. 50% charge within 45-30 days. No refund within 30 days.'
  },
  {
    id: 7,
    name: 'Cairo Stopover Package',
    locations: ['Cairo'],
    mainLocation: 'Cairo, Egypt',
    duration: '3 days, 2 nights',
    rating: 4.6,
    reviewCount: 215,
    price: 17500,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1579709251698-98b5a9a8274a?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=2069',
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2070',
      'https://images.unsplash.com/photo-1572443490709-e57455e46f16?q=80&w=2070'
    ],
    highlights: [
      'Perfect for short layovers in Cairo',
      'Visit the Pyramids and Sphinx',
      'Explore the Egyptian Museum',
      'Flexible scheduling around your flights',
      'Convenient airport transfers'
    ],
    includes: ['Airport Transfers', 'Accommodation', 'Breakfast', 'Guided Tours', 'Entry Fees'],
    accommodationLevel: '4-star hotel',
    packageDates: [
      { date: 'Daily departures', availability: 'Available', spotsLeft: 20 }
    ],
    description: 'Make the most of your layover in Cairo with this compact but comprehensive tour of Egypt\'s capital and its most famous monuments.',
    activities: ['Sightseeing', 'Historical Tours', 'Museum Visits'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Cairo',
        description: 'Meet and greet at Cairo International Airport. Transfer to your hotel in Cairo. Depending on arrival time, optional evening activities can be arranged. Overnight in Cairo.',
        meals: ['None'],
        accommodation: '4-star hotel'
      },
      {
        day: 2,
        title: 'Pyramids & Egyptian Museum',
        description: 'Full-day tour visiting the Great Pyramids of Giza, the Sphinx, and the Egyptian Museum housing the treasures of Tutankhamun. Optional sound and light show at the pyramids in the evening (extra cost). Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 3,
        title: 'Departure',
        description: 'After breakfast, transfer to Cairo International Airport for your departure flight. For guests with late departures, optional tours can be arranged (extra cost).',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: false,
    tags: ['Short Break', 'Layover', 'Cairo', 'Pyramids', 'Flexible'],
    minimumPeople: 1,
    maximumPeople: 10,
    ageRestrictions: {
      minimum: 0
    },
    difficulty: 'Easy',
    cancellationPolicy: 'Free cancellation up to 7 days before arrival. 50% charge within 7-3 days. No refund within 72 hours.'
  },
  {
    id: 8,
    name: 'Nile & Lake Nasser Cruise',
    locations: ['Luxor', 'Aswan', 'Abu Simbel'],
    mainLocation: 'Luxor to Abu Simbel, Egypt',
    duration: '11 days, 10 nights',
    rating: 4.8,
    reviewCount: 96,
    price: 97500,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1538075254171-0b3c9bd4db43?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=2070',
      'https://images.unsplash.com/photo-1562790351-d273a961e0e9?q=80&w=2065',
      'https://images.unsplash.com/photo-1585156509520-b1eb85b10d11?q=80&w=2075'
    ],
    highlights: [
      'Extended Nile cruise from Luxor to Aswan',
      'Lake Nasser cruise to Abu Simbel',
      'Visit all major temples along both waterways',
      'Explore rarely visited sites on Lake Nasser',
      'Spectacular sunset view of Abu Simbel'
    ],
    includes: ['Domestic Flights', 'All Cruise Accommodation', 'All Meals', 'Guided Excursions', 'Entry Fees', 'Airport Transfers'],
    accommodationLevel: '5-star cruise ships',
    packageDates: [
      { date: 'May 1-11, 2025', availability: 'Available', spotsLeft: 8 },
      { date: 'June 5-15, 2025', availability: 'Limited', spotsLeft: 4 },
      { date: 'July 10-20, 2025', availability: 'Available', spotsLeft: 10 }
    ],
    description: 'The ultimate Egyptian cruise experience combining a classic Nile cruise with the less-traveled but equally spectacular Lake Nasser cruise.',
    activities: ['River Cruise', 'Temple Visits', 'Archaeological Sites', 'Sundeck Relaxation', 'Cultural Performances'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Luxor',
        description: 'Arrive at Luxor Airport. Meet and greet by our representative. Transfer to your Nile cruise ship for embarkation. Lunch onboard. Afternoon at leisure to explore the ship. Welcome cocktail reception. Dinner and overnight aboard the cruise in Luxor.',
        meals: ['Lunch', 'Dinner'],
        accommodation: '5-star Nile cruise'
      },
      {
        day: 2,
        title: 'Luxor West Bank',
        description: 'Morning visit to the West Bank of Luxor including the Valley of the Kings, Temple of Queen Hatshepsut, and the Colossi of Memnon. Afternoon visit to Karnak and Luxor Temples. Evening entertainment onboard. Overnight in Luxor.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Nile cruise'
      },
      {
        day: 3,
        title: 'Luxor to Edfu',
        description: 'Morning sailing to Edfu via Esna Lock. Lunch onboard. Afternoon at leisure enjoying the Nile scenery. Evening entertainment. Overnight in Edfu.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Nile cruise'
      },
      {
        day: 4,
        title: 'Edfu & Kom Ombo',
        description: 'Morning visit to the Temple of Horus in Edfu. Sail to Kom Ombo for a visit to the unique double temple dedicated to Sobek and Horus. Continue sailing to Aswan. Overnight in Aswan.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Nile cruise'
      },
      {
        day: 5,
        title: 'Aswan Exploration',
        description: 'Visit the High Dam, the Unfinished Obelisk, and the Temple of Philae. Afternoon felucca ride around Elephantine Island. Optional Sound and Light Show at Philae Temple (extra cost). Overnight in Aswan.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Nile cruise'
      },
      {
        day: 6,
        title: 'Nile Cruise to Lake Nasser',
        description: 'Final day on your Nile cruise ship. Morning at leisure in Aswan. After lunch, disembark and transfer to your Lake Nasser cruise ship. Welcome reception and briefing. Dinner and overnight aboard your Lake Nasser cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Lake Nasser cruise'
      },
      {
        day: 7,
        title: 'Sail to Wadi El Seboua',
        description: 'Begin sailing on Lake Nasser. Morning visit to the Temple of Kalabsha, the Temple of Beit el-Wali, and the Kiosk of Kertassi. Continue sailing to Wadi El Seboua. Dinner and overnight onboard.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Lake Nasser cruise'
      },
      {
        day: 8,
        title: 'Wadi El Seboua to Amada',
        description: 'Visit the Temple of Wadi El Seboua, the Temple of Dakka, and the Temple of Maharraka. Sail to Amada. Visit the Temple of Amada, the Temple of Derr, and the Tomb of Penout. Sail to Kasr Ibrim. Overnight onboard.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Lake Nasser cruise'
      },
      {
        day: 9,
        title: 'Kasr Ibrim to Abu Simbel',
        description: 'Morning visit to the citadel of Kasr Ibrim (viewed from the ship\'s deck as it\'s not open to visitors). Sail to Abu Simbel. Afternoon visit to the impressive Abu Simbel temples. Evening Sound and Light Show at Abu Simbel. Overnight onboard near Abu Simbel.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Lake Nasser cruise'
      },
      {
        day: 10,
        title: 'Abu Simbel to Aswan',
        description: 'Morning at leisure with the option to revisit Abu Simbel temples at sunrise. Begin sailing back to Aswan. Farewell dinner onboard. Overnight cruising toward Aswan.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Lake Nasser cruise'
      },
      {
        day: 11,
        title: 'Departure',
        description: 'Arrive in Aswan. After breakfast, disembark from your Lake Nasser cruise. Transfer to Aswan Airport for your departure flight.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: false,
    specialOffer: {
      discount: 10,
      validUntil: '2025-06-15'
    },
    tags: ['Cruise', 'Lake Nasser', 'Abu Simbel', 'Nile', 'Extended'],
    minimumPeople: 2,
    maximumPeople: 25,
    ageRestrictions: {
      minimum: 8
    },
    difficulty: 'Easy',
    cancellationPolicy: 'Free cancellation up to 45 days before departure. 50% charge within 45-30 days. No refund within 30 days.'
  },
  {
    id: 9,
    name: 'Western Desert Oases Explorer',
    locations: ['Cairo', 'Bahariya', 'Farafra', 'Dakhla', 'Kharga'],
    mainLocation: 'Western Desert, Egypt',
    duration: '8 days, 7 nights',
    rating: 4.7,
    reviewCount: 52,
    price: 1100,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1556855810-ac404aa91e85?q=80&w=2087',
      'https://images.unsplash.com/photo-1579909152157-3df797e43727?q=80&w=2070',
      'https://images.unsplash.com/photo-1608143364669-ed6dc191df69?q=80&w=2035'
    ],
    highlights: [
      'Explore Egypt\'s five major oases',
      'Spectacular White Desert and Black Desert landscapes',
      'Ancient temples and tombs off the tourist track',
      'Desert camping under the stars',
      '4x4 adventure through sand dunes and rock formations'
    ],
    includes: ['Transportation in 4x4 Vehicles', 'Accommodation', 'Most Meals', 'Guides', 'Camping Equipment', 'Entry Fees'],
    accommodationLevel: 'Eco-lodges, hotels & desert camping',
    packageDates: [
      { date: 'May 8-15, 2025', availability: 'Available', spotsLeft: 8 },
      { date: 'October 10-17, 2025', availability: 'Available', spotsLeft: 10 },
      { date: 'November 5-12, 2025', availability: 'Limited', spotsLeft: 6 }
    ],
    description: 'An off-the-beaten-path adventure through Egypt\'s Western Desert oases, combining natural wonders with ancient historical sites.',
    activities: ['Desert Expedition', 'Camping', 'Photography', 'Archaeological Sites', '4x4 Adventure'],
    itinerary: [
      {
        day: 1,
        title: 'Cairo to Bahariya Oasis',
        description: 'Early morning departure from Cairo. Drive to Bahariya Oasis (approximately 4 hours). Visit the Temple of Alexander the Great, the Valley of the Golden Mummies, and Bannentiu Tomb. Check into your eco-lodge. Dinner and overnight in Bahariya.',
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Eco-lodge'
      },
      {
        day: 2,
        title: 'Black & White Deserts',
        description: 'After breakfast, start your desert safari by 4x4 vehicles. Visit the Black Desert with its volcanic mountains, Crystal Mountain, and the Valley of Agabat. Continue to the famous White Desert National Park with its chalk rock formations. Set up camp and enjoy dinner under the stars. Overnight camping in the White Desert.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Desert camping'
      },
      {
        day: 3,
        title: 'Farafra Oasis',
        description: 'Wake up to sunrise in the White Desert. After breakfast, drive to Farafra Oasis. Visit the local museum of Badr, showcasing art made from desert materials. Explore the old village and natural hot springs. Continue to Dakhla Oasis. Dinner and overnight in Dakhla.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Simple hotel'
      },
      {
        day: 4,
        title: 'Dakhla Oasis Exploration',
        description: 'Full day exploring Dakhla Oasis, one of the most picturesque oases. Visit the medieval Islamic town of Al-Qasr, the ancient village of Balat, and the ruins of Deir el-Hagar temple. Explore the beautiful Muzzawaka tombs with their colorful paintings. Dinner and overnight in Dakhla.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Simple hotel'
      },
      {
        day: 5,
        title: 'Dakhla to Kharga Oasis',
        description: 'Drive from Dakhla to Kharga Oasis. En route, visit the Temple of Hibis, the best-preserved Persian temple in Egypt. Continue to the Christian necropolis of Bagawat with its ancient chapels. Check into your hotel in Kharga. Afternoon at leisure. Dinner and overnight in Kharga.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Simple hotel'
      },
      {
        day: 6,
        title: 'Kharga Exploration',
        description: 'Full day exploring Kharga Oasis. Visit the Temple of Nadura, the Temple of Qasr el-Ghueita, and the Roman fortress of Qasr el-Labeka. Explore the beautiful Kharga Museum. Evening special dinner with local families to experience oasis culture. Overnight in Kharga.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Simple hotel'
      },
      {
        day: 7,
        title: 'Desert Road to Bahariya',
        description: 'Early departure for the long but scenic drive back to Bahariya Oasis. En route, stop at interesting geological formations and desert viewpoints. Afternoon relaxation at the hot springs of Bir Sigam. Farewell dinner. Overnight in Bahariya.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Eco-lodge'
      },
      {
        day: 8,
        title: 'Return to Cairo',
        description: 'After breakfast, return drive to Cairo (approximately 4 hours). Arrival in Cairo by early afternoon where the tour ends.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Not included'
      }
    ],
    featured: false,
    tags: ['Desert', 'Oasis', 'Off the Beaten Path', 'Adventure', 'Camping'],
    minimumPeople: 4,
    maximumPeople: 14,
    ageRestrictions: {
      minimum: 12
    },
    difficulty: 'Moderate to Challenging',
    cancellationPolicy: 'Free cancellation up to 30 days before departure. 50% charge within 30-15 days. No refund within 14 days.'
  },
  {
    id: 10,
    name: 'Egypt & Israel Holy Land Tour',
    locations: ['Cairo', 'St. Catherine', 'Jerusalem', 'Bethlehem', 'Nazareth', 'Galilee'],
    mainLocation: 'Cairo, Egypt & Jerusalem, Israel',
    duration: '10 days, 9 nights',
    rating: 4.8,
    reviewCount: 87,
    price: 92500,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1622038494876-ced33929f4ab?q=80&w=2069',
    images: [
      'https://images.unsplash.com/photo-1552423314-cf29ab68ad73?q=80&w=2070',
      'https://images.unsplash.com/photo-1644122275100-45030fc176c8?q=80&w=2070',
      'https://images.unsplash.com/photo-1560528257-62549914d907?q=80&w=2070'
    ],
    highlights: [
      'Biblical sites in Egypt and Israel',
      'Mount Sinai sunrise experience',
      'Old Jerusalem exploration',
      'Sea of Galilee boat ride',
      'River Jordan baptismal site'
    ],
    includes: ['Accommodation', 'Most Meals', 'Transportation', 'Religious Guide', 'Entry Fees', 'Border Crossing Assistance'],
    accommodationLevel: '4-star hotels',
    packageDates: [
      { date: 'May 12-21, 2025', availability: 'Available', spotsLeft: 16 },
      { date: 'June 9-18, 2025', availability: 'Limited', spotsLeft: 6 },
      { date: 'July 14-23, 2025', availability: 'Available', spotsLeft: 14 }
    ],
    description: 'A spiritual journey through the Holy Land, visiting the most significant biblical sites in Egypt and Israel.',
    activities: ['Religious Sites', 'Historical Tours', 'Cultural Experiences', 'Spiritual Journey'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Cairo',
        description: 'Arrive at Cairo International Airport. Meet and greet by our representative. Transfer to your hotel in Cairo. Welcome dinner and tour briefing. Overnight in Cairo.',
        meals: ['Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 2,
        title: 'Biblical Cairo',
        description: 'Morning visit to the Egyptian Museum to see artifacts related to biblical Egypt. Continue to Old Cairo to visit the Hanging Church, Abu Serga Church (where the Holy Family is believed to have stayed), and Ben Ezra Synagogue. Afternoon visit to the Pyramids of Giza. Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 3,
        title: 'Cairo to St. Catherine',
        description: 'Drive from Cairo to St. Catherine in the Sinai Peninsula (approximately 6 hours). En route, cross under the Suez Canal. After check-in at the hotel, briefing about the Mount Sinai climb. Early dinner and rest before the night ascent. Begin the climb of Mount Sinai around midnight.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 4,
        title: 'Mount Sinai & St. Catherine\'s Monastery',
        description: 'Complete the ascent of Mount Sinai in time for sunrise at the summit, where tradition says Moses received the Ten Commandments. Descend to visit St. Catherine\'s Monastery, home to the Burning Bush and one of the world\'s oldest libraries. Afternoon drive to Taba border crossing. Cross into Israel and drive to Jerusalem. Overnight in Jerusalem.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 5,
        title: 'Jerusalem Old City',
        description: 'Full day exploring the Old City of Jerusalem. Walk the Via Dolorosa, visit the Church of the Holy Sepulchre, the Western Wall, and Temple Mount. Afternoon visit to Mount Zion to see the Room of the Last Supper and King David\'s Tomb. Overnight in Jerusalem.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 6,
        title: 'Bethlehem & Jerusalem New City',
        description: 'Morning excursion to Bethlehem to visit the Church of the Nativity. Return to Jerusalem to visit the Mount of Olives, Garden of Gethsemane, and Yad Vashem Holocaust Memorial. Overnight in Jerusalem.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 7,
        title: 'Dead Sea & Masada',
        description: 'Day trip to the Dead Sea region. Visit the ancient fortress of Masada. Enjoy a float in the mineral-rich waters of the Dead Sea. Visit Qumran, where the Dead Sea Scrolls were discovered. Return to Jerusalem for overnight.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 8,
        title: 'Jerusalem to Galilee',
        description: 'Drive north to the Galilee region. En route, visit Beit Shean archaeological site. Continue to the Sea of Galilee. Visit Capernaum, the Mount of Beatitudes, and Tabgha (site of the miracle of loaves and fishes). Boat ride on the Sea of Galilee. Overnight in Tiberias.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 9,
        title: 'Nazareth & Jordan River',
        description: 'Visit Nazareth to see the Church of the Annunciation. Continue to Cana, site of Jesus\'s first miracle. Afternoon visit to the Jordan River baptismal site. Drive to Tel Aviv. Farewell dinner. Overnight in Tel Aviv.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 10,
        title: 'Departure',
        description: 'After breakfast, transfer to Tel Aviv\'s Ben Gurion Airport for your departure flight.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: false,
    tags: ['Religious', 'Holy Land', 'Biblical', 'Israel', 'Spiritual'],
    minimumPeople: 10,
    maximumPeople: 30,
    ageRestrictions: {
      minimum: 12
    },
    difficulty: 'Moderate',
    cancellationPolicy: 'Free cancellation up to 45 days before departure. 50% charge within 45-30 days. No refund within 30 days.'
  },
  {
    id: 11,
    name: 'Sailing the Nile: Dahabiya Experience',
    locations: ['Luxor', 'Esna', 'El Kab', 'Edfu', 'Kom Ombo', 'Aswan'],
    mainLocation: 'Luxor to Aswan, Egypt',
    duration: '7 days, 6 nights',
    rating: 4.9,
    reviewCount: 64,
    price: 1500,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1568124925258-66db38b9a8ae?q=80&w=2071',
      'https://images.unsplash.com/photo-1595753301484-6803bcb5b544?q=80&w=2038',
      'https://images.unsplash.com/photo-1538075254171-0b3c9bd4db43?q=80&w=2070'
    ],
    highlights: [
      'Intimate sailing experience on a traditional dahabiya boat',
      'Maximum 12 passengers for personalized service',
      'Visit sites not accessible to larger cruise ships',
      'Dine under the stars on private sandbanks',
      'Experience the Nile as travelers did a century ago'
    ],
    includes: ['Domestic Flights', 'Dahabiya Accommodation', 'All Meals', 'Guided Excursions', 'Entry Fees', 'Airport Transfers'],
    accommodationLevel: 'Boutique dahabiya sailing boat',
    packageDates: [
      { date: 'May 5-11, 2025', availability: 'Limited', spotsLeft: 4 },
      { date: 'June 2-8, 2025', availability: 'Available', spotsLeft: 10 },
      { date: 'July 7-13, 2025', availability: 'Available', spotsLeft: 8 }
    ],
    description: 'Experience the tranquility of the Nile on a traditional dahabiya sailing boat, visiting temples and villages inaccessible to larger cruise ships.',
    activities: ['Sailing', 'Temple Visits', 'Village Exploration', 'Birdwatching', 'Cultural Experiences'],
    itinerary: [
      {
        day: 1,
        title: 'Luxor Arrival & Embarkation',
        description: 'Arrive at Luxor Airport. Meet and greet by our representative. Transfer to the East Bank of Luxor for a guided tour of Karnak and Luxor Temples. Afternoon embarkation on your dahabiya. Welcome reception and dinner onboard. Overnight moored in Luxor.',
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Dahabiya boat'
      },
      {
        day: 2,
        title: 'Luxor West Bank & Sailing',
        description: 'Morning visit to the West Bank of Luxor including the Valley of the Kings, Temple of Hatshepsut, and the Colossi of Memnon. Return to the dahabiya for lunch. Begin sailing southward to Esna. Afternoon tea on the sundeck. Dinner onboard. Overnight moored near Esna.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Dahabiya boat'
      },
      {
        day: 3,
        title: 'Esna to El Kab',
        description: 'Morning walk to visit Esna Temple. Return to the dahabiya and continue sailing to El Kab. Visit the ancient rock-cut tombs of El Kab, rarely visited by tourists. Evening barbecue dinner on a sandbank. Overnight moored near El Kab.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Dahabiya boat'
      },
      {
        day: 4,
        title: 'Edfu Temple',
        description: 'Morning sail to Edfu. Horse carriage ride to the Temple of Horus, one of the best-preserved ancient temples in Egypt. Return to the dahabiya for lunch. Afternoon sailing toward Gebel El Silsila with birdwatching opportunities. Dinner onboard. Overnight moored near Gebel El Silsila.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Dahabiya boat'
      },
      {
        day: 5,
        title: 'Gebel El Silsila & Kom Ombo',
        description: 'Morning visit to the sandstone quarries and rock-cut shrines of Gebel El Silsila. Continue sailing to Kom Ombo. Afternoon visit to the unique double temple dedicated to the gods Sobek and Horus. Special Nubian dinner onboard. Overnight moored near Kom Ombo.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Dahabiya boat'
      },
      {
        day: 6,
        title: 'Sailing to Aswan',
        description: 'Full day of sailing, enjoying the picturesque scenery of the Nile Valley. Stop at Daraw to visit the traditional camel market if it coincides with market day. Visit a local elementary school to interact with children. Continue to Aswan. Farewell dinner onboard. Overnight moored in Aswan.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Dahabiya boat'
      },
      {
        day: 7,
        title: 'Aswan & Departure',
        description: 'Disembarkation after breakfast. Tour of Aswan including the High Dam, the Unfinished Obelisk, and the Temple of Philae. Transfer to Aswan Airport for departure.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: false,
    specialOffer: {
      discount: 10,
      validUntil: '2025-06-30'
    },
    tags: ['Sailing', 'Dahabiya', 'Boutique', 'Nile', 'Exclusive'],
    minimumPeople: 6,
    maximumPeople: 12,
    ageRestrictions: {
      minimum: 12
    },
    difficulty: 'Easy',
    cancellationPolicy: 'Free cancellation up to 60 days before departure. 50% charge within 60-30 days. No refund within 30 days.'
  },
  {
    id: 12,
    name: 'Egypt Diving Safari',
    locations: ['Sharm El Sheikh', 'Ras Mohammed', 'Tiran Island', 'Dahab'],
    mainLocation: 'Red Sea, Egypt',
    duration: '7 days, 6 nights',
    rating: 4.8,
    reviewCount: 106,
    price: 1350,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1588401115106-563fc50f99b6?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1682687980976-fec0915c6177?q=80&w=2071',
      'https://images.unsplash.com/photo-1576675784201-0e142b423952?q=80&w=2952',
      'https://images.unsplash.com/photo-1551430200-ef7dba735095?q=80&w=2071'
    ],
    highlights: [
      'Guided dives at the best Red Sea sites',
      'Boat trips to pristine coral reefs',
      'Visit to the famous Blue Hole in Dahab',
      'Opportunity to see wrecks, including the SS Thistlegorm',
      'PADI certification courses available'
    ],
    includes: ['Accommodation', 'Breakfast', 'Lunch on Dive Days', 'Diving Equipment', 'Dive Guide', 'Transportation', 'Airport Transfers'],
    accommodationLevel: '4-star dive resort',
    packageDates: [
      { date: 'May 14-20, 2025', availability: 'Available', spotsLeft: 8 },
      { date: 'June 11-17, 2025', availability: 'Limited', spotsLeft: 4 },
      { date: 'July 16-22, 2025', availability: 'Available', spotsLeft: 10 }
    ],
    description: 'Explore the underwater wonders of the Red Sea on this diving safari, suitable for certified divers of all levels.',
    activities: ['Scuba Diving', 'Snorkeling', 'Beach Activities', 'Boat Trips', 'Marine Life Observation'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Sharm El Sheikh',
        description: 'Arrive at Sharm El Sheikh International Airport. Meet and greet by our dive representative. Transfer to your dive resort. Check-in and equipment fitting. Briefing about the week\'s diving schedule. Welcome dinner. Overnight in Sharm El Sheikh.',
        meals: ['Dinner'],
        accommodation: '4-star dive resort'
      },
      {
        day: 2,
        title: 'Local Dive Sites',
        description: 'After breakfast, two morning dives at Near Garden and Far Garden sites, perfect for getting comfortable with local conditions. Lunch onboard the dive boat. Return to the resort in the early afternoon. Optional night dive available (extra cost). Overnight in Sharm El Sheikh.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star dive resort'
      },
      {
        day: 3,
        title: 'Ras Mohammed National Park',
        description: 'Full-day boat trip to Ras Mohammed National Park, one of the world\'s premier dive destinations. Two dives at sites such as Shark Reef and Yolanda Reef, known for walls, drift diving, and abundant marine life. Lunch onboard. Return to the resort in the late afternoon. Overnight in Sharm El Sheikh.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star dive resort'
      },
      {
        day: 4,
        title: 'Tiran Island Dive Sites',
        description: 'Boat trip to the Strait of Tiran. Two dives at famous sites like Jackson Reef, Thomas Reef, or Gordon Reef, known for their vibrant coral gardens and pelagic encounters. Lunch onboard. Return to the resort in the late afternoon. Overnight in Sharm El Sheikh.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star dive resort'
      },
      {
        day: 5,
        title: 'SS Thistlegorm Wreck',
        description: 'Early morning departure for a full-day boat trip to the legendary SS Thistlegorm wreck, one of the world\'s best wreck dives. Two dives to explore this WWII cargo ship and its artifacts. Lunch onboard. Return to the resort in the late afternoon. Overnight in Sharm El Sheikh.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star dive resort'
      },
      {
        day: 6,
        title: 'Dahab & Blue Hole',
        description: 'Day trip to Dahab. Morning dive at the Canyon site. Lunch at a local restaurant. Afternoon dive at the world-famous Blue Hole (outer reef only). Free time to explore Dahab\'s bohemian atmosphere. Return to Sharm El Sheikh for overnight.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star dive resort'
      },
      {
        day: 7,
        title: 'Departure',
        description: 'Free morning for an optional final dive or relaxation on the beach. Check-out and transfer to Sharm El Sheikh International Airport for departure.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: false,
    tags: ['Diving', 'Red Sea', 'Marine Life', 'Coral Reefs', 'Water Sports'],
    minimumPeople: 4,
    maximumPeople: 16,
    ageRestrictions: {
      minimum: 15
    },
    difficulty: 'Moderate',
    cancellationPolicy: 'Free cancellation up to 30 days before departure. 50% charge within 30-15 days. No refund within 14 days.'
  },
  {
    id: 13,
    name: 'Culinary Journey Through Egypt',
    locations: ['Cairo', 'Alexandria', 'Luxor', 'Aswan'],
    mainLocation: 'Multiple Cities, Egypt',
    duration: '9 days, 8 nights',
    rating: 4.7,
    reviewCount: 58,
    price: 1650,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1590179068383-b9c69aacebd3?q=80&w=2080',
    images: [
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2070',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=2070',
      'https://images.unsplash.com/photo-1585937421612-70a008356c36?q=80&w=2036'
    ],
    highlights: [
      'Cooking classes with local chefs',
      'Market tours to select fresh ingredients',
      'Meals at authentic local restaurants',
      'Learn to prepare traditional Egyptian dishes',
      'Visit key historical sites between culinary activities'
    ],
    includes: ['Accommodation', 'Domestic Flights', 'Most Meals', 'Cooking Classes', 'Market Tours', 'Cultural Visits', 'Transportation'],
    accommodationLevel: '4-star hotels',
    packageDates: [
      { date: 'May 18-26, 2025', availability: 'Available', spotsLeft: 12 },
      { date: 'June 15-23, 2025', availability: 'Limited', spotsLeft: 6 },
      { date: 'July 20-28, 2025', availability: 'Available', spotsLeft: 12 }
    ],
    description: 'A gastronomic adventure through Egypt, exploring the country\'s rich culinary heritage while also visiting its most important historical sites.',
    activities: ['Cooking Classes', 'Food Tasting', 'Market Tours', 'Cultural Visits', 'Sightseeing'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Cairo',
        description: 'Arrive at Cairo International Airport. Meet and greet by our representative. Transfer to your hotel. Welcome dinner at a traditional Egyptian restaurant featuring mezze and grilled specialties. Introduction to Egyptian cuisine. Overnight in Cairo.',
        meals: ['Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 2,
        title: 'Cairo Cooking Class & Pyramids',
        description: 'Morning visit to a local market with a chef to select ingredients. Participate in a cooking class to prepare koshari (Egypt\'s national dish), molokhia (jute leaf stew), and stuffed vine leaves. Enjoy your creations for lunch. Afternoon visit to the Pyramids of Giza and the Sphinx. Dinner at a family home. Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 3,
        title: 'Old Cairo & Street Food',
        description: 'Morning visit to the Egyptian Museum. Continue to Islamic Cairo for a street food tour, sampling treats like taameya (Egyptian falafel), hawawshi (meat-filled bread), and sugarcane juice. Afternoon visit to Khan el-Khalili bazaar with stops at historic coffee houses. Evening cooking demonstration of Egyptian desserts like basbousa and kunafa. Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 4,
        title: 'Alexandria Seafood Experience',
        description: 'Drive to Alexandria. Visit the fish market to learn about Mediterranean seafood selection. Lunch at a seaside restaurant featuring fresh catch prepared in Alexandrian style. Afternoon cultural visits to the Bibliotheca Alexandrina and Qaitbay Citadel. Evening food walk along the Corniche. Overnight in Alexandria.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 5,
        title: 'Alexandria to Luxor',
        description: 'Morning cooking class focusing on Alexandrian specialties like sayadeya (fish with rice). Return to Cairo airport for your flight to Luxor. Check into your hotel. Evening visit to Luxor Temple followed by dinner at a restaurant overlooking the Nile. Overnight in Luxor.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 6,
        title: 'Luxor\'s West Bank & Traditional Bakery',
        description: 'Morning visit to the Valley of the Kings and Temple of Hatshepsut. Visit a traditional Egyptian bakery to learn about bread-making techniques. Participate in making Egyptian flatbread (aish baladi). Afternoon visit to Karnak Temple. Dinner featuring Upper Egyptian specialties. Overnight in Luxor.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 7,
        title: 'Luxor to Aswan',
        description: 'Drive to Aswan, stopping at Edfu and Kom Ombo temples en route. Upon arrival in Aswan, visit a Nubian village for a home-cooked meal and cooking demonstration of Nubian specialties. Learn about unique Nubian spices and cooking methods. Overnight in Aswan.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 8,
        title: 'Aswan Exploration & Farewell Cooking',
        description: 'Morning visit to the High Dam, Unfinished Obelisk, and Philae Temple. Afternoon felucca ride on the Nile. Evening farewell cooking class where you\'ll prepare a complete Egyptian meal incorporating techniques learned throughout the tour. Enjoy your creations for dinner. Overnight in Aswan.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 9,
        title: 'Departure',
        description: 'After breakfast, transfer to Aswan Airport for your departure flight.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: false,
    tags: ['Culinary', 'Cooking Classes', 'Food Tour', 'Cultural', 'Market Tours'],
    minimumPeople: 6,
    maximumPeople: 14,
    ageRestrictions: {
      minimum: 12
    },
    difficulty: 'Easy',
    cancellationPolicy: 'Free cancellation up to 30 days before departure. 50% charge within 30-15 days. No refund within 14 days.'
  },
  {
    id: 14,
    name: 'Egyptian Photography Expedition',
    locations: ['Cairo', 'Giza', 'Luxor', 'Aswan', 'Abu Simbel', 'White Desert'],
    mainLocation: 'Multiple Cities, Egypt',
    duration: '12 days, 11 nights',
    rating: 4.9,
    reviewCount: 47,
    price: 140000,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1572254008234-3273ff5bed0d?q=80&w=2071',
    images: [
      'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=2069',
      'https://images.unsplash.com/photo-1584719866406-c76d92976f76?q=80&w=2071',
      'https://images.unsplash.com/photo-1600101592686-bb8b2a276fec?q=80&w=2070'
    ],
    highlights: [
      'Guided by a professional photographer',
      'Photograph at optimal times for lighting',
      'Special access to sites before/after regular hours',
      'Desert night photography under stars',
      'Portrait sessions with local people'
    ],
    includes: ['Accommodation', 'Domestic Flights', 'Transportation', 'Most Meals', 'Photography Guide', 'Special Access Permits', 'Entry Fees'],
    accommodationLevel: '4-star hotels & desert camping',
    packageDates: [
      { date: 'May 3-14, 2025', availability: 'Available', spotsLeft: 8 },
      { date: 'October 5-16, 2025', availability: 'Available', spotsLeft: 10 },
      { date: 'November 2-13, 2025', availability: 'Limited', spotsLeft: 4 }
    ],
    description: 'A specialized photography tour designed to capture Egypt\'s most iconic sites and hidden gems in the best possible light.',
    activities: ['Photography', 'Cultural Visits', 'Desert Expedition', 'River Cruise', 'Sunrise/Sunset Shoots'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Cairo',
        description: 'Arrive at Cairo International Airport. Meet and greet by our representative. Transfer to your hotel. Evening orientation session with your photography guide to discuss equipment, techniques, and the itinerary. Overnight in Cairo.',
        meals: ['Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 2,
        title: 'Cairo Cityscapes',
        description: 'Early morning shoot from the Cairo Tower for cityscape panoramas. Visit the Egyptian Museum to photograph artifacts with expert guidance on museum photography. Afternoon shoot in Islamic Cairo, focusing on architecture and street scenes. Blue hour photography at Al-Azhar Park. Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 3,
        title: 'Pyramids at Dawn & Dusk',
        description: 'Pre-dawn departure for the Pyramids of Giza to capture sunrise. Special access permit for photography without crowds. Mid-day workshop on editing techniques at the hotel. Late afternoon return to the pyramids for sunset shots from alternative angles. Evening light painting workshop. Overnight in Cairo.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 4,
        title: 'Cairo to Luxor',
        description: 'Morning flight to Luxor. Transfer to your hotel. Afternoon shoot at Karnak Temple, focusing on columns, hieroglyphics, and architectural details. Sunset shoot at Luxor Temple with its dramatic lighting. Golden hour river scenes along the Nile. Overnight in Luxor.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 5,
        title: 'Valley of the Kings & Portrait Photography',
        description: 'Early morning hot air balloon ride over Luxor for aerial photography (optional, extra cost). Visit the Valley of the Kings for interior photography techniques (where permitted). Afternoon portrait session with local artisans in an alabaster workshop. Sunset at the Colossi of Memnon. Overnight in Luxor.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 6,
        title: 'Luxor to Aswan',
        description: 'Drive to Aswan with photo stops at Edfu and Kom Ombo temples. Capture the agricultural landscapes and Nile scenes en route. Evening shoot of the Nile at sunset with feluccas. Photography discussion and image review session. Overnight in Aswan.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 7,
        title: 'Aswan & Nubian Village',
        description: 'Morning shoot at the Unfinished Obelisk and High Dam. Visit Philae Temple by boat for water reflection shots. Afternoon visit to a Nubian village for cultural photography, portraits, and colorful architecture. Golden hour shoot from Elephantine Island. Overnight in Aswan.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 8,
        title: 'Abu Simbel Excursion',
        description: 'Very early morning drive to Abu Simbel (or optional flight). Photograph the temples at different times of day to capture changing light. Special access for interior photography where permitted. Return to Aswan in the late afternoon. Evening image review and post-processing workshop. Overnight in Aswan.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 9,
        title: 'Aswan to Cairo to White Desert',
        description: 'Morning flight to Cairo. Drive to Bahariya Oasis (approximately 4 hours). Continue by 4x4 vehicles to the White Desert. Sunset shoot of the unique chalk formations. After dinner, night photography session capturing star trails over the desert formations. Overnight camping in the White Desert.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Desert camping'
      },
      {
        day: 10,
        title: 'White Desert Photography',
        description: 'Wake before dawn to capture the sunrise over the white formations. Morning photoshoot in different lighting conditions. After breakfast, visit the Black Desert for contrast photography. Continue to Crystal Mountain and the Valley of Agabat for landscape photography. Second night of star photography. Overnight camping in the White Desert.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Desert camping'
      },
      {
        day: 11,
        title: 'Desert to Cairo',
        description: 'Final sunrise shoot in the desert. Return to Bahariya Oasis, then drive back to Cairo. Evening farewell dinner and final image sharing session. Overnight in Cairo.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '4-star hotel'
      },
      {
        day: 12,
        title: 'Departure',
        description: 'After breakfast, transfer to Cairo International Airport for your departure flight.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: false,
    tags: ['Photography', 'Special Access', 'Desert', 'Ancient Sites', 'Night Sky'],
    minimumPeople: 6,
    maximumPeople: 12,
    ageRestrictions: {
      minimum: 16
    },
    difficulty: 'Moderate',
    cancellationPolicy: 'Free cancellation up to 45 days before departure. 50% charge within 45-30 days. No refund within 30 days.'
  },
  {
    id: 15,
    name: 'Egyptian Honeymoon Package',
    locations: ['Cairo', 'Luxor', 'Nile Cruise', 'Hurghada'],
    mainLocation: 'Multiple Cities, Egypt',
    duration: '10 days, 9 nights',
    rating: 4.9,
    reviewCount: 83,
    price: 110000,
    currency: 'EGP',
    pricePerPerson: true,
    image: 'https://images.unsplash.com/photo-1517822244305-75e52714cf79?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070',
      'https://images.unsplash.com/photo-1581335167266-5662e1958b2f?q=80&w=2070',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2064'
    ],
    highlights: [
      'Romantic experiences throughout the journey',
      'Private tours of ancient sites',
      'Luxury Nile cruise in a suite cabin',
      'Beachfront resort stay in Hurghada',
      'Special honeymoon amenities and surprises'
    ],
    includes: ['Luxury Accommodation', 'Private Tours', 'Domestic Flights', 'Most Meals', 'Special Romantic Dinners', 'Couple\'s Spa Treatment', 'Airport Transfers'],
    accommodationLevel: '5-star luxury hotels & cruise',
    packageDates: [
      { date: 'Daily departures', availability: 'Available', spotsLeft: 10 }
    ],
    description: 'The perfect blend of cultural exploration and romantic relaxation for newlyweds, featuring Egypt\'s iconic sites and serene beaches.',
    activities: ['Sightseeing', 'Luxury Cruise', 'Beach Relaxation', 'Romantic Dinners', 'Spa Treatments'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Cairo',
        description: 'VIP meet and greet at Cairo International Airport. Private transfer to your luxury hotel. Welcome amenities including flowers, chocolates, and sparkling wine in your room. Evening at leisure. Overnight in Cairo.',
        meals: ['None'],
        accommodation: '5-star luxury hotel'
      },
      {
        day: 2,
        title: 'Cairo Exploration',
        description: 'Private tour of the Pyramids of Giza and the Sphinx. Special access to an exclusive viewing area for couple\'s photos. Continue to the Egyptian Museum. Afternoon at leisure. Evening private dinner cruise on the Nile with entertainment. Overnight in Cairo.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '5-star luxury hotel'
      },
      {
        day: 3,
        title: 'Old Cairo & Romantic Dinner',
        description: 'Morning tour of Islamic Cairo including the Citadel and Mohammed Ali Mosque. Afternoon visit to Khan el-Khalili bazaar with time for shopping. Evening romantic dinner at a rooftop restaurant overlooking the city. Overnight in Cairo.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '5-star luxury hotel'
      },
      {
        day: 4,
        title: 'Cairo to Luxor',
        description: 'Morning flight to Luxor. Embarkation on your luxury Nile cruise ship with suite accommodation. Honeymoon welcome package in your cabin. Afternoon visit to Karnak and Luxor Temples. Special dinner for two on the private balcony of your suite. Overnight aboard the cruise in Luxor.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star luxury cruise'
      },
      {
        day: 5,
        title: 'Nile Cruise - Valley of the Kings',
        description: 'Morning visit to the Valley of the Kings, Temple of Hatshepsut, and Colossi of Memnon. Afternoon sailing to Edfu while enjoying the views from your private balcony. Couple\'s massage at the ship\'s spa. Egyptian-themed dinner. Overnight aboard the cruise.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star luxury cruise'
      },
      {
        day: 6,
        title: 'Nile Cruise - Edfu & Kom Ombo',
        description: 'Visit the Temple of Horus in Edfu. Continue sailing to Kom Ombo and visit the temple. Romantic sunset cocktails on the sundeck. Special honeymoon dinner with wine pairing. Overnight aboard the cruise sailing to Aswan.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star luxury cruise'
      },
      {
        day: 7,
        title: 'Aswan to Hurghada',
        description: 'Morning visit to the High Dam, Unfinished Obelisk, and Philae Temple. Disembarkation and transfer to Aswan Airport. Flight to Hurghada. Transfer to your beachfront resort. Welcome cocktails. Dinner at the resort. Overnight in Hurghada.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '5-star luxury resort'
      },
      {
        day: 8,
        title: 'Relaxation in Hurghada',
        description: 'Day at leisure to enjoy the beach and resort facilities. Private cabana on the beach with butler service. Afternoon couple\'s spa treatment. Romantic candlelit dinner on the beach. Overnight in Hurghada.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: '5-star luxury resort'
      },
      {
        day: 9,
        title: 'Red Sea Adventure',
        description: 'Morning private snorkeling trip to explore the Red Sea reefs. Lunch onboard. Return to the resort for an afternoon at leisure. Farewell dinner at the resort\'s signature restaurant. Overnight in Hurghada.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star luxury resort'
      },
      {
        day: 10,
        title: 'Departure',
        description: 'After breakfast, transfer to Hurghada Airport for your departure flight.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    featured: false,
    specialOffer: {
      discount: 10,
      validUntil: '2025-12-31'
    },
    tags: ['Honeymoon', 'Romantic', 'Luxury', 'Couples', 'Beach'],
    minimumPeople: 2,
    maximumPeople: 2,
    ageRestrictions: {
      minimum: 18
    },
    difficulty: 'Easy',
    cancellationPolicy: 'Free cancellation up to 45 days before departure. 50% charge within 45-30 days. No refund within 30 days.'
  }
];

export const defaultPackagesFilter: PackagesFilterState = {
  minPrice: 300,
  maxPrice: 3000,
  duration: [],
  accommodationLevel: [],
  activities: [],
  rating: 0
};

export const filterPackages = (packages: Package[], filters: PackagesFilterState): Package[] => {
  return packages.filter(pkg => {
    // Price filter
    if (pkg.price < filters.minPrice || pkg.price > filters.maxPrice) {
      return false;
    }
    
    // Duration filter
    if (filters.duration.length > 0) {
      let matchesDuration = false;
      for (const dur of filters.duration) {
        if (pkg.duration.includes(dur)) {
          matchesDuration = true;
          break;
        }
      }
      if (!matchesDuration) {
        return false;
      }
    }
    
    // Accommodation level filter
    if (filters.accommodationLevel.length > 0) {
      let matchesAccommodation = false;
      for (const level of filters.accommodationLevel) {
        if (pkg.accommodationLevel.includes(level)) {
          matchesAccommodation = true;
          break;
        }
      }
      if (!matchesAccommodation) {
        return false;
      }
    }
    
    // Activities filter
    if (filters.activities.length > 0) {
      let hasAllActivities = true;
      for (const activity of filters.activities) {
        if (!pkg.activities.includes(activity)) {
          hasAllActivities = false;
          break;
        }
      }
      if (!hasAllActivities) {
        return false;
      }
    }
    
    // Rating filter
    if (pkg.rating < filters.rating) {
      return false;
    }
    
    return true;
  });
};

export const searchPackages = (
  packages: Package[],
  destination: string,
  dateRange?: string,
  duration?: string,
  travelers: number = 2
): Package[] => {
  return packages.filter(pkg => {
    // Destination match
    const destinationMatch = 
      pkg.mainLocation.toLowerCase().includes(destination.toLowerCase()) || 
      pkg.locations.some(loc => loc.toLowerCase().includes(destination.toLowerCase()));
    
    // Date range match
    const dateMatch = !dateRange || pkg.packageDates.some(date => date.date.includes(dateRange));
    
    // Duration match
    const durationMatch = !duration || pkg.duration.includes(duration);
    
    // Travelers match
    const travelersMatch = travelers >= pkg.minimumPeople && travelers <= pkg.maximumPeople;
    
    return destinationMatch && dateMatch && durationMatch && travelersMatch;
  });
};