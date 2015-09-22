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

  if (inserting) {
    // Inserting.

    // Get plain values of all fields.
    var values = doc._getAll({
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

var classMethods = {};

var checkSelector = function(selector, methodName) {
  // If we are not on the server and we are trying to perform non insert
  // operation on a document then it has to be done by ID.
  if (
    !Meteor.isServer && !LocalCollection._selectorIsIdPerhapsAsObject(selector)
  ) {
    throw new Meteor.Error(
      403,
      'Not permitted. Untrusted code may only ' + methodName +
      ' documents by ID.'
    );
  }
};

/**
 * @summary Inserts a document into the collection.
 * @locus Anywhere
 * @method insert
 * @memberOf Astro.BaseClass
 * @class
 * @param {Object} [doc] A doc to insert.
 * @param {Function} [callback] Optional. If present, called with an error object as the first argument and, if no error, the _id as the second.
 * @returns {String} Returns an _id of an inserted document.
 */
classMethods.insert = function(doc, callback) {
  var Class = this;

  try {
    var doc = new Class(doc);
    var id = doc.save();
    // Execute a callback function if provided.
    if (_.isFunction(callback)) {
      callback(undefined, id);
      return id;
    }
    // Return result.
    return id;
  } catch (e) {
    if (e instanceof Meteor.Error && _.isFunction(callback)) {
      // Execute a callback function with an error.
      callback(e);
    } else {
      // Throw the error again, if we can not handle it.
      throw e;
    }
  }
};

/**
 * @summary Updates documents in the collection.
 * @return
 * @locus Anywhere
 * @method update
 * @memberOf Astro.BaseClass
 * @class
 * @param {MongoSelector} selector Specifies which documents to modify
 * @param {MongoModifier} modifier Specifies how to modify the documents
 * @param {Object} [options]
 * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
 * @param {Boolean} options.upsert True to insert a document if no matching documents are found.
 * @param {Function} [callback] Optional. If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
 * @returns {String|Number} Returns an inserted document ID or number of document that have been updated.
 */
classMethods.update = function(selector, modifier, options, callback) {
  var Class = this;
  var Collection = Class.getCollection();

  // The options argument is optional and if there are only three arguments,
  // then it may mean that the last argument is a callback function.
  if (arguments.length === 3 && _.isFunction(options)) {
    callback = options;
    options = {};
  }
  // Make sure that options object is created.
  options = options || {};
  // Check validity of selector.
  checkSelector(selector, 'update');

  try {
    // We select one or many documents depending on the "multi" flag.
    var docs;
    if (options.multi) {
      docs = Collection.find(selector);
    } else {
      docs = Collection.find(selector, {
        limit: 1,
      });
    }

    // INSERT.
    if (docs.count() === 0 && options.upsert) {

      // If there are no matching documents and the "upsert" option was set,
      // then we have to insert a new document.
      var doc = new Class();
      // If a selector is ID, then set it on a document.
      if (_.isString(selector)) {
        doc.set('_id', selector);
      // If selector is object, then set all fields from the selector on a
      // document.
      } else if (_.isObject(selector)) {
        doc.set(selector);
      }
      // Execute a modifier on the document.
      doc._executeModifier(modifier);
      // Insert a document.
      doc.save();
      // Execute a callback function if provided.
      if (_.isFunction(callback)) {
        callback(undefined, doc._id);
      }
      // Return result.
      return doc._id;

    // UPDATE.
    } else {

      // Execute a modifier on each document.
      var count = 0;
      docs.forEach(function(doc, i) {
        // Execute a modifier on the document.
        doc._executeModifier(modifier);
        // Run the "forEach" function if exists, i.
        if (_.isFunction(options.forEach) && !options.forEach(doc, i)) {
          return;
        }
        // Update a document.
        count += doc.save();
      });
      // Execute a callback function if provided.
      if (_.isFunction(callback)) {
        callback(undefined, count);
      }
      // Return result.
      return count;

    }
  } catch (e) {
    if (e instanceof Meteor.Error && _.isFunction(callback)) {
      // Execute a callback function with an error.
      callback(e);
    } else {
      // Throw the error again, if we can not handle it.
      throw e;
    }
  }
};

/**
 * @summary Modify one or more documents in the collection, or insert one if no matching documents were found.
 * @locus Anywhere
 * @method upsert
 * @memberOf Astro.BaseClass
 * @class
 * @param {MongoSelector} selector Specifies which documents to modify
 * @param {MongoModifier} modifier Specifies how to modify the documents
 * @param {Object} [options]
 * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
 * @param {Function} [callback] Optional. If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
 * @returns {String|Number} Returns an inserted document ID or number of document that have been updated.
 */
classMethods.upsert = function(selector, modifier, options, callback) {
  var Class = this;

  return Class.update(
    selector,
    modifier,
    _.extend({}, options, {upsert: true}),
    callback
  );
};

/**
 * @summary Remove documents from the collection
 * @locus Anywhere
 * @method remove
 * @memberOf Astro.BaseClass
 * @class
 * @param {MongoSelector} selector Specifies which documents to remove
 * @param {Function} [callback] Optional. If present, called with an error object as its argument.
 * @returns {Number} Returns number of removed documents.
 */
classMethods.remove = function(selector, callback) {
  var Class = this;
  var Collection = Class.getCollection();

  // Check validity of selector.
  checkSelector(selector, 'remove');

  // Select all documents matching selector.
  docs = Collection.find(selector);

  // Try removing each document.
  try {
    var count = 0;
    docs.forEach(function(doc, i) {
      // Remove a document.
      count += doc.remove();
    });
    // Execute a callback function if provided.
    if (_.isFunction(callback)) {
      callback(undefined, count);
    }
    // Return result.
    return count;
  } catch (e) {
    if (e instanceof Meteor.Error && _.isFunction(callback)) {
      // Execute a callback function with an error.
      callback(e);
    } else {
      // Throw the error again, if we can not handle it.
      throw e;
    }
  }
};

_.each(['find', 'findOne'], function(methodName) {
  classMethods[methodName] = function(selector, options) {
    var Class = this;
    var Collection = Class.getCollection();

    selector = selector || {};
    options = options || {};

    // Modify selector and options using the "beforeFind" event handlers.
    var event = new Astro.Event('beforeFind', {
      selector: selector,
      options: options
    });
    event.target = Class;
    Class.emitEvent(event);
    // If a default operation was prevented, then we have to stop here.
    if (event.defaultPrevented) {
      return;
    }

    var result = Collection[methodName](selector, options);

    // Modify a query result using the "afterFind" event handlers.
    var event = new Astro.Event('afterFind', {
      selector: selector,
      options: options,
      result: result
    });
    event.target = Class;
    Class.emitEvent(event);

    return result;
  };
});

var afterInit = function(attrs) {
  var doc = this;
  var Class = doc.constructor;

  doc.set(Class.getTypeField(), Class.getName());
};

Astro.eventManager.on('initClass', function onInitClassStorage() {
  var Class = this;

  // If there is no collection for the class, then we can stop class
  // initialization for the module.
  var Collection = Class.getCollection();
  if (!Collection) {
    return;
  }

  // Prepare an object for storing fields definitions and events list that will
  // extend the current schema.
  var extendDefinition = {
    fields: {},
    events: {}
  };

  // Add the "_id" field.
  if (!Class.hasField('_id')) {
    extendDefinition.fields['_id'] = {
      type: 'string'
    };
  }

  // Add the "type" field, to distinguish to what class we have to cast a
  // document fetched from the collection.
  var typeField = Class.getTypeField();
  if (typeField && !Class.hasField(typeField)) {
    extendDefinition.fields[typeField] = {
      type: 'string'
    }

    // Add the "afterInit" event handler that sets a type field.
    if (!Class.hasEvent('afterInit', afterInit)) {
      extendDefinition.events['afterInit'] = [afterInit];
    }
  }

  // Extend the current schema definition.
  if (
    _.size(extendDefinition.fields) > 0 || _.size(extendDefinition.events) > 0
  ) {
    Class.extend(extendDefinition);
  }

  // Add storage methods to the class prototype.
  _.extend(Class.prototype, prototypeMethods);
  // Add storage methods to the class.
  _.extend(Class, classMethods);
});
