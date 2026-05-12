# Contributing

Thanks for taking the time to improve Achilles.

Achilles is intentionally small. Contributions should keep the public API clear,
the Rails + Turbo integration reliable, and the documentation practical for
applications that already use the gem.

## Local Setup

Install dependencies:

```bash
bundle install
```

Run the dummy Rails app:

```bash
bin/rails server
```

Open:

```text
http://localhost:3000/
```

The dummy app includes a working counter component that exercises the basic
Achilles flow.

## Test Commands

Run the Rails and JavaScript lifecycle tests:

```bash
bin/rails test
```

Run the browser system test:

```bash
bin/rails test:system
```

Run JavaScript syntax checks:

```bash
for file in $(find app/javascript/achilles test/dummy/app/javascript -name '*.js' -print); do node --input-type=module --check < "$file" || exit 1; done
```

Run the dummy app asset precompile check:

```bash
RAILS_ENV=test bin/rails app:assets:precompile
```

Run the full local verification set:

```bash
bin/rails test
bin/rails test:system
for file in $(find app/javascript/achilles test/dummy/app/javascript -name '*.js' -print); do node --input-type=module --check < "$file" || exit 1; done
RAILS_ENV=test bin/rails app:assets:precompile
```

## System Test Browser Requirements

System tests use Selenium with headless Chrome.

On CI, GitHub's Ubuntu runner provides Chrome. Locally, set these environment
variables if Chrome or chromedriver are installed in non-standard locations:

```bash
CHROME_BIN=/path/to/chrome CHROMEDRIVER_PATH=/path/to/chromedriver bin/rails test:system
```

If Chrome is not available, the system test base skips browser tests cleanly.

## Pull Request Guidelines

- Keep changes scoped.
- Add or update tests for behavior changes.
- Update the README or docs for public API changes.
- Add or update an upgrade guide for changes existing applications must make.
- Mention breaking changes clearly in the pull request.
- Do not introduce a new runtime dependency without explaining why it belongs in
  a small lifecycle gem.
- Prefer browser DOM APIs in Achilles internals.
- Keep jQuery usage out of Achilles internals. Applications may still use jQuery
  explicitly in their own components.

## Public API Expectations

Treat these as public API:

- `Application`
- `ComponentBase`
- `ComponentsClassMapper`
- `data-component-class`
- `setup()`
- `teardown()`
- `rootElement()`
- `rootNode()`
- `rootElementSelector()`

Changes to these APIs need tests, documentation, and changelog notes.

## Release Process

Use [docs/release-checklist.md](docs/release-checklist.md) for prereleases and
final releases.

Maintainer release ownership and project decision guidelines are documented in
[MAINTAINERS.md](MAINTAINERS.md).

Before releasing:

- confirm CI is green
- run the full local verification set
- build the gem with `gem build achilles.gemspec`
- test release candidates in at least one real application
