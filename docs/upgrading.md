# Upgrading Achilles

Use this page as the entry point for application upgrades.

Achilles should have an upgrade note for every release that changes application
setup, component markup, lifecycle behavior, or public APIs.

## Current Upgrade Notes

- [Upgrading to 1.1.0](upgrading-to-1.1.0.md)
- [Migrating from 0.1.3 to v1](migrating-from-0.1.3-to-v1.md)

## Upgrade Policy

Before upgrading an existing application:

1. Read the guide for the target version.
2. Upgrade one application first.
3. Run the application's test suite.
4. Visit pages with Achilles components.
5. Verify Turbo navigation and dynamically inserted components.
6. Check the browser console for lifecycle, missing component class, or duplicate
   id errors.

For breaking changes, prefer testing a release candidate in a real application
before upgrading every project.
