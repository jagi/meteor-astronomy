# Preventing default

There are processes you may want to prevent from occurring. The example of such process may be saving a document. You won't probably use it on a regular basis. It's more common to use it during the behaviors or modules implementation. Let's take a look at the example:

```js
User = Astro.Class({
  name: 'User',
  /* */
  events: {
    'beforeSave': function(e) {
      if (true) {
        e.preventDefault(); // Prevent saving a document.
      }
    }
  }
});

var user = new User();
user.save(); // The document won't be saved.
```

In the `beforeSave` event handler, we used the `preventDefault()` method on the event object. Our condition in the `if` statement is always `true` so the operation will always be prevented. In a real use case you would probably change it to depend on a document state.

*NOTE: It's worth noting that the `preventDefault()` method does not stop events propagation.*