require "test_helper"

class JavascriptSourceTest < ActiveSupport::TestCase
  test "framework javascript does not require jquery globals" do
    javascript = Dir[Rails.root.join("../../app/javascript/achilles/**/*.js")].to_h do |path|
      [path, File.read(path)]
    end

    offenders = javascript.filter_map do |path, source|
      path if source.match?(/\$\(|jQuery/)
    end

    assert_empty offenders
  end

  test "achilles declares its importmap dependency" do
    dependency_names = Gem.loaded_specs.fetch("achilles").dependencies.map(&:name)

    assert_includes dependency_names, "importmap-rails"
  end
end
