# Changelog

All notable changes to Achilles will be documented in this file.

## Unreleased

### Added

- Added `importmap-rails` as an explicit runtime dependency.
- Added `rootNode()` as the canonical way to access a component's DOM element.
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

### Compatibility

- `rootElement()` still preserves the original Achilles behavior in the
  compatibility line: it returns a jQuery object when `window.$` is present and
  falls back to a DOM element otherwise.

### Planned Breaking Changes For v1

- `rootNode()` will become the primary root element API.
- `rootElement()` will stop returning a jQuery object, or it will be removed.
- Achilles internals will remain independent from jQuery.

## 0.1.3

Tagged as the last known pre-v1 baseline.
