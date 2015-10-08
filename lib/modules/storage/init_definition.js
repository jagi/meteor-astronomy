var prototypeMethods = {};

/**
 * @summary Inserts or updates a document into the collection. Returns document _id on insert or modified documents count on update.
 * @locus Anywhere
 * @method save
 * @memberOf Astro.BaseClass
 * @instance
 * @param {Array} [fieldsNames] The list of fields that should only be saved into the collection.
 * @param {Function} [callback] Optional. If present, called with an error object as the first argument and, if no error, the _id or modified documents count as the second.
 */
prototypeMethods.save = function(fieldsNames, callback) {
  var doc = this;
  var Class = doc.constructor;
  var Collection = Class.getCollection();

  // Handle arguments' types detection.
  if (arguments.length === 1) {
    if (_.isFunction(fieldsNames)) {
      callback = fieldsNames;
    }
  }
  if (_.isString(fieldsNames)) {
    fieldsNames = [fieldsNames];
  } else if (!_.isArray(fieldsNames)) {
    fieldsNames = Class.getFieldsNames();
  }

  // Set the flag indicating whether we are updating or instering a document.
  var inserting = doc._isNew;

  // Trigger "beforeSave" event handlers.
  var event = new Astro.Event('beforeSave');
  event.target = doc;
  Class.emitEvent(event);
  // If user prevented default operation, then we have to stop here.
  if (event.defaultPrevented) {
    return inserting ? undefined : 0;
  }
  // Trigger "beforeInsert" or "beforeUpdate" event handlers.
  event = new Astro.Event(inserting ? 'beforeInsert' : 'beforeUpdate');
  event.target = doc;
  Class.emitEvent(event);
  // If user prevented default operation, then we have to stop here.
  if (event.defaultPrevented) {
    return inserting ? undefined : 0;
  }

  // Prepare a variable for storing a Mongo query result.
  var result;

  // Catch any error that may be cause by unability to save a document. It may
  // be a Mongo exception for an index uniqueness etc. The returned error can be
  // handled in the `saveError` event.
  try {
    if (inserting) {
      // Inserting.

      // Get plain values of all fields.
      var values = doc._rawAll({
        transient: false
      });
      // If, we are inserting a document with the null "_id", then we have to
      // remove it.
      if (_.isNull(values._id)) {
        values = _.omit(values, '_id');
      }
      // Pick only these values that we want to save.
      values = _.pick(values, fieldsNames);
      // Insert a document.
      result = doc._id = Collection.insert(values, callback);

    } else {
      // Updating.

      // Get a modifier.
      var modifier = doc._getModifiers();
      // Get a document's id.
      var id = doc._id;
      // Update a document only if there is anything to update.
      if (_.size(modifier) > 0) {
        result = Collection.update(id, modifier, callback);
      } else {
        if (_.isFunction(callback)) {
          callback(undefined, 0);
        }
        return 0;
      }
    }
  } catch (e) {
    if (e.name === 'MongoError') {
      var event = new Astro.Event('saveError', {
        error: e
      });
      event.target = doc;
      Class.emitEvent(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    throw e;
  }

  // Change the "_isNew" flag to "false". Now a document is not new.
  doc._isNew = false;

  // Trigger "afterInsert" or "afterUpdate" event handlers.
  var event = new Astro.Event(inserting ? 'afterInsert' : 'afterUpdate');
  event.target = doc;
  Class.emitEvent(event);
  // Trigger "afterSave" event handlers.
  var event = new Astro.Event('afterSave');
  event.target = doc;
  Class.emitEvent(event);

  // Copy values to the "_original" property.
  _.each(fieldsNames, function(fieldName) {
    doc._original[fieldName] = EJSON.clone(doc[fieldName]);
  });
  // Clear a modifier.
  doc._clearModifiers();

  // Return result of executing a Mongo query.
  return result;
};

/**
 * @summary Removes a document from the collection. Returns an amount of removed documents.
 * @locus Anywhere
 * @method remove
 * @memberOf Astro.BaseClass
 * @instance
 * @param {Function} [callback] Optional. If present, called with an error object as the first argument and, if no error, the an amount of removed documents as the second.
 */
prototypeMethods.remove = function(callback) {
  var doc = this;
  var Class = doc.constructor;
  var Collection = Class.getCollection();

  // Remove only when document has the "_id" field (it's persisted).
  if (!doc._id) {
    return 0;
  }

  // Trigger "beforeRemove" event handlers on the current and parent classes.
  var event = new Astro.Event('beforeRemove');
  event.target = doc;
  Class.emitEvent(event);
  // If user prevented default operation, then we have to stop here.
  if (event.defaultPrevented) {
    return 0;
  }

  // Remove document and save result.
  var result = Collection.remove(doc._id, callback);

  // Trigger "afterRemove" event handlers on the current and parent classes.
  var event = new Astro.Event('afterRemove');
  event.target = doc;
  Class.emitEvent(event);

  // Clear the "_id" attribute.
  doc._id = null;

  // Clear a modifier.
  doc._clearModifiers();

  // Set document as a new, so it will be possible to save document again.
  doc._isNew = true;

  // Return result of removing document.
  return result;
};

prototypeMethods.reload = function() {
  var doc = this;
  var Class = doc.constructor;
  var Collection = Class.getCollection();

  // The document has to be already saved in the collection.
  if (doc._id) {
    // Get a document from the collection without the transformation.
    var plainDoc = Collection.findOne(doc._id, {
      transform: null,
    });

    // Init instance with the new values from the collection.
    Astro.BaseClass.call(doc, plainDoc);

    // Set the "_isNew" flag back to false.
    doc._isNew = false;
  }
};

prototypeMethods.copy = function(save) {
  var doc = this;
  save = save || false;

  // Use EJSON to clone object.
  var copy = EJSON.clone(doc);

  // Remove the "_id" value and set the "_isNew" flag to false so that it will
  // save the object as a new document instead updating the old one.
  copy._id = null;
  copy._original._id = null;
  copy._isNew = true;

  if (save) {
    copy.save();
  }

  return copy;
};

var events = {};

events.afterInit = function(attrs) {
  var doc = this;
  var Class = doc.constructor;

  doc.set(Class.getTypeField(), Class.getName());
};

var checkSchemaDefinition = function(schemaDefinition) {
  var Class = this;

  // The collection has to be an instance of the Mongo.Collection class.
  if (_.has(schemaDefinition, 'collection') &&
    !(schemaDefinition.collection instanceof Mongo.Collection)
  ) {
    throw new Error(
      'The "collection" property has to be an instance of the ' +
      '"Mongo.Collection" in the "' + Class.getName() + '" class'
    );
  }
  // The "typeField" property has to be a string.
  if (_.has(schemaDefinition, 'typeField') &&
    !_.isString(schemaDefinition.typeField)
  ) {
    throw new Error(
      'The "typeField" property has to be a string in the "' +
      Class.getName() + '" class'
    );
  }
};

Astro.eventManager.on(
  'initDefinition', function onInitDefinitionStorage(schemaDefinition) {
    var Class = this;
    var schema = Class.schema;

    checkSchemaDefinition.call(Class, schemaDefinition);

    // If there is no collection for the class, then we can stop class
    // initialization for the module.
    var Collection = schemaDefinition.collection;
    if (!Collection) {
      return;
    }
    schema.collection = Collection;

    var transform = schemaDefinition.transform;
    if (_.isFunction(transform)) {
      // Apply custom transformation function.
      Collection._transform = Astro.utils.class.transform(transform);
    } else if (_.isUndefined(transform) && !Collection._transform) {
      // Apply standard transformation function, if the transform function was
      // not provided and the collection does not have the transform function
      // yet.
      Collection._transform = Astro.utils.class.transformToClass(
        Class.getName()
      );
    }

    // Prepare an object for storing fields definitions and events list that
    // will extend the current schema.
    var extendDefinition = {
      fields: {
        // Add the "_id" field.
        _id: {
          type: 'string'
        }
      }
    };

    // Add the "type" field, to distinguish to what class we have to cast a
    // document fetched from the collection.
    var typeField = schemaDefinition.typeField;
    if (typeField) {
      schema.typeField = typeField;
      extendDefinition.fields[typeField] = {
        type: 'string'
      };

      // Add the "afterInit" event handler that sets a type field.
      extendDefinition.events = {
        afterInit: [events.afterInit]
      };
    }

    // Extend the current schema definition.
    Class.extend(extendDefinition);

    // Add storage methods to the class prototype.
    _.extend(Class.prototype, prototypeMethods);
  }
);
