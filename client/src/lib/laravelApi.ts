import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Laravel API base URL
const LARAVEL_API_BASE = 'http://localhost:8000/api';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
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
  };

  const mergedOptions = options 
    ? { ...defaultOptions, ...options } 
    : defaultOptions;

  const res = await fetch(url, mergedOptions);
  await throwIfResNotOk(res);
  return await res.json();
}

// Laravel API query function for TanStack Query
export const getLaravelQueryFn: <T>() => QueryFunction<T> = () =>
  async ({ queryKey }) => {
    const endpoint = queryKey[0] as string;
    return laravelApiRequest(endpoint);
  };

// Laravel API service class
export class LaravelApiService {
  // Destinations
  static async getDestinations() {
    return laravelApiRequest('/destinations');
  }

  static async getDestination(id: string) {
    return laravelApiRequest(`/destinations/${id}`);
  }

  // Tours
  static async getTours() {
    return laravelApiRequest('/tours');
  }

  static async getTour(id: string) {
    return laravelApiRequest(`/tours/${id}`);
  }

  // Packages
  static async getPackages() {
    return laravelApiRequest('/packages');
  }

  static async getPackage(id: string) {
    return laravelApiRequest(`/packages/${id}`);
  }

  // Hotels
  static async getHotels() {
    return laravelApiRequest('/hotels');
  }

  static async getHotel(id: string) {
    return laravelApiRequest(`/hotels/${id}`);
  }

  // Health check
  static async healthCheck() {
    return laravelApiRequest('/health');
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