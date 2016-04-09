# Nested fields

MongoDB is a document-oriented database. This allows you to not only store plain values in the fields of documents but also objects and arrays. Astronomy provides two types (`object` and `array`) for storing object and array values. Let's take a look at how to define fields with these types.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    'address': {
      type: 'object',
      default: function() {
        return {};
      }
    },
    'phones': {
      type: 'array',
      default: function() {
        return [];
      }
    }
  }
});
```

In this example, we've defined an `address` field that can store objects and a `phones` field that can store arrays of objects or arrays of any other value.

**Default value of nested field**

But, what if we want to define a default value for the nested object? We can do it by defining a nested class for a field.

```js
Address = Astro.Class({
  name: 'Address',
  /* No collection attribute */
  fields: {
    city: {
      type: 'string',
      /* The default value of the nested field */
      default: 'San Francisco'
    },
    state: {
      type: 'string',
      /* The default value of the nested field */
      default: 'CA'
    }
  }
});

User = Astro.Class({
  name: 'User',
  collection: Users,
  fields: {
    'address': {
      type: 'object',
      // The "address" field can store an instance of the Address class.
      nested: 'Address',
      default: function() {
        return {};
      }
    }
  }
});
```

The essential point when defining nested classes is providing a class name for the `nested` property in the field definition. It may look awkward at first, but after using it for a while you may see the benefit of this approach.

Now let's try defining the `User` class, that has the `addresses` field for storing an array of addresses.

```js
User = Astro.Class({
  name: 'User',
  collection: Users,
  fields: {
    'addresses': {
      type: 'array',
      // The "addresses" field can store multiple instances of the Address class.
      nested: 'Address',
      default: function() {
        return [];
      }
    }
  }
});
```

**Inline nested class definition**

It's also possible to provide nested class definition as a value of the `nested` property instead of a class name. Take a look at the example.

```js
User = Astro.Class({
  name: 'User',
  collection: Users,
  fields: {
    'address': {
      type: 'object',
      default: function() {
        return {};
      },
      nested: {
        name: 'Address',
        fields: {
          city: 'string',
          state: 'string'
        }
      }
    }
  }
});
```

As you can see, we just provided a regular class definition. However this time we didn't use the `Astro.Class` method. Astronomy automatically calls this method for you with the provided definition. That's great, but what if you want to create an instance of the `Address` class? You don't have a constructor. You can always access the constructo by using the `Astro.getClass()` method.

```js
var Address = Astro.getClass('Address');
var user = new User();
user.set('address', new Address());
```

**Complex default value**

A nested field can also have more complex default value.

```js
User = Astro.Class({
  name: 'User',
  collection: Users,
  fields: {
    'address': {
      type: 'object',
      nested: 'Address',
      default: function() {
        return {
          city: 'Miami',
          state: 'FL'
        };
      }
    }
  }
});
```

**Array of plain values**

What if we want to store multiple number values? In the `nested` property for array fields we can provide not only a class name but also a simple type like `number` or `string`.

```js
User = Astro.Class({
  name: 'User',
  collection: Users,
  fields: {
    'phones': {
      type: 'array',
      nested: 'string'
    },
    'numbers': {
      type: 'array',
      nested: 'number'
    }
  }
});
```

**Array of custom objects**

There are situation when you would like to nest some objects in an array but not being instances of any class. In such case you just have to omit the `nested` property. This way Astronomy will not require providing any particular type for a nested array.

```js
User = Astro.Class({
  name: 'User',
  collection: Users,
  fields: {
    'phones': {
      type: 'array',
      default: function() {
        return [];
      }
    }
  }
});

var user = new User();
user.push('phones', '888 888 888');
user.push('phones', {
  name: 'cell'
  number: '999 999 999'
});
```

As you can see, you can push either a plain JavaScript string or object.