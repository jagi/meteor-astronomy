# Sort

You can add the `sort` behavior to your project by executing the following command.

```sh
meteor add jagi:astronomy-sort-behavior
```

The `sort` behavior introduces documents sorting. You can have one or more lists per collection. You can move documents up and down, take them out of the list or insert a new document into the list at a desired position.

The `sort` behavior comes with following options.

```js
behaviors: {
  sort: {
    // The field name that stores position of a document.
    orderFieldName: 'sort',
    // A flag indicating possibility to store multiple lists per collection.
    hasRootField: false,
    // The field name for storing a value distinguish to which list a given
    // document belongs.
    rootFieldName: 'root'
  }
}
```

Let's take a look at the behavior usage.

```js
var user = Users.findOne();
user.insertAt(0);
```

We inserted a document at the first position of a list. Any document that is already on the list will be moved up (a value of the `order` field will be incremented).

To take a document out of the list (remove it), we use the `takeOut()` method.

```js
user.takeOut();
```

*NOTICE: When using the sort behavior, you can't use `save()` and `remove()` methods to insert or removed a document. Any operation related with changing the position of a document on the list has to be done using behavior's methods. You can use the `save()` to update any other value of the document.*

Let's see what methods the `sort` behavior provides.

- `insertAt(position)` - inserts a document at a given position
- `takeOut()` - removes a document from the list
- `moveBy(shift)` - moves a document up/down by a given amount
- `moveTo(position)` - moves a document to the given position
- `moveUp()` - moves a document up by 1
- `moveDown()` - moves a document down by 1
- `moveToTop()` - moves a document to the top of the list
- `moveToBottom()` - moves a document to the bottom of the list