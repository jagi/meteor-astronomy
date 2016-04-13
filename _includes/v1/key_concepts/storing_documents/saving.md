**Saving**

In this section we will focus on the storage of documents. MongoDB provides the `insert` method that allows document inserting and the `update` method that modifies an already stored document. In Astronomy we don't need to call these methods directly. Because Astronomy documents are aware of their states, we can replace both methods with the a single method `save()`. Let's take a look at an example showing how to insert a new document and update an existing one.

```js
var user = new User();
user.set({
  firstName: 'John',
  lastName: 'Smith'
});
user.save(); // Document insertion.

user.set({
  firstName: 'Łukasz',
  lastName: 'Jagodziński'
});
user.save(); // Document update.
```

As you can see, we've used the `save()` method for both insertion and modification of a document. Every Astronomy document has a private `_isNew` property that tells Astronomy if it should be inserted or updated.

**Callback function**

Because Meteor provides a way of passing a callback function as the last argument of `insert()` and `update()` methods, Astronomy does so as well by accepting a callback in the `save()` method:


```js
var user = new User();

user.save(function(err, id) {
});
```

**Saving only certain fields**

It's also possible to save only certain fields of a document. You can pass a list of fields as the first argument of the `save()` method.

```js
var user = new User();
user.save(['firstName', 'lastName']);
```