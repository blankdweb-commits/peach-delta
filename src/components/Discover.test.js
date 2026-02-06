import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Discover from './Discover';
import { UserContext } from '../context/UserContext';
import { act } from 'react';

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
  let originalMathRandom;

  beforeEach(() => {
    originalMathRandom = Math.random;
  });

  afterEach(() => {
    Math.random = originalMathRandom;
  });

  test('shows Template 1 for high match (Sweet like Nectar)', () => {
    // Mock random to 0.1 for template selection (< 0.33)
    // And for array index selection (0.1 * 3 = 0.3 -> index 0)
    Math.random = jest.fn(() => 0.1);

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

    // Template 1: Sweet like Nectar! 🍯 You and [Alias] are a [Score]% match. You both hate [Shared Dislike] but love [Shared Like]? Use 5 Pits to see your twin!
    expect(screen.getByText(/Sweet like Nectar!/i)).toBeInTheDocument();
    expect(screen.getByText(/You both hate X but love A/i)).toBeInTheDocument();
  });

  test('shows Template 2 for high match (Shift Partner Alert)', () => {
    // Mock random to 0.5 for template selection (0.33 <= 0.5 < 0.66)
    // Then subsequent calls for getRandom.
    Math.random = jest.fn()
        .mockReturnValueOnce(0.5) // Template selection
        .mockReturnValue(0.1);    // Array selection (index 0)

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

    // Template 2: Shift Partner Alert! 🩺 A [Score]% match just landed [Distance]km away. They also hate [Shared Dislike]. Ripen the connection now! 🍑
    expect(screen.getByText(/Shift Partner Alert!/i)).toBeInTheDocument();
    expect(screen.getByText(/They also hate X/i)).toBeInTheDocument();
  });

  test('shows Template 3 for high match (Is this your person)', () => {
    // Mock random to 0.8 for template selection (>= 0.66)
    Math.random = jest.fn().mockReturnValue(0.8);

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

    // Template 3: Is this your person? 😍 You and [Alias] have the same 'Sweet Peaches.' Don't let this one stay unripened!
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
    Math.random = jest.fn(() => 0.1); // Ensure notification shows
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
    Math.random = jest.fn(() => 0.1); // Ensure notification shows
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
    Math.random = jest.fn(() => 0.1); // Ensure notification shows
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
    Math.random = jest.fn(() => 0.1); // Ensure notification shows
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
