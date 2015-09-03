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
    return;
  }
  // Trigger "beforeInsert" or "beforeUpdate" event handlers.
  event = new Astro.Event(inserting ? 'beforeInsert' : 'beforeUpdate');
  event.target = doc;
  Class.emitEvent(event);
  // If user prevented default operation, then we have to stop here.
  if (event.defaultPrevented) {
    return;
  }

  // Prepare a variable for storing a Mongo query result.
  var result;

  if (inserting) {
    // Inserting.

    // Get plain values of all fields.
    var values = doc._getAll({
      cast: false,
    });
    // Pick only these values that we want to save.
    values = _.pick(values, fieldsNames);
    // Insert a document.
    result = doc._id = Collection.insert(values, callback);

  } else {
    // Updating.

    // Get a modifier.
    var modifier = doc._getModifier();
    // Get a document's id.
    var id = doc._id;
    // Update a document only if there is anything to update.
    if (_.size(modifier) > 0) {
      console.log(EJSON.stringify(modifier, {indent: true}));
      result = Collection.update(id, modifier, callback);
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
  doc._modifier = {};

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

  // Remove only when document has the "_id" field (it's persisted).
  var id = doc._id;
  if (!id) {
    return;
  }

  // Trigger "beforeRemove" event handlers on the current and parent classes.
  var event = new Astro.Event('beforeRemove');
  event.target = doc;
  Class.emitEvent(event);

  // If user prevented default operation, then we have to stop here.
  if (event.defaultPrevented) {
    return;
  }

  // Add selector to arguments list.
  var args = [];
  args.push({
    _id: id,
  });

  // Add callback to arguments list if provided.
  if (callback) {
    args.push(callback);
  }

  // Get collection for given class or parent class.
  var Collection = Class.getCollection();

  // Remove document and save result.
  var result = Collection.remove.apply(Collection, args);

  // Trigger "afterRemove" event handlers on the current and parent classes.
  var event = new Astro.Event('afterRemove');
  event.target = doc;
  Class.emitEvent(event);

  // Clear "_id" attribute and "_original" object, so that user can save
  // document one more time.
  doc._id = null;
  doc._original = {};

  // Return result of removing document.
  return result;
};

prototypeMethods.reload = function() {
  var doc = this;
  var Class = doc.constructor;

  // Get collection for given class or parent class.
  var Collection = Class.getCollection();

  // The document has to be already saved in the collection.
  var id = doc._id;
  if (id) {
    // Get new values from collection without the transformation.
    var attrs = Collection.findOne(id, {
      transform: null,
    });

    // Init instance with the new values from the collection.
    Astro.BaseClass.call(doc, attrs);

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

  var doc = new Class(doc);
  doc.save();
};

/**
 * @summary Updates documents in the collection.
 * @return
 * @locus update
 * @method insert
 * @memberOf Astro.BaseClass
 * @class
 * @param {MongoSelector} selector Specifies which documents to modify
 * @param {MongoModifier} modifier Specifies how to modify the documents
 * @param {Object} [options]
 * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
 * @param {Boolean} options.upsert True to insert a document if no matching documents are found.
 * @param {Function} [callback] Optional. If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
 * @returns {Number} Returns number of documents that have been modified.
 */
classMethods.update = function(selector, modifier, options, callback) {
  var Class = this;
  var Collection = Class.getCollection();

  // The options argument is optional and if there are only three arguments,
  // then it may mean that the last argument is a callback function not options.
  if (arguments.length === 3 && _.isFunction(options)) {
    callback = options;
    options = {};
  }

  // Make sure that options object is created.
  options = options || {};

  // We select one or many documents depending on the "multi" flag.
  var docs;
  if (options.multi) {
    docs = Collection.find(selector);
  } else {
    docs = Collection.find(selector, {
      limit: 1,
    });
  }

  // Execute each modifier on a document.
  docs.forEach(function(doc) {
    // Execute a modifier on the document.
    doc._executeModifier(modifier);

    // Update a document.
    doc.save(callback);
  });
};

classMethods.remove = function() {
};

var afterInit = function(attrs) {
  var doc = this;
  var Class = doc.constructor;

  doc.set(Class.getTypeField(), Class.getName());
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  var Class = this;

  // Create an object storing information about classes names connected to the
  // given collection and the "type" field.
  var Collection = Class.getCollection();
  if (!Collection) {
    return;
  }

  // Add storage methods to the class prototype.
  _.extend(Class.prototype, prototypeMethods);

  // Add storage methods to the class.
  _.extend(Class, classMethods);

  // Add the "_id" field.
  if (!Class.hasField('_id')) {
    Class.addField('_id', {
      type: 'string',
    });
  }

  // Add the "type" field, to distinguish to what class we have to cast a
  // document fetched from the collection.
  var typeField = Class.getTypeField();
  if (!typeField) {
    return;
  }

  if (!Class.hasField(typeField)) {
    Class.addField(typeField, {
      type: 'string',
    });
  }

  if (!Class.hasEvent('afterInit', afterInit)) {
    Class.addEvent('afterInit', afterInit);
  }
});
