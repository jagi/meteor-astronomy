# Slug

You can add the `slug` behavior to your project by executing the following command.

```sh
meteor add jagi:astronomy-slug-behavior
```

The `slug` behavior adds a slug field for storing an URL friendly value of a chosen field. The slug field can be used in the routing for generating URLs `http://localhost:3000/post/to-jest-test-polskich-znakow-aszclonz`.

The `slug` behavior comes with following options.

```js
behaviors: {
  slug: {
    // The field name from which a slug will be created.
    fieldName: 'title',
    // The method name that generates a value for the slug-ification process.
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

**The fieldName and methodName**

There are two possible ways of generating a slug: from the value of a field or from the value returned by a method.

If we want to generate a slug from a single field then we have to provide a field name in the `fieldName` option.

If we want to generate a slug from multiple fields or from a manually generated value then we have to provide a method name in the `methodName` option.

*NOTICE: You can't use both ways of generating slug. You have to choose between the `fieldName` option or the `methodName` option.*

Let's take a look at the example of generating a slug using a method.

```js
User = Astro.Class({
  /* ... */
  methods: {
    fullName: function() {
      // Slug will be generated from the returned value.
      return this.firstName + ' ' + this.lastName;
    }
  },
  behaviors: {
    slug: {
      // You have to set null here if you want to use "methodName" option
      fieldName: null,
      // The method name that generates a value for the slug-ification process.
      methodName: 'fullName'
    }
  }
});
```

**The generateSlug() method**

You can also use the `generateSlug()` method to manually generate a slug in any moment no only on a document save. Let's take a look at the example usage.

```js
User = Astro.Class({
  /* ... */
  methods: {
    fullName: function() {
      return this.firstName + ' ' + this.lastName;
    }
  },
  events: {
    afterInit: function() {
      // We can generate a slug after initialization of a document.
      this.generateSlug();
    },
    afterSet: function(e) {
      var fieldName = e.data.fieldName;
      if (fieldName === 'firstName' || fieldName === 'lastName') {
        // We can also generate a slug when one of the fields that creates a
        // slug has changed.
        this.generateSlug();
      }
    }
  },
  behaviors: {
    slug: {
      fieldName: null,
      methodName: 'fullName'
    }
  }
});
```