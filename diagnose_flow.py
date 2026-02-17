from playwright.sync_api import sync_playwright
import time

def diagnose():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 375, 'height': 667}) # Mobile size
        page = context.new_page()

        print("--- DIAGNOSIS STARTED ---")

        # Capture console logs
        page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"BROWSER ERROR: {exc}"))

        try:
            print("1. Loading App...")
            page.goto("http://localhost:3000")
            page.wait_for_timeout(3000)
            page.screenshot(path="diag_01_loaded.png")

            # Check for crash
            content = page.content()
            if "Something went wrong" in content or "Error" in content: # Generic React error boundary check if implemented, or just raw text
                print("!! Potential Crash Detected on Load !!")

            # Check Auth Screen
            if page.is_visible('text=Login'):
                print("   > Auth Screen Visible")

                # 2. Login Flow
                print("2. Attempting Login...")
                page.fill('input[placeholder="Email"]', 'test@peach.com')
                page.fill('input[placeholder="Password"]', 'password123')
                page.click('button:has-text("Login")')
                page.wait_for_timeout(2000)
                page.screenshot(path="diag_02_logged_in.png")

                # Should be at Discover (test user skips onboarding)
                if page.is_visible('text=Discover'):
                    print("   > Login Successful. On Discover Page.")
                else:
                    print("   !! Login Failed or Stuck !!")
                    print(page.content())
            else:
                print("   !! Auth Screen NOT Visible !!")

            # 3. Check Mobile Nav
            print("3. Checking Bottom Nav...")
            if page.is_visible('.bottom-nav'):
                print("   > Bottom Nav Present")
            else:
                print("   !! Bottom Nav Missing !!")

            # 4. Check Swipe Cards
            print("4. Checking Swipe Cards...")
            try:
                page.wait_for_selector('.swipe', timeout=5000)
                print("   > Cards Rendered")
                page.screenshot(path="diag_03_cards.png")
            except:
                print("   !! No Cards Found !!")

            # 5. Check Settings
            print("5. Checking Settings...")
            page.click('text=Settings')
            page.wait_for_timeout(1000)
            page.screenshot(path="diag_04_settings.png")

            if page.is_visible('text=Identity Verification'):
                print("   > Settings Page Loaded")
            else:
                print("   !! Settings Page Issue !!")

        except Exception as e:
            print(f"EXCEPTION DURING DIAGNOSIS: {e}")
            page.screenshot(path="diag_error.png")

        browser.close()
        print("--- DIAGNOSIS COMPLETE ---")

if __name__ == "__main__":
    diagnose()
