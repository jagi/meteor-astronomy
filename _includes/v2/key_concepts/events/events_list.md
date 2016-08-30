# Events list

**Initialization events**

There are two events that are triggered on a document initialization:

- `beforeInit`
- `afterInit`

The `beforeInit` event is triggered just after a new document instance is created. During this event all document's fields are empty and you shouldn't set or modify any field value. This event is mostly used by behaviors and modules.

The `afterInit` event is triggered after a document is fully created and filled with data. You can freely modify fields' values and do other changes.

**Storage events**

There are several storage events that are triggered on a document save, update and remove. Let's take a look at what events are triggered on what operation and in what order.

Insert:

- `beforeSave`
- `beforeInsert`
- Actual document insertion is performed
- `afterInsert`
- `afterSave`

```js
var user = new User();
u.save();
```

Update:

- `beforeSave`
- `beforeUpdate`
- Actual document update is performed
- `afterUpdate`
- `afterSave`

```js
var user = User.findOne();
u.firstName = 'Smith';
u.save();
```

Remove:

- `beforeRemove`
- Actual document removal is performed
- `afterRemove`

```js
var user = User.findOne();
u.remove();
```

**Find events**

There are two events being emitted when retrieving documents from collection using `Class.find()` or `Class.findOne()`:

- `beforeFind`
- `afterFind`

```js
User.findOne(); // Both events triggered
```

An event object passed to the `beforeFind` event handler contains two additional properties `selector` and `options`. They are two arguments passed to the `findOne()` or `find()` method. In an event handler you can modify selector or passed options. The **softremove** behavior is using it to limit fetching documents to only those that were not soft removed.

An event object passed to the `afterFind` event handler contains three additional properties `selector`, `options` and `result`. So, in this event handler you can additionally modify result of a find operation.

**EJSON events**

There are two events that maybe handy for behaviors and modules authors:

- `toJSONValue`
- `fromJSONValue`

These events are used to EJSONify documents and send them over DDP protocol.