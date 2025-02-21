import { useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';

interface UseIdleEventHandlerProps {
  onIdleHandler: () => void; // function to handle event when user is idle for given timeout duration
  onIdle: () => void; // function to prompt idling user when close to timeout
  idleTime: number; // seconds
}

export const useIdleEventHandler = ({
  onIdle,
  onIdleHandler,
  idleTime = 7200, // 2hrs default idle timeout period
}: UseIdleEventHandlerProps) => {
  const idleTimeout = 1000 * idleTime;
  const [isIdle, setIdle] = useState(false);

  const handleIdle = () => {
    setIdle(true);
    onIdleHandler();
  };

  const idleTimer = useIdleTimer({
    timeout: idleTimeout,
    promptTimeout: idleTimeout / 2,
    onPrompt: onIdle,
    onIdle: handleIdle,
    debounce: 1000 * (idleTime - 60),
  });

  return {
    isIdle,
    setIdle,
    idleTimer,
  };
};
