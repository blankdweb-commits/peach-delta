# UI Flow: Peach Nectar Notification & Ripen Interaction

## 1. Trigger Condition
- **Event:** User browses the "Discover" feed.
- **Logic:** System calculates compatibility between current user and the potential match.
- **Condition:** If Compatibility Score >= 90%.

## 2. Notification Display (Peach Nectar)
- **Visual:** A high-energy, animated overlay or toast appears over the profile card.
- **Color Scheme:** Coral (#FF7F50) and Lavender Blush (#FFF0F5).
- **Copy:** "Sweet like Nectar! 🍯 You and [Alias] are a [Score]% match. You both love [Shared Like]?"

## 3. User Interaction & Logic
The notification contains a primary Action Button. The text and behavior of this button depend on the User's Pit Balance.

### Scenario A: Sufficient Pits (>= 5)
- **Button Text:** "Ripen Now (-5 Pits)"
- **Action:**
    1.  User clicks button.
    2.  System deducts 5 Pits.
    3.  Notification dismisses.
    4.  Profile Card updates: Photo unblurs, Real Name is revealed.
    5.  Success Toast: "You have ripened the connection!"

### Scenario B: Insufficient Pits (< 5)
- **Button Text:** "Get Pits to Ripen" (or similar CTA)
- **Visual Cue:** Small red text indicating "Not enough Pits!"
- **Action:**
    1.  User clicks button.
    2.  User is navigated to the **Pit Store** component.
    3.  User purchases a bundle (e.g., Student Saver).
    4.  Upon successful purchase, user is returned to the Discover screen (or can navigate back).
    5.  User can now click "Ripen Now".

## 4. Alternative Action
- **Secondary Button:** "Maybe later"
- **Action:** Dismisses the notification. User can still manually ripen the match from the profile card later if they choose.
