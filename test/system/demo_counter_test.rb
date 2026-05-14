require "application_system_test_case"

class DemoCounterTest < ApplicationSystemTestCase
  test "demo counter increments through Achilles component lifecycle" do
    visit "/"

    assert_button "Count: 0"
    click_button "Count: 0"

    assert_button "Count: 1"
  end

  test "nested components inside a turbo form survive form replacement" do
    visit "/nested"

    assert_selector "#nested-panel[data-panel-ready='true']"
    assert_selector "#profile-form[data-form-ready='true']"
    assert_text "Preview: empty"

    fill_in "Label", with: "Alpha"
    assert_text "Preview: Alpha"

    click_button "Save nested form"

    assert_selector "#form-result", text: "Submitted: Alpha"
    assert_selector "#profile-form[data-form-ready='true']"
    assert_field "Label", with: "Alpha"

    fill_in "Label", with: "Beta"
    assert_text "Preview: Beta"

    assert_button "Nested count: 0"
    click_button "Nested count: 0"
    assert_button "Nested count: 1"
  end

  test "turbo navigation keeps the page alive and nested components still work" do
    visit "/"

    boot_count = page.evaluate_script("window.achillesBootCount")

    click_link "Open nested demo"

    assert_current_path "/nested"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")
    assert_selector "#nested-panel[data-panel-ready='true']"

    assert_button "Nested count: 0"
    click_button "Nested count: 0"
    assert_button "Nested count: 1"

    click_link "Back to counter"

    assert_current_path "/"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")
    assert_button "Count: 0"

    click_button "Count: 0"
    assert_button "Count: 1"
  end

  test "browser back restores the previous page with working components" do
    visit "/"

    boot_count = page.evaluate_script("window.achillesBootCount")

    click_link "Open nested demo"

    assert_current_path "/nested"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")
    assert_selector "#nested-panel[data-panel-ready='true']"

    page.go_back

    assert_current_path "/"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")
    assert_button "Count: 0"

    click_button "Count: 0"
    assert_button "Count: 1"
  end

  test "browser back and forward restore pages with working components" do
    visit "/"

    boot_count = page.evaluate_script("window.achillesBootCount")

    click_link "Open nested demo"
    assert_current_path "/nested"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")

    page.go_back

    assert_current_path "/"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")
    assert_button "Count: 0"
    click_button "Count: 0"
    assert_button "Count: 1"

    page.go_forward

    assert_current_path "/nested"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")
    assert_selector "#nested-panel[data-panel-ready='true']"
    assert_selector "#nested-button[data-nested-button-ready='true']"

    assert_button "Nested count: 0"
    click_button "Nested count: 0"
    assert_button "Nested count: 1"
  end

  test "browser back to a nested page restores nested component listeners" do
    visit "/nested"

    boot_count = page.evaluate_script("window.achillesBootCount")

    click_link "Back to counter"
    assert_current_path "/"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")

    page.go_back

    assert_current_path "/nested"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")
    assert_selector "#nested-panel[data-panel-ready='true']"
    assert_selector "#nested-button[data-nested-button-ready='true']"

    assert_button "Nested count: 0"
    click_button "Nested count: 0"
    assert_button "Nested count: 1"
  end

  test "browser back to a nested page restores form field listeners" do
    visit "/nested"

    boot_count = page.evaluate_script("window.achillesBootCount")

    click_link "Back to counter"
    assert_current_path "/"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")

    page.go_back

    assert_current_path "/nested"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")
    assert_selector "#profile-form[data-form-ready='true']"
    assert_text "Preview: empty"

    fill_in "Label", with: "Restored"
    assert_text "Preview: Restored"
  end

  test "browser back to a turbo-replaced nested form restores component listeners" do
    visit "/nested"

    boot_count = page.evaluate_script("window.achillesBootCount")

    fill_in "Label", with: "Submitted"
    click_button "Save nested form"
    assert_selector "#form-result", text: "Submitted: Submitted"
    assert_selector "#profile-form[data-form-ready='true']"

    click_link "Back to counter"
    assert_current_path "/"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")

    page.go_back

    assert_current_path "/nested"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")
    assert_selector "#form-result", text: "Submitted: Submitted"
    assert_selector "#profile-form[data-form-ready='true']"

    fill_in "Label", with: "Resubmitted"
    assert_text "Preview: Resubmitted"

    click_button "Save nested form"
    assert_selector "#form-result", text: "Submitted: Resubmitted"
  end

  test "browser history restore does not attach duplicate click listeners" do
    visit "/"

    boot_count = page.evaluate_script("window.achillesBootCount")

    click_link "Open nested demo"
    assert_current_path "/nested"

    page.go_back

    assert_current_path "/"
    assert_equal boot_count, page.evaluate_script("window.achillesBootCount")
    assert_button "Count: 0"

    click_button "Count: 0"

    assert_button "Count: 1"
    assert_no_button "Count: 2"
  end
end
