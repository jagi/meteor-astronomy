# Relations

The relations module provides ability to define relations between classes assigned to different collections. You can add this module to your Meteor project using the following command.

```sh
meteor add jagi:astronomy-relations
```

**Adding relations**

Let's say we have two classes, `User` and `Address`, and we want to create a "one-to-many" relation. It would mean that one user can have many addresses associated with them. Take a look at the definition of the `Address` class:

```js
Addresses = new Mongo.Collection('addresses');

Address = Astro.Class({
  name: 'Address',
  collection: Addresses,
  fields: {
    city: 'string',
    state: 'string',
    street: 'string',
    userId: 'string'
  }
});
```

And now the `User` class with the defined relation:

```js
Users = new Mongo.Collection('users');

User = Astro.Class({
  name: 'User',
  collection: Users,
  fields: {
    firstName: 'string',
    lastName: 'string'
  },
  relations: {
    addresses: {
      type: 'many',
      class: 'Address',
      local: '_id',
      foreign: 'userId'
    }
  }
});
```

As you can see, we defined the `addresses` relation which points to the `Address` class.

We also have here two extra attributes, `local` and `foreign`. The `local` attribute says that any `Address` is related with the `User` via the `User`'s  `_id` attribute. The `foreign` key specifies that the value of the `_id` attribute will be stored in the `userId` field of instances of the `Address` document.

**Getting related documents**

Having relation defined, it's possible to execute the following code to get all addresses associated with a given user.

```js
var user = Users.findOne();
user.addresses().forEach(function (address) {
  /* Do something with the address */
});
```

As you can see there is the `addresses` method added by the relation which we can call and receive a Mongo cursor pointing to all addresses of a given user.