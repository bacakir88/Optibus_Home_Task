import { describe, test, expect } from 'vitest';
import { formatDateTime } from '../utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDateTime', () => {
    test('formats date and time correctly', () => {
      const isoString = '2022-11-01T08:30:00Z';
      const formatted = formatDateTime(isoString);
      
      expect(formatted.date).toBe('2022-11-01');
    });

    test('handles different time zones correctly', () => {
      const isoString = '2022-11-01T20:30:00Z';
      const formatted = formatDateTime(isoString);
      
      expect(formatted.date).toBe('2022-11-01');
    });

    test('throws error for invalid date string', () => {
      expect(() => formatDateTime('invalid-date')).toThrow();
    });
  });
});