# Release Checklist

Use this checklist for every Achilles release. Replace `VERSION` with the
version being prepared, for example `1.1.0`.

## Before Finalizing The Version

- Confirm the release type: patch, minor, major, or prerelease.
- Confirm `lib/achilles/version.rb` has the intended version.
- Confirm `CHANGELOG.md` has an entry for the intended version.
- Confirm application-facing changes have an upgrade note in `docs/upgrading.md`.
- Confirm release notes exist in `docs/releases/` when the release needs a
  GitHub release body.
- Confirm package file expectations are covered by `test/gemspec_files_test.rb`
  when adding source or documentation files.

## Before Building

- Confirm CI is green on GitHub.
- Run the local verification commands:

```bash
bin/rails test
node --test test/javascript/*_test.mjs
for file in $(rg --files app/javascript/achilles test/dummy/app/javascript test/javascript | rg "\.(js|mjs)$"); do node --input-type=module --check < "$file" || exit 1; done
bin/rails test:system
RAILS_ENV=test bin/rails app:assets:precompile
```

## Build The Gem

```bash
gem build achilles.gemspec
```

Confirm the generated gem name matches the intended version:

```bash
ls achilles-VERSION.gem
```

## Test In A Real Application

Before a broad rollout, test the built gem in at least one real Rails + Turbo
application that already uses Achilles.

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

For releases with breaking or compatibility-sensitive behavior, test one app
first, then roll out to the rest of the maintained apps gradually.

## Publish A Prerelease

Publish a prerelease only when the release needs real-app validation before a
final tag.

```bash
git tag vVERSION
git push origin vVERSION
gem push achilles-VERSION.gem
```

Mark the GitHub release as a prerelease and include the matching release notes.

## Publish A Final Release

Publish a final release after local checks, GitHub CI, packaging verification,
and real-app testing are complete.

```bash
git tag vVERSION
git push origin vVERSION
gem push achilles-VERSION.gem
```

After pushing:

- Create or update the GitHub release for `vVERSION`.
- Paste the release note from `docs/releases/vVERSION.md` when one exists, for
  example `docs/releases/v1.1.0.md`.
- Link the release back to the upgrade guide for application-facing changes.
- Confirm the pushed gem is visible on RubyGems.
