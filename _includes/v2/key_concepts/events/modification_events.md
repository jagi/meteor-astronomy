# Modification events

There are several storage events that are triggered on a document modification. Methods that modifies a document are: `set()`, `inc()`, `push()` and `pop()`. Let's take a look at what events are triggered on what operation and in what order.

The `set()` method:

- `beforeChange`
- `beforeSet`
- `afterSet`
- `afterChange`

The `inc()` method:

- `beforeChange`
- `beforeInc`
- `afterInc`
- `afterChange`

The `push()` method:

- `beforeChange`
- `beforePush`
- `afterPush`
- `afterChange`

The `pop()` method:

- `beforeChange`
- `beforePop`
- `afterPop`
- `afterChange`

You can prevent each operation using the `preventDefault()` method on the event object passed to the event handler as the first argument.

**Data passed in the event object**

Event objects passed to the modification events handlers contain the `data` property that stores additional information about the event. Let's examine what does each event object hold.

The `beforeChange` and `afterChange` events in all methods.

- `e.data.fieldName` - a field name being modified
- `e.data.operation` - an operation name: `set`, `inc`, `push`, `pop`

The `beforeSet` and `afterSet` events in the `set()` method:

- `e.data.fieldName` - a field name being modified
- `e.data.setValue` - a field value being set

The `beforeInc` and `afterInc` events in the `inc()` method:

- `e.data.fieldName` - a field name being modified
- `e.data.incValue` - an incrementation amount of a modified field

The `beforePush` and `afterPush` events in the `push()` method:

- `e.data.fieldName` - a field name being modified
- `e.data.pushValue` - a value being pushed into the array

The `beforePop` and `afterPop` events in the `pop()` method:

- `e.data.fieldName` - a field name that is being modified
- `e.data.popValue` - a value being popped from the array