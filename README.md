# Achilles

Achilles is a small JavaScript lifecycle layer for Rails + Turbo applications.
It is an explicit component-class alternative to Stimulus for teams that prefer
plain JavaScript classes mapped directly to DOM nodes.

Achilles scans the page for elements with `data-component-class`, instantiates
the matching JavaScript class, and calls `setup` and `teardown` as Turbo renders
new pages or new component markup is inserted.

Current applications should use Achilles `1.1.1`. If you are upgrading an
existing app, start with the [1.1.0 upgrade guide](docs/upgrading-to-1.1.0.md)
and then read the [1.1.1 release note](docs/releases/v1.1.1.md).

## Why Achilles?

Rails and Turbo make server-rendered interfaces productive, but many apps still
need page-specific JavaScript for menus, forms, filters, widgets, charts, and
small interaction islands.

Achilles keeps that JavaScript close to the DOM without requiring controller
naming conventions or a build step. You register classes explicitly, mark the
HTML root node, and implement lifecycle methods.

Use Achilles when you want:

- explicit JavaScript classes instead of controller naming conventions
- lifecycle hooks that match Turbo navigation
- no internal jQuery dependency
- no JavaScript build step
- predictable setup and teardown for server-rendered UI
- simple dynamic DOM registration through `MutationObserver`

## Achilles vs Stimulus

Stimulus is a strong default for many Rails apps. Achilles is intentionally
smaller and more explicit.

| Concern | Achilles | Stimulus |
| --- | --- | --- |
| Class registration | Explicit mapper registration | File and identifier conventions |
| DOM marker | `data-component-class` | `data-controller` |
| Root element API | `this.rootElement()` | `this.element` |
| Lifecycle | `setup()` and `teardown()` | `connect()` and `disconnect()` |
| Targets/actions | Use standard DOM APIs | Built-in targets/actions |
| Dependency | Rails, Turbo, Importmap | Hotwire Stimulus |

Choose Achilles if you want a tiny lifecycle layer with explicit class mapping.
Choose Stimulus if you want its controller ecosystem, targets, values, actions,
and conventions.

## Requirements

- Rails 7.0.2.3 or newer
- Turbo Rails
- Importmap Rails

## Installation

Add Achilles to your application's Gemfile:

```ruby
gem "achilles"
```

Then install:

```bash
bundle install
```

## Usage

Create one Achilles application instance and register your component classes:

```js
// app/javascript/application.js
import { Application } from "achilles/application/application";
import { CounterComponent } from "components/counter_component";

const achilles = new Application();
achilles.componentsClassMapper.addComponentClass("CounterComponent", CounterComponent);
achilles.start();
```

Call `start()` after registering component classes. Achilles parses the current
page and attaches Turbo lifecycle hooks when the application starts.

Create components by extending `ComponentBase`:

```js
// app/javascript/components/counter_component.js
import { ComponentBase } from "achilles/components/component_base";

class CounterComponent extends ComponentBase {
  setup() {
    this.rootElement().addEventListener("click", this.increment);
  }

  teardown() {
    this.rootElement().removeEventListener("click", this.increment);
  }

  increment = () => {
    this.rootElement().textContent = Number(this.rootElement().textContent) + 1;
  }
}

export { CounterComponent };
```

Mark the component root in your view:

```erb
<button id="counter" data-component-class="CounterComponent">0</button>
```

Every component root must have a non-empty unique `id`. Achilles uses that id to
register the component, find its root element, and avoid running setup twice for
the same DOM node. Components without ids are skipped and reported in the browser
console.

## Dynamic Components

Achilles watches the document for inserted component markup. If Turbo Streams,
custom JavaScript, or another UI flow adds a matching element, Achilles parses
and sets it up automatically.

```erb
<div id="notification-42" data-component-class="NotificationComponent">
  Saved successfully
</div>
```

```js
import { ComponentBase } from "achilles/components/component_base";

class NotificationComponent extends ComponentBase {
  setup() {
    this.timeout = window.setTimeout(() => {
      this.rootElement().remove();
    }, 3000);
  }

  teardown() {
    window.clearTimeout(this.timeout);
  }
}

export { NotificationComponent };
```

Register the component class once:

```js
achilles.componentsClassMapper.addComponentClass("NotificationComponent", NotificationComponent);
```

## Nested Components

Achilles keeps a component tree rooted at a single synthetic `Page` component.
A component's parent is its nearest ancestor element with `data-component-class`.
If there is no component ancestor, its parent is `Page`.

