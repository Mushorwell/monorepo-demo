import { useEffect } from 'react';
import { useAuthStatus } from './useAuthStatus';
import { useAuthStore } from './useAuthStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const updateActivity = useAuthStore((state) => state.updateActivity);
  const { data: authStatus } = useAuthStatus();
  const logout = useAuthStore((state) => state.logout);

  //   // Handle automatic logout
  useEffect(() => {
    if (authStatus && !authStatus.isValid) {
      logout();
    }
  }, [authStatus, logout]);

  // Track user activity
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => updateActivity();

    events.forEach((event) => window.addEventListener(event, handleActivity));
    return () =>
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
  }, [updateActivity]);

  return children;
};
