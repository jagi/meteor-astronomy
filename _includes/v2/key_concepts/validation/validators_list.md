# Validators list

Here is a list of all validators predefined in Astronomy and information about params that they take.

**string**

Checks if value is a string.

```js
{
  type: 'string'
  // No param.
}
```

**number**

Checks if value is a number.

```js
{
  type: 'number'
  // No param.
}
```

**boolean**

Checks if value is a boolean.

```js
{
  type: 'boolean'
  // No param.
}
```

**array**

Checks if value is an array.

```js
{
  type: 'array'
  // No param.
}
```

**object**

Checks if value is an object.

```js
{
  type: 'object'
  // No param.
}
```
**date**

Checks if value is a date.

```js
{
  type: 'date'
  // No param.
}
```

**required**

Checks if value is not `null` or `undefined`.

```js
{
  type: 'required'
  // No param.
}
```

**null**

Checks if value is `null`.

```js
{
  type: 'null'
  // No param.
}
```

**notNull**

Checks if value is not `null`.

```js
{
  type: 'notNull'
  // No param.
}
```

**length**

Checks length of value. Works with any value having the `length` property like arrays or strings.

```js
{
  type: 'length'
  param: 5
}
```

**minLength**

Checks minimal length of value. Works with any value having the `length` property like arrays or strings.

```js
{
  type: 'minLength'
  param: 5
}
```

**maxLength**

Checks maximum length of value. Works with any value having the `length` property like arrays or strings.

```js
{
  type: 'maxLength'
  param: 5
}
```

**gt**

Checks if value is greater than param. Works with any value which casts to numbers like number, dates and strings.

```js
{
  type: 'gt'
  param: 5
}
```

**gte**

Checks if value is greater than or equal to param. Works with any value which casts to numbers like number, dates and strings.

```js
{
  type: 'gte'
  param: 5
}
```

**lt**

Checks if value is less than param. Works with any value which casts to numbers like number, dates and strings.

```js
{
  type: 'lt'
  param: 5
}
```

**lte**

Checks if value is less than or equal to param. Works with any value which casts to numbers like number, dates and strings.

```js
{
  type: 'lte'
  param: 5
}
```

**email**

Checks if value is a correct email address.

```js
{
  type: 'email'
  // No param.
}
```


**choice**

Checks if value of the field is one of the values provided as a param.


```js
fields: {
  sex: {
    type: String,
    validators: [{
      type: 'choice',
      param: ['male', 'female']
    }]
  }
}
```

**equal**

Checks if value is equal to the one in a param.

```js
{
  type: 'equal'
  resolveParam() {
    return 'Should be equal to this value';
  }
}
```

**regexp**

Checks if value matches regular expression passed as a param.

```js
{
  type: 'regexp',
  param: /^[a-zA-Z0-9]+$/
}
```

**and**

Checks if all of validators passed as a param passes validation.

```js
{
  type: 'and',
  param: [{
    type: 'gt',
    param: 6
  }, {
    type: 'lt',
    param: 9
  }]
]
```

**or**

Checks if any of validators passed as a param passes validation.

```js
{
  type: 'or',
  param: [{
    type: 'lt',
    param: 6
  }, {
    type: 'gt',
    param: 9
  }]
]
```

**every**

Checks if any value in an array passes validation.

```js
fields: {
  tags: [String],
  validators: [{
    // Each tag in an array...
    type: 'every',
    param: [{
      // ... has to be at least 3 characters long and...
      type: 'minLength',
      param: 3
    }, {
      // ... up to 40 characters long.
      type: 'maxLength',
      param: 40
    }]
  }]
}
```

**has**

Checks if a property is present in an object.

```js
fields: {
  address: {
    type: Object,
    validators: [{
      // The non-schema address object has to have the "city" property.
      type: 'has',
      param: 'city'
    }]
  }
}
```

**includes**

Checks if an array or object contains a given value.

```js
fields: {
  tags: {
    type: [String],
    validators: [{
      // The "tags" array has to contain the "test" tag.
      type: 'includes',
      param: 'test'
    }]
  }
}
```
