import { render, screen, fireEvent, act } from '@testing-library/react';
import Discover from './Discover';

// Mock the hook directly
jest.mock('../context/UserContext', () => ({
  useUser: jest.fn(),
}));

import { useUser } from '../context/UserContext';

describe('Discover Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Peach Nectar notification when match is compatible', () => {
    useUser.mockReturnValue({
      user: { pits: 25 },
      deductPits: jest.fn(),
      navigateTo: jest.fn(),
    });

    render(<Discover />);

    // Check for the "Peach Nectar" header
    expect(screen.getByText(/Peach Nectar!/i)).toBeInTheDocument();
    // Check for compatibility score
    expect(screen.getByText(/95% Match!/i)).toBeInTheDocument();
  });

  test('shows Ripen button when user has enough pits', () => {
    const mockDeductPits = jest.fn().mockReturnValue(true);
    useUser.mockReturnValue({
      user: { pits: 10 },
      deductPits: mockDeductPits,
      navigateTo: jest.fn(),
    });

    render(<Discover />);

    const ripenButton = screen.getByText(/Ripen Connection \(-5 Pits\)/i);
    expect(ripenButton).toBeInTheDocument();

    fireEvent.click(ripenButton);
    expect(mockDeductPits).toHaveBeenCalledWith(5);
    // After clicking, should show "Connection Ripened"
    expect(screen.getByText(/Connection Ripened!/i)).toBeInTheDocument();
  });

  test('shows Get More Pits button when user has insufficient pits', () => {
    const mockNavigateTo = jest.fn();
    useUser.mockReturnValue({
      user: { pits: 2 }, // Less than 5
      deductPits: jest.fn(),
      navigateTo: mockNavigateTo,
    });

    render(<Discover />);

    const storeButton = screen.getByText(/Get More Pits to Ripen/i);
    expect(storeButton).toBeInTheDocument();

    fireEvent.click(storeButton);
    expect(mockNavigateTo).toHaveBeenCalledWith('store');
  });
});
