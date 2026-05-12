# Achilles v1 Roadmap

This document tracks the work needed before publishing Achilles `1.0.0`.
The goal is a stable open source release that is safe to evaluate in real Rails
applications, even if it intentionally removes legacy behavior from the `0.x`
line.

## Product Direction

Achilles is a small JavaScript lifecycle layer for Rails + Turbo applications.
It gives teams explicit component classes mapped to DOM nodes without requiring
Stimulus controller conventions or a JavaScript build step.

## v1 Public API

The v1 API should be small and documented:

- `Application`
- `ComponentBase`
- `ComponentsClassMapper`
- DOM discovery through `data-component-class`
- component root lookup through `rootElement()`
- `rootNode()` as an alias for `rootElement()`
- CSS selector lookup through `rootElementSelector()`
- lifecycle hooks: `setup()` and `teardown()`
- Turbo integration through `turbo:load` and `turbo:before-render`

## Planned Breaking Changes

- Make `rootElement()` return the component's DOM element.
- Keep `rootNode()` as an alias for `rootElement()`.
- Remove the jQuery return behavior from `rootElement()`.
- Keep Achilles internals independent from jQuery.
- Require every component root to have a unique `id`.
- Treat setup and teardown as idempotent lifecycle operations managed by
  Achilles.

## Release Gates

Do not publish `1.0.0` until these are true:

- Rails test suite passes.
- JavaScript lifecycle tests cover parser, registry, Turbo hooks, root lookup,
  setup idempotence, teardown idempotence, missing elements, and dynamic DOM
  insertion.
- Dummy app asset precompile passes.
- README includes install, usage, lifecycle, dynamic DOM, migration, and API
  reference sections.
- `CHANGELOG.md` documents all breaking changes from `0.1.3`.
- CI runs tests on supported Ruby and Rails versions.
- At least one real application has tested the release candidate.

## Release Plan

1. Publish a compatibility release in the `0.x` line with dependency and
   lifecycle fixes.
2. Create a `v1.0.0.rc1` prerelease after the v1 API and tests are complete.
3. Test `v1.0.0.rc1` in existing applications.
4. Publish `1.0.0` only after the migration guide and real-app testing are done.

## Current Recommendation

Do not push `v1.0.0` yet. The project is ready for a compatibility release, but
`1.0.0` should wait for the final v1 API cleanup and real-application testing
through a release candidate.
