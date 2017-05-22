# Secured property

Every Astronomy class is "secured" by default and no operations from the client are allowed. It's similar to removing the `insecure` package from your Meteor project. In most cases it's exactly what you want. However, you may turn off security and provide some rules in events. Everything depends on your programming style. Let's talk about the class level `secured` property in more details.

**The "secured" property**

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  // Turn off security for insert, update and remove operations.
  secured: false
});
```

As you can see, we switched security off for every operation on this class. Now let's see how to secure only certain operations.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  // Turn off security for update operations.
  secured: {
    update: false
  }
});
```

In the example above, we turned off security only for update operations.

Now let's see what will happen if you try insert something.

```js
var user = new User();
user.save(); // Throw error: Inserting from the client is not allowed
```

**Securing application using events**

If you set the `secured` property to `false` then you have to be very careful about your application security. It will allow anyone to insert, update or remove documents from the client. In such situation, we have to secure a class by defining some security rules in events. Let's take a look at the example.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  secured: false,
  events: {
    beforeUpdate(e) {
      // Get a document being saved.
      const doc = e.currentTarget;
      // Check if a given user can update a document.
      if (!RolesHelpers.isOwner(doc, Meteor.user())) {
        throw new Meteor.Error(403, 'You are not authorized');
      }
    }
  }
});
```

As you can see, in the `beforeUpdate` event, we check if a given user can update a document. For that purpose, we use imaginary helper function `RolesHelpers.isOwner()` which checks if a user is an owner of a document. In similar way, you have to write any other security rules. It's very similar to what you can do in the allow/deny rules. Now, let's see how to access different data.

INSERT:

```js
// Allow/deny rules.
Posts.allow({
  insert(userId, doc) {}
});
// Astronomy.
Post.extend({
  events: {
    beforeInsert(e) {
      const userId = Meteor.userId(); // userId
      const doc = e.currentTarget; // doc
    }
  }
});
```

UPDATE:

```js
// Allow/deny rules.
Posts.allow({
  update(userId, doc, fieldNames, modifier) {}
});
// Astronomy.
Post.extend({
  events: {
    beforeUpdate(e) {
      const userId = Meteor.userId(); // userId
      const doc = e.currentTarget; // doc
      const fieldNames = doc.getModified(); // fieldNames
      const modifier = doc.getModifier(); // modifier
    }
  }
});
```

REMOVE:

```js
// Allow/deny rules.
Posts.allow({
  remove(userId, doc) {}
});
// Astronomy.
Post.extend({
  events: {
    beforeRemove(e) {
      const userId = Meteor.userId(); // userId
      const doc = e.currentTarget; // doc
    }
  }
});
```

As you can see, in Astronomy events you can access all data that is accessible using allow/deny rules. You just define them in a little bit different way. And you are responsible for throwing `Meteor.Error` with an error message.

**Securing application using methods**

Securing application using events may not work for every use case. Even MDG is not recommending securing your application using allow/deny rules beside situations where you really know what are you doing and you are very careful. MDG is recommending putting security rules in Meteor methods. That way you can split your application logic into separate methods. It allows you not only defining methods like `post/insert`, `post/update`, `post/remove` but also `post/publish`, `post/rename` etc. So you have more control over an operation which you're performing. Some security rules may work for update operation but not especially for the `post/rename` operation which in theory is also update operation, but limited to changing only a single field's value. Let's see how to define some security rules using Meteor methods.

```js
import { Class } from 'meteor/jagi:astronomy';

const Post = Class.create({
  name: 'Post',
  /* ... */
  secured: true,
  fields: {
    title: String,
    published: {
      type: Boolean,
      default: false
    }
    /* ... */
  },
  meteorMethods: {
    rename(title) {
      const invocation = DDP._CurrentInvocation.get();
      // Check if a given user can rename a post.
      if (!Permissions.canRenamePost(this, invocation.userId)) {
        throw new Meteor.Error(403, 'You can not rename this post');
      }
      this.title = title;
      this.save();
    },
    publish() {
      const invocation = DDP._CurrentInvocation.get();
      // Check if a given user can rename a post.
      if (!Permissions.canPublishPost(this, invocation.userId)) {
        throw new Meteor.Error(403, 'You can not publish this post');
      }
      this.published = true;
      this.save();
    }
  }
});
```

Now let's use these methods.

```js
const post = Post.findOne();
post.rename('New post name');
post.publish();
```