# 0.9.0 (2015-05-21)

- Changes in API:
  - `Astro.Module` to `Astro.createModule`
  - `Astro.Type` to `Astro.createType`
  - `Astro.Behavior` to `Astro.createBehavior`
  - `Astro.Validator` to `Astro.createValidator`
  - `Astro.modules` - list of all added modules
  - `Astro.classes` - list of all created classes
  - `Astro.types` - list of all types
  - `Astro.validators` or `Validators` - list of all added / created validators
  - `Astro.behaviors` - list of all added behaviors

# 0.8.0 (2015-05-17)

- Relations
- Moving all methods from Schema to Class

# 0.7.0 (2015-05-13)

- EJSON-ification of Astronomy objects

# 0.6.1 (2015-05-10)

- Rewrite events system and introduce events propagation
- Rename validation helpers

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
