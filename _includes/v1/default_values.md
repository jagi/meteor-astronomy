# Default values

If you need to provide more information than just the field's type -- let's say a default value, then you can pass an object with a field's definition. Take a look at the following example:

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    firstName: {
      type: 'string',
      default: ''
    }
  }
});

var user = new User();
user.firstName; // '' - empty string
```

If we don't provide a default value of the field, then it will be set to `null` when the underlying document is created. For the default value, we can use a plain JavaScript object or a function. If we use a function, it will be executed on document creation the function's returned value will be used as the default value.

*NOTE: If you want to set a default value of a field to object (an array is also object) you should always use a function that returns such object. This is important because values in JavaScript are passed by reference and we want every instance of the class to have its own copy of the object, not one that would be shared among all documents.*

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    address: {
      type: 'object',
      default: function() {
        return {};
      }
    }
  }
});
```