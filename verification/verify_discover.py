from playwright.sync_api import sync_playwright, expect

def test_discover_page(page):
    page.goto("http://localhost:3000")

    # Check Header
    expect(page.get_by_role("heading", name="Discover Peaches in Delta State")).to_be_visible()

    # Check Notification (Since it's a high match, one of the templates should be visible)
    # Because it is random, we can check if the notification container is visible, or check for partial text.
    # The notification has h3.
    # We can also check for the button "Ripen Now (5 Pits)" since pits start at 25.

    expect(page.get_by_role("button", name="Ripen Now (5 Pits)")).to_be_visible()

    # Take screenshot
    page.screenshot(path="verification/discover_page.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_discover_page(page)
            print("Verification script ran successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()
