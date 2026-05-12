# Changelog

All notable changes to Achilles will be documented in this file.

## Unreleased

### Added

- Added explicit `Application#start` and `Application#stop` lifecycle methods.

### Changed

- `Application` no longer starts automatically from the constructor. Applications
  should register component classes, then call `achilles.start()`.
- Turbo lifecycle hooks are now attached by `start()` and removed by `stop()`.

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
