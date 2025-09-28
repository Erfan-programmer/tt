export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  status: number;
  error?: {
    message: string;
    code?: string | number;
  };
}
export async function apiRequest<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> {
  try {
    const fetchOptions: RequestInit = { method, headers: { ...headers } };

    if (body) {
      if (body instanceof FormData) fetchOptions.body = body;
      else {
        fetchOptions.body = JSON.stringify(body);
        fetchOptions.headers = {
          "Content-Type": "application/json",
          ...headers,
        };
      }
    }

    const res = await fetch(url, fetchOptions);
    let data: any = {};

    try {
      data = await res.json();
    } catch {}

    if (res.status === 401) {
      if (typeof window !== "undefined") {
        if (typeof window !== "undefined") {
          const redirectTo = window.location.pathname.includes("hrtaamst2025")
            ? "/hrtaamst2025/auth/login"
            : "/login";

          setTimeout(() => {
            window.location.href = redirectTo;
          }, 1500);
        }
      }
      return {
        success: false,
        message: "token is expired please log in again , Redirecting...",
        status: 401,
        error: {
          message: "token is expired please log in again , Redirecting...",
          code: 401,
        },
        data: {} as T,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Request failed",
        status: res.status,
        error: {
          message: data?.message || "Request failed",
          code: data?.error?.code || res.status,
        },
        data: {} as T,
      };
    }

    return {
      success: true,
      data: (data ?? {}) as T,
      message: data?.message || "Request successful",
      status: res.status,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Unexpected error",
      status: 500,
      error: { message: error.message || "Unexpected error", code: 500 },
      data: {} as T,
    };
  }
}
