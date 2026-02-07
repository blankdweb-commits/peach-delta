import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Discover from './Discover';
import { UserContext } from '../context/UserContext';
import { act } from 'react';

// Helper to provide context
const renderWithContext = (ui, { pits, userProfile, potentialMatches, ripenMatch, isRipped, incrementAdsSeen }) => {
  return render(
    <UserContext.Provider value={{ pits, userProfile, potentialMatches, ripenMatch, isRipped, incrementAdsSeen }}>
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

const mockMatch2 = { ...lowMatch, id: 3, alias: "Match2" };
const mockMatch3 = { ...lowMatch, id: 4, alias: "Match3" };
const mockMatch4 = { ...lowMatch, id: 5, alias: "Match4" };

describe('Discover Component', () => {
  let originalMathRandom;

  beforeEach(() => {
    originalMathRandom = Math.random;
  });

  afterEach(() => {
    Math.random = originalMathRandom;
  });

  test('shows Template 1 for high match (Sweet like Nectar)', () => {
    Math.random = jest.fn(() => 0.1);
    renderWithContext(
      <Discover onNavigateToStore={jest.fn()} />,
      {
        pits: 25,
        userProfile: mockUserProfile,
        potentialMatches: [highMatch],
        ripenMatch: jest.fn(),
        isRipped: () => false,
        incrementAdsSeen: jest.fn()
      }
    );
    expect(screen.getByText(/Sweet like Nectar!/i)).toBeInTheDocument();
  });

  test('shows ad after 3 actions (integration check)', async () => {
    jest.useFakeTimers();
    const incrementAdsSeen = jest.fn();

    // Setup matches to iterate through
    const matches = [highMatch, lowMatch, mockMatch2, mockMatch3, mockMatch4];

    renderWithContext(
      <Discover onNavigateToStore={jest.fn()} />,
      {
        pits: 25,
        userProfile: mockUserProfile,
        potentialMatches: matches,
        ripenMatch: jest.fn(),
        isRipped: () => false,
        incrementAdsSeen
      }
    );

    // 1. Skip HighMatch
    fireEvent.click(screen.getByText("Skip"));

    // 2. Skip LowMatch
    fireEvent.click(screen.getByText("Skip"));

    // 3. Skip Match2 -> Should trigger ad
    fireEvent.click(screen.getByText("Skip"));

    expect(screen.getByText("Sponsored Ad")).toBeInTheDocument();

    // Advance timer
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText("Sponsored Ad")).not.toBeInTheDocument();
    expect(incrementAdsSeen).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
