# Helpers

By adding helpers to your class you can make a document to be alive. A user can `user.greet()` you and a dog can `dog.bark()`. Let's take a look at the example of adding the `fullName()` helper to the `User` class.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    firstName: String,
    lastName: String
  },
  helpers: {
    fullName(param) {
      var fullName = this.firstName + ' ' + this.lastName;
      if (param === 'lower') {
        return fullName.toLowerCase();
      } else if (param === 'upper') {
        return fullName.toUpperCase();
      }
      return fullName;
    }
  }
});

var user = new User();
user.firstName = 'John';
user.lastName = 'Smith';
user.fullName();  // Returns "John Smith"
```

A context `this` in a helper is a document instance, so you can access other fields of a document. The `fullName()` helper takes the `firstName` and `lastName` properties and join them with a space character and returns such a string. As you can see, we can also pass parameters to helpers.

**Using helpers in Blaze templates**

You can use Astronomy helpers in Blaze templates as normal helpers or properties. Let's take a look at the example of printing a full name of a user.

```html
{% raw %}
<div>Full name: {{user.fullName}}</div>
{% endraw %}
```

You can also pass parameters to helpers:

```html
{% raw %}
<div>Full name: {{user.fullName "upper"}}</div>
{% endraw %}
```