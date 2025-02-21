import { act, renderHook } from '@testing-library/react-hooks';
import { useIdleEventHandler } from './useIdleEventHandler';

vi.mock('react-idle-timer');

describe('useIdleEventHandler', () => {
  const onIdle = vi.fn();
  const onIdleHandler = vi.fn();
  const idleTime = 7200; // 2 hours

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onIdleHandler when idle', () => {
    const { result } = renderHook(() =>
      useIdleEventHandler({ onIdle, onIdleHandler, idleTime })
    );

    act(() => {
      // Simulate idle event
      result.current.idleTimer.isIdle();
    });

    expect(result.current.isIdle).toBe(true);
    expect(onIdleHandler).toHaveBeenCalled();
  });

  it('should call onIdle when prompted', () => {
    const { result } = renderHook(() =>
      useIdleEventHandler({ onIdle, onIdleHandler, idleTime })
    );

    act(() => {
      // Simulate prompt event
      result.current.idleTimer.isPrompted();
    });

    expect(onIdle).toHaveBeenCalled();
  });
});
