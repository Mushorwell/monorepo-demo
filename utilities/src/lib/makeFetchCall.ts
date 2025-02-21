declare global {
  interface Window {
    fetch: typeof fetch;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface Options<TRequestData> {
  method: HttpMethod;
  data?: TRequestData;
  headers?: Record<string, string>;
  timeoutMs?: number;
  retries?: number;
  retryDelay?: number;
}

export interface FetchCallbacks<TResponseData, TErrorData> {
  onSuccess?: (data: TResponseData) => void;
  onError?: (error: TErrorData) => void;
  onFinally?: () => void;
}

interface ResponseHandlers {
  [key: number]: (response: Response) => Promise<any>;
}

interface FetchConfig {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  defaultTimeoutMs?: number;
  responseHandlers?: ResponseHandlers;
  authToken?: any;
}

// Default response handlers for common status codes
const defaultResponseHandlers: ResponseHandlers = {
  200: (response: Response) => response.json(),
  201: (response: Response) => response.json(),
  204: () => Promise.resolve(null),
  400: (response: Response) => response.json(),
  401: (response: Response) => {
    // Handle unauthorized - could redirect to login
    throw new Error('Unauthorized');
  },
  403: (response: Response) => {
    throw new Error('Forbidden');
  },
  404: (response: Response) => {
    throw new Error('Not Found');
  },
  500: (response: Response) => {
    throw new Error('Internal Server Error');
  },
};

// Create the fetch utility with configuration
export const makeFetchCall = (config: FetchConfig = {}) => {
  const {
    baseURL = '',
    defaultHeaders = {},
    defaultTimeoutMs = 5000,
    responseHandlers = {},
    authToken,
  } = config;

  // Merge default and custom response handlers
  const handlers = { ...defaultResponseHandlers, ...responseHandlers };

  // Main fetch function
  async function fetchCall<TRequestData, TResponseData, TErrorData = any>(
    url: string,
    options: Options<TRequestData>,
    callbacks?: FetchCallbacks<TResponseData, TErrorData>,
    token?: any
  ): Promise<TResponseData> {
    const {
      method,
      data,
      headers = {},
      timeoutMs = defaultTimeoutMs,
      retries = 0,
      retryDelay = 1000,
    } = options;

    const addAuthHeaders = (headers: Record<string, string>) => {
      if (token && typeof token === 'string') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      return headers;
    };

    const { onSuccess, onError, onFinally } = callbacks || {};

    // Construct full URL
    const fullUrl = `${baseURL}${url}`;

    // Merge headers
    const fullHeaders = {
      ...addAuthHeaders(defaultHeaders),
      ...headers,
      'Content-Type': 'application/json',
    };

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method,
        headers: fullHeaders,
        signal: controller.signal,
      };

      // Add body for non-GET requests
      if (method !== 'GET' && data) {
        // Check if data is FormData
        if (data instanceof FormData) {
          fetchOptions.body = data; // Directly use FormData
        } else {
          fetchOptions.body = JSON.stringify(data); // Stringify for JSON
        }
      }

      // Make the fetch call
      const response = await fetch(fullUrl, fetchOptions);
      clearTimeout(timeoutId);

      // Handle response based on status code
      const handler = handlers[response.status as number];
      if (handler) {
        const result = await handler(response);
        if (response.ok) {
          onSuccess?.(result);
          return result;
        } else {
          throw result;
        }
      }

      // Handle unexpected status codes
      throw new Error(`Unhandled status code: ${response.status}`);
    } catch (error) {
      // Handle retries
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return fetchCall(
          url,
          { ...options, retries: retries - 1 },
          callbacks,
          authToken
        );
      }

      onError?.(error as TErrorData);
      throw error;
    } finally {
      onFinally?.();
    }
  }

  // Helper methods for common HTTP methods
  return {
    get: <TResponseData, TErrorData = any>(
      url: string,
      options?: Omit<Options<never>, 'method'>,
      callbacks?: FetchCallbacks<TResponseData, TErrorData>
    ) =>
      fetchCall<never, TResponseData, TErrorData>(
        url,
        { ...options, method: 'GET' },
        callbacks,
        authToken
      ),

    post: <TRequestData, TResponseData, TErrorData = any>(
      url: string,
      data: TRequestData,
      options?: Omit<Options<TRequestData>, 'method' | 'data'>,
      callbacks?: FetchCallbacks<TResponseData, TErrorData>
    ) =>
      fetchCall<TRequestData, TResponseData, TErrorData>(
        url,
        { ...options, method: 'POST', data },
        callbacks,
        authToken
      ),

    put: <TRequestData, TResponseData, TErrorData = any>(
      url: string,
      data: TRequestData,
      options?: Omit<Options<TRequestData>, 'method' | 'data'>,
      callbacks?: FetchCallbacks<TResponseData, TErrorData>
    ) =>
      fetchCall<TRequestData, TResponseData, TErrorData>(
        url,
        { ...options, method: 'PUT', data },
        callbacks,
        authToken
      ),

    patch: <TRequestData, TResponseData, TErrorData = any>(
      url: string,
      data: TRequestData,
      options?: Omit<Options<TRequestData>, 'method' | 'data'>,
      callbacks?: FetchCallbacks<TResponseData, TErrorData>
    ) =>
      fetchCall<TRequestData, TResponseData, TErrorData>(
        url,
        { ...options, method: 'PATCH', data },
        callbacks,
        authToken
      ),

    delete: <TResponseData, TErrorData = any>(
      url: string,
      options?: Omit<Options<never>, 'method'>,
      callbacks?: FetchCallbacks<TResponseData, TErrorData>
    ) =>
      fetchCall<never, TResponseData, TErrorData>(
        url,
        { ...options, method: 'DELETE' },
        callbacks,
        authToken
      ),
  };
};
