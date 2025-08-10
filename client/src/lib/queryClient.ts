import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  const isFormData = data instanceof FormData;
  const headers: Record<string, string> = {};

  if (data && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Add JWT token header if user is logged in
  const token = localStorage.getItem('token');
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
    credentials: "include",
  });

  // Handle 401 responses (token expired or invalid)
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Authentication failed');
  }

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const url = Array.isArray(queryKey) ? queryKey.join("/") : queryKey as string;
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    const token = localStorage.getItem('token');
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch(fullUrl, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const url = Array.isArray(queryKey) ? queryKey.join("/") : queryKey as string;
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const res = await fetch(fullUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Authentication failed');
        }

        await throwIfResNotOk(res);
        return await res.json();
      },
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
