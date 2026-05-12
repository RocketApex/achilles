require "test_helper"

class JavascriptBehaviorTest < ActiveSupport::TestCase
  test "achilles javascript lifecycle behavior" do
    assert system("node", "--test", Rails.root.join("../../test/javascript/achilles_lifecycle_test.mjs").to_s)
  end
end
