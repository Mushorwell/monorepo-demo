export interface AuthToken {
  iat: number;
  exp?: number;
  [key: string]: any;
}

export interface AuthConfig {
  tokenTimeout: number;
  idleTimeout: number;
  storageKey: string;
}

export interface AuthState {
  token: string | null;
  tokenData: AuthToken | null;
  lastActivity: number;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
  updateActivity: () => void;
}

export const DEFAULT_CONFIG: AuthConfig = {
  tokenTimeout: 2 * 60 * 60 * 1000, // 2 hours
  idleTimeout: 30 * 60 * 1000, // 30 minutes
  storageKey: 'auth_token',
};
