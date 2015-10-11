# 1.1.0 (2015-10-11)

- [Add the "raw()" method](http://astronomy.jagi.io/#raw)
- [Change the way how the "get()" method works](http://astronomy.jagi.io/#raw) - this needs more clarification. As 1.1.0 version should be backward compatible with 1.0.0, this one change is breaking a compatibility. I know I shouldn't do so, but I had to. In most situation you won't even see any difference. From now the `raw()` method is getting responsibilites of the `get()` method.
- Fix the internal `_clearModifiers()` method

# 1.0.2 (2015-10-02)

- [Add the "pull()" method](http://astronomy.jagi.io/#pull)
- Add `getMethod()`, `getBehavior()` etc. to every class
- Stop using the `initSchema` event in every module

# 1.0.1 (2015-10-01)

- Fix the `initSchema` event

# 1.0.0 (2015-09-30)

- [Nested classes/fields](http://astronomy.jagi.io/#nested-fields)
- [Transient fields](http://astronomy.jagi.io/#transient-fields)
- [Immutable fields](http://astronomy.jagi.io/#immutable-fields)
- [Optional fields](http://astronomy.jagi.io/#optional-fields)
- [Modification methods](http://astronomy.jagi.io/#modifying-documents)
  - [push](http://astronomy.jagi.io/#push)
  - [pop](http://astronomy.jagi.io/#pop)
  - [inc](http://astronomy.jagi.io/#inc)
- [Change the way how constructor works](http://astronomy.jagi.io/#initialization-events)
- [Selective saving of fields](http://astronomy.jagi.io/#saving)
- [Changes in how the "get()" method works](http://astronomy.jagi.io/#get)
- [The "isModified()" method](http://astronomy.jagi.io/#modified)
- [Direct database access](http://astronomy.jagi.io/#direct-collection-access)
- [Events](http://astronomy.jagi.io/#events)
  - [before/afterInit](http://astronomy.jagi.io/#modification-events)
  - [before/afterChange](http://astronomy.jagi.io/#modification-events)
  - [before/afterPush](http://astronomy.jagi.io/#modification-events)
  - [before/afterPop](http://astronomy.jagi.io/#modification-events)
  - [before/afterInc](http://astronomy.jagi.io/#modification-events)
  - [initDefinition](http://astronomy.jagi.io/#writing-modules)
  - [before/afterFind](http://astronomy.jagi.io/#storage-events)
  - [Stopping propagation in modification methods](http://astronomy.jagi.io/#events-propagation)
- [A new way of inheriting from a class](http://astronomy.jagi.io/#inheritance)
- [A new way of extending a class](http://astronomy.jagi.io/#extending-class)
- [Validation](http://astronomy.jagi.io/#validation)
  - The `validateAll()` method was removed and replaced with the `validate(false)` method (notice that the `false` value was passed as the first argument)
- [Validators](http://astronomy.jagi.io/#validators-list)
  - [if](http://astronomy.jagi.io/#logical-validators)
  - [switch](http://astronomy.jagi.io/#logical-validators)
- Integration of the behaviors module. The `behaviors` module was integrated with the core Astronom package and the external module/package will be removed in the future.
- [Changes in behaviors creation](http://astronomy.jagi.io/#writing-behaviors)
- The `supportLegacyBrowsers` configuration variable was removed. To support older browsers and simplify the Astronomy code, there was a need for abandoning some features from ES6 that can't be polyfilled. The only change is that you should always use [modification functions](http://astronomy.jagi.io/#modifying-documents) to change values of the fields. You shouldn't change them directly.

# 0.12.0 (2015-07-13)

- Indexes

# 0.11.0 (2015-07-01)

- Support for legacy browsers by using the `Astro.config.supportLegacyBrowsers` flag
- Child classes can have the same amount of fields as a Parent class
- Ability to set the `_id` field on a document's creation

# 0.10.0 (2015-05-31)

- Changed utilities namespace
- Removed automatic setters and getters
- Nested validators
- Changed the way validators are added to the class

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
