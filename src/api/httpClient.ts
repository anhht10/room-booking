import { API_BASE_URL } from '../config/api';
import { ApiError, BookingConflictError } from '../types/api';

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function httpClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeoutMs = 8000, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody.message || `Request failed with status ${response.status}`;

      if (response.status === 409) {
        throw new BookingConflictError(message);
      }

      throw new ApiError(message, response.status);
    }

    return (await response.json()) as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new ApiError('Network request timed out. Please check your backend connection.', 408);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error?.message || 'Unable to connect to the campus booking server.',
      500
    );
  }
}

