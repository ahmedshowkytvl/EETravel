export interface Tour {
  id: number;
  name: string;
  destination: string;
  country: string;
  region?: string;
  category: string;
  subcategory?: string;
  duration: string;
  startDates: string[];
  price: number;
  currency: string;
  priceIncludes: string[];
  priceExcludes: string[];
  groupSize: {
    min: number;
    max: number;
  };
  description: string;
  shortDescription: string;
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    meals: string[];
    accommodation: string;
  }[];
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  specialOffer?: {
    discount: number;
    validUntil: string;
  };
  tourGuide: {
    languages: string[];
    included: boolean;
  };
  accommodation: {
    type: string;
    rating: number;
    included: boolean;
  };
  transportation: {
    type: string[];
    included: boolean;
  };
  difficulty: string;
  minimumAge: number;
  available: number;
  tags: string[];
}

export interface ToursFilterState {
  minPrice: number;
  maxPrice: number;
  duration: string[];
  categories: string[];
  groupSize: number;
  rating: number;
  difficulty: string[];
}

export const tourCategories = [
  { id: 1, name: 'Cultural', subcategories: ['Historical Sites', 'Museums', 'Religious', 'Archaeological'] },
  { id: 2, name: 'Adventure', subcategories: ['Hiking', 'Safari', 'Water Sports', 'Desert Expedition'] },
  { id: 3, name: 'Relaxation', subcategories: ['Beach', 'Spa', 'Retreat'] },
  { id: 4, name: 'Food & Drink', subcategories: ['Culinary', 'Wine Tasting', 'Cooking Classes'] },
  { id: 5, name: 'Nature', subcategories: ['Wildlife', 'National Parks', 'Ecotourism'] },
  { id: 6, name: 'Special Interest', subcategories: ['Photography', 'Art', 'Architecture'] }
];

export const tourDurations = [
  { id: 1, name: 'Half-day' },
  { id: 2, name: 'Full-day' },
  { id: 3, name: '2-3 days' },
  { id: 4, name: '4-7 days' },
  { id: 5, name: '8-14 days' },
  { id: 6, name: '15+ days' }
];

export const tourDifficulties = [
  { id: 1, name: 'Easy' },
  { id: 2, name: 'Moderate' },
  { id: 3, name: 'Challenging' }
];

