# Custom types

In Astronomy you can create custom types. An example of such custom type is `MongoObjectID`. Let's take a look at the example of creating this type.

```js
import Type from '../type.js';
import Validators from '../../validators/validators.js';
import { Mongo } from 'meteor/mongo';

Type.create({
  name: 'MongoObjectID',
  class: Mongo.ObjectID,
  validate(args) {
    Validators.mongoObjectID(args);
  }
});
```

As you can see, we have here three properties. The first one is a name, which is mandatory. The second one is a class or constructor, that is used to create instances of our type. In this situation, it's just `Mongo.ObjectID`. But it could be also `String` or any custom class/constructor that you created. The last property is the `validate()` function which validates value stored in a field with our type used.

Now, let's see how to use our type in a schema.

```js
import { Class } from 'meteor/jagi:astronomy';
import { Mongo } from 'meteor/mongo';

const Post = Class.create({
  name: 'Post',
  /* ... */
  fields: {
    threadId: {
      type: Mongo.ObjectID
    }
  }
});
```

We only pass our type constructor as the field's type. That way Astronomy will know where to look for a type definition and what validation it should perform.