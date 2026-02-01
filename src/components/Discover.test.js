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
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0); // Default to first template (index 0)
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('displays correct header', () => {
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
    expect(screen.getByText(/Discover Peaches in Delta State/i)).toBeInTheDocument();
  });

  test('shows Peach Nectar notification for high match (Template 1)', () => {
    Math.random.mockReturnValue(0); // Force index 0
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

    // Template 1: Sweet like Nectar! ... You both hate X but love A? ...
    expect(screen.getByText(/Sweet like Nectar!/i)).toBeInTheDocument();
    expect(screen.getByText(/You both hate X but love A\?/i)).toBeInTheDocument();
  });

  test('shows Shift Partner Alert notification (Template 2)', () => {
    // Math.random() * 3. Floor(0.5 * 3) = 1
    Math.random.mockReturnValue(0.5);

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

    // Template 2: Shift Partner Alert! ... landed 1km away. They also hate X.
    expect(screen.getByText(/Shift Partner Alert!/i)).toBeInTheDocument();
    expect(screen.getByText(/landed 1km away/i)).toBeInTheDocument();
    expect(screen.getByText(/hate X/i)).toBeInTheDocument();
  });

  test('shows Is this your person notification (Template 3)', () => {
    // Math.random() * 3. Floor(0.8 * 3) = 2
    Math.random.mockReturnValue(0.8);

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

    // Template 3: Is this your person? ...
    expect(screen.getByText(/Is this your person\?/i)).toBeInTheDocument();
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
    expect(screen.queryByText(/Is this your person\?/i)).not.toBeInTheDocument();
  });

  test('button says "Ripen Now" when pits >= 5', () => {
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

    expect(screen.getByText("Ripen Now (5 Pits)")).toBeInTheDocument();
  });

  test('button says "Get Pits to Ripen" when pits < 5', () => {
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
    const handleRipen = jest.fn(() => true);

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
