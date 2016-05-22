# Features

Astronomy is highly modularized. Some basic features comes with the base `jagi:astronomy` package. Others have to be added as separate modules / packages. Here is a list of all the features with a short description.

**Astronomy documents**

Documents fetched from collections are not simple JavaScript objects but instances of classes you define using Astronomy.

**Fields' types**

When defining a field list, you can specify their types like `String`, `Number`, `Boolean`, `Date` etc. Thanks to that it will automatically validate fields' values.

**Fields' default values**

On document initialization, you may want to set default values of some fields. In Astronomy it's easy to do. You can also use functions to compute a default value.

**Nested fields / classes**

You can nest one or many class instances in a field.

**Transient fields**

You can define list of fields that won't be stored in the database. You can use transient fields as normal fields.

**Immutable fields**

There are situations when you may want to mark a field as immutable so it won't be possible to change field's value once it has been saved into the database.

**Document's EJSON-ification**

[EJSON](http://docs.meteor.com/#/full/ejson) is an extension of JSON that supports more types. When sending documents from the client to the server over the DDP protocol (for instance in Meteor methods), they get stringified using the `EJSON.strinigify()` function. Astronomy classes are EJSON compatible, so you can send them over the DDP.

**Methods**

You can define methods, so your document is not only a data storage but a "live" thing. A dog can bark `dog.bark();` and a user can greet you `user.sayHello();`.

**Events**

Astronomy implements an events system that allows you to hook into many processes happening inside the package. For example, you can hook into the process of saving document. You may want to lowercase user's nickname just before saving document. With Astronomy it's a piece of cake. The events system also provides you a way to stop an event's propagation and to prevent default behavior.

**Getters and setters**

Each Astronomy document has `get()` and `set()` methods. Thanks to them, you can get and set multiple fields at once and access nested fields in an easy way. For example you can call `user.set('profile.email', 'example@mail.com')` to set email address in the profile object.

**Modified fields**

Thanks to the `doc.getModified()` method you can access fields that had been modified from the last save.

**Cloning document**

It allows making copies of documents. You can automatically save cloned document or modify it before saving `var copy = post.copy();`.

**Reloading document**

Sometimes after introducing some changes into your document, you may want to reload document to its new state from the database. For that task you can use the `reload()` method.

**Indexes**

This feature allows you to define indexes that will be created on given fields / columns to speed up the process of fetching data.

**Inheritance**

When there are classes with similar schemas, sometimes it's simpler to create a base class and extend it by adding only the features that differ.

**Multiple classes in the same collection**

You can store instances of many classes in the same collection. You just have to tell Astronomy which field will store the name of the class to use when creating the instance.

**Validation**

When saving a document, Astronomy will validate its values agains rules you defined. If yo haven't defined any rules it at least validate types of fields. You can also validate a document without saving it.

**Validation order**

You can define the order in which validation will take place.

**Mongo queries**

You can perform `insert`, `update`, `upsert` and `remove` mongo queries directly on a class with all the benefits of Astronomy, like default fields' values or validation `User.update(id, {$set: {firstName: 'John'}});`.

**Behaviors**

Behavior is a nice way of reusing your code in more than one class. If you have similar features in two or more classes, you should consider creating a behavior for that feature. An example of a behavior is the Timestamp behavior which automatically sets `createdAt` and `updateAt` fields with the current date on every document save or update.

**Timestamp behavior**

The Timestamp Behavior adds two fields that store information about a document's creation and update dates. Those fields will be automatically filled with the correct date. To use this behavior you have to add it to your project `meteor add jagi:astronomy-timestamp-behavior`.

**Slug behavior**

The Slug Behavior adds a slug field for storing a URL friendly value of a chosen field. The text `Tytuł artykułu` will be converted to `tytul-artykulu`. The slug field can then be used in routing `http://localhost:3000/post/tytul-artykulu`. To use this behavior you have to add it to your project `meteor add jagi:astronomy-slug-behavior`.

**Softremove behavior**

The Softremove Behavior adds the `softRemove()` method to your class which prevents a document from being removed. Instead, it will flag the document as removed and you will be able to omit such documents on documents fetch. To use this behavior you have to add it to your project `meteor add jagi:astronomy-softremove-behavior`.
