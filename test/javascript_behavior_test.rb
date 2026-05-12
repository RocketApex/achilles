require "test_helper"

class JavascriptBehaviorTest < ActiveSupport::TestCase
  test "achilles javascript lifecycle behavior" do
    test_files = Rails.root.join("../../test/javascript/*_test.mjs").to_s

    assert system("node", "--test", *Dir[test_files].sort)
  end
end
