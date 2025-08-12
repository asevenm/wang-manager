// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Fetch Options
export interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

// Error Types
export interface ApiError {
  success: false;
  message: string;
  code?: number;
  details?: any;
}