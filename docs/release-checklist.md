# Release Checklist

Use this checklist for `1.0.0.rc1` and future releases.

## Before Building

- Confirm `lib/achilles/version.rb` has the intended version.
- Confirm `CHANGELOG.md` has an entry for the intended version.
- Confirm CI is green on GitHub.
- Run the local verification commands:

```bash
bin/rails test
for file in $(find app/javascript/achilles -name '*.js' -print); do node --input-type=module --check < "$file" || exit 1; done
RAILS_ENV=test bin/rails app:assets:precompile
```

## Build The Gem

```bash
gem build achilles.gemspec
```

Confirm the generated gem name matches the intended version:

```bash
ls achilles-*.gem
```

## Test In A Real Application

In one application that currently uses Achilles `0.1.3`, point the Gemfile to
the local checkout or install the built prerelease gem.

Check:

- app boot
- importmap rendering
- pages with Achilles components
- Turbo navigation between pages
- dynamic component insertion
- browser console errors
- components that use `rootElement()`
- components that attach window, document, timer, observer, or third-party
  widget state

For v1, `rootElement()` returns a DOM element. If a component expects a jQuery
object, update it to use DOM APIs or wrap explicitly with
`$(this.rootElement())`.

## Publish A Prerelease

Only publish `1.0.0.rc1` after local checks and GitHub CI pass.

```bash
gem push achilles-1.0.0.rc1.gem
git tag v1.0.0.rc1
git push origin v1.0.0.rc1
```

## Publish Final v1.0.0

Publish final `1.0.0` only after at least one real application has successfully
tested the release candidate.

Before final release:

- update `lib/achilles/version.rb` to `1.0.0`
- update `CHANGELOG.md` from `1.0.0.rc1` to `1.0.0`
- run all local checks
- confirm GitHub CI is green
- build and push `achilles-1.0.0.gem`
- tag `v1.0.0`
