# Timestamp

You can add the `timestamp` behavior to your project by executing the following command.

```sh
meteor add jagi:astronomy-timestamp-behavior
```

The `timestamp` behavior adds two fields that store information about document creation and update dates.

The `timestamp` behavior comes with following options. Options names are self explanatory.

```js
behaviors: {
  timestamp: {
    hasCreatedField: true,
    createdFieldName: 'createdAt',
    hasUpdatedField: true,
    updatedFieldName: 'updatedAt'
  }
}
```

Let's take a look at the behavior usage.

```js
var post = new Post();
post.save();

post.createdAt; // A document creation date.

/* ... */

post.save();
post.updatedAt; // A document modification date.
```