# Changelog

All notable changes to Achilles will be documented in this file.

## Unreleased

### Fixed

- Fixed Turbo Frame rendering so registered components in the outgoing frame are
  torn down and deregistered immediately before Turbo invokes the frame renderer.

## 1.1.1

### Fixed

- Fixed Turbo browser history restoration so components restored from cached DOM
  are registered and set up again when their registry entries were already
  removed.
- Fixed component subtree deregistration so child components are removed with
  their parent and cannot block later re-registration.
- Added browser system coverage for back, forward, restored nested components,
  restored form-field listeners, Turbo-replaced form restoration, and duplicate
  listener prevention.

## 1.1.0

### Added

- Added explicit `Application#start` and `Application#stop` lifecycle methods.
- Added opt-in `Application#strictLifecycleErrors` handling for tests and
  development.
- Added browser system coverage for nested components inside Turbo form
  replacement and Turbo Drive navigation.

### Changed

- `Application` no longer starts automatically from the constructor. Applications
  should register component classes, then call `achilles.start()`. See
  [docs/upgrading-to-1.1.0.md](docs/upgrading-to-1.1.0.md).
- Elements with `data-component-class` must now have a non-empty `id`; invalid
  component roots are skipped with a console error.
- Component teardown now runs from child components to parent components.
- Component parentage now follows DOM ancestry under the synthetic `Page` root.
- Turbo lifecycle hooks are now attached by `start()` and removed by `stop()`.
- Achilles now requires `turbo-rails` so Turbo importmap assets are available to
  host applications.

## 1.0.0

### Added

- Added `importmap-rails` as an explicit runtime dependency.
- Added `rootNode()` as an alias for a component's DOM element.
- Added Turbo teardown support through `turbo:before-render`.
- Added JavaScript lifecycle behavior tests for parser, registry, Turbo hooks,
  dynamic DOM insertion, setup idempotence, teardown idempotence, missing
  elements, and root lookup.
- Added GitHub Actions CI for Rails tests, JavaScript syntax checks, and dummy
  app asset precompile.
- Added v1 roadmap and migration documentation.

### Changed

- Replaced Achilles' internal jQuery usage with browser DOM APIs.
- Updated README with real installation, usage, lifecycle, and contribution
  instructions.
- Fixed dummy app asset manifest linkage for asset precompile.
- Removed deprecated Rails statistics rake task loading.

### Breaking Changes

- `rootElement()` now always returns the DOM element for the component id.
- `rootElement()` no longer returns a jQuery object when `window.$` is present.
- Applications that want jQuery should wrap the DOM element explicitly with
  `$(this.rootElement())`.
- Achilles internals are independent from jQuery.

## 0.1.3

Tagged as the last known pre-v1 baseline.
