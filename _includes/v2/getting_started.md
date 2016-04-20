# Getting started

First, you have to create a Meteor project:

```sh
meteor create myapp
```

Open the project's directory and add the Astronomy package.

```sh
cd myapp
meteor add jagi:astronomy
```

You're ready to go.

**Creating the first class**

We'll start by showing the simplest possible class implementation.

```js
import { class } from 'meteor/jagi:astronomy';

const Posts = new Mongo.Collection('posts');

const Post = Class.create({
  name: 'Post',
  collection: Posts
});
```

As you can see, we've created the Mongo collection named `Posts` and the `Post`  class. It's good to keep this convention. The `Posts` (plural) collection is a container for documents of the `Post` (singular) class. We've provided two attributes: `name` and `collection`. The `name` attribute is obligatory and it's just an internal name of the class. The `collection` attribute just tells our class in which collection instance our class should be stored.

Now, we can create an instance of the `Post` class.

```js
var post = new Post();
```

Our class is very simple and right now. It doesn't have any fields, so let's change that.

```js
import { class } from 'meteor/jagi:astronomy';

const Post = Class.create({
  name: 'Post',
  collection: Posts,
  fields: {
    title: String,
    publishedAt: Date
  }
});
```

Now, we have the class with the two fields: `title` and `publishedAt`. The type of the `title` field is `String` and the type of the `publishedAt` field is `Date`. Let's create an instance of the class and fill it with some values.

```js
var post = new Post();
post.title = 'Sample title';
post.publishedAt = new Date();
```

How do we save the document into database? Nothing simpler.

```js
post.save();
```

Let's assume that after a while, we want to change the post's title.

```js
// Notice that we call the "findOne" method from the "Post" class.
var post = Post.findOne({title: 'Sample title'});
post.title = 'New title';
post.save();
```

In the example above, we fetched previously saved document and modified its title. The `save` method ensures that only the title of the document will be updated in the database.

**Adding validation**

Let's define some validation rules in our class.

```js
import { class } from 'meteor/jagi:astronomy';

const Post = Class.create({
  name: 'Post',
  collection: Posts,
  fields: {
    title: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 3
      }, {
        type: 'maxLength',
        param: 40
      }]
    },
    publishedAt: Date
  }
});
```

We've modified the definition of the `title` field. Now instead passing a field type, we pass an object. The object contains two properties: `type` and `validators`. The `type` property is just the type of the field. The `validator` property is a list of validators for the given field. We've defined only two validators: `minLength` and `maxLength`. New validation rules will be check during the save operation.

```js
var post = new Post({
  /* ... */
});
// Validate length of the "title" field.
post.save();
```

**What's next?**

This is a brief introduction that covered only a tiny portion of Astronomy's features. If you want to read more about Astronomy please take a look at the other sections in this documentation.