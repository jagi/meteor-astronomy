# Adding validators

There are two ways of adding validators to the class. You can define them on the class level on the field's definition level. Let's take a look at the example of both.

**Validators on the field level**

You can define validator on a field level to keep field definition together with its validators. It's much more readable that way. You define validators for a field by providing the `validators` property.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    firstName: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 3
      }]
    }
  }
});
```

As you can see, for the `validators` property we provide array of objects, where each one has one mandatory attribute `type`. In this example, we used the `minLength` validator, which checks if a string is at least X characters long. The `param` attribute tells how long a given text should be.

There are validators that does not take any param like type validators (`string`, `number`, `data`) so it's not mandatory for each validator. However, the `minLength` validator requires this parameter to be passed.

**Validators on the class level**

This type of defining validators is much less used. This time, you define validators on the class level under the `validators` property. Let's take a look at the example.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  validators: [
    firsName: [{
      type: 'minLength',
      param: 3
    }]
  ]
});
```

This situation is similar to previous one, however we only have here section dedicated to validation. We don't provide any field properties beside validators data.

**Reusing validators**

Sometimes you may notice that you repeat the same set of validators over and over again. There is a possibility to reuse validators.

```js
import { Class } from 'meteor/jagi:astronomy';

var min3max10 = [{
  type: 'minLength',
  param: 3
}, {
  type: 'maxLength',
  param: 10
}];

const User = Class.create({
  name: 'User',
  /* */
  validators: {
    firstName: min3max10,
    lastName: min3max10
  }
});
```

**Function as a validator param**

There are situations when you may want resolve param value on runtime as you may not know the actual param value on the schema definition time. For such cases there is a special `resolveParam` validator property. You can provide function that will be resolved on validation. Let's take a look at the example.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    birthDate: {
      type: Date,
      validators: [{
        type: 'lte',
        resolveParam: function() {
          let date = new Date();
          return date.setFullYear(date.getFullYear() - 18);
        }
      }]
    },
    firstName: {
      type: String,
      validators: [{
        type: 'maxLength',
        resolveParam(args) {
          return args.doc.lastName.length - 1;
        }
      }]
    }
  }
});
```

We have here two examples of usage of the `resolveParam` function. In the `birthDate` field, we used it for the `lte` validator, which stands for `less than or equal`. We just calculate at which date should at least given user be born to be 18 years old. So, this param depends on the current date.

In the second example, in the `firstName` field we used the `resolveParam` function in the `maxLength` validator to tell that the `firstName` has to be shorter than the `lastName` (I know it's bad example). So, we have to access document's another field. We can do so, by accessing arguments object passed to the `resolveParam` method. It contains such properties like.

- `args.doc` - Document being validated
- `args.name` - Field name being validated
- `args.nestedName` - Nested field name being validated
- `args.value` - Current field's value