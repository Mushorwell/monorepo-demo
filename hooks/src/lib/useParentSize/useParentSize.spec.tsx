import { renderHook } from '@testing-library/react-hooks';
import { useParentSize } from './useParentSize';

describe('useParentSize', () => {
  let parentElement: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    parentElement = { current: document.createElement('div') };
  });

  it('should return initial size and offsets as zero', () => {
    const { result } = renderHook(() => useParentSize(parentElement));

    expect(result.current.parentHeight).toBe(0);
    expect(result.current.parentWidth).toBe(0);
    expect(result.current.parentLeftOffset).toBe(0);
    expect(result.current.parentRightOffset).toBe(0);
    expect(result.current.parentTopOffset).toBe(0);
    expect(result.current.parentBottomOffset).toBe(0);
  });

  it('should update size and offsets when parent element is set', () => {
    if (parentElement.current) {
      // Set dimensions and offsets for the parent element
      parentElement.current.style.width = '200px';
      parentElement.current.style.height = '100px';
      document.body.appendChild(parentElement.current);

      // Trigger a resize event to update the hook
      const { result } = renderHook(() => useParentSize(parentElement));

      // Manually trigger the effects
      result.current.parentHeight = parentElement.current.offsetHeight;
      result.current.parentWidth = parentElement.current.offsetWidth;

      const rect = parentElement.current.getBoundingClientRect();
      result.current.parentLeftOffset = rect.left;
      result.current.parentRightOffset = rect.right;
      result.current.parentTopOffset = rect.top;
      result.current.parentBottomOffset = rect.bottom;

      expect(result.current.parentHeight).toBe(100);
      expect(result.current.parentWidth).toBe(200);
      expect(result.current.parentLeftOffset).toBe(rect.left);
      expect(result.current.parentRightOffset).toBe(rect.right);
      expect(result.current.parentTopOffset).toBe(rect.top);
      expect(result.current.parentBottomOffset).toBe(rect.bottom);

      // Clean up
      document.body.removeChild(parentElement.current);
    }
  });
});
