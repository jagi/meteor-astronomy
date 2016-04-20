# Storage events

There are several storage events that are triggered on a document save, update and remove. Let's take a look at what events are triggered on what operation and in what order.

Insert:

- `beforeSave`
- `beforeInsert`
- `afterInsert`
- `afterSave`

Update:

- `beforeSave`
- `beforeUpdate`
- `afterUpdate`
- `afterSave`

Remove:

- `beforeRemove`
- `afterRemove`

You can prevent each operation using the `preventDefault()` method on the event object passed to the event handler as the first argument.

**Soft remove behavior events**

There are also two events defined in the soft remove behavior:

- `beforeSoftRemove`
- `afterSoftRemove`

When they are triggered and what you can do using them will be described in the section regarding the soft remove behavior.

**Direct database access events**

There are also two event defined for the direct database access:

- `beforeFind`
- `afterFind`

When they are triggered and what you can do using them will be described in the section regarding the direct database access.