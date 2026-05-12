# Upgrading To 1.1.0

This guide covers application-facing changes in Achilles `1.1.0`.

## Application Startup

Achilles applications must now be started explicitly.

Before:

```js
import { Application } from "achilles/application/application";
import { MenuComponent } from "components/menu_component";

const achilles = new Application();
achilles.componentsClassMapper.addComponentClass("MenuComponent", MenuComponent);
```

After:

```js
import { Application } from "achilles/application/application";
import { MenuComponent } from "components/menu_component";

const achilles = new Application();
achilles.componentsClassMapper.addComponentClass("MenuComponent", MenuComponent);
achilles.start();
```

Call `start()` after registering component classes. This lets applications
control when Achilles parses the DOM and attaches Turbo lifecycle hooks.

## Stopping An Application

Applications that create temporary Achilles instances can now call:

```js
achilles.stop();
```

`stop()` removes Turbo lifecycle hooks and stops observing DOM mutations.

Most Rails applications only need one long-lived Achilles instance and do not
need to call `stop()` manually.

## Search Checklist

In each application, search for Achilles construction:

```bash
rg "new Application"
```

For every application instance, confirm component classes are registered before
calling `start()`.

## Component Root Ids

Every element with `data-component-class` must have a non-empty `id`.

Before:

```erb
<div data-component-class="MenuComponent"></div>
```

After:

```erb
<div id="menu" data-component-class="MenuComponent"></div>
```

Achilles uses component root ids as registry keys. Components without ids are
skipped and reported in the browser console.

Search for component roots without ids:

```bash
rg "data-component-class"
```

## Nested Components

Achilles now builds the component tree from DOM ancestry.

- `Page` remains the single synthetic root component.
- A component's parent is its nearest ancestor element with
  `data-component-class`.
- If no component ancestor exists, the parent is `Page`.

For example:

```erb
<div id="dashboard" data-component-class="DashboardComponent">
  <div id="filters" data-component-class="FiltersComponent"></div>
</div>
```

The component tree is:

```text
Page
dashboard
filters
```

## Teardown Order

Component teardown now runs from children to parents.

Before this change, a parent component's `teardown()` could run before its child
components. Now child components clean up first, and the parent cleans up after
its subtree.

Review parent components whose `teardown()` removes DOM nodes, shared event
targets, third-party widgets, or state that child components also use during
cleanup.

## Strict Lifecycle Errors

By default, Achilles logs `setup()` and `teardown()` errors and keeps the page
running.

Tests and development environments can opt into strict lifecycle errors:

```js
const achilles = new Application();
achilles.strictLifecycleErrors = true;
```

When strict mode is enabled, `setup()` and `teardown()` errors are still logged
and then re-raised.

## Manual Test Checklist

After updating an application:

- boot the app
- open a page with Achilles components
- confirm component `setup()` methods run
- navigate with Turbo to another page and back
- confirm `teardown()` still runs before Turbo renders a new page
- insert any dynamic component markup the app supports
- check the browser console for Achilles errors
