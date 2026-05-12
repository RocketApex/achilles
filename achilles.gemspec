require_relative "lib/achilles/version"

Gem::Specification.new do |spec|
  spec.name        = "achilles"
  spec.version     = Achilles::VERSION
  spec.authors     = ["Jey Geethan"]
  spec.email       = ["jey@jeygeethan.com"]
  spec.homepage    = "https://github.com/RocketApex/achilles"
  spec.summary     = "JavaScript component lifecycle for Rails and Turbo apps"
  spec.description = "A small JavaScript lifecycle layer for Rails and Turbo applications, positioned as an explicit component-class alternative to Stimulus."
  spec.license     = "MIT"
  spec.required_ruby_version = ">= 3.1"
  
  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the "allowed_push_host"
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  spec.metadata["allowed_push_host"] = "https://rubygems.org"

  spec.metadata["source_code_uri"] = "https://github.com/RocketApex/achilles"
  spec.metadata["changelog_uri"] = "https://github.com/RocketApex/achilles/blob/main/CHANGELOG.md"

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{app,config,db,lib}/**/*", "CHANGELOG.md", "MIT-LICENSE", "Rakefile", "README.md", "docs/**/*"]
  end

  spec.add_dependency "rails", ">= 7.0.2.3"
  spec.add_dependency "importmap-rails", ">= 2.0.0"
  spec.add_dependency "turbo-rails", ">= 2.0.11"
end
