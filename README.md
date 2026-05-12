# Achilles

Achilles is a small JavaScript lifecycle layer for Rails + Turbo applications.
It is positioned as a simpler alternative to Stimulus for apps that prefer
explicit component classes mapped to DOM nodes.

Achilles scans the page for elements with `data-component-class`, instantiates
the matching JavaScript class, and calls `setup` and `teardown` as Turbo renders
new pages.

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
```

Create components by extending `ComponentBase`:

```js
// app/javascript/components/counter_component.js
import { ComponentBase } from "achilles/components/component_base";

class CounterComponent extends ComponentBase {
  setup() {
    this.rootNode().addEventListener("click", this.increment);
  }

  teardown() {
    this.rootNode().removeEventListener("click", this.increment);
  }

  increment = () => {
    this.rootNode().textContent = Number(this.rootNode().textContent) + 1;
  }
}

export { CounterComponent };
```

Mark the component root in your view:

```erb
<button id="counter" data-component-class="CounterComponent">0</button>
```

Every component root must have a unique `id`. Achilles uses that id to register
the component, find its root element, and avoid running setup twice for the same
DOM node.

## Lifecycle

- `setup` runs after `turbo:load` and after new matching DOM nodes are inserted.
- `teardown` runs before Turbo renders a new page.
- `rootElement()` preserves the original Achilles behavior: it returns a jQuery object when `window.$` is available, and otherwise returns the DOM element.
- `rootNode()` returns the DOM element for the component id.
- `rootElementSelector()` returns a CSS selector for the component id.

## Timezone

If the page includes an element with `data-app-timezone`, Achilles exposes the
value through `achilles.timezone.timezoneString`.

```erb
<div data-app-timezone="<%= Time.zone.tzinfo.name %>"></div>
```

If no timezone is present, Achilles falls back to `Etc/UTC`.

## Contributing

Run the test suite with:

```bash
bin/rails test
```

## License

Achilles is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
