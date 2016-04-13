# Writing modules

Astronomy is highly modularized and developer can hook into almost any process. Behaviors are class specific. However, modules can introduce some global objects can influence the process of building class from a schema etc. In this section, I will describe the most important features. However, it's best to investigate code of already existing modules to better understand how to create your own module.

**The initDefinition event**

The first thing that your module will probably mess with is a class schema. There is the global `initDefinition` event that can modify schema to fit your needs.

```js
Astro.eventManager.on('initDefinition', function(schemaDefinition) {
  // Modify the "schemaDefinition".
});
```

In the internal `fields` module, this event is responsible for parsing fields list. As you may know you can provide array of fields names or an object with fields names and fields definitions. In the `initDefinition` event the array of fields are converted to objects, so it can be later processed by a module without the need to distinguish if fields definition is array or object.

**The initSchema event**

The `initSchema` event gets a schema definition and applies it to the schema of a class. Each class has an internal `schema` object that stores some module specific data that makes it easier and faster to operate.

```js
User = Astro.Class({ /* ... */ });
User.schema; // Schema object.
```

The `initSchema` event receives the `schemaDefinition` object as the first argument of an event handler. Let's take a look at the example.

```js
Astro.eventManager.on('initSchema', function(schemaDefinition) {
    var schema = this; // The "this" context is the current schema object.

    // Add the "validators" attribute to the schema.
    schema.validators = schema.validators || {};

    if (_.has(schemaDefinition, 'validators')) {
      // Check if there are any validators in the schema and convert them to
      // field validators.
    }
  }
);
```

**The initClass event**

The `initClass` event is responsible for adding some methods or properties to the class constructor.

```js
User = Astro.Class({ /* ... */ });
User.getFieldsNames(); // Method added in the "fields" module.
```

As you can see in the example below, the `this` context in an event handler is a class constructor. We can add some methods and properties to the given class.

```js
Astro.eventManager.on('initClass', function() {
  var Class = this;

  Class.getFieldsNames = function() {
    return /* ... */;
  };
});
```

**Methods in instances of all clasess**

If you want to add some method or properties to intances all classes you should extend the `Astro.BaseClass` prototype. All Astronomy classes inherits its prototype.

```js
Astro.BaseClass.prototype.methodForAllClasses = function() {
  /* ... */
};

var user = new User();
user.methodForAllClasses();
```