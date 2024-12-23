import { renderHook, act } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { useDutyManagement } from '../hooks/useDutyManagement';
import { Duty } from '../types/duty';

// Mock checkDutyConflicts utility
vi.mock('../../utils/dutyValidation', () => ({
  checkDutyConflicts: vi.fn((duty, assignedDuties) => {
    // Simple mock implementation for overlap check
    if (duty.id === 999) return 'OVERLAP';
    if (duty.id === 888) return 'INSUFFICIENT_REST';
    return null;
  })
}));

describe('useDutyManagement', () => {
  const mockDuties: Duty[] = [
    {
      id: 1,
      name: 'Duty 1',
      depot: 'Depot A',
      start: '2024-01-01T09:00:00Z',
      end: '2024-01-01T17:00:00Z'
    },
    {
      id: 2,
      name: 'Duty 2',
      depot: 'Depot B',
      start: '2024-01-01T10:00:00Z',
      end: '2024-01-01T18:00:00Z'
    }
  ];

  const overlappingDuty: Duty = {
    id: 999,
    name: 'Overlapping Duty',
    depot: 'Depot C',
    start: '2024-01-01T16:00:00Z',
    end: '2024-01-01T20:00:00Z'
  };

  const insufficientRestDuty: Duty = {
    id: 888,
    name: 'Insufficient Rest Duty',
    depot: 'Depot D',
    start: '2024-01-01T23:00:00Z',
    end: '2024-01-02T07:00:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.alert
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  test('initializes with provided duties', () => {
    const { result } = renderHook(() => useDutyManagement(mockDuties));
    
    expect(result.current.availableDuties).toEqual(mockDuties);
    expect(result.current.assignedDuties).toEqual([]);
  });

  test('assigns duty successfully', () => {
    const { result } = renderHook(() => useDutyManagement(mockDuties));

    act(() => {
      result.current.assignDuty(mockDuties[0]);
    });

    expect(result.current.assignedDuties).toEqual([mockDuties[0]]);
    expect(result.current.availableDuties).toEqual([mockDuties[1]]);
  });

  test('prevents assigning overlapping duty', () => {
    const { result } = renderHook(() => useDutyManagement([overlappingDuty]));

    act(() => {
      result.current.assignDuty(overlappingDuty);
    });

    expect(result.current.assignedDuties.length).toEqual(1);
    expect(result.current.availableDuties).toEqual([]);
  });

  test('prevents assigning duty with insufficient rest', () => {
    const { result } = renderHook(() => useDutyManagement([insufficientRestDuty]));

    act(() => {
      result.current.assignDuty(insufficientRestDuty);
    });

    expect(result.current.assignedDuties.length).toEqual(1);
    expect(result.current.availableDuties).toEqual([]);
  });

  test('unassigns duty successfully', () => {
    const { result } = renderHook(() => useDutyManagement(mockDuties));

    // First assign a duty
    act(() => {
      result.current.assignDuty(mockDuties[0]);
    });

    // Then unassign it
    act(() => {
      result.current.unassignDuty(mockDuties[0]);
    });

    expect(result.current.assignedDuties).toEqual([]);
    expect(result.current.availableDuties).toEqual(mockDuties);
  });

  test('maintains sorted order when unassigning duties', () => {
    const { result } = renderHook(() => useDutyManagement(mockDuties));

    // Assign duties in different order
    act(() => {
      result.current.assignDuty(mockDuties[1]); // id: 2
      result.current.assignDuty(mockDuties[0]); // id: 1
    });

    // Unassign duty with id: 2
    act(() => {
      result.current.unassignDuty(mockDuties[1]);
    });

    // Available duties should be sorted by id
    expect(result.current.availableDuties[0].id).toBe(2);
  });

  test('handles multiple duty assignments', () => {
    const { result } = renderHook(() => useDutyManagement(mockDuties));

    act(() => {
      result.current.assignDuty(mockDuties[0]);
      result.current.assignDuty(mockDuties[1]);
    });

    expect(result.current.assignedDuties).toEqual(mockDuties);
    expect(result.current.availableDuties).toEqual([]);
  });

  test('handles multiple duty unassignments', () => {
    const { result } = renderHook(() => useDutyManagement(mockDuties));

    // Assign both duties
    act(() => {
      result.current.assignDuty(mockDuties[0]);
      result.current.assignDuty(mockDuties[1]);
    });

    // Unassign both duties
    act(() => {
      result.current.unassignDuty(mockDuties[1]);
      result.current.unassignDuty(mockDuties[0]);
    });

    expect(result.current.assignedDuties).toEqual([]);
    expect(result.current.availableDuties).toEqual(mockDuties);
  });
});