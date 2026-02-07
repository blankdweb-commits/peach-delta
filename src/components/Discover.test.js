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
  basics: {
      fun: ["A", "B", "C"],
      media: ["X", "Y", "Z"]
  },
  life: {
      based: "Sapele",
      upbringing: "Strict"
  },
  work: {
      job: "Nurse",
      reason: "Love it"
  },
  relationships: {
      values: ["Honesty", "Family", "Trust"],
      lookingFor: "Long-term"
  },
  vision: "Peace",
  special: "Love"
};

const highMatch = {
  id: 1,
  alias: "HighMatch",
  level: "Year 2",
  realName: "Real Name",
  photoUrl: "url",
  distance: 1,
  basics: {
      fun: ["A", "B", "C"], // Match 3 * 7 = 21 (cap 20)
      media: ["X", "Y", "Z"] // Match 3 * 7 = 21 (cap 20)
  },
  life: {
      based: "Sapele", // Match 20
      upbringing: "Strict"
  },
  work: {
      job: "Nurse",
      reason: "Love it"
  },
  relationships: {
      values: ["Honesty", "Family", "Trust"], // Match 3 * 10 = 30
      lookingFor: "Long-term" // Match 10
  },
  vision: "Peace",
  special: "Love"
  // Total: 20 + 20 + 30 + 20 + 10 = 100
};

const lowMatch = {
  id: 2,
  alias: "LowMatch",
  level: "Year 1",
  realName: "Other Name",
  photoUrl: "url",
  distance: 10,
  basics: {
      fun: ["D"],
      media: ["U"]
  },
  life: {
      based: "Warri",
      upbringing: "Urban"
  },
  work: {
      job: "Student",
      reason: "Study"
  },
  relationships: {
      values: ["Ambition"],
      lookingFor: "Casual"
  },
  vision: "Wealth",
  special: "Hustle"
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
    // And for array index selection
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

    // Template 1: Sweet like Nectar! 🍯 You and [Alias] match [Score]%. You both enjoy [FunItem]! Use 5 Pits to see your twin!
    expect(screen.getByText(/Sweet like Nectar!/i)).toBeInTheDocument();
    expect(screen.getByText(/You both enjoy A/i)).toBeInTheDocument();
  });

  test('shows Template 2 for high match (Deep Connection Alert)', () => {
    // Mock random to 0.5 for template selection (0.33 <= 0.5 < 0.66)
    // Then subsequent calls for getRandom.
    Math.random = jest.fn()
        .mockReturnValueOnce(0.5) // Template selection
        .mockReturnValue(0.1);    // Array selection

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

    // Template 2: Deep Connection Alert! 💫 You and [Alias] match [Score]%. You both value [ValueItem]. Ripen the connection now! 🍑
    expect(screen.getByText(/Deep Connection Alert!/i)).toBeInTheDocument();
    expect(screen.getByText(/You both value Honesty/i)).toBeInTheDocument();
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

    // Template 3: Is this your person? 😍 You and [Alias] have a [Score]% vibe match. Don't let this one stay unripened!
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
    expect(screen.queryByText(/Deep Connection Alert!/i)).not.toBeInTheDocument();
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
