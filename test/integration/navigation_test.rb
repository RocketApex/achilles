require "test_helper"

class NavigationTest < ActionDispatch::IntegrationTest
  test "dummy app renders the Achilles demo page" do
    get "/"

    assert_response :success
    assert_select "[data-component-class='DemoCounterComponent']"
    assert_select "script[type='importmap']"
    assert_includes response.body, "demo_counter_component"
  end
end
