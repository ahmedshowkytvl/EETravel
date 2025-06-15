// Mock data for demonstration when Laravel server is not available
// This provides a consistent interface for testing the frontend components

export const mockDestinations = [
  {
    id: 1,
    name: "Cairo",
    description: "Discover the ancient wonders of Egypt's capital city, home to the Great Pyramids and rich Islamic heritage.",
    country_id: 1,
    is_featured: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    country: {
      id: 1,
      name: "Egypt",
      code: "EG",
      currency: "EGP"
    }
  },
  {
    id: 2,
    name: "Petra",
    description: "Explore the rose-red city carved into rock, one of the New Seven Wonders of the World.",
    country_id: 2,
    is_featured: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    country: {
      id: 2,
      name: "Jordan",
      code: "JO",
      currency: "JOD"
    }
  },
  {
    id: 3,
    name: "Marrakech",
    description: "Experience the vibrant souks, stunning architecture, and rich culture of Morocco's imperial city.",
    country_id: 3,
    is_featured: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    country: {
      id: 3,
      name: "Morocco",
      code: "MA",
      currency: "MAD"
    }
  }
];

export const mockTours = [
  {
    id: 1,
    title: "Pyramids and Sphinx Tour",
    description: "Full day tour of Giza Pyramids and the Great Sphinx",
    destination_id: 1,
    price: 150,
    duration: "8 hours",
    max_participants: 20
  },
  {
    id: 2,
    title: "Petra Historical Walk",
    description: "Guided tour through the ancient Nabataean city",
    destination_id: 2,
    price: 200,
    duration: "6 hours",
    max_participants: 15
  }
];

export const mockPackages = [
  {
    id: 1,
    name: "Egypt Explorer",
    description: "7-day comprehensive tour of Egypt's highlights",
    price: 1200,
    duration_days: 7,
    destinations: ["Cairo", "Luxor", "Aswan"]
  },
  {
    id: 2,
    name: "Jordan Adventure",
    description: "5-day journey through Jordan's ancient sites",
    price: 950,
    duration_days: 5,
    destinations: ["Amman", "Petra", "Wadi Rum"]
  }
];

export const mockHotels = [
  {
    id: 1,
    name: "Cairo Grand Hotel",
    description: "Luxury hotel in the heart of Cairo",
    destination_id: 1,
    rating: 5,
    price_per_night: 120
  },
  {
    id: 2,
    name: "Petra Heritage Hotel",
    description: "Traditional hotel near Petra entrance",
    destination_id: 2,
    rating: 4,
    price_per_night: 85
  }
];

export const mockHealthStatus = {
  status: "OK",
  message: "API is running",
  timestamp: new Date().toISOString(),
  version: "1.0.0"
};