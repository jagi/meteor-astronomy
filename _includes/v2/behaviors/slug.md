# Slug

*NOTICE: This description is for v.3.0.0 of the slug behavior.*

You can add the `slug` behavior to your project by executing the following command in your Meteor project directory.

```sh
meteor add jagi:astronomy-slug-behavior
```

The `slug` behavior adds a slug field for storing an URL friendly value of a chosen field. The slug field can be used in the routing for generating URLs `http://localhost:3000/post/to-jest-test-polskich-znakow-aszclonz`. The behavior comes with following options.

```js
behaviors: {
  slug: {
    // The field name from which a slug will be created.
    fieldName: null,
    // The helper name that generates a value for the slug-ification process.
    methodName: null,
    // The field name where a slug will be stored.
    slugFieldName: 'slug',
    // A flag indicating if we can update a slug.
    canUpdate: true,
    // A flag indicating if a slug is unique.
    unique: true,
    // A separator used for generating a slug.
    separator: '-'
  }
}
```

Let's take a look at the behavior usage.

```js
var post = new Post();
post.title = 'To jest test polskich znaków ąśźćłóńż';
post.save();

post.slug; // "to-jest-test-polskich-znakow-aszclonz"
```

**The fieldName vs methodName**

There are two possible ways of generating a slug: from a value of the field or a the value returned by the helper.

If we want to generate a slug from a single field then we have to provide the `fieldName` option.

If we want to generate a slug from multiple fields or from a manually generated value then we have to provide the `helperName` option.

*NOTICE: You can't use both ways of generating slug. You have to choose between the `fieldName` option or the `helperName` option.*

Let's take a look at the example of generating a slug using a helper.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  /* ... */
  helpers: {
    fullName() {
      // Slug will be generated from the returned value.
      return this.firstName + ' ' + this.lastName;
    }
  },
  behaviors: {
    slug: {
      // You can't use the "fieldName option when using the "methodName" option.
      // fieldName: 'lastName',

      // The helper name that generates a value for the slug-ification process.
      methodName: 'fullName'
    }
  }
});
```
