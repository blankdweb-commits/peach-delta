
from playwright.sync_api import sync_playwright

def verify_peach_nectar(page):
    page.goto("http://localhost:3000")

    # Wait for the "Peach Nectar" notification
    page.wait_for_selector("text=Peach Nectar!")

    # Take a screenshot
    page.screenshot(path="verification/peach_nectar.png")
    print("Screenshot taken!")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_peach_nectar(page)
        finally:
            browser.close()
