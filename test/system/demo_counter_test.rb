require "application_system_test_case"

class DemoCounterTest < ApplicationSystemTestCase
  test "demo counter increments through Achilles component lifecycle" do
    visit "/"

    assert_button "Count: 0"
    click_button "Count: 0"

    assert_button "Count: 1"
  end
end
