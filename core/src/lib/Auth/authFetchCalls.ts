import { makeFetchCall } from '@monorepo-demo/utilities';
import { useAuthStore } from './AuthStore';

export const authFetchCall = makeFetchCall({
  baseURL: process.env.REACT_APP_API_URL,
  defaultHeaders: {
    Accept: 'application/json',
  },
  responseHandlers: {
    401: async (response) => {
      const error = await response.json();
      useAuthStore.getState().logout();
      throw error;
    },
  },
});

export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    authFetchCall.post<typeof credentials, { token: string }>(
      '/auth/login',
      credentials
    ),

  refreshToken: () =>
    authFetchCall.post<void, { token: string }>('/auth/refresh', undefined),

  logout: () => authFetchCall.post<void, void>('/auth/logout', undefined),
};
