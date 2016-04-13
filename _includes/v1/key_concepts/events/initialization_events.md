# Initialization events

There are two events that are triggered on a document initialization:

- `beforeInit`
- `afterInit`

The `beforeInit` event is triggered just after a new document instance is created. During this event all document's fields are empty and you shouldn't set or modify any field value. This event is mostly used by behaviors and modules.

The `afterInit` event is triggered after a document is fully created and filled with data. You can freely modify fields' values and do other changes.

**Data passed in the event object**

An event object passed to the initialization events handlers contain the `data` property that stores fields values being set on an instance being initialized.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  events: {
    afterInit: function(e) {
      console.log(EJSON.stringify(e.data));
    }
  }
});

var u = new User({
  firstName: 'John',
  lastName: 'Smith'
});
```

On the console the `"{firstName: 'John', lastName: 'Smith'}"` text will be printed.