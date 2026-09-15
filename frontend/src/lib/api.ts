import axios, {
  type AxiosError,
  type AxiosRequestConfig,
} from 'axios';

/**
 * API Base URL
 *
 * Supports both:
 * - VITE_API_BASE_URL (Admin module)
 * - VITE_API_URL (existing Public website)
 * - /api fallback
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  '/api';

/**
 * Admin authentication token storage key.
 */
export const TOKEN_STORAGE_KEY =
  'digixdubai_admin_token';

/**
 * Get stored authentication token.
 */
export function getStoredToken(): string | null {
  return localStorage.getItem(
    TOKEN_STORAGE_KEY
  );
}

/**
 * Store or remove authentication token.
 */
export function setStoredToken(
  token: string | null
): void {
  if (token) {
    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      token
    );
  } else {
    localStorage.removeItem(
      TOKEN_STORAGE_KEY
    );
  }
}

/**
 * API client.
 *
 * All admin/public API requests can use this
 * centralized Axios instance.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

/**
 * Automatically attach Bearer token
 * to every API request when available.
 */
api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers = config.headers ?? {};

    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

/**
 * One centralized handler for unauthorized
 * responses (401).
 */
let onUnauthorized:
  | (() => void)
  | null = null;

export function registerUnauthorizedHandler(
  handler: () => void
): void {
  onUnauthorized = handler;
}

/**
 * Standardized API error shape.
 */
export interface ApiError {
  status: number | null;
  message: string;

  /**
   * Laravel validation errors.
   *
   * Example:
   * {
   *   email: ["The email field is required."]
   * }
   */
  errors?: Record<string, string[]>;
}

/**
 * Convert Axios/Laravel errors into
 * one predictable error structure.
 */
function normalizeError(
  error: AxiosError
): ApiError {
  const status =
    error.response?.status ?? null;

  const data =
    error.response?.data as
      | {
          message?: string;
          errors?: Record<
            string,
            string[]
          >;
        }
      | undefined;

  if (status === 422 && data?.errors) {
    return {
      status,
      message:
        data.message ||
        'Please fix the errors below.',
      errors: data.errors,
    };
  }

  if (status === 401) {
    return {
      status,
      message:
        data?.message ||
        'Your session has expired. Please sign in again.',
    };
  }

  if (status === 403) {
    return {
      status,
      message:
        data?.message ||
        'You don’t have permission to do that.',
    };
  }

  if (status === 404) {
    return {
      status,
      message:
        data?.message ||
        'Not found.',
    };
  }

  if (!error.response) {
    return {
      status: null,
      message:
        'Network error — couldn’t reach the server.',
    };
  }

  return {
    status,
    message:
      data?.message ||
      'Something went wrong. Please try again.',
  };
}

/**
 * Global response handling.
 *
 * On 401:
 * - Remove saved token
 * - Run registered unauthorized handler
 * - Return normalized error
 */
api.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    if (
      error.response?.status === 401
    ) {
      setStoredToken(null);
      onUnauthorized?.();
    }

    return Promise.reject(
      normalizeError(error)
    );
  }
);

/**
 * Generic Laravel paginated response.
 *
 * Supports:
 *
 * 1. Laravel default paginator:
 * {
 *   data: [],
 *   current_page: 1,
 *   last_page: 5,
 *   per_page: 20,
 *   total: 100
 * }
 *
 * 2. API responses with meta:
 * {
 *   data: [],
 *   meta: {
 *     current_page: 1,
 *     last_page: 5,
 *     per_page: 20,
 *     total: 100
 *   }
 * }
 */
export interface PaginatedResponse<T> {
  data: T[];

  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };

  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

/**
 * Normalize different Laravel pagination
 * response formats into one format.
 */
export function normalizePaginated<T>(
  payload: PaginatedResponse<T>
) {
  const data = Array.isArray(payload.data)
    ? payload.data
    : [];

  return {
    data,

    currentPage:
      payload.meta?.current_page ??
      payload.current_page ??
      1,

    lastPage:
      payload.meta?.last_page ??
      payload.last_page ??
      1,

    perPage:
      payload.meta?.per_page ??
      payload.per_page ??
      data.length,

    total:
      payload.meta?.total ??
      payload.total ??
      data.length,
  };
}

/**
 * GET request helper.
 */
export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response =
    await api.get<T>(url, config);

  return response.data;
}

/**
 * POST request helper.
 */
export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response =
    await api.post<T>(
      url,
      body,
      config
    );

  return response.data;
}

/**
 * PUT request helper.
 */
export async function apiPut<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response =
    await api.put<T>(
      url,
      body,
      config
    );

  return response.data;
}

/**
 * PATCH request helper.
 */
export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response =
    await api.patch<T>(
      url,
      body,
      config
    );

  return response.data;
}

/**
 * DELETE request helper.
 */
export async function apiDelete<T = void>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response =
    await api.delete<T>(
      url,
      config
    );

  return response.data;
}

/**
 * Default export.
 */
export default api;
