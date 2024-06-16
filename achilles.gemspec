require_relative "lib/achilles/version"

Gem::Specification.new do |spec|
  spec.name        = "achilles"
  spec.version     = Achilles::VERSION
  spec.authors     = ["Jey Geethan"]
  spec.email       = ["jey@jeygeethan.com"]
  spec.homepage    = "https://github.com/RocketApex/achilles"
  spec.summary     = "Js library as an alternative to stimulus"
  spec.description = "A simple js library to make your turbo apps work better"
  spec.license     = "MIT"
  
  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the "allowed_push_host"
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  spec.metadata["allowed_push_host"] = "https://rubygems.org"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/RocketApex/achilles"
  spec.metadata["changelog_uri"] = "https://github.com/RocketApex/achilles"

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  end

  spec.add_dependency "rails", ">= 7.0.2.3"
end
