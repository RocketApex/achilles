# Maintainers

Achilles is maintained as a small, stable Rails + Turbo lifecycle gem.

The maintainer goal is to keep the public API easy to understand, the runtime
surface small, and releases safe for applications that already depend on the
gem.

## Decision Making

Maintainers should prefer changes that:

- preserve the small public API
- improve reliability across Rails, Turbo, and importmap applications
- reduce hidden runtime dependencies
- make migration or debugging easier for existing applications
- include tests for changed behavior

Breaking changes are acceptable when they make the project simpler, safer, or
more predictable. They should be documented in `CHANGELOG.md`, covered by tests,
and called out in migration notes when existing applications need code changes.

## Release Ownership

Before publishing a release, a maintainer should:

- confirm CI is green
- run the local verification set in `CONTRIBUTING.md`
- follow `docs/release-checklist.md`
- test release candidates in at least one real Rails application when behavior
  changes affect runtime integration

Patch releases should be narrow and low risk. Minor releases can add compatible
APIs or documentation improvements. Major releases may remove deprecated
behavior or tighten public contracts.

## Security Reports

Security reports should follow `SECURITY.md`. Reports are handled privately
until there is a fix or a clear public response.

## Community Standards

Project participation is covered by `CODE_OF_CONDUCT.md`. Maintainers may close
issues, reject pull requests, edit discussions, or block participants when
needed to keep the project focused and respectful.

## Adding Maintainers

New maintainers should already have a history of useful issues, documentation,
or code contributions. They should understand the project scope, support the
public API expectations in `CONTRIBUTING.md`, and be comfortable reviewing
changes conservatively.
