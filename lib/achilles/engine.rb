module Achilles
  class Engine < ::Rails::Engine
    isolate_namespace Achilles

    # Importmap initializers
    initializer 'achilles.importmap', before: 'importmap' do |app|
      app.config.importmap.paths << Engine.root.join('config/importmap.rb')
      app.config.importmap.cache_sweepers << Engine.root.join('app/javascript') # Required to ensure that js reloads
    end

    # Add javascript to precompile paths
    initializer 'achilles.precompile' do |app|
      app.config.assets.paths << Engine.root.join('app/javascript')
    end
  end
end
