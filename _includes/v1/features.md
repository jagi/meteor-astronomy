# Features

Astronomy is highly modularized. Some basic features comes with the base `jagi:astronomy` package. Others have to be added as separate modules / packages. Here is a list of all the features with a short description.

**Document transformation**

Documents fetched from collections are not simple JavaScript objects but instances of classes you define using Astronomy.

**Field types**

When defining a field list, you can specify their types like `string`, `number`, `boolean` etc. Thanks to this, when setting field's value, it will be automatically casted to the given type.

**Field default values**

On document initialization, you may want to set default values of some fields. In Astronomy it's easy to do. You can also use functions to compute a default value.

**Nested fields / classes**

You can nest one or many classes in a field. In this way, you can define types of fields and default values of nested objects and arrays.

**Transient fields**

You can define list of fields that won't be stored in the database. You can use transient fields as normal fields and have all the benefits of Astronomy fields system.

**Immutable fields**

There are situations when you may want to mark a field as immutable so it won't be possible to change field's value once it has been saved into the database.

**Document's EJSON-ification**

[EJSON](http://docs.meteor.com/#/full/ejson) is an extension of JSON that supports more types. When sending documents from the client to the server over the DDP protocol (for instance in Meteor methods), they get stringified using the `EJSON.strinigify()` function. Astronomy classes are EJSON compatible, so you can send them over the DDP.

**Methods**

You can define methods, so your document is not only a data storage but a "live" thing. A dog can bark `dog.bark();` and a user can greet you `user.sayHello();`.

**Events**

Astronomy implements an events system that allows you to hook into many processes happening inside the package. For example, you can hook into the process of saving document. You may want to lowercase a user's nickname just before saving document. With Astronomy it's a piece of cake. The events system also provides you a way to stop an event's propagation and to prevent default behavior.

**Getters and setters**

Each Astronomy document has `get()` and `set()` methods. Thanks to them, you can get and set multiple fields at once. They can also perform operation on nested properties `user.set('profile.email', 'example@mail.com')`. Moreover, when using them, the `beforeGet`, `afterGet`, `beforeSet` and `afterSet` events are triggered and you can hook into the process of getting and setting a value.

**Push, pop, inc operations**

When working with array fields you can easily `push()` and `pop()` values from the array. Astronomy is smart enough to deduce what fields needs updating and execute minimal query to minimize database access. When working with number values you can use the `inc()` method to increment the value of a number field.

**Modified fields**

Thanks to the `doc.getModified()` method you can access fields that had been modified from the last save.

**Cloning document**

It allows making copies of documents already stored in the database. You can automatically save cloned document or modify it before saving `var copy = post.copy();`.

**Reloading document**

Sometimes after introducing some changes into your document, you may want to reverse them. For that task you can use the `reload()` method.

**Indexes**

This feature allows you to define indexes that will be created on given fields / columns to speed up the process of fetching data.

**Inheritance**

When there are classes with similar schemas, sometimes it's simpler to create a base class and extend it by adding only the features that differ.

**Multiple classes in the same collection**

You can store instances of many classes in the same collection. You just have to tell Astronomy which field will store the name of the class to use when creating the instance.

**Direct collection access**

You can perform `insert`, `update`, `upsert` and `remove` operations directly on a collection with all the benefits of Astronomy like defaulting field values or type casting.

**Validation**

The Validators module is responsible for making sure that the fields' values in your document are in the proper format. For example, you can check whether an e-mail address is valid. To use this module you have to add it to your project `meteor add jagi:astronomy-validators`.

**Validation order**

You can define the order in which validation will take place.

**Simple validation**

The Simple Validators module is an extension of the Validators module. It allows you to create validation rules in the form of a string instead of functions. However, this approach limits some functionalities. To use this module you have add it to your project `meteor add jagi:astronomy-simple-validators`. You don't have to add the `jagi:astronomy-validators` module when using Simple Validators as it will be automatically included.

**Relations**

*NOTE: This is an experimental module so use it at your own risk.*

The Relations module allows you to define relations between documents of different classes. With this, we can easily fetch related documents. We can create one-to-one, one-to-many, and many-to-many relations. To use this module you have to add it to your project `meteor add jagi:astronomy-relations`.

**Query Builder**

*NOTE: This is an experimental module and you're using it at your own risk.*

The Query Builder module is an abstraction layer for accessing data in your database. To use this module you have to add it to your project `meteor add jagi:astronomy-query-builder`.

**Behaviors module**

The Behaviors module is a nice way of reusing your code in more than one class. If you have similar features in two or more classes, you should consider creating a behavior for the feature. An example of a behavior is the Timestamp behavior which automatically sets `createdAt` and `updateAt` fields with the current date on every document save or update.

You don't need to use Behaviors module directly as long as you don't want to create your own behavior. Instead, you'll be using one of the modules listed below.

**Timestamp behavior**

The Timestamp Behavior adds two fields that store information about a document's creation and update dates. Those fields will be automatically filled with the correct date. To use this behavior you have to add it to your project `meteor add jagi:astronomy-timestamp-behavior`.

**Slug behavior**

The Slug Behavior adds a slug field for storing a URL friendly value of a chosen field. The text `Tytuł artykułu` will be converted to `tytul-artykulu`. The slug field can then be used in routing `http://localhost:3000/post/tytul-artykulu`. To use this behavior you have to add it to your project `meteor add jagi:astronomy-slug-behavior`.

**Sort behavior**

The Sort Behavior helps with sorting documents. It delivers several useful methods to manage sorting like `post.moveUp();` or `post.moveBy(2);`. To use this behavior you have to add it to your project `meteor add jagi:astronomy-sort-behavior`.

**Softremove behavior**

The Softremove Behavior adds the `softRemove()` method to your class which prevents a document a document from being removed. Instead, it will flag the document as removed and you will be able to omit such documents on documents fetch. To use this behavior you have to add it to your project `meteor add jagi:astronomy-softremove-behavior`.