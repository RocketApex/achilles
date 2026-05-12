# Upgrading To Unreleased

This guide covers changes currently on `main` that are not part of the latest
published gem.

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

## Manual Test Checklist

After updating an application:

- boot the app
- open a page with Achilles components
- confirm component `setup()` methods run
- navigate with Turbo to another page and back
- confirm `teardown()` still runs before Turbo renders a new page
- insert any dynamic component markup the app supports
- check the browser console for Achilles errors
