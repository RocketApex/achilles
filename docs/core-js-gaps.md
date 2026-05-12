# Core JavaScript Gaps

This is the current improvement backlog for Achilles core JavaScript. API
reference docs should wait until the structure settles.

## Completed

- Added an explicit `Application#start` and `Application#stop` lifecycle.
- Made Turbo event listeners removable.
- Validated that component roots have non-empty ids before registration.
- Changed teardown order so child components tear down before parent components.
- Deleted deregistered registry entries instead of leaving `null` tombstones.
- Batched mutation observer setup work with a microtask debounce.
- Replaced one-way lifecycle flags with a `mounted` state while keeping
  `setupExecuted` and `teardownExecuted` as compatibility aliases.
- Added tests for missing ids, duplicate starts, listener cleanup,
  child-before-parent teardown, dynamic insertion batching, deregistration, and
  remounting a reused component instance.
- Chose a DOM ancestry model for nested components under the single synthetic
  `Page` root.
- Split JavaScript tests by parser, registry, application, Turbo hooks, and
  component base responsibility.
- Added package/file-list regression coverage for the gemspec.

## Remaining Priority Gaps

1. Clarify lifecycle error handling.
   Setup and teardown exceptions are logged and swallowed. That is friendly for
   production pages, but tests and development may need an opt-in strict mode.
