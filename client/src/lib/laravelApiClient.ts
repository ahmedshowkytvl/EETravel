// Laravel API Client - Complete replacement for Express.js backend
const LARAVEL_API_BASE = import.meta.env.VITE_LARAVEL_API_URL || 'http://127.0.0.1:8000/api';

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  meta?: any;
}

class LaravelApiClient {
  private baseURL: string;

  constructor(baseURL: string = LARAVEL_API_BASE) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`Laravel API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }

  // Countries API
  async getCountries(active?: boolean) {
    const params = active !== undefined ? `?active=${active}` : '';
    return this.makeRequest(`/countries${params}`);
  }

  async getCountry(id: string) {
    return this.makeRequest(`/countries/${id}`);
  }

  async getCountryByCode(code: string) {
    return this.makeRequest(`/countries/code/${code}`);
  }

  async getCountryCities(id: string) {
    return this.makeRequest(`/countries/${id}/cities`);
  }

  // Destinations API
  async getDestinations() {
    return this.makeRequest('/destinations');
  }

  async getDestination(id: string) {
    return this.makeRequest(`/destinations/${id}`);
  }

  // Tours API
  async getTours() {
    return this.makeRequest('/tours');
  }

  async getTour(id: string) {
    return this.makeRequest(`/tours/${id}`);
  }

  // Packages API
  async getPackages() {
    return this.makeRequest('/packages');
  }

  async getPackage(id: string) {
    return this.makeRequest(`/packages/${id}`);
  }

  // Hotels API
  async getHotels() {
    return this.makeRequest('/hotels');
  }

  async getHotel(id: string) {
    return this.makeRequest(`/hotels/${id}`);
  }

  // Authentication API
  async register(userData: any) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: any) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(token: string) {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getUser(token: string) {
    return this.makeRequest('/auth/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Menu API
  async getMenus() {
    return this.makeRequest('/menus');
  }

  async getMenuByLocation(location: string) {
    return this.makeRequest(`/menus/location/${location}`);
  }

  // Bookings API (authenticated)
  async getBookings(token: string) {
    return this.makeRequest('/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async createBooking(bookingData: any, token: string) {
    return this.makeRequest('/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
  }

  async getBooking(id: string, token: string) {
    return this.makeRequest(`/bookings/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateBooking(id: string, updates: any, token: string) {
    return this.makeRequest(`/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
  }
}

// Export singleton instance
export const laravelApi = new LaravelApiClient();
export default laravelApi;