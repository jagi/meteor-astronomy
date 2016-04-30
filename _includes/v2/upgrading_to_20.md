# Upgrading to 2.0

There are several changes in API that were made in Astronomy 2.0. Let's discuss each one.

**ES2015 support**

Astronomy 2.0 uses ES2015 syntax in every file, including modules loading system. So, you should get familiar with it before switching. You can import data from Astronomy package in the following way.

```js
import { Class } from 'meteor/jagi:astronomy';
```

Here is a list of all objects that you can import:

- Class - for creating classes
- Module - for creating modules
- Enum - for creating ENUMs
- Type - for creating custom types
- Event - for creating custom events
- Behavior - for creating custom behaviors
- Validator - for creating custom validators
- Validators - validators list
- Field - field class, handy for modules authors
- ScalarField - field class, handy for modules authors
- ObjectField - field class, handy for modules authors
- ListField - field class, handy for modules authors

**Creating class**

V1

```js
var User = Astro.Class({});
```

V2

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({});

export User;
```

**Type definition**

Now, instead using string as a type, we use type constructor function.

V1

```js
fields: {
  firstName: 'string'
}
```

V2

```js
fields: {
  firstName: String
}
```

**Nested fields**

The way how we define nested fields got simplified and now we use `[]` array operator to define fields storing multiple values.

V1

```js
fields: {
  address: {
    type: 'object',
    nested: 'Address'
  },
  phones: {
    type: 'array',
    nested: 'Phone'
  }
}
```

V2

```js
fields: {
  address: Address,
  phones: [Phones]
}
```

**The "this" context in event**

The `this` context in event handler is not a document. Use `event.target` to get a document. Use `event.currentTarget` to get nested document.

```js
events: {
  beforeSave(e) {
    const doc = e.currentTarget;
  }
}
```

**Fetching documents**

Astronomy 2.0 does not transform documents coming from the collection. Now, you have to use class level `find()` and `findOne()` methods to retrieve transformed documents.

V1

```js
var post = Posts.findOne();
var posts = Posts.find();
```

V2

```js
var post = Post.findOne();
var posts = Post.find();
```

**Document modification**

In Astronomy 2.0 you don't have to use `set()` method to modify fields' values. Now you can modify document freely and Astronomy will detect changes automatically. Methods like `push()`, `inc()`, `pop()` have been removed.

V1

```js
user.set('firstName', 'John');
user.push('phones', '+48 123 123 123');
```

V2

```js
user.firstName = 'John';
// However, you can still write for nested fields.
user.set('address.city', 'San Francisco');
// You can push directly into the array.
user.phones.push('+48 123 123 123');
```

**Validation**

There is a lot of changes in how validators are defined and how to handle validation process. To learn more about that, please go to this [section](#validation).

**Saving**

Now, you don't have to write Meteor methods in client and server to save a document. You can just write `doc.save()` on the client and the corresponding `doc.save()` method will be called on the server.