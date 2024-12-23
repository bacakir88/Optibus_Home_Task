import { describe, it, expect } from 'vitest';
import { checkDutyConflicts } from '../utils/dutyValidation';
import { Duty } from '../types/duty';

describe('Duty Validation', () => {
  // Helper function to create duties with specific times
  const createDuty = (id: number, start: string, end: string): Duty => ({
    id,
    name: `Duty ${id}`,
    depot: 'Test Depot',
    start,
    end
  });

  describe('Time Overlap Validation', () => {
    it('should detect completely overlapping duties', () => {
      const existingDuty = createDuty(1, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z');
      const newDuty = createDuty(2, '2024-01-01T10:00:00Z', '2024-01-01T16:00:00Z');

      const result = checkDutyConflicts(newDuty, [existingDuty]);
      expect(result).toBe('OVERLAP');
    });

    it('should detect partially overlapping duties (new duty starts during existing)', () => {
      const existingDuty = createDuty(1, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z');
      const newDuty = createDuty(2, '2024-01-01T16:00:00Z', '2024-01-01T20:00:00Z');

      const result = checkDutyConflicts(newDuty, [existingDuty]);
      expect(result).toBe('OVERLAP');
    });

    it('should detect partially overlapping duties (new duty ends during existing)', () => {
      const existingDuty = createDuty(1, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z');
      const newDuty = createDuty(2, '2024-01-01T08:00:00Z', '2024-01-01T10:00:00Z');

      const result = checkDutyConflicts(newDuty, [existingDuty]);
      expect(result).toBe('OVERLAP');
    });

    it('should detect when new duty completely contains existing duty', () => {
      const existingDuty = createDuty(1, '2024-01-01T10:00:00Z', '2024-01-01T16:00:00Z');
      const newDuty = createDuty(2, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z');

      const result = checkDutyConflicts(newDuty, [existingDuty]);
      expect(result).toBe('OVERLAP');
    });

    it('should not detect overlap for adjacent duties', () => {
      const existingDuty = createDuty(1, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z');
      const newDuty = createDuty(2, '2024-01-01T17:00:00Z', '2024-01-01T20:00:00Z');

      const result = checkDutyConflicts(newDuty, [existingDuty]);
      expect(result).toBe('INSUFFICIENT_REST'); // Will fail due to rest period
    });
  });

  describe('Rest Period Validation', () => {
    it('should detect insufficient rest period after existing duty', () => {
      const existingDuty = createDuty(1, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z');
      const newDuty = createDuty(2, '2024-01-01T22:00:00Z', '2024-01-02T06:00:00Z');

      const result = checkDutyConflicts(newDuty, [existingDuty]);
      expect(result).toBe('INSUFFICIENT_REST');
    });

    it('should detect insufficient rest period before existing duty', () => {
      const existingDuty = createDuty(1, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z');
      const newDuty = createDuty(2, '2024-01-01T02:00:00Z', '2024-01-01T06:00:00Z');

      const result = checkDutyConflicts(newDuty, [existingDuty]);
      expect(result).toBe('INSUFFICIENT_REST');
    });

    it('should allow duties with exactly 8 hours rest period', () => {
      const existingDuty = createDuty(1, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z');
      const newDuty = createDuty(2, '2024-01-02T01:00:00Z', '2024-01-02T09:00:00Z');

      const result = checkDutyConflicts(newDuty, [existingDuty]);
      expect(result).toBe(null);
    });

    it('should allow duties with more than 8 hours rest period', () => {
      const existingDuty = createDuty(1, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z');
      const newDuty = createDuty(2, '2024-01-02T02:00:00Z', '2024-01-02T10:00:00Z');

      const result = checkDutyConflicts(newDuty, [existingDuty]);
      expect(result).toBe(null);
    });
  });

  describe('Multiple Existing Duties', () => {
    it('should detect conflicts with any of multiple existing duties', () => {
      const existingDuties = [
        createDuty(1, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z'),
        createDuty(2, '2024-01-02T09:00:00Z', '2024-01-02T17:00:00Z')
      ];
      const newDuty = createDuty(3, '2024-01-01T16:00:00Z', '2024-01-01T20:00:00Z');

      const result = checkDutyConflicts(newDuty, existingDuties);
      expect(result).toBe('OVERLAP');
    });

    it('should pass when no conflicts with any existing duties', () => {
      const existingDuties = [
        createDuty(1, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z'),
        createDuty(2, '2024-01-02T09:00:00Z', '2024-01-02T17:00:00Z')
      ];
      const newDuty = createDuty(3, '2024-01-03T09:00:00Z', '2024-01-03T17:00:00Z');

      const result = checkDutyConflicts(newDuty, existingDuties);
      expect(result).toBe(null);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty existing duties array', () => {
      const newDuty = createDuty(1, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z');
      const result = checkDutyConflicts(newDuty, []);
      expect(result).toBe(null);
    });

    it('should handle duties on different days', () => {
      const existingDuty = createDuty(1, '2024-01-01T09:00:00Z', '2024-01-01T17:00:00Z');
      const newDuty = createDuty(2, '2024-01-03T09:00:00Z', '2024-01-03T17:00:00Z');

      const result = checkDutyConflicts(newDuty, [existingDuty]);
      expect(result).toBe(null);
    });

    it('should handle duties crossing midnight', () => {
      const existingDuty = createDuty(1, '2024-01-01T20:00:00Z', '2024-01-02T04:00:00Z');
      const newDuty = createDuty(2, '2024-01-02T03:00:00Z', '2024-01-02T11:00:00Z');

      const result = checkDutyConflicts(newDuty, [existingDuty]);
      expect(result).toBe('OVERLAP');
    });
  });
});