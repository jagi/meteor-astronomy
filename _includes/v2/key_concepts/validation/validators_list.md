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
validators: {
  sex: {
    type: 'choice',
    param: ['male', 'female']
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
  param /^[a-zA-Z0-9]+$/
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

**if**

```js
Validators.if({
  condition: function(fieldValue, fieldName) {},
  true: validator
  false: validator /* Optional */
});
```

The `if` validator takes an object with some options as the first argument. The available options are `condition`, `true` and `false`. The `false` option is not obligatory. In the `condition` function, you have to return `true` or `false` value which will determine usage of the `true` or `false` validator accordingly. The `condition` function is executed in the context of the given document, so you can base condition on values of other fields in a document. The `condition` function also receives two arguments. The first one is a current field value and the second one is a current field name.

```js
// Example:
validators: {
  someField: Validators.if({
    condition: function(fieldValue, fieldName) {
      return this.otherField.length > fieldValue.length
    },
    true: Validators.and([
      Validators.string(),
      Validators.email()
    ])
  })
}
```

**switch**

```js
Validators.switch({
  expression: function(fieldValue, fieldName) {},
  cases: {
    value1: validator,
    value2: validator,
    value3: validator
    /* ... */
  }
});
```

The `switch` validator takes an object with some options as the first argument. The available options are `expression` and `cases`. Both options are obligatory. In the `expression` function, you have to return one of the keys in the `cases` object. It will take the returned value and validate a value of a field using proper validator from the `cases` object.

```js
// Example:
validators: {
  someField: Validators.switch({
    expression: function(fieldValue, fieldName) {
      return fieldValue.length
    },
    cases: {
      4: Validators.regexp(/^d+$/),
      6: Validators.regexp(/^[a-z]+$/)
    }
  })
}
```

**every**

The `every` validator takes a validator as the first argument. The validator function is to check whether every element of a field's value, which should be an array, passes validation using the validator passed as the first argument.

```js
// Example:
Post = Astro.Class({
  name: 'Post',
  /* ... */
  fields: {
    tags: {
      type: 'array',
      nested: 'string',
      default: function() {
        return [];
      },
      validator: [
        // Up to 100 tags per post.
        Validators.maxLength(100),
        // Each tag has to...
        Validators.every(
          Validators.and([
            // ... be a string and...
            Validators.string(),
            // ... at least 3 characters long
            Validators.minLength(3)
          ])
        )
      ]
    }
  }
});
```

**has**

```js
Validators.has(propertyName);
```

The `has` validator takes a property name as the first argument. Its function is to check whether a value of a field, which should be an object, has the property property.

```js
validators: {
  address: Validators.has('city')
}
```

**contains**

```js
Validators.contains(soughtArrayElement);
```

The `contains` validator takes a sought element as the first argument. Its function is to check whether a value of a field, which should be an array, contains the sought element.

```js
validators: {
  tags: Validators.contains('meteor')
}
```