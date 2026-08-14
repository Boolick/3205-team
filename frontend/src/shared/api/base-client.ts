export interface ApiErrorPayload {
  statusCode: number;
  message: string;
  errors?: string[];
  timestamp?: string;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: string[];
  public readonly timestamp: string;

  constructor(data: ApiErrorPayload) {
    super(data.message || 'API request failed');
    this.name = 'ApiError';
    this.statusCode = data.statusCode;
    this.errors = data.errors || [];
    this.timestamp = data.timestamp || new Date().toISOString();
  }
}

export const API_BASE = '/api';

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiErrorPayload;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        statusCode: response.status,
        message: response.statusText || 'Unknown server error',
        errors: [],
        timestamp: new Date().toISOString(),
      };
    }
    throw new ApiError(errorData);
  }
  return response.json() as Promise<T>;
}
