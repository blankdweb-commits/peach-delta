from playwright.sync_api import sync_playwright

def verify_final():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 375, 'height': 667})
        page = context.new_page()

        print("Navigating...")
        page.goto("http://localhost:3000")

        # Verify Onboarding
        page.wait_for_selector('text=Step 1: Verification')
        page.screenshot(path="onboarding_step1.png")
        print("Onboarding step 1 visible.")

        browser.close()

if __name__ == "__main__":
    verify_final()
