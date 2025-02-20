import { describe, expect, it, vi } from 'vitest';
import { search } from './search';

describe('search utility', () => {
  const mockSetSearchResults = vi.fn();

  const data = [
    { id: 1, name: 'Apple', category: 'Fruit' },
    { id: 2, name: 'Banana', category: 'Fruit' },
    { id: 3, name: 'Carrot', category: 'Vegetable' },
  ];

  it('should return all data when searchTerm is empty', () => {
    search('', data, mockSetSearchResults);
    expect(mockSetSearchResults).toHaveBeenCalledWith(data);
  });

  it('should filter results based on searchTerm', () => {
    search('apple', data, mockSetSearchResults);
    expect(mockSetSearchResults).toHaveBeenCalledWith([data[0]]);
  });

  it('should be case insensitive when filtering', () => {
    search('BANANA', data, mockSetSearchResults);
    expect(mockSetSearchResults).toHaveBeenCalledWith([data[1]]);
  });

  it('should return an empty array if no matches are found', () => {
    search('grape', data, mockSetSearchResults);
    expect(mockSetSearchResults).toHaveBeenCalledWith([]);
  });

  it('should handle searchTerm with leading/trailing spaces', () => {
    search('  carrot  ', data, mockSetSearchResults);
    expect(mockSetSearchResults).toHaveBeenCalledWith([data[2]]);
  });
});
