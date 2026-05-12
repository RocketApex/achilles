# Migrating From 0.1.3 To v1

This guide is for applications already using Achilles `0.1.3`.

The recommended path is to first adopt the compatibility release, then test the
v1 release candidate in one real application before upgrading every app.

## Upgrade Strategy

1. Upgrade one application at a time.
2. Run the app locally with Turbo navigation enabled.
3. Visit pages with Achilles components.
4. Watch the browser console for missing component classes, duplicate ids, and
   lifecycle errors.
5. Verify that components still clean up event listeners on navigation.
6. Repeat the same checks after dynamically inserting component markup.

## Compatibility Release Checklist

These changes should be safe for existing `0.1.3` applications:

- `importmap-rails` is declared as an Achilles dependency.
- Achilles calls `teardown()` before Turbo renders a new page.
- Achilles internals no longer require jQuery.
- `rootNode()` is available for new code.
- `rootElement()` returns the component's DOM element in v1.

Use the compatibility release to review component code that expects
`rootElement()` to return a jQuery object.

## v1 Breaking API Direction

In v1, component code should use DOM APIs:

```js
class MenuComponent extends ComponentBase {
  setup() {
    this.rootElement().addEventListener("click", this.toggle);
  }

  teardown() {
    this.rootElement().removeEventListener("click", this.toggle);
  }

  toggle = () => {
    this.rootElement().classList.toggle("is-open");
  }
}
```

Avoid relying on `rootElement()` returning a jQuery object:

```js
// Old style
this.rootElement().addClass("is-open");

// v1 style
this.rootElement().classList.add("is-open");
```

If an application still wants to use jQuery inside its own component code, keep
that dependency in the application and wrap `rootElement()` explicitly:

```js
$(this.rootElement()).addClass("is-open");
```

## Component Markup

Every Achilles component root must have a unique `id` and a
`data-component-class` value that matches a registered component class:

```erb
<div id="account-menu" data-component-class="MenuComponent"></div>
```

Duplicate ids are invalid HTML and Achilles will skip registering those
components.

## Lifecycle Changes To Verify

Achilles calls:

- `setup()` after `turbo:load`
- `setup()` when matching component markup is inserted dynamically
- `teardown()` before Turbo renders a new page

Review every component for setup work that must be undone in teardown:

- event listeners
- timers
- observers
- third-party widgets
- subscriptions
- global document/window handlers

## Search Checklist

In each application, search for:

```bash
rg "rootElement\\("
rg "\\$\\(this\\.root"
rg "data-component-class"
```

Convert jQuery-style `rootElement()` usage to DOM APIs or explicit jQuery
wrapping before testing v1.

## When To Test v1.0.0.rc1

Test the release candidate after:

- the application passes its own test suite
- all obvious `rootElement()` usages have been reviewed
- pages with Achilles components work across Turbo navigation
- dynamic components are verified manually or by system tests

Do not upgrade every application at once. Test one representative app first,
then move the rest after the migration path is proven.
