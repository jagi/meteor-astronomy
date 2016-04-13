# Writing behaviors

When you notice that you're repeating some parts of a code over and over again for some classes it may be a good idea to create a behavior. Behavior is a module that provides some functionality for a class. It may be a feature that adds fields for storing document creation and modification dates that are automatically updated on a document insert and update. It may be a feature that adds the slug field that stores an URL friendly form of a document title. There are some behaviors that have been already implemented and you can add them to the class. In this section we will write about creating custom behaviors using the `timestamp` behavior as an example.

To create a behavior you have to use the `Astro.createBehavior()` function. As the first and only argument you pass a behavior definition. It's an object with key-value pairs. Here is a list of required properties.

- `name` - name of a behavior
- `options` - an object with behavior options (if any) and default values
- `createSchemaDefinition` - a function that should return a schema definition that would be used in the `Class.extend()` method.

We will discuss each property in detail.

**Behavior name**

The behavior name is used in a class definition to determine which behavior we want to add to our class.

```js
Astro.Class({
  behavior: ['behaviorName']
});

// Or

Astro.Class({
  behavior: {
    behaviorName: {}
  }
});
```

**Behavior options**

Some behaviors can have ability to customize them. You can for example change name of the field being added to the class. In the `timestamp` behavior you can for example decide what will be the names of fields for storing creation and modification dates.

```js
Astro.createBehavior({
  name: 'timestamp',
  options: {
    hasCreatedField: true,
    createdFieldName: 'createdAt',
    hasUpdatedField: true,
    updatedFieldName: 'updatedAt'
  },
  /* ... */
});
```

Each option should have a default value. The developer shouldn't have to define any option value when adding a behavior.

**The createSchemaDefinition function**

The `createSchemaDefinition()` function is a heart of behavior. It should return a class definition that can be used in the `extend()` method of a class.

```js
User = Astro.Class({/* ... */});
User.extend(schemaReturnedFromBehavior);
```

The class extension is done automatically by Astronomy when a behavior is being added to the class. However, you should know what form it has to have. Now, let's take a look at how the `timestamp` behavior is constructing this schema definition.

```js
Astro.createBehavior({
  /* ... */
  createSchemaDefinition: function(options) {
    var schemaDefinition = {
      fields: {},
      events: events
    };

    if (options.hasCreatedField) {
      // Add a field for storing a creation date.
      schemaDefinition.fields[options.createdFieldName] = {
        type: 'date',
        immutable: true,
        default: null
      };
    }

    if (options.hasUpdatedField) {
      // Add a field for storing an update date.
      schemaDefinition.fields[options.updatedFieldName] = {
        type: 'date',
        optional: true,
        default: null
      };
    }

    return schemaDefinition;
  }
});
```

As you can see, in the first line, we create a new schema definition object that is returned in the return statement on the last line. The actual body of the function fills this schema with all data needed for the behavior to work.

It's important to notice, that the `createSchemaDefinition()` function receives an `options` object as the first argument. This `options` argument is filled with default values of options overridden with options defined by a developer while adding a behavior to the class.

```js
Astro.Class({
  behavior: {
    behaviorName: {
      // Override a default value of this option.
      createdFieldName: 'creationDate'
    }
  }
});
```

We use the `options` argument to check if some flags were set `options.hasCreatedField` and add a field with a name defined in options `options.createdFieldName`.

**Events**

As you may notice, there is also the `events` object that is a list of event that will be added to the class. For the `timestamp` behavior we add the `beforeInsert` and `beforeUpdate` events. We will examine only the `beforeInsert` event.

```js
events.beforeInsert = function() {
  var doc = this;
  var Class = doc.constructor;

  // Find a class on which the behavior had been set.
  var classBehavior = Class.getBehavior('timestamp');
  var options = classBehavior.options;

  // Get current date.
  var date = new Date();

  // If the "hasCreatedField" option is set.
  if (options.hasCreatedField) {
    // Set value for created field.
    this.set(options.createdFieldName, date);
  }

  if (options.hasUpdatedField) {
    // Set value for the "updatedAt" field.
    this.set(options.updatedFieldName, date);
  }
};
```

In the `beforeInsert` event, we have to know what are the values of options for a given behavior. Maybe someone didn't want to have a field for storing the creation date. We can get options for a behavior by executing the `Class.getBehavior(behaviorName)` method. The `this` context in an event is a document on which an event was triggered, so the line `var doc = this;`. When can get the class for a document getting its constructor `var Class = doc.constructor;`. Now having a class function, we can get behavior's options.

```js
var classBehavior = Class.getBehavior('timestamp');
var options = classBehavior.options;
```