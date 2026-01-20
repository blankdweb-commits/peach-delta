import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('full flow: insufficient pits -> store -> buy -> sufficient pits -> ripen', () => {
  render(<App />);

  // 1. Verify Initial State (2 Pits)
  expect(screen.getByText(/Balance: 2 Pits/i)).toBeInTheDocument();
  expect(screen.getByText(/Sweet like Nectar!/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Nurse_Peachy99/i)[0]).toBeInTheDocument(); // Alias visible
  expect(screen.queryByText(/Chioma Okonjo/i)).not.toBeInTheDocument(); // Real Name hidden

  // Verify location is one of the Delta State locations
  expect(screen.getByText(/(Sapele|Warri|Asaba|Ughelli), Delta State/)).toBeInTheDocument();

  // 2. Verify "Get Pits" button is shown
  const getPitsButton = screen.getByText(/Get Pits to Ripen/i);
  expect(getPitsButton).toBeInTheDocument();

  // 3. Click "Get Pits" -> Go to Store
  fireEvent.click(getPitsButton);

  expect(screen.getByText(/Pit Store/i)).toBeInTheDocument();

  // 4. Buy Pits
  // Mock alert since it's not supported in JSDOM environment usually without implementation
  window.alert = jest.fn();

  const buyButton = screen.getAllByText(/Buy Now/i)[0]; // First one (20 Pits)
  fireEvent.click(buyButton);

  expect(window.alert).toHaveBeenCalled();

  // 5. Verify Redirect to Discover & New Balance
  expect(screen.getByText(/Discover Peaches/i)).toBeInTheDocument();
  expect(screen.getByText(/Balance: 22 Pits/i)).toBeInTheDocument(); // 2 + 20

  // 6. Verify "Ripen" button is now shown
  const ripenButton = screen.getByText(/Ripen Connection \(5 Pits\)/i);
  expect(ripenButton).toBeInTheDocument();

  // 7. Click "Ripen"
  fireEvent.click(ripenButton);

  // 8. Verify Balance Deducted & Profile Revealed
  expect(screen.getByText(/Balance: 17 Pits/i)).toBeInTheDocument(); // 22 - 5
  expect(screen.getAllByText(/Chioma Okonjo/i).length).toBeGreaterThan(0); // Real Name Visible
  expect(screen.getByText(/Connection Ripened!/i)).toBeInTheDocument();
});
