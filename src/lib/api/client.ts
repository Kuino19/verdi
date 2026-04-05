/**
 * API Client Utility with Centralized Error Handling
 */

import { ApiResponse } from '@/types/api';
import { logger } from '@/lib/logger';

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

class APIClient {
  private baseURL: string;
  private timeout: number = 30000;
  private retries: number = 1;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  /**
   * Main request method with error handling and retries
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeout = this.timeout, retries = this.retries, ...fetchOptions } = options;
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(
            errorData.error || `HTTP ${response.status}: ${response.statusText}`
          );
          (error as any).statusCode = response.status;
          throw error;
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on client errors (4xx) or network errors
        if (
          (error instanceof Error && error.name === 'AbortError') ||
          (error as any).statusCode === 400 ||
          (error as any).statusCode === 401 ||
          (error as any).statusCode === 403 ||
          (error as any).statusCode === 404
        ) {
          throw lastError;
        }

        if (attempt < retries) {
          const backoffMs = Math.pow(2, attempt) * 1000;
          logger.warn(`Request failed, retrying in ${backoffMs}ms`, {
            endpoint,
            attempt,
            error: lastError.message,
          });
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new APIClient();
