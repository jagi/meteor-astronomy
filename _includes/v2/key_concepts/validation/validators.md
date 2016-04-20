# Validators

**string**

```js
Validators.string();
```

The `string` validator doesn't take any options as the first argument and its function is to check whether a value of the field is a string.

**number**

```js
Validators.number();
```

The `number` validator doesn't take any options as the first argument and its function is to check whether a value of the field is a number.

**boolean**

```js
Validators.boolean();
```

The `boolean` validator doesn't take any options as the first argument and its function is to check whether a value of the field is a boolean.

**array**

```js
Validators.array();
```

The `array` validator doesn't take any options as the first argument and its function is to check whether a value of the field is an array.

**object**

```js
Validators.object();
```

The `object` validator doesn't take any options as the first argument and its function is to check whether a value of the field is an object.

**date**

```js
Validators.date();
```

The `date` validator doesn't take any options as the first argument and its function is to check whether a value of the field is a date.

**required**

```js
Validators.required();
```

The `required` validator doesn't take any options as the first argument and its function is to check whether a value of the field is not an empty value like `null` or `""` (empty string).

**null**

```js
Validators.null();
```

The `null` validator doesn't take any options as the first argument and its function is to check whether a value of the field is `null`.

**notNull**

```js
Validators.notNull();
```

The `notNull` validator doesn't take any options as the first argument and its function is to check whether a value of the field is not `null`.

**length**

```js
Validators.length(size);
```

The `length` validator takes a number as the first argument and its function is to check whether the length of a value of a field is exactly `size` characters long. Where `size` is the first argument of the validator. It can also works with fields of the `Array` type. In such situation, it checks number of elements in an array.

**minLength**

```js
Validators.minLength(size);
```

The `minLength` validator takes a number as the first argument and its function is to check whether the length of a value of a field is at least `size` characters long. Where `size` is the first argument of the validator. It can also works with fields of the `Array` type. In such situation, it checks number of elements in an array.

**maxLength**

```js
Validators.maxLength(size);
```

The `maxLength` validator takes a number as the first argument and its function is to check whether the length of a value of a field is at most `size` characters long. Where `size` is the first argument of the validator. It can also works with fields of the `Array` type. In such situation, it checks number of elements in an array.

**gt**

```js
Validators.gt(size);
```

The `gt` validator takes a number as the first argument and its function is to check whether a value of a field is greater than the `size`. Where `size` is the first argument of the validator. It can also works with fields of the `Date` type and other types that are comparable with numbers.

**gte**

```js
Validators.gte(size);
```

The `gte` validator takes a number as the first argument and its function is to check whether a value of a field is greater than or equal the `size`. Where `size` is the first argument of the validator. It can also works with fields of the `Date` type and other types that are comparable with numbers.

**lt**

```js
Validators.lt(size);
```

The `lt` validator takes a number as the first argument and its function is to check whether a value of a field is less than the `size`. Where `size` is the first argument of the validator. It can also works with fields of the `Date` type and other types that are comparable with numbers.

**lte**

```js
Validators.lte(size);
```

The `lte` validator takes a number as the first argument and its function is to check whether a value of a field is less than or equal the `size`. Where `size` is the first argument of the validator. It can also works with fields of the `Date` type and other types that are comparable with numbers.

**email**

```js
Validators.email();
```

The `email` validator doesn't take any options as the first argument and its function is to check whether a value of the field is a string with a valid email address.

```js
// Example:
validators: {
  email: Validators.email()
}
```

**choice**

```js
Validators.choice(choices);
```

The `choice` validator takes a list of valid values as the first argument and its function is to check whether a value of the field is one of them.

```js
// Example:
validators: {
  sex: Validators.choice(['male', 'female'])
}
```

**unique**

```js
Validators.unique();
```

The `unique` validator takes no arguments and checks whether the value of the field is unique.
Currently the `unique` validator should only be used to validate top level fields. It will not work with nested fields.

```js
// Example:
validators: {
  // Each document has to have unique email address.
  email: Validators.unique()
}
```

*NOTICE: The `unique` validator should be used on the server because on the client we can be subscribed to not entire set of documents and checking uniqueness in such situation may not be reliable.*

**equal**

```js
Validators.equal(comparisonValue);
```

The `equal` validator takes a comparison value as the first argument and its function is to check whether a value of the field is equal to the comparison value.

```js
// Example:
validators: {
  captcha: Validators.equal('aBcDeFg')
}
```

**equalTo**

```js
Validators.equalTo(fieldName);
```

The `equalTo` validator takes a field name as the first argument and its function is to check whether a value of the field is equal to the value of a field passed as the argument.

```js
// Example:
validators: {
  // Check if values of `password1` and `password2` fields are equal.
  password1: Validators.equalTo('password2')
}
```

**regexp**

```js
Validators.regexp(regularExpression);
```

The `regexp` validator takes a regular expression as the first argument and its function is to check whether a value of the field is matches the regular expression passed as the argument.

```js
// Example:
validators: {
  login: Validators.regexp(/^[a-zA-Z0-9]+$/)
}
```

**and**

```js
Validators.and(validatorsList);
```

The `and` validator takes a list of validators as the first argument and its function is to check whether a value of the field passes validation of all validators from the list.

```js
validators: {
  firstName: Validators.and([
    Validators.string(),
    Validators.minLength(3)
  ])
}
```

**or**

```js
Validators.or(validatorsList);
```

The `or` validator takes a list of validators as the first argument and its function is to check whether a value of the field passes validation of any validator from the list.

```js
validators: {
  // Age has to be between 18 and 30 or between 45 and 60
  age: Validators.or([
    Validators.and([
      Validators.minLength(18),
      Validators.maxLength(30)
    ]),
    Validators.and([
      Validators.minLength(45),
      Validators.maxLength(60)
    ])
  ])
}
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