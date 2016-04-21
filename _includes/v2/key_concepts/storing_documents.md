# Storing Documents

In this section we will focus on documents storage. We will describe saving and removing documents.

**Saving**

MongoDB provides the `insert` method that allows document inserting and the `update` method that modifies an already stored document. In Astronomy we don't need to call these methods directly. Astronomy documents are aware of their states, so we can replace `insert` and `update` methods with the one `save()` method. Let's take a look at an example showing how to insert a new document and update an existing one.

```js
var user = new User();
user.firstName = 'John';
user.lastName = 'Smith';
user.save(); // Insert document.

user.firstName = 'Łukasz';
user.lastName = 'Jagodziński';
user.save(); // Update document.
```

As you can see, we've used the `save()` method for both insertion and modification of a document. Every Astronomy document has a private `_isNew` property that tells Astronomy if it should be inserted or updated.

**Server only call**

By default, when you execute the `save()` method on the client, it will perform the save operation in both environments client and server. Thanks to that you don't have to create Meteor methods, however it's highly recommended for security reason. But more about that in the [Security](#security) section.

```js
var user = new User();
user.save(); // Insert a document on the client and server.
```

There are situations when you don't want to perform simulation on the client. The `save()` method takes an object of options as the first argument. One of the options is `simulation` which you have set to `false`, to not perform client simulation.

```js
var user = new User();
user.save({
  simulation: false // Insert only on the server.
});
```

**Updating only selected fields**

The `save()` method as the first argument can also take a list of options and one of them is `fields`. By providing array of fields, we can force Astronomy to update only provided fields even when we modified more of them.

```js
var user = User.findOne();
user.save({
  fields: ['firstName', 'lastName'] // Update only first and last name.
});
```

It's important to note here that the `fields` option does not work with the insert operation.

**Stoping validation on the first error**

The `save()` method as the first argument can also take a list of options and one of them is `stopOnFirstError`. By default it's set to `true`, so it will stop further validation on the first validation error. However, if you want to get all validation errors, then you can set it to `false`.

```js
var user = User.findOne();;
user.save({
  stopOnFirstError: false // Don't stop on the first validation error.
});
```

**Callback function**

The `save()` method takes a callback function as the last argument. The callback function will be called when document storage is finished or on when any error occurred on the client or server. The first argument of the callback function is error object and the second one is response from the server. On insert the response is ID of the inserted document, and on update it's number of modified documents.

```js
var user = new User();
user.save(function(err, id) {
});
```

**Removing**

Removing documents is as simple as saving them. It works the same way as the `save()` method - it executes removal operation in both client and server. Let's take a look at an example.

```js
var user = Users.findOne();
user.remove();
// Or with callback function.
user.remove(function(err, result) {
});
```