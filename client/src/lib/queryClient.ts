import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = any>(
  url: string, 
  options?: RequestInit
): Promise<T> {
  // Use Laravel API compatibility layer in Express.js
  const apiUrl = url.startsWith('/api') ? url : `/api${url}`;

  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    credentials: "include",
  };

  const mergedOptions = options 
    ? { ...defaultOptions, ...options } 
    : defaultOptions;

  // Try Express.js with Laravel API compatibility first
  try {
    const res = await fetch(apiUrl, mergedOptions);
    await throwIfResNotOk(res);
    const data = await res.json();
    return data.data || data;
  } catch (error) {
    console.error('Express countries API failed, using direct database approach:', error);
    
    // Fallback to Laravel compatibility endpoints
    const laravelApiUrl = url.replace('/api/', '/laravel-api/');
    const fallbackRes = await fetch(laravelApiUrl, mergedOptions);
    await throwIfResNotOk(fallbackRes);
    const fallbackData = await fallbackRes.json();
    return fallbackData.data || fallbackData;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options?: {
  on401?: UnauthorizedBehavior;
}) => QueryFunction<T> =
  (options) =>
  async ({ queryKey }) => {
    const unauthorizedBehavior = options?.on401 || "throw";
    
    // Use Express.js API endpoints with Laravel compatibility
    const url = queryKey[0] as string;
    const apiUrl = url.startsWith('/api') ? url : `/api${url}`;
    
    // Try Express.js API first
    try {
      const res = await fetch(apiUrl, {
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      return data.data || data;
    } catch (error) {
      console.error('Express countries API failed, using direct database approach:', error);
      
      // Fallback to Laravel compatibility endpoints
      const laravelApiUrl = url.replace('/api/', '/laravel-api/');
      const fallbackRes = await fetch(laravelApiUrl, {
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      });

      if (unauthorizedBehavior === "returnNull" && fallbackRes.status === 401) {
        return null;
      }

      await throwIfResNotOk(fallbackRes);
      const fallbackData = await fallbackRes.json();
      return fallbackData.data || fallbackData;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
