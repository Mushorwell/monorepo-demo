import { describe, expect, it } from 'vitest';
import { formatCurrency, formatPhoneNumber } from './number';

describe('formatCurrency', () => {
  it('should format currency correctly for ZAR', () => {
    expect(formatCurrency(1234.56)).toBe(
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ZAR',
      }).format(1234.56)
    );
  });

  it('should format currency correctly for USD', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('should return short form for ZAR', () => {
    expect(formatCurrency(1234.56, 'ZAR', false)).toBe(
      new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
      }).format(1234.56)
    );
  });

  it('should return long form for ZAR when internationalFormat is true', () => {
    expect(formatCurrency(1234.56, 'ZAR', true)).toBe(
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ZAR',
      }).format(1234.56)
    );
  });
});

describe('formatPhoneNumber', () => {
  it('should format a valid phone number', () => {
    expect(formatPhoneNumber('1234567890')).toBe('123 456 7890');
  });

  it('should return null for an invalid phone number', () => {
    expect(formatPhoneNumber('12345')).toBe(null);
  });

  it('should handle phone numbers with non-digit characters', () => {
    expect(formatPhoneNumber('(123) 456-7890')).toBe('123 456 7890');
  });

  it('should handle phone numbers with leading/trailing spaces', () => {
    expect(formatPhoneNumber('   123 456 7890   ')).toBe('123 456 7890');
  });
});
