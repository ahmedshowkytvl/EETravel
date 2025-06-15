import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { ExpressToLaravelAdapter } from "./expressToLaravelAdapter";

// Laravel API base URL - Try multiple potential URLs
const POTENTIAL_LARAVEL_URLS = [
  'http://localhost:8000/api',
  'http://127.0.0.1:8000/api',
  'http://0.0.0.0:8000/api'
];

let LARAVEL_API_BASE = POTENTIAL_LARAVEL_URLS[0];

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Auto-detect working Laravel server
async function findWorkingLaravelServer(): Promise<string | null> {
  for (const baseUrl of POTENTIAL_LARAVEL_URLS) {
    try {
      const response = await fetch(`${baseUrl}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      if (response.ok) {
        LARAVEL_API_BASE = baseUrl;
        return baseUrl;
      }
    } catch (error) {
      // Continue to next URL
      continue;
    }
  }
  return null;
}

export async function laravelApiRequest<T = any>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  const url = `${LARAVEL_API_BASE}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    signal: AbortSignal.timeout(10000), // 10 second timeout
  };

  const mergedOptions = options 
    ? { ...defaultOptions, ...options } 
    : defaultOptions;

  try {
    const res = await fetch(url, mergedOptions);
    await throwIfResNotOk(res);
    return await res.json();
  } catch (error) {
    // If main URL fails, try to find working server
    const workingServer = await findWorkingLaravelServer();
    if (workingServer && workingServer !== LARAVEL_API_BASE) {
      // Retry with working server
      const newUrl = `${workingServer}${endpoint}`;
      const res = await fetch(newUrl, mergedOptions);
      await throwIfResNotOk(res);
      return await res.json();
    }
    
    // Provide clear error message for Laravel server connection issues
    if (error instanceof Error && (error.name === 'TypeError' || error.message.includes('fetch'))) {
      throw new Error(`Laravel server not available at ${LARAVEL_API_BASE}. Database migration required.`);
    }
    throw error;
  }
}

// Laravel API query function for TanStack Query
export const getLaravelQueryFn: <T>() => QueryFunction<T> = () =>
  async ({ queryKey }) => {
    const endpoint = queryKey[0] as string;
    return laravelApiRequest(endpoint);
  };

// Laravel API service class with Express backend adapter
export class LaravelApiService {
  // Destinations
  static async getDestinations() {
    // Use Express backend with Laravel format transformation for authentic data
    return await ExpressToLaravelAdapter.getDestinations();
  }

  static async getDestination(id: string) {
    const destinations = await ExpressToLaravelAdapter.getDestinations();
    const destination = destinations.find(d => d.id === parseInt(id));
    if (!destination) throw new Error(`Destination ${id} not found`);
    return destination;
  }

  // Tours
  static async getTours() {
    return await ExpressToLaravelAdapter.getTours();
  }

  static async getTour(id: string) {
    const tours = await ExpressToLaravelAdapter.getTours();
    const tour = tours.find((t: any) => t.id === parseInt(id));
    if (!tour) throw new Error(`Tour ${id} not found`);
    return tour;
  }

  // Packages
  static async getPackages() {
    return await ExpressToLaravelAdapter.getPackages();
  }

  static async getPackage(id: string) {
    const packages = await ExpressToLaravelAdapter.getPackages();
    const pkg = packages.find((p: any) => p.id === parseInt(id));
    if (!pkg) throw new Error(`Package ${id} not found`);
    return pkg;
  }

  // Hotels
  static async getHotels() {
    return await ExpressToLaravelAdapter.getHotels();
  }

  static async getHotel(id: string) {
    const hotels = await ExpressToLaravelAdapter.getHotels();
    const hotel = hotels.find((h: any) => h.id === parseInt(id));
    if (!hotel) throw new Error(`Hotel ${id} not found`);
    return hotel;
  }

  // Health check
  static async healthCheck() {
    return await ExpressToLaravelAdapter.healthCheck();
  }

  // Authentication
  static async register(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return laravelApiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  static async login(credentials: {
    email: string;
    password: string;
  }) {
    return laravelApiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  static async logout(token: string) {
    return laravelApiRequest('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  // Bookings (requires authentication)
  static async getBookings(token: string) {
    return laravelApiRequest('/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  static async createBooking(bookingData: any, token: string) {
    return laravelApiRequest('/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
  }
}