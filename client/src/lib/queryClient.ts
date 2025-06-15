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
  // Route all API requests through Laravel backend
  const laravelUrl = url.startsWith('/api') 
    ? `http://localhost:8000${url}` 
    : `http://localhost:8000/api${url}`;

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

  const res = await fetch(laravelUrl, mergedOptions);
  await throwIfResNotOk(res);
  const data = await res.json();
  
  // Handle Laravel API response format
  return data.data || data;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options?: {
  on401?: UnauthorizedBehavior;
}) => QueryFunction<T> =
  (options) =>
  async ({ queryKey }) => {
    const unauthorizedBehavior = options?.on401 || "throw";
    
    // Route all queries through Laravel backend
    const url = queryKey[0] as string;
    const laravelUrl = url.startsWith('/api') 
      ? `http://localhost:8000${url}` 
      : `http://localhost:8000/api${url}`;
    
    const res = await fetch(laravelUrl, {
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
    
    // Handle Laravel API response format
    return data.data || data;
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