export const toursData: Tour[] = [
  {
    id: 1,
    name: 'Giza Pyramids & Sphinx Day Tour',
    destination: 'Giza',
    country: 'Egypt',
    region: 'Cairo & Surroundings',
    category: 'Cultural',
    subcategory: 'Archaeological',
    duration: 'Full-day',
    startDates: ['2025-05-15', '2025-05-16', '2025-05-17', '2025-05-18', '2025-05-19'],
    price: 65,
    currency: 'USD',
    priceIncludes: ['Transportation', 'Professional guide', 'Entrance fees', 'Bottled water'],
    priceExcludes: ['Gratuities', 'Food and drinks', 'Camel/horse rides'],
    groupSize: {
      min: 1,
      max: 15
    },
    description: 'Explore the only remaining Wonder of the Ancient World on this guided tour of the Great Pyramids of Giza and the Sphinx. Learn about the fascinating history of these 4,500-year-old monuments from your expert Egyptologist guide. Visit the Valley Temple and enjoy panoramic views of the pyramids from the Western Plateau.',
    shortDescription: 'Visit the Great Pyramids of Giza and the Sphinx on this guided day tour from Cairo.',
    highlights: [
      'Guided tour of the Great Pyramids of Giza',
      'See the iconic Great Sphinx',
      'Learn about ancient Egyptian history from an expert Egyptologist',
      'Visit the Valley Temple',
      'Photo stops at panoramic viewpoints'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Giza Pyramids Complex',
        description: 'Morning pickup from your hotel in Cairo or Giza. Drive to the Giza Plateau where you\'ll explore the Great Pyramid of Khufu, the Pyramid of Khafre, and the Pyramid of Menkaure with your expert guide. Option to enter one of the pyramids (additional fee). Continue to the Great Sphinx and the Valley Temple. Enjoy panoramic views of the pyramids from the Western Plateau, perfect for photos. Return to your hotel in the afternoon.',
        meals: ['None'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=2071',
      'https://images.unsplash.com/photo-1565234332822-1a8c6c4d44c8?q=80&w=2070',
      'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=2069'
    ],
    rating: 4.8,
    reviewCount: 456,
    featured: true,
    tourGuide: {
      languages: ['English', 'Arabic', 'Spanish', 'French'],
      included: true
    },
    accommodation: {
      type: 'Not included',
      rating: 0,
      included: false
    },
    transportation: {
      type: ['Air-conditioned vehicle'],
      included: true
    },
    difficulty: 'Easy',
    minimumAge: 0,
    available: 15,
    tags: ['Pyramids', 'Historical', 'Sphinx', 'Egypt', 'Day Tour']
  },
  {
    id: 2,
    name: 'Cairo Museum, Citadel & Khan el-Khalili Bazaar Tour',
    destination: 'Cairo',
    country: 'Egypt',
    region: 'Cairo & Surroundings',
    category: 'Cultural',
    subcategory: 'Historical Sites',
    duration: 'Full-day',
    startDates: ['2025-05-15', '2025-05-16', '2025-05-17', '2025-05-18', '2025-05-19'],
    price: 70,
    currency: 'USD',
    priceIncludes: ['Transportation', 'Professional guide', 'Entrance fees', 'Bottled water'],
    priceExcludes: ['Gratuities', 'Food and drinks', 'Optional activities'],
    groupSize: {
      min: 1,
      max: 15
    },
    description: 'Explore Cairo\'s most famous attractions and historical sites in one day. Visit the Egyptian Museum to discover ancient artifacts including Tutankhamun\'s treasures. Tour the medieval Citadel of Saladin with its impressive Mohammed Ali Alabaster Mosque. Finish your day at the bustling Khan el-Khalili bazaar, where you can shop for souvenirs and experience local culture.',
    shortDescription: 'Discover Cairo\'s top attractions: the Egyptian Museum, Citadel, and Khan el-Khalili bazaar.',
    highlights: [
      'Guided tour of the Egyptian Museum',
      'See Tutankhamun\'s golden treasures',
      'Visit the medieval Citadel of Saladin',
      'Tour the impressive Mohammed Ali Alabaster Mosque',
      'Shop at Khan el-Khalili, Cairo\'s oldest bazaar'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Cairo\'s Top Attractions',
        description: 'Morning pickup from your hotel. Begin at the Egyptian Museum, home to the world\'s largest collection of pharaonic antiquities. See King Tutankhamun\'s golden mask and treasures. After lunch (optional), visit the Citadel of Saladin, a medieval fortification with panoramic views of Cairo. Tour the Mohammed Ali Alabaster Mosque inside the citadel. End your day at Khan el-Khalili bazaar, where you can explore narrow alleys filled with shops selling everything from spices to souvenirs. Return to your hotel in the late afternoon.',
        meals: ['None'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1590366726853-6a454e484f67?q=80&w=2033',
      'https://images.unsplash.com/photo-1601824772624-39a0d40c1eda?q=80&w=2071',
      'https://images.unsplash.com/photo-1525248152312-434c15a82f37?q=80&w=2070'
    ],
    rating: 4.7,
    reviewCount: 362,
    featured: true,
    tourGuide: {
      languages: ['English', 'Arabic', 'German', 'Italian'],
      included: true
    },
    accommodation: {
      type: 'Not included',
      rating: 0,
      included: false
    },
    transportation: {
      type: ['Air-conditioned vehicle'],
      included: true
    },
    difficulty: 'Easy',
    minimumAge: 0,
    available: 15,
    tags: ['Museum', 'Mosque', 'Bazaar', 'Cairo', 'Day Tour']
  },
  {
    id: 3,
    name: 'Luxor Valley of the Kings & Karnak Temple Day Trip',
    destination: 'Luxor',
    country: 'Egypt',
    region: 'Upper Egypt',
    category: 'Cultural',
    subcategory: 'Archaeological',
    duration: 'Full-day',
    startDates: ['2025-05-15', '2025-05-17', '2025-05-19', '2025-05-21', '2025-05-23'],
    price: 125,
    currency: 'USD',
    priceIncludes: ['Flight tickets (Cairo-Luxor-Cairo)', 'Transportation', 'Professional guide', 'Entrance fees', 'Lunch', 'Bottled water'],
    priceExcludes: ['Gratuities', 'Optional tomb entries', 'Hotel pickup/drop-off'],
    groupSize: {
      min: 2,
      max: 15
    },
    description: 'Explore the ancient wonders of Luxor on this full-day trip from Cairo, including round-trip flights. Visit the Valley of the Kings, where pharaohs were buried in ornate tombs, including Tutankhamun\'s final resting place. See the impressive Colossi of Memnon and the Temple of Hatshepsut. After lunch, tour the vast Karnak Temple Complex with its massive columns and sacred lake. Perfect for those with limited time who want to see Egypt\'s most important archaeological sites.',
    shortDescription: 'Full-day trip to Luxor from Cairo to explore ancient tombs and temples.',
    highlights: [
      'Day trip to Luxor with round-trip flights from Cairo',
      'Explore the Valley of the Kings and iconic royal tombs',
      'Visit the Temple of Hatshepsut and Colossi of Memnon',
      'Tour the massive Karnak Temple Complex',
      'Learn from an expert Egyptologist guide'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Luxor\'s Ancient Wonders',
        description: 'Early morning flight from Cairo to Luxor. Upon arrival, meet your Egyptologist guide and begin your tour on the West Bank. Visit the Valley of the Kings and explore three royal tombs (Tutankhamun tomb optional extra). See the Temple of Hatshepsut, an architectural marvel built into a cliff face. View the Colossi of Memnon, two massive stone statues. After lunch at a local restaurant, cross to the East Bank and tour the Karnak Temple Complex, one of the largest religious buildings ever constructed. Explore the Great Hypostyle Hall with its 134 enormous columns. Evening flight back to Cairo with drop-off at your hotel.',
        meals: ['Lunch'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1595753301484-6803bcb5b544?q=80&w=2038',
    images: [
      'https://images.unsplash.com/photo-1595753301484-6803bcb5b544?q=80&w=2038',
      'https://images.unsplash.com/photo-1585156509520-b1eb85b10d11?q=80&w=2075',
      'https://images.unsplash.com/photo-1551272884-40a213aff361?q=80&w=2076'
    ],
    rating: 4.9,
    reviewCount: 287,
    featured: true,
    specialOffer: {
      discount: 15,
      validUntil: '2025-06-30'
    },
    tourGuide: {
      languages: ['English', 'Arabic', 'French', 'Spanish'],
      included: true
    },
    accommodation: {
      type: 'Not included',
      rating: 0,
      included: false
    },
    transportation: {
      type: ['Flight', 'Air-conditioned vehicle'],
      included: true
    },
    difficulty: 'Moderate',
    minimumAge: 6,
    available: 12,
    tags: ['Luxor', 'Valley of Kings', 'Karnak', 'Temples', 'Day Trip']
  },
  {
    id: 4,
    name: 'Classic Egypt 8-Day Tour with Nile Cruise',
    destination: 'Multiple Destinations',
    country: 'Egypt',
    region: 'Cairo, Luxor, Aswan',
    category: 'Cultural',
    subcategory: 'Historical Sites',
    duration: '8 days',
    startDates: ['2025-05-15', '2025-05-22', '2025-05-29', '2025-06-05', '2025-06-12'],
    price: 990,
    currency: 'USD',
    priceIncludes: ['7 nights accommodation', 'Domestic flights', 'Nile cruise (3 nights)', 'Daily breakfast', 'Full board on cruise', 'All transfers', 'Guided tours', 'Entrance fees'],
    priceExcludes: ['International flights', 'Visa fees', 'Gratuities', 'Optional activities', 'Travel insurance'],
    groupSize: {
      min: 2,
      max: 20
    },
    description: 'Experience the best of Egypt on this comprehensive 8-day tour. Begin in Cairo with visits to the Pyramids, Sphinx, and Egyptian Museum. Fly to Luxor to board your 5-star Nile cruise, sailing to Aswan with stops at ancient temples along the way. Throughout your journey, expert Egyptologist guides will bring history to life, explaining the significance of these remarkable monuments and the fascinating culture of ancient Egypt.',
    shortDescription: '8-day tour covering Cairo\'s highlights and a luxury Nile cruise from Luxor to Aswan.',
    highlights: [
      'Explore the Pyramids of Giza and the Egyptian Museum in Cairo',
      'Enjoy a 3-night luxury Nile cruise from Luxor to Aswan',
      'Visit the Valley of the Kings and Karnak Temple',
      'Explore the temples of Edfu and Kom Ombo',
      'See the High Dam and Temple of Philae in Aswan'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Cairo',
        description: 'Arrive at Cairo International Airport where our representative will meet and assist you through immigration and customs. Transfer to your hotel for check-in. Overnight in Cairo.',
        meals: ['None'],
        accommodation: '4-star hotel'
      },
      {
        day: 2,
        title: 'Pyramids, Sphinx & Egyptian Museum',
        description: 'Full-day tour of Cairo. Visit the Pyramids of Giza and the Sphinx. After lunch, tour the Egyptian Museum with its Tutankhamun treasures. Return to your hotel for overnight.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star hotel'
      },
      {
        day: 3,
        title: 'Cairo to Luxor',
        description: 'Morning flight to Luxor. Check-in to your Nile cruise. Afternoon visit to Karnak and Luxor Temples. Overnight aboard the cruise in Luxor.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Nile cruise'
      },
      {
        day: 4,
        title: 'Luxor West Bank & Sail to Edfu',
        description: 'Morning visit to the Valley of the Kings, Temple of Hatshepsut, and Colossi of Memnon. Afternoon sailing to Edfu via Esna Lock. Overnight aboard the cruise in Edfu.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Nile cruise'
      },
      {
        day: 5,
        title: 'Edfu & Kom Ombo Temples',
        description: 'Morning visit to Horus Temple in Edfu. Sail to Kom Ombo and visit the unique double temple dedicated to Sobek and Horus. Continue sailing to Aswan. Overnight aboard the cruise in Aswan.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Nile cruise'
      },
      {
        day: 6,
        title: 'Aswan Highlights',
        description: 'Visit the High Dam, the Unfinished Obelisk, and the Temple of Philae. Optional afternoon Felucca ride around Elephantine Island (extra cost). Overnight aboard the cruise in Aswan.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-star Nile cruise'
      },
      {
        day: 7,
        title: 'Aswan to Cairo',
        description: 'Optional early morning tour to Abu Simbel (extra cost). Check-out from the cruise. Afternoon flight to Cairo. Transfer to your hotel. Overnight in Cairo.',
        meals: ['Breakfast'],
        accommodation: '4-star hotel'
      },
      {
        day: 8,
        title: 'Departure',
        description: 'After breakfast, transfer to Cairo International Airport for your departure flight.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=2069',
    images: [
      'https://images.unsplash.com/photo-1552250575-e508473b090f?q=80&w=2070',
      'https://images.unsplash.com/photo-1626688445657-94ae5c93d5d8?q=80&w=2074',
      'https://images.unsplash.com/photo-1585156509520-b1eb85b10d11?q=80&w=2075'
    ],
    rating: 4.9,
    reviewCount: 354,
    featured: true,
    specialOffer: {
      discount: 10,
      validUntil: '2025-07-31'
    },
    tourGuide: {
      languages: ['English', 'Arabic', 'French', 'Spanish', 'German'],
      included: true
    },
    accommodation: {
      type: 'Hotel & Nile Cruise',
      rating: 5,
      included: true
    },
    transportation: {
      type: ['Flight', 'Air-conditioned vehicle', 'Nile cruise ship'],
      included: true
    },
    difficulty: 'Easy to moderate',
    minimumAge: 8,
    available: 15,
    tags: ['Nile Cruise', 'Pyramids', 'Luxor', 'Aswan', 'Multi-day Tour']
  },
  {
    id: 5,
    name: 'Egyptian Desert Safari & Red Sea',
    destination: 'Western Desert & Red Sea',
    country: 'Egypt',
    region: 'Western Desert & Red Sea Coast',
    category: 'Adventure',
    subcategory: 'Desert Expedition',
    duration: '5 days',
    startDates: ['2025-05-15', '2025-05-20', '2025-05-25', '2025-05-30', '2025-06-04'],
    price: 650,
    currency: 'USD',
    priceIncludes: ['4 nights accommodation', 'Transportation', 'Driver/guide', 'Meals as specified', 'Activities', 'Camping equipment'],
    priceExcludes: ['Personal expenses', 'Gratuities', 'Travel insurance', 'Optional activities'],
    groupSize: {
      min: 4,
      max: 12
    },
    description: 'Combine adventure and relaxation on this 5-day journey through Egypt\'s stunning landscapes. Begin with an exciting desert safari through the White Desert with its unique chalk formations and the Black Desert with its volcanic mountains. Experience the magic of camping under the desert stars. Then, head to the Red Sea coast for snorkeling, swimming, and relaxation at a beautiful beach resort.',
    shortDescription: '5-day adventure through Egypt\'s Western Desert with camping and Red Sea relaxation.',
    highlights: [
      'Safari through the White Desert with its surreal chalk formations',
      'Experience the contrast of the Black Desert\'s volcanic landscapes',
      'Camp under the stars in the desert',
      'Relax and snorkel at the Red Sea',
      'Visit the Bahariya Oasis and hot springs'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Cairo to Bahariya Oasis',
        description: 'Early morning departure from Cairo. Drive to Bahariya Oasis (approximately 4 hours). Visit the hot springs, the Temple of Alexander the Great, and the Golden Mummies Tomb. Overnight at a local guesthouse in Bahariya.',
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Guesthouse'
      },
      {
        day: 2,
        title: 'White Desert Camping',
        description: 'After breakfast, start your desert safari in 4x4 vehicles. Visit the Black Desert with its volcanic mountains and the Crystal Mountain. Continue to the White Desert National Park to see the famous chalk rock formations shaped by wind erosion. Enjoy the sunset over the desert. Set up camp and enjoy a traditional dinner under the stars. Overnight camping in the White Desert.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Desert camping'
      },
      {
        day: 3,
        title: 'Desert to Red Sea',
        description: 'Wake up to an incredible sunrise in the White Desert. After breakfast, visit the Agabat Valley. Return to Bahariya for lunch, then drive to the Red Sea resort town of Hurghada (approximately 5-6 hours). Check into your beachfront hotel. Free evening to relax. Overnight in Hurghada.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star beach resort'
      },
      {
        day: 4,
        title: 'Red Sea Activities',
        description: 'Full day to enjoy the Red Sea. Morning snorkeling trip to explore the vibrant coral reefs and colorful fish (equipment provided). Afternoon at leisure for swimming, sunbathing, or optional water sports (extra cost). Overnight in Hurghada.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: '4-star beach resort'
      },
      {
        day: 5,
        title: 'Return to Cairo',
        description: 'Morning at leisure. After lunch, drive back to Cairo (approximately 5 hours). Drop-off at your hotel or airport.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1596392301391-f8aa4b56240a?q=80&w=2071',
    images: [
      'https://images.unsplash.com/photo-1556855810-ac404aa91e85?q=80&w=2087',
      'https://images.unsplash.com/photo-1579909152157-3df797e43727?q=80&w=2070',
      'https://images.unsplash.com/photo-1626785525314-5be345c69c48?q=80&w=2071'
    ],
    rating: 4.7,
    reviewCount: 118,
    featured: false,
    tourGuide: {
      languages: ['English', 'Arabic'],
      included: true
    },
    accommodation: {
      type: 'Guesthouse, Desert Camping, Beach Resort',
      rating: 4,
      included: true
    },
    transportation: {
      type: ['4x4 Vehicle', 'Air-conditioned minivan'],
      included: true
    },
    difficulty: 'Moderate',
    minimumAge: 12,
    available: 8,
    tags: ['Desert', 'Camping', 'Red Sea', 'Adventure', 'Safari']
  },
  {
    id: 6,
    name: 'Alexandria Day Trip from Cairo',
    destination: 'Alexandria',
    country: 'Egypt',
    region: 'Mediterranean Coast',
    category: 'Cultural',
    subcategory: 'Historical Sites',
    duration: 'Full-day',
    startDates: ['2025-05-15', '2025-05-16', '2025-05-17', '2025-05-18', '2025-05-19'],
    price: 85,
    currency: 'USD',
    priceIncludes: ['Transportation', 'Professional guide', 'Entrance fees', 'Lunch', 'Bottled water'],
    priceExcludes: ['Gratuities', 'Additional food and drinks'],
    groupSize: {
      min: 1,
      max: 15
    },
    description: 'Explore Egypt\'s second-largest city and its Mediterranean heritage on this full-day trip from Cairo. Alexandria was founded by Alexander the Great and was once a center of learning in the ancient world. Visit key attractions including the Catacombs of Kom el-Shoqafa, the new Bibliotheca Alexandrina, and the impressive Citadel of Qaitbay overlooking the Mediterranean Sea.',
    shortDescription: 'Full-day exploration of Alexandria\'s Greco-Roman heritage and Mediterranean charm.',
    highlights: [
      'Visit the ancient Catacombs of Kom el-Shoqafa',
      'Explore the modern Bibliotheca Alexandrina',
      'See the Citadel of Qaitbay on the Mediterranean',
      'View Pompey\'s Pillar and the Roman Amphitheater',
      'Enjoy a seafood lunch overlooking the Mediterranean'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Alexandria\'s Historical Sites',
        description: 'Early morning pickup from your Cairo hotel. Drive to Alexandria (approximately 3 hours). First, visit the Catacombs of Kom el-Shoqafa, a magnificent example of Greco-Roman funerary architecture. Continue to Pompey\'s Pillar and the remains of the Serapeum temple. After lunch at a local seafood restaurant overlooking the Mediterranean, visit the impressive Citadel of Qaitbay, built on the site of the ancient Lighthouse of Alexandria. Next, explore the modern Bibliotheca Alexandrina, inspired by the ancient Library of Alexandria. If time permits, see the Roman Amphitheater. Late afternoon drive back to Cairo with drop-off at your hotel.',
        meals: ['Lunch'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1610633389918-c85e5c1d9fcf?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1599584721530-ec447bf2bf01?q=80&w=2070',
      'https://images.unsplash.com/photo-1606577244198-7466a1ee5349?q=80&w=2070',
      'https://images.unsplash.com/photo-1591235809799-167137192567?q=80&w=2074'
    ],
    rating: 4.6,
    reviewCount: 248,
    featured: false,
    tourGuide: {
      languages: ['English', 'Arabic', 'French'],
      included: true
    },
    accommodation: {
      type: 'Not included',
      rating: 0,
      included: false
    },
    transportation: {
      type: ['Air-conditioned vehicle'],
      included: true
    },
    difficulty: 'Easy',
    minimumAge: 0,
    available: 15,
    tags: ['Alexandria', 'Mediterranean', 'Day Trip', 'History', 'Roman']
  },
  {
    id: 7,
    name: 'Siwa Oasis 3-Day Adventure',
    destination: 'Siwa',
    country: 'Egypt',
    region: 'Western Desert',
    category: 'Adventure',
    subcategory: 'Desert Expedition',
    duration: '3 days',
    startDates: ['2025-05-15', '2025-05-18', '2025-05-21', '2025-05-24', '2025-05-27'],
    price: 390,
    currency: 'USD',
    priceIncludes: ['Transportation', '2 nights accommodation', 'Meals as specified', 'Local guide', 'Activities'],
    priceExcludes: ['Gratuities', 'Optional activities', 'Personal expenses'],
    groupSize: {
      min: 2,
      max: 12
    },
    description: 'Discover the remote Siwa Oasis, a cultural and natural paradise located in Egypt\'s Western Desert near the Libyan border. Experience Berber culture, explore ancient ruins, swim in natural springs, and enjoy an exhilarating desert safari. Stay in a traditional eco-lodge built in the distinctive Siwan architectural style made from salt-rock and mud.',
    shortDescription: '3-day escape to the enchanting Siwa Oasis with its unique culture and natural beauty.',
    highlights: [
      'Explore the ancient Oracle Temple and Shali Fortress',
      'Swim in the crystal-clear waters of Cleopatra\'s Bath',
      'Experience a thrilling desert safari to the Great Sand Sea',
      'Enjoy a traditional Siwan dinner under the stars',
      'Relax in natural hot and cold springs'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Cairo to Siwa',
        description: 'Early morning departure from Cairo. Long but scenic drive to Siwa (approximately 8-9 hours) with stops along the way. Late afternoon arrival in Siwa Oasis. Check into your eco-lodge. Evening walk around the town to get oriented. Dinner at a local restaurant. Overnight in Siwa.',
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Eco-lodge'
      },
      {
        day: 2,
        title: 'Siwa Exploration',
        description: 'After breakfast, full-day tour of Siwa. Visit the ancient Oracle Temple where Alexander the Great consulted the oracle, and the ruins of the Shali Fortress. Swim in the famous Cleopatra\'s Bath, a natural spring. After lunch, visit Fatnas Island surrounded by a salt lake. Experience a sunset safari to the Great Sand Sea with sandboarding. Traditional Siwan dinner under the stars. Overnight in Siwa.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Eco-lodge'
      },
      {
        day: 3,
        title: 'Return to Cairo',
        description: 'Early morning free time to relax in the hot springs or shop for handmade Siwan crafts. After breakfast, begin the journey back to Cairo, arriving in the evening.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1556855810-ac404aa91e85?q=80&w=2087',
      'https://images.unsplash.com/photo-1566288623394-377af472d81b?q=80&w=2071',
      'https://images.unsplash.com/photo-1608143364669-ed6dc191df69?q=80&w=2035'
    ],
    rating: 4.8,
    reviewCount: 87,
    featured: false,
    tourGuide: {
      languages: ['English', 'Arabic'],
      included: true
    },
    accommodation: {
      type: 'Eco-lodge',
      rating: 3,
      included: true
    },
    transportation: {
      type: ['Air-conditioned vehicle', '4x4 Vehicle'],
      included: true
    },
    difficulty: 'Moderate',
    minimumAge: 10,
    available: 10,
    tags: ['Oasis', 'Desert', 'Berber Culture', 'Springs', 'Adventure']
  },
  {
    id: 8,
    name: 'Nile Dinner Cruise with Entertainment',
    destination: 'Cairo',
    country: 'Egypt',
    region: 'Cairo & Surroundings',
    category: 'Cultural',
    subcategory: 'Food & Drink',
    duration: 'Evening',
    startDates: ['2025-05-15', '2025-05-16', '2025-05-17', '2025-05-18', '2025-05-19'],
    price: 55,
    currency: 'USD',
    priceIncludes: ['Hotel pickup and drop-off', 'Dinner buffet', 'Entertainment', 'Bottled water'],
    priceExcludes: ['Gratuities', 'Alcoholic beverages', 'Photos'],
    groupSize: {
      min: 1,
      max: 100
    },
    description: 'Experience Cairo by night on this elegant dinner cruise along the Nile River. Enjoy panoramic views of the city skyline while savoring a delicious buffet dinner of Egyptian and international cuisine. Be entertained by a folkloric show including a mesmerizing Tanoura spinning dance performance and a talented belly dancer.',
    shortDescription: 'Evening dinner cruise on the Nile with Egyptian entertainment and buffet dinner.',
    highlights: [
      'Cruise the Nile River on an elegant dinner boat',
      'Enjoy a lavish buffet dinner of Egyptian and international dishes',
      'Watch a captivating Tanoura spinning dance performance',
      'See a traditional belly dancing show',
      'Admire Cairo\'s illuminated skyline at night'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Evening Nile Cruise',
        description: 'Evening pickup from your Cairo hotel. Transfer to the dock and board your dinner cruise boat. As you begin sailing, enjoy the views of Cairo\'s skyline illuminated at night. Delicious buffet dinner of Egyptian and international cuisine is served. Watch the entertainment program featuring traditional music, colorful Tanoura spinning dance, and professional belly dancing. After approximately 2 hours, return to the dock. Transfer back to your hotel.',
        meals: ['Dinner'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1601247337642-63cca9c9aad6?q=80&w=2071',
    images: [
      'https://images.unsplash.com/photo-1538075254171-0b3c9bd4db43?q=80&w=2070',
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2070',
      'https://images.unsplash.com/photo-1606046604972-77cc76aee944?q=80&w=2065'
    ],
    rating: 4.4,
    reviewCount: 315,
    featured: false,
    tourGuide: {
      languages: ['English', 'Arabic'],
      included: true
    },
    accommodation: {
      type: 'Not included',
      rating: 0,
      included: false
    },
    transportation: {
      type: ['Air-conditioned vehicle', 'Cruise boat'],
      included: true
    },
    difficulty: 'Easy',
    minimumAge: 0,
    available: 40,
    tags: ['Dinner Cruise', 'Entertainment', 'Nile', 'Evening', 'Belly Dance']
  },
  {
    id: 9,
    name: 'Mount Sinai Sunrise & St. Catherine\'s Monastery',
    destination: 'Sinai Peninsula',
    country: 'Egypt',
    region: 'Sinai',
    category: 'Adventure',
    subcategory: 'Hiking',
    duration: '2 days',
    startDates: ['2025-05-15', '2025-05-17', '2025-05-19', '2025-05-21', '2025-05-23'],
    price: 210,
    currency: 'USD',
    priceIncludes: ['Transportation', '1 night accommodation', 'Guide', 'Entrance fees', 'Meals as specified'],
    priceExcludes: ['Gratuities', 'Drinks', 'Personal expenses'],
    groupSize: {
      min: 2,
      max: 15
    },
    description: 'Embark on a spiritual journey to Mount Sinai (also known as Moses Mountain), where tradition says Moses received the Ten Commandments. Hike to the summit for a breathtaking sunrise, then visit the historic St. Catherine\'s Monastery, home to the famous Burning Bush and one of the world\'s oldest continuously operating libraries.',
    shortDescription: '2-day spiritual journey to Mount Sinai for sunrise and the ancient St. Catherine\'s Monastery.',
    highlights: [
      'Hike up Mount Sinai for a spectacular sunrise',
      'Visit ancient St. Catherine\'s Monastery, a UNESCO World Heritage site',
      'See the Chapel of the Burning Bush',
      'View one of the world\'s oldest libraries with rare manuscripts',
      'Experience the tranquility of the Sinai wilderness'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Journey to Mount Sinai',
        description: 'Afternoon pickup from your hotel in Sharm El Sheikh, Dahab, or Cairo. Drive to the foot of Mount Sinai (approximately 3 hours from Sharm, 2 hours from Dahab, or 6 hours from Cairo). Dinner at a local hotel near St. Catherine\'s. Rest before the night hike. Around midnight, begin the ascent of Mount Sinai (2,285 meters). The hike takes approximately 3 hours, mostly on a camel path with steps near the summit.',
        meals: ['Dinner'],
        accommodation: 'Hotel near St. Catherine\'s'
      },
      {
        day: 2,
        title: 'Sunrise & Monastery Visit',
        description: 'Reach the summit before dawn. Witness the spectacular sunrise over the Sinai mountains. Descend back down the mountain (approximately 2 hours). Breakfast at the hotel. Visit St. Catherine\'s Monastery, built in the 6th century around what is believed to be the Burning Bush. Tour includes the monastery church, icon gallery, and library (containing ancient manuscripts). Early afternoon departure for return journey to your hotel.',
        meals: ['Breakfast'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1622038494876-ced33929f4ab?q=80&w=2069',
    images: [
      'https://images.unsplash.com/photo-1622038494876-ced33929f4ab?q=80&w=2069',
      'https://images.unsplash.com/photo-1510546462255-860527b3856c?q=80&w=2070',
      'https://images.unsplash.com/photo-1644122275100-45030fc176c8?q=80&w=2070'
    ],
    rating: 4.7,
    reviewCount: 127,
    featured: false,
    tourGuide: {
      languages: ['English', 'Arabic'],
      included: true
    },
    accommodation: {
      type: 'Hotel',
      rating: 3,
      included: true
    },
    transportation: {
      type: ['Air-conditioned vehicle'],
      included: true
    },
    difficulty: 'Challenging',
    minimumAge: 12,
    available: 15,
    tags: ['Hiking', 'Sunrise', 'Monastery', 'Religious', 'Mountain']
  },
  {
    id: 10,
    name: 'Aswan Philae Temple & High Dam Tour',
    destination: 'Aswan',
    country: 'Egypt',
    region: 'Upper Egypt',
    category: 'Cultural',
    subcategory: 'Historical Sites',
    duration: 'Half-day',
    startDates: ['2025-05-15', '2025-05-16', '2025-05-17', '2025-05-18', '2025-05-19'],
    price: 45,
    currency: 'USD',
    priceIncludes: ['Transportation', 'Professional guide', 'Entrance fees', 'Motorboat to Philae Temple', 'Bottled water'],
    priceExcludes: ['Gratuities', 'Food and drinks'],
    groupSize: {
      min: 1,
      max: 15
    },
    description: 'Explore Aswan\'s most famous attractions on this half-day tour. Visit the impressive High Dam, built in the 1960s to control the annual flooding of the Nile. See the massive Unfinished Obelisk in the ancient quarries of Aswan. Take a short boat ride to the beautiful island temple of Philae, dedicated to the goddess Isis and rescued from the rising waters of Lake Nasser.',
    shortDescription: 'Half-day tour of Aswan\'s highlights: the High Dam, Unfinished Obelisk, and Philae Temple.',
    highlights: [
      'Visit the impressive Aswan High Dam',
      'See the massive Unfinished Obelisk in the ancient quarries',
      'Take a motorboat to the island of Philae',
      'Explore the beautiful Temple of Isis',
      'Learn about the UNESCO rescue of Philae Temple'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Aswan\'s Engineering Marvels and Ancient Temple',
        description: 'Morning pickup from your Aswan hotel or Nile cruise. First, visit the High Dam, an engineering marvel that created Lake Nasser and changed Egypt\'s relationship with the Nile. Continue to the ancient granite quarries to see the Unfinished Obelisk, which would have been the largest obelisk of Ancient Egypt had it been completed. Take a short motorboat ride to the island of Philae to explore the Temple of Isis, which was dismantled and rebuilt on higher ground when the original site was flooded by the dam. Your guide will explain the temple\'s history and the remarkable UNESCO rescue project. Return to your hotel or cruise ship by early afternoon.',
        meals: ['None'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1590101858888-df6bc212c7a5?q=80&w=2071',
    images: [
      'https://images.unsplash.com/photo-1586958011825-fc0b0fa72664?q=80&w=2073',
      'https://images.unsplash.com/photo-1688320072220-4a546fc2bb5d?q=80&w=2070',
      'https://images.unsplash.com/photo-1673362654270-b3466d67223c?q=80&w=2068'
    ],
    rating: 4.6,
    reviewCount: 154,
    featured: false,
    tourGuide: {
      languages: ['English', 'Arabic', 'German'],
      included: true
    },
    accommodation: {
      type: 'Not included',
      rating: 0,
      included: false
    },
    transportation: {
      type: ['Air-conditioned vehicle', 'Motorboat'],
      included: true
    },
    difficulty: 'Easy',
    minimumAge: 0,
    available: 15,
    tags: ['Aswan', 'Temple', 'Dam', 'Half-day', 'Boat']
  },
  {
    id: 11,
    name: 'Hurghada Red Sea Snorkeling Trip',
    destination: 'Hurghada',
    country: 'Egypt',
    region: 'Red Sea Coast',
    category: 'Adventure',
    subcategory: 'Water Sports',
    duration: 'Full-day',
    startDates: ['2025-05-15', '2025-05-16', '2025-05-17', '2025-05-18', '2025-05-19'],
    price: 40,
    currency: 'USD',
    priceIncludes: ['Hotel pickup and drop-off', 'Boat trip', 'Snorkeling equipment', 'Lunch', 'Soft drinks', 'Professional guide'],
    priceExcludes: ['Gratuities', 'Underwater photos', 'Alcoholic beverages'],
    groupSize: {
      min: 4,
      max: 25
    },
    description: 'Spend a day exploring the vibrant coral reefs of the Red Sea on this snorkeling trip from Hurghada. Visit multiple snorkeling spots known for their diverse marine life, colorful corals, and clear visibility. Suitable for beginners and experienced snorkelers alike, with professional guides to ensure safety and enhance your experience.',
    shortDescription: 'Full-day boat trip to snorkel at the best spots in the Red Sea near Hurghada.',
    highlights: [
      'Snorkel at 2-3 different beautiful coral reef locations',
      'See colorful tropical fish and diverse marine life',
      'Enjoy lunch and refreshments aboard the boat',
      'Relax on the sundeck between snorkeling sessions',
      'All equipment and instruction provided for beginners'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Red Sea Snorkeling Adventure',
        description: 'Morning pickup from your Hurghada hotel. Transfer to the marina to board your comfortable boat. Sail to the first snorkeling site, typically in the Giftun Island area. Your guide will provide equipment and safety instructions. Spend approximately 45 minutes exploring the underwater world. Continue to a second snorkeling site with different marine features. Lunch served aboard the boat. Third snorkeling stop in the afternoon. Time to relax and sunbathe on the boat\'s deck between stops. Return to marina in late afternoon with transfer back to your hotel.',
        meals: ['Lunch'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1611811146928-0a1f6c1576ae?q=80&w=2069',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=2071',
      'https://images.unsplash.com/photo-1551430200-ef7dba735095?q=80&w=2071'
    ],
    rating: 4.8,
    reviewCount: 342,
    featured: false,
    tourGuide: {
      languages: ['English', 'Arabic', 'Russian', 'German'],
      included: true
    },
    accommodation: {
      type: 'Not included',
      rating: 0,
      included: false
    },
    transportation: {
      type: ['Minivan', 'Boat'],
      included: true
    },
    difficulty: 'Easy',
    minimumAge: 8,
    available: 25,
    tags: ['Snorkeling', 'Red Sea', 'Boat Trip', 'Marine Life', 'Hurghada']
  },
  {
    id: 12,
    name: 'Abu Simbel Day Trip from Aswan',
    destination: 'Abu Simbel',
    country: 'Egypt',
    region: 'Upper Egypt',
    category: 'Cultural',
    subcategory: 'Archaeological',
    duration: 'Full-day',
    startDates: ['2025-05-15', '2025-05-16', '2025-05-17', '2025-05-18', '2025-05-19'],
    price: 110,
    currency: 'USD',
    priceIncludes: ['Transportation', 'Professional guide', 'Entrance fees', 'Bottled water'],
    priceExcludes: ['Gratuities', 'Food and drinks', 'Hotel pickup/drop-off'],
    groupSize: {
      min: 1,
      max: 15
    },
    description: 'Visit the magnificent temples of Abu Simbel on this full-day trip from Aswan. These incredible rock-cut temples were built by Ramses II and feature massive statues of the pharaoh. Learn about the temples\' amazing history, including their unprecedented relocation to save them from the rising waters of Lake Nasser in the 1960s.',
    shortDescription: 'Full-day excursion from Aswan to the awe-inspiring temples of Abu Simbel.',
    highlights: [
      'Marvel at the four colossal statues of Ramses II at the Great Temple',
      'Explore the interior chambers with their detailed reliefs',
      'Visit the smaller Temple of Hathor, dedicated to Queen Nefertari',
      'Learn about the UNESCO relocation project that saved the temples',
      'Experience one of Ancient Egypt\'s most impressive monuments'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Abu Simbel Excursion',
        description: 'Very early morning pickup (around 4:00 AM) from your Aswan hotel or cruise ship. Travel by air-conditioned vehicle through the desert to Abu Simbel (approximately 3-4 hours). Upon arrival, your Egyptologist guide will lead you through the temple complex. Explore the Great Temple of Ramses II with its four colossal statues and impressive interior chambers decorated with battle scenes. Visit the smaller Temple of Hathor, dedicated to Queen Nefertari. Learn about how these massive temples were relocated in the 1960s to save them from the rising waters of Lake Nasser. Free time for photos and exploration. Return journey to Aswan, arriving in the late afternoon.',
        meals: ['None'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1591293836027-e05d02e9f171?q=80&w=2045',
    images: [
      'https://images.unsplash.com/photo-1591293836027-e05d02e9f171?q=80&w=2045',
      'https://images.unsplash.com/photo-1584719866406-c76d92976f76?q=80&w=2071',
      'https://images.unsplash.com/photo-1664091729943-a6e6b94e70e9?q=80&w=2070'
    ],
    rating: 4.9,
    reviewCount: 186,
    featured: false,
    specialOffer: {
      discount: 10,
      validUntil: '2025-06-30'
    },
    tourGuide: {
      languages: ['English', 'Arabic', 'French', 'Spanish'],
      included: true
    },
    accommodation: {
      type: 'Not included',
      rating: 0,
      included: false
    },
    transportation: {
      type: ['Air-conditioned vehicle'],
      included: true
    },
    difficulty: 'Easy',
    minimumAge: 6,
    available: 15,
    tags: ['Abu Simbel', 'Temples', 'Ramses II', 'Day Trip', 'UNESCO']
  },
  {
    id: 13,
    name: 'Discover Cairo Walking Tour',
    destination: 'Cairo',
    country: 'Egypt',
    region: 'Cairo & Surroundings',
    category: 'Cultural',
    subcategory: 'Historical Sites',
    duration: 'Half-day',
    startDates: ['2025-05-15', '2025-05-16', '2025-05-17', '2025-05-18', '2025-05-19'],
    price: 30,
    currency: 'USD',
    priceIncludes: ['Professional guide', 'Traditional Egyptian tea or coffee', 'Bottle of water'],
    priceExcludes: ['Gratuities', 'Additional food and drinks', 'Transportation'],
    groupSize: {
      min: 1,
      max: 10
    },
    description: 'Explore the historic heart of Cairo on this guided walking tour. Wander through the narrow streets of Islamic Cairo and Khan el-Khalili bazaar, discovering hidden gems and architectural treasures not found in guidebooks. Experience local life, taste traditional foods, and learn about the city\'s rich history from your knowledgeable guide.',
    shortDescription: 'Half-day walking tour through Islamic Cairo\'s streets, markets, and historic buildings.',
    highlights: [
      'Explore the historic Al-Moez Street with its Islamic architectural treasures',
      'Visit off-the-beaten-path mosques, madrasas, and historic houses',
      'Experience the sensory overload of Khan el-Khalili bazaar',
      'Sample traditional Egyptian street food',
      'Discover the authentic side of Cairo beyond the typical tourist sites'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Islamic Cairo Walking Tour',
        description: 'Meet your guide at the Al-Azhar Park entrance in the morning. Begin walking through the historic district of Al-Darb Al-Ahmar. Visit the stunning Sultan Hassan Mosque and the Al-Rifa\'i Mosque. Continue along Al-Moez Street, one of the oldest streets in Cairo, lined with medieval Islamic architecture. Explore the complex of Qalawun, showcasing Mamluk architecture. Stop for traditional Egyptian tea or coffee at a local café. Continue to Khan el-Khalili bazaar, wandering through the labyrinthine alleys filled with shops selling copper, spices, textiles, and souvenirs. Sample some street food like koshari or falafel. The tour ends at Bab Zuweila, one of the remaining gates of the old city wall, with the option to climb the minaret for panoramic views (extra cost).',
        meals: ['Snack'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1601824772624-39a0d40c1eda?q=80&w=2071',
    images: [
      'https://images.unsplash.com/photo-1572443490709-e57455e46f16?q=80&w=2070',
      'https://images.unsplash.com/photo-1605351770566-cc226b56395f?q=80&w=2070',
      'https://images.unsplash.com/photo-1590424593747-49da0724d809?q=80&w=2069'
    ],
    rating: 4.7,
    reviewCount: 95,
    featured: false,
    tourGuide: {
      languages: ['English', 'Arabic'],
      included: true
    },
    accommodation: {
      type: 'Not included',
      rating: 0,
      included: false
    },
    transportation: {
      type: ['Walking'],
      included: true
    },
    difficulty: 'Moderate',
    minimumAge: 12,
    available: 10,
    tags: ['Walking Tour', 'Islamic Cairo', 'Bazaar', 'Local Experience', 'Architecture']
  },
  {
    id: 14,
    name: 'Dahab Blue Hole Snorkeling Experience',
    destination: 'Dahab',
    country: 'Egypt',
    region: 'Sinai',
    category: 'Adventure',
    subcategory: 'Water Sports',
    duration: 'Half-day',
    startDates: ['2025-05-15', '2025-05-16', '2025-05-17', '2025-05-18', '2025-05-19'],
    price: 35,
    currency: 'USD',
    priceIncludes: ['Transportation', 'Snorkeling equipment', 'Professional guide', 'Bottled water', 'Light refreshments'],
    priceExcludes: ['Gratuities', 'Additional food and drinks'],
    groupSize: {
      min: 2,
      max: 10
    },
    description: 'Experience the famous Blue Hole of Dahab, one of the most renowned snorkeling and diving sites in the world. Known for its incredible visibility and rich marine life, the Blue Hole offers a breathtaking underwater experience along its outer reef. This guided tour ensures safe exploration of this natural wonder while providing insight into the unique ecosystem.',
    shortDescription: 'Half-day snorkeling excursion to Dahab\'s famous Blue Hole site.',
    highlights: [
      'Snorkel at the world-famous Blue Hole',
      'Explore the vibrant outer reef with its diverse marine life',
      'Enjoy the stunning contrast between deep blue waters and colorful corals',
      'Professional guide ensures safety and enhances the experience',
      'Perfect for underwater photography'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Blue Hole Snorkeling',
        description: 'Morning pickup from your hotel in Dahab. Short drive along the scenic coast to the Blue Hole site (approximately 20 minutes). Upon arrival, your guide will provide equipment and safety briefing. Begin snorkeling along the outer reef of the Blue Hole where it\'s safe for snorkelers (the central deep blue hole itself is for experienced divers only). Explore the rich coral gardens teeming with colorful fish, look for moray eels, parrotfish, and occasionally larger pelagic fish. Take breaks at the beachside cafes where you can enjoy refreshments. Continue snorkeling at different sections of the reef. Return to Dahab in the early afternoon.',
        meals: ['Light refreshments'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070',
    images: [
      'https://images.unsplash.com/photo-1682687980976-fec0915c6177?q=80&w=2071',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=2071',
      'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?q=80&w=2069'
    ],
    rating: 4.9,
    reviewCount: 142,
    featured: false,
    tourGuide: {
      languages: ['English', 'Arabic'],
      included: true
    },
    accommodation: {
      type: 'Not included',
      rating: 0,
      included: false
    },
    transportation: {
      type: ['Jeep', 'Minivan'],
      included: true
    },
    difficulty: 'Moderate',
    minimumAge: 10,
    available: 10,
    tags: ['Snorkeling', 'Blue Hole', 'Marine Life', 'Dahab', 'Reef']
  },
  {
    id: 15,
    name: 'Egyptian Cooking Class in Cairo',
    destination: 'Cairo',
    country: 'Egypt',
    region: 'Cairo & Surroundings',
    category: 'Food & Drink',
    subcategory: 'Cooking Classes',
    duration: 'Half-day',
    startDates: ['2025-05-15', '2025-05-16', '2025-05-17', '2025-05-18', '2025-05-19'],
    price: 45,
    currency: 'USD',
    priceIncludes: ['Cooking class', 'Market tour', 'Ingredients', 'Meal', 'Recipes to take home', 'Tea and coffee'],
    priceExcludes: ['Gratuities', 'Transportation'],
    groupSize: {
      min: 2,
      max: 10
    },
    description: 'Learn to prepare authentic Egyptian cuisine in this hands-on cooking class in Cairo. Begin with a visit to a local market to select fresh ingredients, then head to a traditional home kitchen to prepare several classic dishes under the guidance of an experienced local cook. Finish by enjoying the meal you\'ve prepared together.',
    shortDescription: 'Half-day cooking class to learn traditional Egyptian recipes in a local Cairo home.',
    highlights: [
      'Tour a local market to select fresh ingredients',
      'Learn to prepare 3-4 traditional Egyptian dishes',
      'Cook in an authentic home kitchen with a local expert',
      'Discover the spices and techniques of Egyptian cooking',
      'Enjoy the meal you\'ve prepared with your fellow cooks'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Market Shopping & Cooking Class',
        description: 'Morning meet-up at a central location in Cairo. Begin with a guided tour of a local market where you\'ll learn about Egyptian ingredients and select fresh produce, herbs, and spices for your cooking class. Travel to the host\'s home kitchen, typically in a residential neighborhood. Learn to prepare 3-4 traditional Egyptian dishes, which may include koshari (rice, lentils, and pasta with tomato sauce), molokhia (jute leaf stew), stuffed vine leaves, falafel, or traditional desserts like basbousa. Get hands-on experience with preparing and cooking each dish. After cooking, sit down to enjoy your creations together with your fellow participants and host. Receive recipe cards to take home. The class ends in the early afternoon.',
        meals: ['Lunch'],
        accommodation: 'Not included'
      }
    ],
    image: 'https://images.unsplash.com/photo-1590179068383-b9c69aacebd3?q=80&w=2080',
    images: [
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=2070',
      'https://images.unsplash.com/photo-1585937421612-70a008356c36?q=80&w=2036',
      'https://images.unsplash.com/photo-1596797038430-2ac3699aaede?q=80&w=2075'
    ],
    rating: 4.8,
    reviewCount: 76,
    featured: false,
    tourGuide: {
      languages: ['English', 'Arabic'],
      included: true
    },
    accommodation: {
      type: 'Not included',
      rating: 0,
      included: false
    },
    transportation: {
      type: ['Walking'],
      included: false
    },
    difficulty: 'Easy',
    minimumAge: 8,
    available: 10,
    tags: ['Cooking Class', 'Food', 'Local Experience', 'Market', 'Egyptian Cuisine']
  }
];

export const defaultToursFilter: ToursFilterState = {
  minPrice: 20,
  maxPrice: 1500,
  duration: [],
  categories: [],
  groupSize: 2,
  rating: 0,
  difficulty: []
};

export const filterTours = (tours: Tour[], filters: ToursFilterState): Tour[] => {
  return tours.filter(tour => {
    // Price filter
    if (tour.price < filters.minPrice || tour.price > filters.maxPrice) {
      return false;
    }
    
    // Duration filter
    if (filters.duration.length > 0) {
      let matchesDuration = false;
      for (const dur of filters.duration) {
        if (tour.duration.includes(dur)) {
          matchesDuration = true;
          break;
        }
      }
      if (!matchesDuration) {
        return false;
      }
    }
    
    // Categories filter
    if (filters.categories.length > 0 && !filters.categories.includes(tour.category)) {
      return false;
    }
    
    // Group size filter
    if (filters.groupSize > tour.groupSize.max || filters.groupSize < tour.groupSize.min) {
      return false;
    }
    
    // Rating filter
    if (tour.rating < filters.rating) {
      return false;
    }
    
    // Difficulty filter
    if (filters.difficulty.length > 0 && !filters.difficulty.includes(tour.difficulty)) {
      return false;
    }
    
    return true;
  });
};

export const searchTours = (
  tours: Tour[],
  destination: string,
  date: string,
  duration: string = 'All',
  category: string = 'All'
): Tour[] => {
  return tours.filter(tour => {
    const destinationMatch = 
      tour.destination.toLowerCase().includes(destination.toLowerCase()) || 
      tour.country.toLowerCase().includes(destination.toLowerCase()) ||
      (tour.region && tour.region.toLowerCase().includes(destination.toLowerCase()));
    
    const dateMatch = tour.startDates.includes(date);
    const durationMatch = duration === 'All' || tour.duration.includes(duration);
    const categoryMatch = category === 'All' || tour.category === category;
    
    return destinationMatch && dateMatch && durationMatch && categoryMatch;
  });
};