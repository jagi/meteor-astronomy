# Adding validators

There are two ways of adding validators to the class. You can define them on the level of the class or on the level of the field definition. Let's take a look at the example of both.

**Validators on the class level**

Validators of the class level have to be defined under the `validators` property in the class schema.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  validators: {
    firstName: Validators.minLength(3)
  }
});
```

As you can see, we've added the `minLength` validator for the `firstName` field. We will write more about available validators and their options.

**Validators on the field level**

You can also define validators with a field definition, to keep them together and make it more readable. To do that you have to define validator under the `validator` property.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    firstName: {
      type: 'string',
      validator: Validators.minLength(3)
    }
  }
});
```

*NOTICE: In a field definition the correct property name is `validator` (singular) and in the class definition it `validators` (plural).*

**Passing array of validators**

As a value of the `validators` or `validator` property you can pass array of validators. In such situation array of validators will be replaced with the `and` validator. The `and` validator means that all sub-validators has to pass validation test to mark field's value as valid. The two following examples are equivalent.

The `and` validator:

```js
User = Astro.Class({
  name: 'User',
  /* */
  validators: {
    firstName: Validators.and([
      Validators.required(),
      Validators.string()
    ])
  }
});
```

Array of validators:

```js
User = Astro.Class({
  name: 'User',
  /* */
  validators: {
    firstName: [
      Validators.required(),
      Validators.string()
    ]
  }
});
```

**Reusing validators**

Sometimes you may notice that you repeat the same set of validators over and over again. There is a possibility to reuse validators.

```js
var reqStrMin3 = Validators.and([
  Validators.required(),
  Validators.string(),
  Validators.minLength(3)
]);

User = Astro.Class({
  name: 'User',
  /* */
  validators: {
    firstName: reqStrMin3,
    lastName: reqStrMin3
  }
});
```

**Types of validator params**

Most of the validators take a param as the first argument. The param may differ from validator to validator. Let's examine some cases.

Array of validators. They `and` and `or` validators are the only two predefined validators that take an array of validators as a param. We will write more about them in next sections.

```js
Validators.and([
  Validators.string(),
  Validators.minLength(3)
]);

Validators.or([
  Validators.string(),
  Validators.minLength(3)
]);
```

There are validators that take a single plain value (string, number) as a param. The examples of them are: `minLength`, `equal`, `contains`. We will write more about them in next sections.

```js
Validators.minLength(3);
Validators.equal('mustBeEqualToThisString');
Validators.contains('mustContainThisString');
```

There are validators that take array of some values or object with some validator details. The examples of them are: `choice`, `if`. We will write more about them in next sections.

```js
Validators.choice(['value', 'has', 'to', 'match', 'one', 'of', 'these']);
Validators.if({
  condition: function() {
    return this.lastName > 5;
  },
  true: Validators.maxLength(10),
  false: Validators.minLength(2)
});
```

There are also validators that does not take any param. The example of them are: `string`, `number`, `boolean`.

**Function as a validator param**

There is a special type of a param. If a validator takes parameter, you can also pass a function as a param. In such situation, the param value will be calculated on validation execution. It's very useful when we want to depend validation of one field on the value of another field.

```js
validators: {
  firstName: Validators.string(),
  lastName: Validators.minLength(function() {
    // A value of the "lastName" field has to be at least as long as a value of
    // the "firstName" field.
    return this.firstName.length;
  });
}
```

*NOTICE: It's important to remember that a function param works with every validator that takes param as the first argument.*