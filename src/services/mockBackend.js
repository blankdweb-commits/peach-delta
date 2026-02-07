// Mock Backend Service
// This simulates the interactions with Supabase (Database) and Paystack (Payment)
// In a production environment, this would be replaced with actual API calls to your backend.

export const mockBackend = {
  // Simulate fetching user subscription status from Supabase
  getUserSubscription: async (userId) => {
    // In reality, this would query the 'users' table
    // For demo purposes, we return a default structure
    return {
      userId,
      isPremium: false,
      dailyUnripes: 0,
      lastReset: new Date().toISOString().split('T')[0] // Today's date YYYY-MM-DD
    };
  },

  // Simulate updating subscription status in Supabase after successful payment
  upgradeSubscription: async (userId) => {
    // In reality, this would update the 'users' table set is_premium = true
    return {
      success: true,
      message: "Subscription upgraded to Premium!"
    };
  },

  // Simulate verifying a Paystack transaction
  verifyPayment: async (reference) => {
    // In reality, this would call Paystack's verify endpoint via your backend
    // to ensure the payment was legitimate before granting premium access.
    return new Promise((resolve) => {
      setTimeout(() => {
        if (reference) {
          resolve({ status: true, message: "Payment Verified" });
        } else {
          resolve({ status: false, message: "Payment Failed" });
        }
      }, 1000); // Simulate network delay
    });
  },

  // Simulate tracking daily usage
  incrementDailyUsage: async (userId, currentCount) => {
    // In reality, update 'daily_unripes_count' in 'users' table
    return currentCount + 1;
  }
};
