import { render, screen, fireEvent } from '@testing-library/react';
import Discover from './Discover';

// Mock the hook directly
jest.mock('../context/UserContext', () => ({
  useUser: jest.fn(),
}));

import { useUser } from '../context/UserContext';

describe('Discover Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default Math.random to 0.5 (above 0.3 threshold) so ads don't show by default
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  const mockAds = [
      { id: 1, title: 'Test Ad', content: 'Buy more Peaches', target: 'all' }
  ];

  test('renders Peach Nectar notification when match is compatible', () => {
    useUser.mockReturnValue({
      user: {
          membershipTier: 'free',
          dailyRipenCount: 0,
          adPreferences: { allowAds: true }
      },
      ads: mockAds,
      ripenMatch: jest.fn(),
      navigateTo: jest.fn(),
    });

    render(<Discover />);

    // Check for the "Peach Nectar" header
    expect(screen.getByText(/Peach Nectar!/i)).toBeInTheDocument();
    // Check for compatibility score
    expect(screen.getByText(/95% Match!/i)).toBeInTheDocument();
  });

  test('shows Ripen button and handles success', async () => {
    const mockRipenMatch = jest.fn().mockResolvedValue({ success: true });
    useUser.mockReturnValue({
      user: {
          membershipTier: 'free',
          dailyRipenCount: 10,
          adPreferences: { allowAds: true }
      },
      ads: mockAds,
      ripenMatch: mockRipenMatch,
      navigateTo: jest.fn(),
    });

    render(<Discover />);

    const ripenButton = screen.getByText(/Ripen Connection/i);
    expect(ripenButton).toBeInTheDocument();

    fireEvent.click(ripenButton);
    expect(mockRipenMatch).toHaveBeenCalled();
    // After clicking, should show "Connection Ripened"
    expect(await screen.findByText(/Connection Ripened!/i)).toBeInTheDocument();
  });

  test('shows Limit Reached alert when daily quota exceeded', async () => {
    const mockNavigateTo = jest.fn();
    const mockRipenMatch = jest.fn().mockResolvedValue({ success: false, reason: 'limit_reached' });
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    useUser.mockReturnValue({
      user: {
          membershipTier: 'free',
          dailyRipenCount: 25,
          adPreferences: { allowAds: true }
      },
      ads: mockAds,
      ripenMatch: mockRipenMatch,
      navigateTo: mockNavigateTo,
    });

    render(<Discover />);

    const ripenButton = screen.getByText(/Ripen Connection/i);
    expect(ripenButton).toBeInTheDocument();

    fireEvent.click(ripenButton);

    // Wait for the async action
    await screen.findByText(/Ripen Connection/i); // Just waiting for loop/promises

    expect(mockRipenMatch).toHaveBeenCalled();
    // Since alert is synchronous after await, we might need a small delay or waitFor
    await new Promise(r => setTimeout(r, 0));

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining("Daily limit reached"));
    expect(mockNavigateTo).toHaveBeenCalledWith('settings');

    alertMock.mockRestore();
  });

  test('renders Ad when random chance hits', () => {
    // Force Math.random to be < 0.3
    jest.spyOn(global.Math, 'random').mockReturnValue(0.1);

    useUser.mockReturnValue({
        user: {
            membershipTier: 'free',
            dailyRipenCount: 0,
            adPreferences: { allowAds: true }
        },
        ads: mockAds,
        ripenMatch: jest.fn(),
        navigateTo: jest.fn(),
    });

    render(<Discover />);

    expect(screen.getByText('Sponsored')).toBeInTheDocument();
    expect(screen.getByText('Test Ad')).toBeInTheDocument();

    // Test skipping ad
    const skipButton = screen.getByText('Skip Ad');
    fireEvent.click(skipButton);

    // Ad should be gone, match should appear
    expect(screen.queryByText('Sponsored')).not.toBeInTheDocument();
    expect(screen.getByText(/Peach Nectar!/i)).toBeInTheDocument();
  });
});
