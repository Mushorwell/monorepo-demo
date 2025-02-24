import { describe, expect, test, vi } from 'vitest';
import { makeFetchCall } from './makeFetchCall';

describe('makeFetchCall', () => {
  const mockFetch = vi.fn();
  const fetchUtil = makeFetchCall({ baseURL: 'https://api.example.com' });

  beforeAll(() => {
    // Mock the global fetch function
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should successfully fetch data with GET method', async () => {
    await expect(fetchUtil.get('')).toHaveBeenCalledWith(
      expect.stringContaining('/endpoint'),
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  });

  test('should handle 404 error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: vi.fn().mockResolvedValueOnce({ message: 'Not Found' }),
    });

    await expect(fetchUtil.get('/non-existent-endpoint')).rejects.toThrow(
      'Not Found'
    );
  });

  test('should retry on failure', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({ data: 'retried' }),
      });

    const result = await fetchUtil.get('/retry-endpoint', { retries: 1 });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ data: 'retried' });
  });

  test('should call onSuccess callback on successful fetch', async () => {
    const onSuccess = vi.fn();
    const mockResponse = { data: 'test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    await fetchUtil.get('/endpoint', {}, { onSuccess });

    expect(onSuccess).toHaveBeenCalledWith(mockResponse);
  });

  test('should call onError callback on fetch error', async () => {
    const onError = vi.fn();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValueOnce({ message: 'Internal Server Error' }),
    });

    await fetchUtil.get('/error-endpoint', {}, { onError });

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });
});
