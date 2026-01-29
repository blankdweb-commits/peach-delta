from playwright.sync_api import Page, expect, sync_playwright

def test_peach_notification(page: Page):
    print("Navigating to app...")
    page.goto("http://localhost:3000")

    print("Checking header...")
    expect(page.get_by_text("Discover Peaches in Delta State 🍑")).to_be_visible()

    print("Checking notification button...")
    # The notification should appear because the first match is 100% compatible
    expect(page.get_by_role("button", name="Ripen Now (5 Pits)")).to_be_visible()

    print("Taking screenshot...")
    page.screenshot(path="verification/verification.png")
    print("Done.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_peach_notification(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()
