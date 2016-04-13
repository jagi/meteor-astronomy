# Methods

By adding methods to your class you can make a document to be alive. A user can `user.greet()` you and a dog can `dog.bark()`. Let's take a look at the example of adding the `fullName()` method to the `User` class.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: ['firstName', 'lastName'],
  methods: {
    fullName: function (param) {
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

var post = new User();
post.set({
  firstName: 'John',
  lastName: 'Smith'
});
post.fullName();  // Returns "John Smith"
```

A context (`this`) in a method is a document instance. You can access other fields of the document. The `fullName()` method takes the `firstName` and `lastName` properties and join them with a space character and returns such string.

**Using methods in templates**

You can use Astronomy methods in templates as normal methods or properties. Let's take a look at the example of printing a full name of a user:

```html
{% raw %}
<div>Full name: {{user.fullName}}</div>
{% endraw %}
```

You can also pass parameters to methods:

```html
{% raw %}
<div>Full name: {{user.fullName "upper"}}</div>
{% endraw %}
```