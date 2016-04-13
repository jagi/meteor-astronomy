**Removing**

Removing documents is as simple as saving them. Let's take a look at an example:

```js
var user = Users.findOne();
user.remove();
```

**Callback function**

Because Meteor provides a way of passing a callback function as the last argument of the `remove()` method, Astronomy does it too.

```js
var user = Users.findOne();

user.remove(function(err, count) {
});
```