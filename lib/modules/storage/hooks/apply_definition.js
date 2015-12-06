Astro.Module.modules.storage.onApplyDefinition = function(
  Class, parsedSchema, className
) {
  let schema = Class.schema;

  if (parsedSchema.collection) {
    let Collection = parsedSchema.collection;
    schema.collection = Collection;

    Class.extend({
      // Add the "_id" field.
      fields: {
        _id: {
          name: '_id',
          type: 'string'
        }
      },
      // Add storage events.
      events: {
        beforeInit: [Astro.Module.modules.storage.classEvents.beforeInit],
        toJSONValue: [Astro.Module.modules.storage.classEvents.toJSONValue],
        fromJSONValue: [Astro.Module.modules.storage.classEvents.fromJSONValue]
      }
    });

    if (parsedSchema.typeField) {
      schema.typeField = parsedSchema.typeField;

      let fields = {};
      fields[typeField] = {
        name: typeField,
        type: 'string'
      };
      Class.extend({
        // Add the type field.
        fields: fields,
        events: {
          afterInit: [Astro.Module.modules.storage.classEvents.afterInit]
        }
      });
    }

    if (parsedSchema.transform) {
      // Apply custom transformation function.
      schema.transform = function(attrs) {
        if (!Astro.config.enabled) {
          return attrs;
        }

        return parsedSchema.transform(attrs);
      };
    } else {
      // Apply standard transformation function.
      schema.transform = Astro.utils.storage.transformToClass(className);
    }

    // Override collection methods.
    let collectionMethods = Astro.Module.modules.storage.collectionMethods;
    _.each(collectionMethods, function(collectionMethod, methodName) {
      if (Collection[methodName]) {
        // If there is a method with the same name already defined in the
        // collection, then override it.
        Astro.utils.overrideMethod(
          Collection, methodName, collectionMethod, Class
        );
      } else {
        // If there is no method with the given name, then we add one.
        Collection[methodName] = collectionMethod;
      }
    });

    // Add meteor methods.
    if (Meteor.isClient || Collection._connection === Meteor.server) {
      let meteorMethods = Astro.Module.modules.storage.meteorMethods;
      let methods = {};
      _.each(meteorMethods, function(meteorMethod, methodName) {
        let meteorMethodName =
          '/Astronomy/' + Class.getName() + '/' + methodName;
        methods[meteorMethodName] = meteorMethod;
      });
      Collection._connection.methods(methods);
    }

    // Add methods to the class prototype only if there is a collection defined
    // for the given class.
    _.extend(
      Class.prototype, Astro.Module.modules.storage.classPrototypeMethods
    );
  }
};