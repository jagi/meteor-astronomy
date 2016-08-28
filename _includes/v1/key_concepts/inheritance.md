# Inheritance

Creating a new class by inheriting from other class can give you two benefits:

- Each instance of a child class is also instance of a parent class
- You can store instances of different classes in the same collection

At first, let's check how to inherit a class:

```js
Parent = Astro.Class({
  name: 'Parent',
  fields: {
    parent: 'string'
  }
});

Child = Parent.inherit({
  name: 'Child',
  fields: {
    child: 'string'
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

We didn't provide any collection object in class definitions. Let's change it, so that we will be able to store instances of both classes in such collection.

```js
Items = new Mongo.Collection('items');

Parent = Astro.Class({
  name: 'Parent',
  collection: Items,
  typeField: 'type',
  fields: {
    parent: 'string'
  }
});

Child = Parent.inherit({
  name: 'Child',
  fields: {
    child: 'string'
  }
});
```

Notice two things:

- We provided a collection object (`Items`) in the parent class definition
- We provided a value of the `typeField` property in the parent class definition

The collection object is quite obvious, it's where instances of our classes will be saved in.

The `typeField` property tells Astronomy what field name should be added to definitions of parent and child classes that determines type of a fetched object. To understand it better let's take a look at the example.

```js
var child = new Child();
child.type; // "Child"

var parent = new Parent();
parent.type; // "Parent"
```

As you can see in both classes Astronomy added the `type` field which stores "Child" and "Parent" strings for `Child` and `Parent` parent classes accordingly. A value of this field will be stored with an instance and when fetching the given document from the collection, the transform function will automatically fetch an instance of proper class.

*NOTE: In previous versions of Astronomy, the `typeField` field was `_type` and you weren't able to change it. However in 1.0.0, you can freely decide how to name it.*