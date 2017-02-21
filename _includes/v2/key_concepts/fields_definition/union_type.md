# Union type

One example of custom type is union. Union allows a field to accept values of different type. Let's say you want to have a field which can accept `Number` or `String`. You can easily create a union type in Astronomy that will allow that. Let's take a look at the basic example.

```js
import { Class, Union } from 'meteor/jagi:astronomy';

const StringOrNumber = Union.create({
  name: 'StringOrNumber',
  types: [String, Number]
});

const Item = Class.create({
  name: 'Item',
  fields: {
    stringOrNumber: {
      type: StringOrNumber
    }
  }
});
```

Now you can validate documents of this class.

```js
const item = new Item();
item.stringOrNumber = 'abc';
item.validate(); // Valid.
item.stringOrNumber = 123;
item.validate(); // Valid.
item.stringOrNumber = false;
item.validate(); // Invalid.
```

You can also pass an optional casting function to the union definition.

```js
const StringOrNumber = Union.create({
  name: 'StringOrNumber',
  types: [String, Number]
  cast(value) {
    if (typeof value !== 'string') {
      return String(value);
    }
    return value;
  }
});
```

And use it in the standard way.

```js
const item = new Item({
  stringOrNumber: false
}, {cast: true});
item.set({
  stringOrNumber: new Date()
}, {cast: true});
```