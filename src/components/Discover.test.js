import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Discover from './Discover';
import { UserContext } from '../context/UserContext';
import { act } from 'react';

// Mock data
const mockRipenMatch = jest.fn();
const mockBuyPits = jest.fn();
const mockNavigateToStore = jest.fn();

const userHighPits = {
  alias: "TestUser",
  pits: 25,
  sweetPeaches: ["A", "B", "C"],
  bruisedPeaches: ["X", "Y", "Z"]
};

const userLowPits = {
  alias: "TestUser",
  pits: 2,
  sweetPeaches: ["A", "B", "C"],
  bruisedPeaches: ["X", "Y", "Z"]
};

const matchHighScore = {
  id: 101,
  alias: "PerfectMatch",
  location: "Sapele",
  level: "Year 2",
  sweetPeaches: ["A", "B", "C"], // 3 shared likes * 20 = 60
  bruisedPeaches: ["X", "Y", "Z"], // 3 shared dislikes * 40/3 = 40. Total 100
  imageUrl: "url",
  isRipened: false
};

const matchLowScore = {
  id: 102,
  alias: "LowMatch",
  location: "Warri",
  level: "Year 1",
  sweetPeaches: ["D"],
  bruisedPeaches: ["W"],
  imageUrl: "url",
  isRipened: false
};

const renderWithContext = (ui, contextValue) => {
  return render(
    <UserContext.Provider value={contextValue}>
      {ui}
    </UserContext.Provider>
  );
};

describe('Discover Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders high match notification when compatibility is >= 90%', () => {
    const contextValue = {
      user: userHighPits,
      matches: [matchHighScore],
      ripenedMatches: new Set(),
      ripenMatch: mockRipenMatch,
      buyPits: mockBuyPits
    };

    renderWithContext(<Discover onNavigateToStore={mockNavigateToStore} />, contextValue);

    expect(screen.getByText(/Peach Nectar!/i)).toBeInTheDocument();
    expect(screen.getByText(/Sweet like Nectar!/i)).toBeInTheDocument();
  });

  test('does not render notification for low match', () => {
    const contextValue = {
      user: userHighPits,
      matches: [matchLowScore],
      ripenedMatches: new Set(),
      ripenMatch: mockRipenMatch,
      buyPits: mockBuyPits
    };

    renderWithContext(<Discover onNavigateToStore={mockNavigateToStore} />, contextValue);

    expect(screen.queryByText(/Peach Nectar!/i)).not.toBeInTheDocument();
  });

  test('shows "Ripen Now" button when user has enough pits', () => {
    const contextValue = {
      user: userHighPits,
      matches: [matchHighScore],
      ripenedMatches: new Set(),
      ripenMatch: mockRipenMatch,
      buyPits: mockBuyPits
    };

    renderWithContext(<Discover onNavigateToStore={mockNavigateToStore} />, contextValue);

    const button = screen.getByRole('button', { name: /Ripen Now \(5 Pits\)/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockRipenMatch).toHaveBeenCalledWith(matchHighScore.id);
  });

  test('shows "Get Pits to Ripen" button when user has insufficient pits', () => {
    const contextValue = {
      user: userLowPits,
      matches: [matchHighScore],
      ripenedMatches: new Set(),
      ripenMatch: mockRipenMatch,
      buyPits: mockBuyPits
    };

    renderWithContext(<Discover onNavigateToStore={mockNavigateToStore} />, contextValue);

    const button = screen.getByRole('button', { name: /Get Pits to Ripen/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockNavigateToStore).toHaveBeenCalled();
    expect(mockRipenMatch).not.toHaveBeenCalled();
  });

  test('displays unblurred photo if already ripened', () => {
     const contextValue = {
      user: userHighPits,
      matches: [matchHighScore],
      ripenedMatches: new Set([matchHighScore.id]),
      ripenMatch: mockRipenMatch,
      buyPits: mockBuyPits
    };

    renderWithContext(<Discover onNavigateToStore={mockNavigateToStore} />, contextValue);

    // Notification should NOT be present if already ripened
    expect(screen.queryByText(/Peach Nectar!/i)).not.toBeInTheDocument();
    expect(screen.getByAltText(matchHighScore.alias)).toBeInTheDocument();
  });
});
