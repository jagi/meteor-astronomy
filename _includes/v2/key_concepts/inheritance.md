# Inheritance

Creating a new class by inheriting from other class can give you several benefits:

- Each instance of a child class is also instance of a parent class
- You can store instances of different classes in the same collection
- You can fetch only documents of a given type even if they are stored in the same collection

At first, let's check how to inherit a class.

```js
import { Class } from 'meteor/jagi:astronomy';

const Parent = Class.create({
  name: 'Parent',
  fields: {
    parent: String
  }
});

const Child = Parent.inherit({
  name: 'Child',
  fields: {
    child: String
  }
});
```

Now, we can check if an instance of a child class is also an instance of a parent class.

```js
var child = new Child();
child instanceof Child; // true
child instanceof Parent; // true
```

**Many classes in the same collection**

Previous example showed how to inherit class that does not have related collection in which documents are stored. Let's create class that gets stored in a collection. We will inherit from it and store documents of both classes in the same collection.

```js
import { Class } from 'meteor/jagi:astronomy';
import { Mongo } from 'mongo';

const Items = new Mongo.Collection('items');
const Parent = Class.create({
  name: 'Parent',
  collection: Items,
  // Class discriminator.
  typeField: 'type',
  fields: {
    parent: String
  }
});

Child = Parent.inherit({
  name: 'Child',
  fields: {
    child: String
  }
});
```

Notice two things that have changed.

- We provided a collection object (`Items`) in the parent class definition
- We provided a value of the `typeField` property in the parent class definition

The collection object is quite obvious, it's where instances of our classes will be stored.

The `typeField` property tells Astronomy what field name should be added to definitions of parent and child classes that determines type of a fetched object. To understand it better let's take a look at the example.

```js
var child = new Child();
child.type; // "Child"

var parent = new Parent();
parent.type; // "Parent"
```

As you can see in both classes Astronomy added the `type` field which stores "Child" and "Parent" strings for `Child` and `Parent` parent classes accordingly. A value of this field will be stored with an instance and when fetching the given document from the collection, the transform function will automatically fetch an instance of proper class.