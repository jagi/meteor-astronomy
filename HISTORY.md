# 0.4.0 (2015-04-29)

- The field type definition in the form of string instead casting function.

```js
// Before.
Post = Astro.Class({
  /* ... */
  fields: {
    title: {
      type: String, // Change.
      default: ''
    }
  }
});

// After.
Post = Astro.Class({
  /* ... */
  fields: {
    title: {
      type: 'string', // Change.
      default: ''
    }
  }
});
```
