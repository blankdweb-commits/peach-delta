import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Discover from '../components/Discover';
import { useUser } from '../context/UserContext';

// Mock the UserContext hook
jest.mock('../context/UserContext', () => ({
  useUser: jest.fn(),
}));

describe('Discover Component', () => {
  const mockDeductPits = jest.fn();
  const mockNavigateToStore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Peach Nectar notification and Ripen button when pits >= 5', async () => {
    // Mock useUser to return a user with sufficient pits
    useUser.mockReturnValue({
      user: { pits: 10 },
      deductPits: mockDeductPits,
    });

    render(<Discover onNavigateToStore={mockNavigateToStore} />);

    // Expect the notification to be present (since mock match has 95% compatibility)
    // We wait for it because useEffect sets the state
    await waitFor(() => {
        expect(screen.getByTestId('nectar-notification')).toBeInTheDocument();
    });

    expect(screen.getByText(/Peach Nectar!/i)).toBeInTheDocument();

    // Check for Ripen button
    const ripenButton = screen.getByText(/Ripen Match \(5 Pits\)/i);
    expect(ripenButton).toBeInTheDocument();

    // Mock successful deduction
    mockDeductPits.mockReturnValue(true);

    // Click it
    fireEvent.click(ripenButton);

    expect(mockDeductPits).toHaveBeenCalledWith(5);
  });

  test('renders Get More Pits button when pits < 5', async () => {
    // Mock useUser to return a user with insufficient pits
    useUser.mockReturnValue({
      user: { pits: 2 },
      deductPits: mockDeductPits,
    });

    render(<Discover onNavigateToStore={mockNavigateToStore} />);

    await waitFor(() => {
        expect(screen.getByTestId('nectar-notification')).toBeInTheDocument();
    });

    // Check for Store button
    const storeButton = screen.getByText(/Get More Pits/i);
    expect(storeButton).toBeInTheDocument();
    expect(screen.queryByText(/Ripen Match/i)).not.toBeInTheDocument();

    // Click it
    fireEvent.click(storeButton);
    expect(mockNavigateToStore).toHaveBeenCalled();
  });
});
