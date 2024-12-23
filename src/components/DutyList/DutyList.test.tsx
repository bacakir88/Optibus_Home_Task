import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DutyList } from './DutyList';

const mockDuties = [
  {
    id: 1,
    name: "Duty 1",
    depot: "Depot 1",
    start: "2022-11-01T08:00:00Z",
    end: "2022-11-01T16:00:00Z"
  },
  {
    id: 2,
    name: "Duty 2",
    depot: "Depot 2",
    start: "2022-11-01T09:00:00Z",
    end: "2022-11-01T17:00:00Z"
  }
];

describe('DutyList Component', () => {
  const mockOnDutyClick = vi.fn();

  beforeEach(() => {
    mockOnDutyClick.mockClear();
  });

  test('renders title correctly', () => {
    render(
      <DutyList
        duties={mockDuties}
        onDutyClick={mockOnDutyClick}
        title="Test List"
      />
    );
    expect(screen.getByText('Test List (2)')).toBeInTheDocument();
  });

  test('renders all duties', () => {
    render(
      <DutyList
        duties={mockDuties}
        onDutyClick={mockOnDutyClick}
        title="Test List"
      />
    );
    
    expect(screen.getByText('Duty 1')).toBeInTheDocument();
    expect(screen.getByText('Duty 2')).toBeInTheDocument();
  });

  test('calls onDutyClick with correct duty when duty is clicked', () => {
    render(
      <DutyList
        duties={mockDuties}
        onDutyClick={mockOnDutyClick}
        title="Test List"
      />
    );
    
    fireEvent.click(screen.getByText('Duty 1'));
    expect(mockOnDutyClick).toHaveBeenCalledWith(mockDuties[0]);
  });

  test('renders empty list when no duties provided', () => {
    render(
      <DutyList
        duties={[]}
        onDutyClick={mockOnDutyClick}
        title="Empty List"
      />
    );
    
    const list = screen.getByText('Empty List (0)').parentElement;
    expect(list?.children[1].children.length).toBe(0);
  });
});
