import { act, renderHook } from '@testing-library/react-hooks';
import { useListPagination2 } from './usePagination';

describe('useListPagination2', () => {
  const mockItems = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    content: `Item ${i + 1}`,
  }));

  it('should initialize with the correct current page and items', () => {
    const { result } = renderHook(() =>
      useListPagination2({ items: mockItems, itemsPerPage: 3 })
    );

    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageItems).toEqual(mockItems.slice(0, 3));
  });

  it('should change the current page correctly', () => {
    const { result } = renderHook(() =>
      useListPagination2({ items: mockItems, itemsPerPage: 3 })
    );

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageItems).toEqual(mockItems.slice(3, 6));
  });

  it('should not change to a page greater than the number of pages', () => {
    const { result } = renderHook(() =>
      useListPagination2({ items: mockItems, itemsPerPage: 3 })
    );

    act(() => {
      result.current.setCurrentPage(4); // There are only 4 pages (1-4)
    });

    expect(result.current.currentPage).toBe(4);
    expect(result.current.pageItems).toEqual(mockItems.slice(9, 10)); // Last page
  });

  it('should provide next and previous controls', () => {
    const { result } = renderHook(() =>
      useListPagination2({ items: mockItems, itemsPerPage: 3 })
    );

    // Test next control
    act(() => {
      result.current.nextControl &&
        result.current.nextControl.onClick &&
        result.current.nextControl.onClick(result.current.currentPage);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageItems).toEqual(mockItems.slice(3, 6));

    // Test previous control
    act(() => {
      result.current.prevControl &&
        result.current.prevControl.onClick &&
        result.current.prevControl.onClick(result.current.currentPage);
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageItems).toEqual(mockItems.slice(0, 3));
  });

  it('should handle initialPage correctly', () => {
    const { result } = renderHook(() =>
      useListPagination2({ items: mockItems, itemsPerPage: 3, initialPage: 2 })
    );

    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageItems).toEqual(mockItems.slice(3, 6));
  });
});