```erb
<div id="dashboard" data-component-class="DashboardComponent">
  <div id="filters" data-component-class="FiltersComponent"></div>
</div>
```

This creates the following component tree:

```text
Page
dashboard
filters
```

## Example App

The dummy Rails app includes a working counter component. See
[examples/README.md](examples/README.md) for the files and local run command.

## Lifecycle

- `setup()` runs after `turbo:load` and after new matching DOM nodes are inserted.
- `teardown()` runs before Turbo renders a new page.
- Before Turbo renders replacement content in a frame, Achilles tears down and
  deregisters registered components in the outgoing frame from children to
  parents.
- `setup()` and `teardown()` are called once per registered component instance.
- Parent components are set up before their children.
- Child components are torn down before their parents.
- Components that attach listeners, timers, observers, subscriptions, or widgets
  should clean them up in `teardown()`.
- Lifecycle errors are logged and swallowed by default so one broken component
  does not stop the page. Enable strict mode in tests or development when errors
  should be re-raised:

```js
achilles.strictLifecycleErrors = true;
```

## API Reference

### `Application`

The top-level Achilles application object.

```js
import { Application } from "achilles/application/application";

const achilles = new Application();
achilles.start();
```

Useful properties:

- `componentsClassMapper`: register component classes by name.
- `componentRegistry`: inspect or manage registered component instances.
- `strictLifecycleErrors`: re-raise lifecycle errors after logging them.
- `timezone`: access the configured app timezone.

Call `start()` after registering component classes. Call `stop()` when an
application instance should remove its Turbo hooks and stop observing the DOM.

### `ComponentsClassMapper`

Maps `data-component-class` values to JavaScript classes.

```js
achilles.componentsClassMapper.addComponentClass("MenuComponent", MenuComponent);
```

### `ComponentBase`

Base class for application components.

```js
import { ComponentBase } from "achilles/components/component_base";

class MenuComponent extends ComponentBase {
  setup() {}
  teardown() {}
}
```

Useful methods:

- `setup()`: override to initialize behavior.
- `teardown()`: override to clean up behavior before Turbo renders a new page.
- `rootElement()`: returns the component root DOM element.
- `rootNode()`: alias for `rootElement()`.
- `rootElementSelector()`: returns a CSS selector for the component id.

### Component Markup

```erb
<div id="account-menu" data-component-class="MenuComponent"></div>
```

The `data-component-class` value must match a class registered with
`componentsClassMapper`. The element must also have a non-empty unique `id`.
Nested components are parented by DOM ancestry, with top-level components
parented by the synthetic `Page` component.

## Timezone

If the page includes an element with `data-app-timezone`, Achilles exposes the
value through `achilles.timezone.timezoneString`.

```erb
<div data-app-timezone="<%= Time.zone.tzinfo.name %>"></div>
```

If no timezone is present, Achilles falls back to `Etc/UTC`.

## Upgrading

Applications upgrading to `1.1.0` should read the
[1.1.0 upgrade guide](docs/upgrading-to-1.1.0.md). The complete upgrade index
lives in [docs/upgrading.md](docs/upgrading.md), and the GitHub release draft is
available at [docs/releases/v1.1.1.md](docs/releases/v1.1.1.md).

## Upgrading From 0.1.3

Achilles `1.0.0` changes `rootElement()` to return a DOM element. It no longer
returns a jQuery object when `window.$` is present.

Old jQuery-style code:

```js
this.rootElement().addClass("is-open");
```

Use DOM APIs:

```js
this.rootElement().classList.add("is-open");
```

Or wrap explicitly if the application still uses jQuery:

```js
$(this.rootElement()).addClass("is-open");
```

Applications upgrading from `0.1.3` should also read the
[v1 migration guide](docs/migrating-from-0.1.3-to-v1.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, test commands, pull request
guidelines, and release notes. Project participation is covered by the
[code of conduct](CODE_OF_CONDUCT.md). Maintainer responsibilities are described
in [MAINTAINERS.md](MAINTAINERS.md).

Run the test suite with:

```bash
bin/rails test
```

Run the browser system test with:

```bash
bin/rails test:system
```

Run the JavaScript syntax check with:

```bash
for file in $(find app/javascript/achilles -name '*.js' -print); do node --input-type=module --check < "$file" || exit 1; done
```

Run the dummy app asset precompile check with:

```bash
RAILS_ENV=test bin/rails app:assets:precompile
```

## Security

Report security issues privately. See [SECURITY.md](SECURITY.md).

## License

Achilles is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
