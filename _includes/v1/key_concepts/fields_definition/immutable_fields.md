# Immutable fields

If you want some field to be immutable you should set the `immutable` flag in the definition of the field. It won't be possible to change the field's value once it has been persisted in the database. Let's take a look at the example.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    createdAt: 'date',
    immutable: true
  }
});

var user = new User();
// It's possible to set a value.
user.set('createdAt', new Date('2015-09-14'));
// It's possible to change a value as long as it was not save into database.
user.set('createdAt', new Date('2015-09-15'));
user.save();
// Now setting a value will be denied.
user.set('createdAt', new Date('2015-09-16'));
```