# Optional fields

A field can also be marked as optional using the `optional` attribute.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    address: {
      type: 'object',
      optional: true
    }
  }
});
```

Not proving a value for such field will not throw any error. However, when validating a document it will be taken into account. Validation module does not validate a field that is marked as optional and its value is `null`.