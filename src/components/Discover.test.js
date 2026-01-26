import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Discover from './Discover';
import { UserContext } from '../context/UserContext';

// Helper to provide context
const renderWithContext = (ui, { pits, userProfile, potentialMatches, ripenMatch, isRipped }) => {
  return render(
    <UserContext.Provider value={{ pits, userProfile, potentialMatches, ripenMatch, isRipped }}>
      {ui}
    </UserContext.Provider>
  );
};

const mockUserProfile = {
  alias: "TestUser",
  likes: ["A", "B", "C"],
  dislikes: ["X", "Y", "Z"],
  location: "Sapele"
};

const highMatch = {
  id: 1,
  alias: "HighMatch",
  level: "Year 2",
  location: "Sapele",
  likes: ["A", "B", "C"], // 100% like match
  dislikes: ["X", "Y", "Z"], // 100% dislike match
  realName: "Real Name",
  photoUrl: "url",
  distance: 1
};

const lowMatch = {
  id: 2,
  alias: "LowMatch",
  level: "Year 1",
  location: "Warri",
  likes: ["D", "E", "F"],
  dislikes: ["U", "V", "W"],
  realName: "Other Name",
  photoUrl: "url",
  distance: 10
};

describe('Discover Component', () => {
  let randomSpy;

  beforeEach(() => {
    randomSpy = jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  test('shows Template 1 (Sweet like Nectar) when random selects it', () => {
    // With highMatch, all 3 templates are valid.
    // We want index 0. 0 * 3 = 0.
    randomSpy.mockReturnValue(0.1);

    renderWithContext(
      <Discover onNavigateToStore={jest.fn()} />,
      {
        pits: 25,
        userProfile: mockUserProfile,
        potentialMatches: [highMatch],
        ripenMatch: jest.fn(),
        isRipped: () => false
      }
    );

    expect(screen.getByText(/Sweet like Nectar!/i)).toBeInTheDocument();
    expect(screen.getByText(/You both hate X but love A/i)).toBeInTheDocument();
  });

  test('shows Template 2 (Shift Partner Alert) when random selects it', () => {
    // With highMatch, all 3 templates are valid.
    // We want index 1. 0.4 * 3 = 1.2 -> 1.
    randomSpy.mockReturnValue(0.4);

    renderWithContext(
      <Discover onNavigateToStore={jest.fn()} />,
      {
        pits: 25,
        userProfile: mockUserProfile,
        potentialMatches: [highMatch],
        ripenMatch: jest.fn(),
        isRipped: () => false
      }
    );

    expect(screen.getByText(/Shift Partner Alert!/i)).toBeInTheDocument();
    expect(screen.getByText(/They also hate X/i)).toBeInTheDocument();
  });

  test('shows Template 3 (Is this your person) when random selects it', () => {
    // With highMatch, all 3 templates are valid.
    // We want index 2. 0.8 * 3 = 2.4 -> 2.
    randomSpy.mockReturnValue(0.8);

    renderWithContext(
      <Discover onNavigateToStore={jest.fn()} />,
      {
        pits: 25,
        userProfile: mockUserProfile,
        potentialMatches: [highMatch],
        ripenMatch: jest.fn(),
        isRipped: () => false
      }
    );

    expect(screen.getByText(/Is this your person?/i)).toBeInTheDocument();
  });

  test('does not show notification for low match', () => {
    renderWithContext(
      <Discover onNavigateToStore={jest.fn()} />,
      {
        pits: 25,
        userProfile: mockUserProfile,
        potentialMatches: [lowMatch],
        ripenMatch: jest.fn(),
        isRipped: () => false
      }
    );

    expect(screen.queryByText(/Sweet like Nectar!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Shift Partner Alert!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Is this your person?/i)).not.toBeInTheDocument();
  });

  test('button says "Ripen Now" when pits >= 5', () => {
    randomSpy.mockReturnValue(0.1); // Force template 1
    renderWithContext(
      <Discover onNavigateToStore={jest.fn()} />,
      {
        pits: 10,
        userProfile: mockUserProfile,
        potentialMatches: [highMatch],
        ripenMatch: jest.fn(),
        isRipped: () => false
      }
    );

    // Look for button in notification
    expect(screen.getByText("Ripen Now (5 Pits)")).toBeInTheDocument();
  });

  test('button says "Get Pits to Ripen" when pits < 5', () => {
    randomSpy.mockReturnValue(0.1); // Force template 1
    renderWithContext(
      <Discover onNavigateToStore={jest.fn()} />,
      {
        pits: 2,
        userProfile: mockUserProfile,
        potentialMatches: [highMatch],
        ripenMatch: jest.fn(),
        isRipped: () => false
      }
    );

    expect(screen.getByText("Get Pits to Ripen")).toBeInTheDocument();
  });

  test('calls onNavigateToStore when pits < 5', () => {
    randomSpy.mockReturnValue(0.1); // Force template 1
    const handleNavigate = jest.fn();
    renderWithContext(
      <Discover onNavigateToStore={handleNavigate} />,
      {
        pits: 2,
        userProfile: mockUserProfile,
        potentialMatches: [highMatch],
        ripenMatch: jest.fn(),
        isRipped: () => false
      }
    );

    fireEvent.click(screen.getByText("Get Pits to Ripen"));
    expect(handleNavigate).toHaveBeenCalled();
  });

  test('calls ripenMatch when pits >= 5', () => {
    randomSpy.mockReturnValue(0.1); // Force template 1
    const handleRipen = jest.fn(() => true);
    window.alert = jest.fn(); // Mock alert

    renderWithContext(
      <Discover onNavigateToStore={jest.fn()} />,
      {
        pits: 10,
        userProfile: mockUserProfile,
        potentialMatches: [highMatch],
        ripenMatch: handleRipen,
        isRipped: () => false
      }
    );

    fireEvent.click(screen.getByText("Ripen Now (5 Pits)"));
    expect(handleRipen).toHaveBeenCalledWith(highMatch.id);
  });
});
