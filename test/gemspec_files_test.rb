require "test_helper"

class GemspecFilesTest < ActiveSupport::TestCase
  test "package includes source files and project documentation" do
    spec = Gem::Specification.load(Rails.root.join("../../achilles.gemspec").to_s)

    expected_files = [
      "CHANGELOG.md",
      "CODE_OF_CONDUCT.md",
      "CONTRIBUTING.md",
      "MAINTAINERS.md",
      "MIT-LICENSE",
      "README.md",
      "SECURITY.md",
      "app/javascript/achilles/application/application.js",
      "app/javascript/achilles/components/component_base.js",
      "app/javascript/achilles/components/component_parser.js",
      "app/javascript/achilles/components/components_registry.js",
      "config/importmap.rb",
      "docs/upgrading.md",
      "docs/upgrading-to-1.1.0.md"
    ]

    expected_files.each do |file|
      assert_includes spec.files, file
    end
  end
end
