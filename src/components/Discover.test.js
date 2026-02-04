import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Discover from './Discover';
import { UserContext } from '../context/UserContext';
import { CURRENT_USER } from '../data/mockData';

// Mock match generator
jest.mock('../data/mockData', () => ({
  MOCK_USERS: [
    {
      id: 1,
      alias: 'Perfect Match',
      level: 'Year 2',
      location: 'Sapele',
      likes: ['A', 'B', 'C'],
      dislikes: ['X', 'Y', 'Z'],
      compatibility: 95,
    }
  ],
  CURRENT_USER: {
      id: 100,
      likes: ['A', 'B', 'C'],
      dislikes: ['X', 'Y', 'Z'],
  }
}));

const mockUser = {
  id: 100,
  likes: ['A', 'B', 'C'],
  dislikes: ['X', 'Y', 'Z'],
};

const renderWithContext = (component, contextValue) => {
  return render(
    <UserContext.Provider value={{ user: mockUser, ripenedMatches: new Set(), ...contextValue }}>
      {component}
    </UserContext.Provider>
  );
};

describe('Discover Component', () => {
  test('renders header with Delta State', () => {
    renderWithContext(<Discover />, { pits: 25, ripenMatch: jest.fn() });
    expect(screen.getByText(/Discover Peaches in Delta State/i)).toBeInTheDocument();
  });

  test('shows Peach Nectar notification for high match', () => {
    renderWithContext(<Discover />, { pits: 25, ripenMatch: jest.fn() });
    expect(screen.getByText(/Peach Nectar!/i)).toBeInTheDocument();
    expect(screen.getByText(/Perfect Match/i)).toBeInTheDocument();
  });

  test('button shows "Ripen Now" when pits >= 5', () => {
    const mockRipen = jest.fn().mockReturnValue(true);
    const mockNavigate = jest.fn();
    renderWithContext(<Discover onNavigateToStore={mockNavigate} />, { pits: 25, ripenMatch: mockRipen });

    const button = screen.getByText(/Ripen Now \(5 Pits\)/i);
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockRipen).toHaveBeenCalledWith(1);
  });

  test('button shows "Get Pits" when pits < 5 and navigates to store', () => {
    const mockNavigate = jest.fn();
    renderWithContext(<Discover onNavigateToStore={mockNavigate} />, { pits: 0, ripenMatch: jest.fn() });

    const button = screen.getByText(/Get Pits to Ripen/i);
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalled();
  });
});
