# Fields with types

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    firstName: 'string',
    createdAt: 'date',
    age: 'number'
  }
});
```

In this example, we passed an object with the fields' names as keys and the fields' types as values. There are several predefined types. You can choose from:

- `string`
- `number`
- `boolean`
- `date`
- `object`
- `array`