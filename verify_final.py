from playwright.sync_api import sync_playwright

def verify_final():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 375, 'height': 667})
        page = context.new_page()

        print("Navigating...")
        page.goto("http://localhost:3000")

        # Verify Discover
        page.wait_for_selector('text=Discover Peaches 🍑')
        page.screenshot(path="discover_page.png")
        print("Discover page verified.")

        # Go to Chats
        page.click('button:has-text("💬")')
        try:
             page.wait_for_selector('text=Your Peaches 🍑', timeout=5000)
        except:
             # Or "No Chats Yet"
             page.wait_for_selector('text=No Chats Yet', timeout=5000)

        page.screenshot(path="chat_list_page.png")
        print("Chat list page verified.")

        browser.close()

if __name__ == "__main__":
    verify_final()
