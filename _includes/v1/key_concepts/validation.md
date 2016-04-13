# Validation

The validators module allows checking validity of fields' values. For instance, we can check whether a value of a given field is a correct email string or if it matches a regular expression. You can add this module to your Meteor project using the following command.

```sh
meteor add jagi:astronomy-validators
```

**Validating document**

The heart of the validation is the `validate()` method. It can be called with different sets of arguments causing different effect. Here is the list of allowed sets of arguments.

- `validate()` - validate all fields and stop after the first error
- `validate(false)` - validate all fields and do not stop after the first error
- `validate(fieldName)` - validate a single field
- `validate(arrayOfFieldsNames)` - validate multiple fields and stop after the first error
- `validate(arrayOfFieldsNames, false)` - validate multiple fields and do not stop after the first error

The `validate()` method returns `true` if validation succeeded and `false` if there was any error. Let's take a look at the example usage.

```js
var user = new User();
if (user.validate()) {
  user.save();
}
```

In the first step, we've created a new user document. In the next line, we check a validity of the document. If it's valid then we save it.

**Validation on the server**

We should validate a document on both client and server. Let's say, we have a form template that has some events and helpers that create a new document. We can validate such document and display validation errors in the form. However, we can't trust validation on the client. We should always send a given document to the server and repeat validation. We should also send errors back to the client if there're any. Let's take a look at the example of Meteor method that performs validation and returns errors back to the client.

```js
Meteor.methods({
  '/user/save': function(user) {
    if (user.validate()) {
      user.save();
      return user;
    }

    // Send errors back to the client.
    user.throwValidationException();
  }
});
```

If the validation haven't succeeded, then we send validation errors back to the client using the `throwValidationException()` method. Now, take a look at the example usage of this method.

```js
Template.Form.events({
  'submit form': function() {
    var user = this;

    Meteor.call('/user/save', user, function(err) {
      if (err) {
        // Put validation errors back in the document.
        user.catchValidationException(err);
      }
   });
  }
});
```

In the context of the `Form` template we have our newly created document that was filled with values coming from the form fields. We pass the `used` document as parameter of method. In the callback function, we check if there are any server validation errors. We put these errors back in the document using the `catchValidationException()` method.

**Optional fields**

As described in the [Optional fields](/optional-fields) section, if a field is marked as `optional` then it won't be validated if its value is `null`.

{% include v1/key_concepts/validation/adding_validators.md %}

{% include v1/key_concepts/validation/errors.md %}

{% include v1/key_concepts/validation/validators.md %}

{% include v1/key_concepts/validation/creating_validators.md %}

{% include v1/key_concepts/validation/validation_order.md %}

{% include v1/key_concepts/validation/simple_validators.md %}