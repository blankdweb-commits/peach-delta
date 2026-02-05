import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Discover from './Discover';
import { useUser } from '../context/UserContext';

// Mock UserContext
jest.mock('../context/UserContext');

// Mock Data
jest.mock('../data/mockData', () => ({
  USERS: [
    {
      id: 1,
      alias: 'PerfectMatch',
      location: 'Warri',
      likes: ['A', 'B', 'C'],
      dislikes: ['X', 'Y', 'Z'], // Same as currentUser -> 100% match
      photo: '1.jpg'
    },
    {
      id: 2,
      alias: 'LowMatch',
      location: 'Asaba',
      likes: ['D', 'E', 'F'],
      dislikes: ['U', 'V', 'W'], // No match
      photo: '2.jpg'
    }
  ]
}));

describe('Discover Component', () => {
  const mockRipenMatch = jest.fn();
  const mockNavigateToStore = jest.fn();

  const currentUser = {
    id: 99,
    alias: 'Me',
    location: 'Sapele',
    likes: ['A', 'B', 'C'],
    dislikes: ['X', 'Y', 'Z'],
    ripenedMatches: [],
    pits: 25
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useUser.mockReturnValue({
      user: currentUser,
      ripenMatch: mockRipenMatch
    });
    // Mock Math.random to return a fixed value for consistent messages
    jest.spyOn(Math, 'random').mockReturnValue(0.1);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders header correctly', () => {
    render(<Discover onNavigateToStore={mockNavigateToStore} />);
    expect(screen.getByText(/Discover Peaches in Delta State/i)).toBeInTheDocument();
  });

  test('shows Peach Nectar notification for high match', () => {
    render(<Discover onNavigateToStore={mockNavigateToStore} />);
    expect(screen.getByText(/Peach Nectar!/i)).toBeInTheDocument();
    // Use getAllByText because it might appear in the card and the notification
    // The message includes the alias.
    expect(screen.getAllByText(/PerfectMatch/i).length).toBeGreaterThan(0);
  });

  test('button says "Ripen Now" when pits >= 5 and calls ripenMatch', () => {
    useUser.mockReturnValue({
      user: { ...currentUser, pits: 10 },
      ripenMatch: mockRipenMatch
    });

    render(<Discover onNavigateToStore={mockNavigateToStore} />);

    const button = screen.getByText(/Ripen Now \(5 Pits\)/i);
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockRipenMatch).toHaveBeenCalledWith(1);
    expect(mockNavigateToStore).not.toHaveBeenCalled();
  });

  test('button says "Get Pits to Ripen" when pits < 5 and calls onNavigateToStore', () => {
    useUser.mockReturnValue({
      user: { ...currentUser, pits: 2 },
      ripenMatch: mockRipenMatch
    });

    render(<Discover onNavigateToStore={mockNavigateToStore} />);

    const button = screen.getByText(/Get Pits to Ripen/i);
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockNavigateToStore).toHaveBeenCalled();
    expect(mockRipenMatch).not.toHaveBeenCalled();
  });

  test('does not show notification if no high match', () => {
    // Override currentUser to have no matches
    useUser.mockReturnValue({
      user: {
          ...currentUser,
          likes: ['Q', 'W', 'E'],
          dislikes: ['R', 'T', 'Y']
      },
      ripenMatch: mockRipenMatch
    });

    render(<Discover onNavigateToStore={mockNavigateToStore} />);
    expect(screen.queryByText(/Peach Nectar!/i)).not.toBeInTheDocument();
  });
});
