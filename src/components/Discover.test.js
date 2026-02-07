import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Discover from './Discover';
import { UserContext } from '../context/UserContext';
import { act } from 'react';

// Helper to provide context
const renderWithContext = (ui, { subscription, userProfile, potentialMatches, ripenMatch, isRipped, incrementAdsSeen }) => {
  return render(
    <UserContext.Provider value={{ subscription, userProfile, potentialMatches, ripenMatch, isRipped, incrementAdsSeen }}>
      {ui}
    </UserContext.Provider>
  );
};

const mockUserProfile = {
  alias: "TestUser",
  basics: { fun: ["A", "B", "C"], media: ["X", "Y", "Z"] },
  life: { based: "Sapele", upbringing: "Strict" },
  work: { job: "Nurse", reason: "Love it" },
  relationships: { values: ["Honesty", "Family", "Trust"], lookingFor: "Long-term" },
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
  basics: { fun: ["A", "B", "C"], media: ["X", "Y", "Z"] },
  life: { based: "Sapele", upbringing: "Strict" },
  work: { job: "Nurse", reason: "Love it" },
  relationships: { values: ["Honesty", "Family", "Trust"], lookingFor: "Long-term" },
  vision: "Peace",
  special: "Love"
};

const defaultSubscription = {
  isPremium: false,
  dailyUnripes: 0,
  lastReset: "2023-01-01"
};

describe('Discover Component', () => {
  let originalMathRandom;

  beforeEach(() => {
    originalMathRandom = Math.random;
  });

  afterEach(() => {
    Math.random = originalMathRandom;
  });

  test('button says "Ripen Now 👑" when Premium', () => {
    Math.random = jest.fn(() => 0.1);
    renderWithContext(
      <Discover onNavigateToStore={jest.fn()} />,
      {
        subscription: { ...defaultSubscription, isPremium: true },
        userProfile: mockUserProfile,
        potentialMatches: [highMatch],
        ripenMatch: jest.fn(),
        isRipped: () => false,
        incrementAdsSeen: jest.fn()
      }
    );

    expect(screen.getByText("Ripen Now 👑")).toBeInTheDocument();
  });

  test('button says "Ripen (X left)" when Free and limit ok', () => {
    Math.random = jest.fn(() => 0.1);
    renderWithContext(
      <Discover onNavigateToStore={jest.fn()} />,
      {
        subscription: { ...defaultSubscription, dailyUnripes: 5 },
        userProfile: mockUserProfile,
        potentialMatches: [highMatch],
        ripenMatch: jest.fn(),
        isRipped: () => false,
        incrementAdsSeen: jest.fn()
      }
    );

    // 25 - 5 = 20 left
    expect(screen.getByText(/Ripen \(20 left today\)/i)).toBeInTheDocument();
  });

  test('button says "Limit Reached - Upgrade" when Free and limit exceeded', () => {
    Math.random = jest.fn(() => 0.1);
    renderWithContext(
      <Discover onNavigateToStore={jest.fn()} />,
      {
        subscription: { ...defaultSubscription, dailyUnripes: 25 },
        userProfile: mockUserProfile,
        potentialMatches: [highMatch],
        ripenMatch: jest.fn(),
        isRipped: () => false,
        incrementAdsSeen: jest.fn()
      }
    );

    expect(screen.getByText("Limit Reached - Upgrade")).toBeInTheDocument();
  });

  test('redirects to store (membership) when limit reached button clicked', async () => {
    Math.random = jest.fn(() => 0.1);
    const handleNavigate = jest.fn();
    const handleRipen = jest.fn(() => false); // Returns false as ripen fails

    renderWithContext(
      <Discover onNavigateToStore={handleNavigate} />,
      {
        subscription: { ...defaultSubscription, dailyUnripes: 25 },
        userProfile: mockUserProfile,
        potentialMatches: [highMatch],
        ripenMatch: handleRipen,
        isRipped: () => false,
        incrementAdsSeen: jest.fn()
      }
    );

    await act(async () => {
        fireEvent.click(screen.getByText("Limit Reached - Upgrade"));
    });

    expect(handleRipen).toHaveBeenCalled();
    expect(handleNavigate).toHaveBeenCalled();
  });
});
