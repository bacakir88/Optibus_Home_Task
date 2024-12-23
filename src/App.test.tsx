import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  test('renders both duty lists', () => {
    render(<App />);
    expect(screen.getByText('Assigned Duties (0)')).toBeInTheDocument();
  });

  test('renders header with correct title', () => {
    render(<App />);
    expect(screen.getByText('Driver Duty Management')).toBeInTheDocument();
  });

  test('prevents assigning overlapping duties', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<App />);
    
    fireEvent.click(screen.getByText('Duty 121').closest('[data-testid]')!);
    fireEvent.click(screen.getByText('Duty 130').closest('[data-testid]')!);
    
    expect(alertMock).toHaveBeenCalledWith(
      expect.stringContaining('Overlapping duties are not allowed')
    );
  });

  test('enforces 8-hour rest period between duties', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<App />);
    
    fireEvent.click(screen.getByText('Duty 110').closest('[data-testid]')!);
    fireEvent.click(screen.getByText('Duty 111').closest('[data-testid]')!);
    
    expect(alertMock).toHaveBeenCalledWith(
      expect.stringContaining('Minimum 8-hour rest period required')
    );
  });
});