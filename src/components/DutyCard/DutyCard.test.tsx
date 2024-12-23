import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DutyCard } from './DutyCard';

const mockDuty = {
  id: 1,
  name: "Test Duty",
  depot: "Test Depot",
  start: "2022-11-01T08:00:00Z",
  end: "2022-11-01T16:00:00Z"
};

describe('DutyCard Component', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('renders duty information correctly', () => {
    render(<DutyCard duty={mockDuty} onClick={mockOnClick} />);

    expect(screen.getByText('Test Duty')).toBeInTheDocument();
    expect(screen.getByText('Test Depot')).toBeInTheDocument();
    expect(screen.getByText('Date: 2022-11-01')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    render(<DutyCard duty={mockDuty} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByText('Test Duty'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('has correct data-testid', () => {
    render(<DutyCard duty={mockDuty} onClick={mockOnClick} />);
    
    expect(screen.getByTestId('duty-1')).toBeInTheDocument();
  });
});