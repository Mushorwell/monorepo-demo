import { useQuery } from '@tanstack/react-query';
import { DEFAULT_CONFIG } from './authModels';
import { useAuthStore } from './useAuthStore';

export const useAuthStatus = () => {
const { token, tokenData, lastActivity } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'status'],
    queryFn: () => {
      if (!token || !tokenData) return { isValid: false };

      const now = Date.now();
      const tokenAge = now - tokenData.iat * 1000;
      const idleTime = now - lastActivity;

      return {
        isValid:
          tokenAge < DEFAULT_CONFIG.tokenTimeout &&
          idleTime < DEFAULT_CONFIG.idleTimeout,
        timeUntilExpiry: Math.min(
          DEFAULT_CONFIG.tokenTimeout - tokenAge,
          DEFAULT_CONFIG.idleTimeout - idleTime
        ),
      };
    },
    enabled: !!token && !!tokenData,
    refetchInterval: 1000, // Check status every second
  });
};
