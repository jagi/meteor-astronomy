# Indexes

To speed up the database access, we should create indexes on the fields we are searching on or sorting by. By default index is created only on the `_id` field. We can define a single field index in a definition of the field or multi fields index in the `indexes` property of the class schema. Let's see examples of both.

**Single field indexes**

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    birthDate: {
      type: 'date',
      index: 1 // Define an index (ascending order) for the "birthDate" field.
    }
  }
});
```

The value `1` under the `index` property is an order in which index will be stored. In this case, it doesn't matter if we use ascending (`1`) or descending (`-1`) order because MongoDB can easily iterate through the one key indexes in both directions. However it does matter in the case of the multi-key indexes. In the field definition we can only create single field indexes.

MongoDB supports several different index types including text, geospatial, and hashed indexes. If you want to use them you have to provide a type name instead of the 1 or -1 values. You can read about index types in the [MongoDB documentation](http://docs.mongodb.org/manual/reference/method/db.collection.createIndex/#db.collection.createIndex).

Let's take a look at how to define the `text` index.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    lastName: {
      type: 'string',
      index: 'text' // Define the "text" index on the "lastName" field.
    }
  }
});
```

**Multiple fields indexes**

We define multi fields indexes under the `indexes` property in the class schema. Let's take a look at the example:

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    firstName: 'string',
    lastName: 'string'
  },
  indexes: {
    fullName: {
      fields: {
        lastName: 1,
        firstName: 1
      },
      options: {}
    }
  }
});
```

The index name is `fullName`. An index definition consists of two objects: list of fields and list of options.

A value of the `fields` property is an object with the key-value pairs where the key is a field name and the value describes the type of index for that field. For an ascending index order on a field, specify a value of 1 and for descending index order, specify a value of -1. You can also use text, geospatial, and hashed types.

The `options` property let's you specify details of your index like index uniqueness. You can read more about available options in the [MongoDB documentation](http://docs.mongodb.org/manual/reference/method/db.collection.createIndex/#ensureindex-options).

Example of defining unique index:

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    firstName: 'string',
    lastName: 'string',
    email: 'string'
  },
  indexes: {
    email: {
      fields: {
        email: 1
      },
      options: {
        unique: true
      }
    }
  }
});
```