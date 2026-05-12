# Core JavaScript Gaps

This is the current improvement backlog for Achilles core JavaScript. API
reference docs should wait until the structure settles.

## Priority Gaps

1. Add an explicit application lifecycle.
   `Application` currently starts from the constructor. A public
   `start()`, `stop()`, and eventual destroy/cleanup path would make component
   registration order, tests, multiple instances, and future adapters safer.

2. Make Turbo event listeners removable.
   The Turbo hook manager registers anonymous listeners, so a second
   `Application` instance can leave duplicate listeners behind.

3. Validate component element ids.
   Components are registry-backed by `id`, so elements with
   `data-component-class` should have a non-empty stable id and fail clearly
   when they do not.

4. Teardown child components before parent components.
   Parent teardown currently runs before child teardown. Child-first teardown is
   safer when children need DOM or shared resources during cleanup.

5. Delete deregistered registry entries instead of leaving null tombstones.
   Dynamic pages can accumulate unused keys if entries are set to `null`.

6. Batch mutation observer setup work.
   Each mutation currently reparses the full document. A microtask debounce
   would preserve behavior while reducing repeated work.

7. Replace one-way lifecycle flags with mounted/unmounted state.
   `setupExecuted` and `teardownExecuted` never reset. Reused component
   instances would not mount again after teardown.

8. Expand tests around lifecycle edge cases.
   Missing ids, duplicate application instances, listener cleanup,
   child-before-parent teardown, dynamic add/remove loops, and mutation batching
   should be covered before large internal restructuring.
