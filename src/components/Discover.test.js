import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Discover from './Discover';
import { UserContext } from '../context/UserContext';

// Mock Math.random to always pick first template
beforeAll(() => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
});

afterAll(() => {
  jest.restoreAllMocks();
});

const mockUser = {
  id: 1,
  alias: "Nurse_Peachy99",
  likes: ["Suya", "Night shifts", "Boat club"],
  dislikes: ["8 AM", "Ghosting", "PHCN"],
};

const highMatchUser = {
  id: 2,
  alias: "Perfect_Match",
  location: "Warri",
  level: "Intern",
  likes: ["Suya", "Night shifts", "Boat club"],
  dislikes: ["8 AM", "Ghosting", "PHCN"],
};

const lowMatchUser = {
  id: 3,
  alias: "Low_Match",
  location: "Asaba",
  level: "Student",
  likes: ["X", "Y", "Z"],
  dislikes: ["A", "B", "C"],
};

const renderDiscover = (contextValues, props = {}) => {
  return render(
    <UserContext.Provider value={contextValues}>
      <Discover onNavigateToStore={jest.fn()} {...props} />
    </UserContext.Provider>
  );
};

test('shows notification for high match', () => {
  const contextValues = {
    user: mockUser,
    matches: [highMatchUser],
    pits: 25,
    ripenMatch: jest.fn(),
    ripenedMatches: []
  };

  renderDiscover(contextValues);

  expect(screen.getByTestId('nectar-notification')).toBeInTheDocument();
  expect(screen.getByText(/Sweet like Nectar!/)).toBeInTheDocument();
});

test('does not show notification for low match', () => {
   const contextValues = {
    user: mockUser,
    matches: [lowMatchUser],
    pits: 25,
    ripenMatch: jest.fn(),
    ripenedMatches: []
  };

  renderDiscover(contextValues);

  expect(screen.queryByTestId('nectar-notification')).not.toBeInTheDocument();
});

test('button logic with enough pits', () => {
  const ripenMatchMock = jest.fn();
  const contextValues = {
    user: mockUser,
    matches: [highMatchUser],
    pits: 25,
    ripenMatch: ripenMatchMock,
    ripenedMatches: []
  };

  renderDiscover(contextValues);

  const btn = screen.getByTestId('notification-action-btn');
  expect(btn).toHaveTextContent('Ripen Now (5 Pits)');

  fireEvent.click(btn);
  expect(ripenMatchMock).toHaveBeenCalledWith(highMatchUser.id);
});

test('button logic with insufficient pits', () => {
  const onNavigateToStoreMock = jest.fn();
  const contextValues = {
    user: mockUser,
    matches: [highMatchUser],
    pits: 2,
    ripenMatch: jest.fn(),
    ripenedMatches: []
  };

  render(
     <UserContext.Provider value={contextValues}>
      <Discover onNavigateToStore={onNavigateToStoreMock} />
    </UserContext.Provider>
  );

  const btn = screen.getByTestId('notification-action-btn');
  expect(btn).toHaveTextContent('Get Pits to Ripen');

  fireEvent.click(btn);
  expect(onNavigateToStoreMock).toHaveBeenCalled();
});
