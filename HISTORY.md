# 0.6.0 (2015-05-09)

- Global events system 

```js
Astro.eventManager.on('validationerror', function(e) {
  return 'Custom error message';
});
```

# 0.5.1 (2015-05-09)

- Better modified fields detection

# 0.4.0 (2015-05-07)

- New events system

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

- Documents transformation into class instances is now set to `true` by default.

```js
// Before
Post = Astro.Class({
  /* ... */
  transform: true
});

// After
Post = Astro.Class({
  /* ... */
  // Don't have to write "transform: true" anymore.
});

```
