import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Discover from './Discover';
import { UserContext } from '../context/UserContext';

// Mock match data
const mockMatch = {
  id: 'match_1',
  alias: 'TestMatch',
  location: 'Warri',
  likes: ['A', 'B', 'C'],
  dislikes: ['X', 'Y', 'Z'],
  avatar: 'test.jpg'
};

const mockUser = {
  id: 'user_1',
  alias: 'Me',
  location: 'Sapele',
  pits: 25,
  likes: ['A', 'B', 'C'], // 100% match
  dislikes: ['X', 'Y', 'Z']
};

const renderWithContext = (ui, { user, matches = [mockMatch], ripenedMatches = [], ripenMatch = jest.fn() } = {}) => {
  return render(
    <UserContext.Provider value={{ user, matches, ripenedMatches, ripenMatch }}>
      {ui}
    </UserContext.Provider>
  );
};

describe('Discover Component', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0); // Ensure deterministic template selection
  });

  afterEach(() => {
    jest.spyOn(Math, 'random').mockRestore();
  });

  test('displays correct header for Delta State', () => {
    renderWithContext(<Discover onNavigate={jest.fn()} />, { user: mockUser });
    expect(screen.getByText(/Discover Peaches in Delta State 🍑/i)).toBeInTheDocument();
  });

  test('notification button redirects to store when pits < 5', () => {
    const onNavigate = jest.fn();
    const poorUser = { ...mockUser, pits: 4 };

    renderWithContext(<Discover onNavigate={onNavigate} />, { user: poorUser });

    // Check if notification is present (High match)
    const notification = screen.getByText(/Peach Nectar!/i);
    expect(notification).toBeInTheDocument();

    // Button should indicate getting pits
    const button = screen.getByText(/Get Pits to Ripen/i);
    fireEvent.click(button);

    expect(onNavigate).toHaveBeenCalledWith('pitstore');
  });

  test('notification button ripens match when pits >= 5', () => {
    const ripenMatch = jest.fn();
    const richUser = { ...mockUser, pits: 5 };

    renderWithContext(<Discover onNavigate={jest.fn()} />, { user: richUser, ripenMatch });

    const notification = screen.getByText(/Peach Nectar!/i);
    expect(notification).toBeInTheDocument();

    const button = screen.getByText(/Ripen Now \(5 Pits\)/i);
    fireEvent.click(button);

    expect(ripenMatch).toHaveBeenCalledWith('match_1');
  });
});
