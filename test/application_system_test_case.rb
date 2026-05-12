require "test_helper"
require "capybara/rails"
require "selenium-webdriver"

CHROME_BINARY = ENV["CHROME_BIN"] || [
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].find { |path| File.executable?(path) }

CHROMEDRIVER_PATH = ENV["CHROMEDRIVER_PATH"] || "/usr/bin/chromedriver"
Selenium::WebDriver::Chrome::Service.driver_path = CHROMEDRIVER_PATH if File.executable?(CHROMEDRIVER_PATH)

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [1400, 1400] do |options|
    options.binary = CHROME_BINARY if CHROME_BINARY
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_option("goog:loggingPrefs", { browser: "ALL" })
  end

  setup do
    skip "Chrome or Chromium is not available for system tests" unless CHROME_BINARY
  end
end
