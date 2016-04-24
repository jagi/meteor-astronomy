# Errors

There are several ways of generating an error message when validation fails. Of course, you can always use default error messages that comes with the validators module. However if you want something more application specific or when you need messages translation, it may be a good idea to generate custom error message. In this section, we will discuss all possible ways of the error message generation.

**A validation message in a field validator**

The simplest and less flexible way of generating error message is passing it as the second argument of a validator. Let's take a look at the example.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    firstName: {
      type: 'string',
      validator: Validators.minLength(3, 'The first name is too short!')
    }
  }
});
```

As you can see, we passed the `"The first name is too short"` string as the second argument of the `minLength` validator. Each validator can have its own error message or it can be left empty, and in such situation a default error message will be used.

**Generating an error message in an event**

There is the `validationError` event that is triggered on a validation error. There are some useful information passed to that event in an event object. They are:

- `e.data.validator` - the field validator object
- `e.data.validator.name` - the name of the field validator
- `e.data.fieldValue` - the value of the field
- `e.data.fieldName` - the name of the field
- `e.data.param` - the param value passed to the field validator
- `e.data.message` - the current error message

There are also two method on the event object:

- `e.setMessage()` - sets a new error message
- `e.getMessage()` - gets the current error message

Now, let's take a look at the example usage of the `validationError` event.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    firstName: {
      type: 'string',
      validator: Validators.minLength(3)
    }
  },
  events: {
    validationError: function(e) {
      if (
        e.data.validator.name === 'minLength' &&
        e.data.fieldName === 'firstName'
      ) {
        // Set a new error message.
        e.setMessage('The first name is too short!');
        // You have to stop propagation.
        e.stopPropagation();
      }
    }
  }
});
```

As you can see, in the `validationError` event handler we check if a validator that caused error is `minLength` and if a field name is `firstName`. If the condition is met, then we set a new error message using the `e.setMessage()` method. We also have to stop propagation of the following events.

As in all document events the event propagation of the `validationError` event goes from the parent class, through the child class and gets to the global scope. Knowing that we could also "catch" the `validationError` event in the global scope.

```js
Astro.eventManager.on('validationError', function(e) {
  if (
    e.data.validator.name === 'minLength' &&
    e.data.fieldName === 'firstName'
  ) {
    // Set a new error message.
    e.setMessage('The first name is too short!');
    // You have to stop propagation.
    e.stopPropagation();
  }
});
```

If we don't generate an error message in an event handler then it will be generated in a default event handler for a validator. If a validator does not have an event handler for the `validationError` event, then the default validation error will be used.

**Accessing error messages**

Errors generated on a validation fail can be accessed using a few methods. We can not only get a validation error message but also check if there are any errors and if a given field has a validation error. Let's examine all available functions.

- `doc.hasValidationErrors()` - check if there are any validation errors
- `doc.hasValidationError(fieldName)` - check if there is a validation error for a given field
- `doc.getValidationErrors()` - get all validation errors
- `doc.getValidationError(fieldName)` - get a validation error for a given field

All of these methods are reactive.

The `getValidationErrors()` method returns an object containing key-value pairs where the key is field name and the value is a validation error message.

**Displaying errors in a template**

Getting a validation error message is one thing but displaying it in a template another one that needs explanation. All described methods can be used in a template. Let's take a look at how we can create an input field with a validation error message displayed underneath only when there is any for a given field.

```html
{{|#with user}}
  <input id="firstName" type="text" />
  {{|#if hasValidationError "firstName"}}
    <div class="error">{{|getValidationError "firstName"}}</div>
  {{|/if}}
{{|/with}}
```

**Validation error message for nested fields**

It's important to notice that error messages for nested fields resides inside of the nested fields. So, if we have the `User` class that has the nested `address` field which stores an instance of the `Address` class, then getting error for the `address.city` field would look like in the example below.

```html
{{|#with user}}
  <input id="city" type="text" value="{{|address.city}}" />
  {{|#if address.hasValidationError "city"}}
    <div class="error">{{|address.getValidationError "city"}}</div>
  {{|/if}}
{{|/with}}
```

As you can see, that time we used the `hasValidationError()` method from the `address` field and we passed the `"city"` string as its argument. The same is true if it goes about the `getValidationError()` method.

**Clearing error messages**

If a field validation failed then an error message resides in the document and is correlated with the given field. Now, if you set a new value for the field then the error message will be cleared for that field to prepare a document for next validation. However you may want to clear all validation errors. You can do it using the `clearValidationErrors()` method.

```js
var user = new User();
user.validate();
user.getValidationErrors(); // {firstName: "..."}
user.clearValidationErrors();
user.getValidationErrors(); // {}
```