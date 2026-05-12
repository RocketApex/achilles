# Examples

The dummy Rails application includes a working Achilles counter component.

Run the dummy app from the project root:

```bash
bin/rails server
```

Then open:

```text
http://localhost:3000/
```

The demo is implemented in:

- `test/dummy/app/views/demo/index.html.erb`
- `test/dummy/app/javascript/application.js`
- `test/dummy/app/javascript/demo_counter_component.js`

It shows the core Achilles flow:

1. Create an `Application`.
2. Register a component class with `componentsClassMapper`.
3. Mark a DOM node with `data-component-class`.
4. Use `setup()` and `teardown()` for event listener lifecycle.
