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

  // Trigger "beforeSave" event handlers on the current and parent classes.
  var event = new Astro.Event('beforeSave');
  event.target = doc;
  Class.emitEvent(event);

  // If user prevented default operation, then we have to stop here.
  if (event.defaultPrevented) {
    return;
  }

  // Set the flag indicating whether we are updating a document.
  var isUpdating = !doc._isNew;

  // Trigger "beforeInsert" or "beforeUpdate" event handlers on the current
  // and parent classes.
  event = new Astro.Event(isUpdating ? 'beforeUpdate' : 'beforeInsert');
  event.target = doc;
  Class.emitEvent(event);

  // If user prevented default operation, then we have to stop here.
  if (event.defaultPrevented) {
    return;
  }

  // Get values to update or insert.
  var values;
  if (doc._isNew) {
    values = doc._getAll({
      cast: false,
    });
  } else {
    values = doc._getModifiedValues(false, {
      cast: false,
    });
  }

  // Get a value of the "_id" field.
  var id = doc._id;

  // Remove the "_id" field from the fields names list. We can only allow
  // saving the "_id" field, if it's a new doc with provided id. It means that
  // the developer wants that.
  if (!(values._id && doc._isNew)) {
    fieldsNames = _.without(fieldsNames, '_id');
  }

  // Pick only the values that the developer wants to save.
  values = _.pick(values, fieldsNames);

  // Modify fields list to only those that are present in the values.
  fieldsNames = _.keys(values);

  // Check if there are any values to update or insert. If there are no
  // modified fields, we shouldn't do anything.
  if (_.size(values) === 0) {
    return;
  }

  // Add callback to arguments list if provided.
  var args = [];
  if (_.isFunction(callback)) {
    args.push(callback);
  }

  // Get collection for given class or parent class.
  var Collection = Class.getCollection();

  var result;
  if (isUpdating) {
    // Add selector and modifier at the beginning of the arguments list. Right
    // now in the array is a callback function (if provided).
    args.unshift({ // Selector.
      _id: id,
    }, { // Modifier.
      $set: values,
    });

    // Update document.
    result = Collection.update.apply(Collection, args);
  } else {
    // Add values to insert into the list of arguments passed to the "insert"
    // method.
    args.unshift(values);

    // Insert document.
    doc._id = result = Collection.insert.apply(Collection, args);
  }

  // Change the "_isNew" flag to "false". Now the document is not new, it has
  // just been saved.
  doc._isNew = false;

  // Trigger "afterInsert" or "afterUpdate" event handlers on the current and
  // parent classes.
  var event = new Astro.Event(isUpdating ? 'afterUpdate' : 'afterInsert');
  event.target = doc;
  Class.emitEvent(event);

  // Trigger "afterSave" event handlers on the current and parent classes.
  var event = new Astro.Event('afterSave');
  event.target = doc;
  Class.emitEvent(event);

  // Copy all values to the "_original" property so that we are starting with
  // the clean object without modifications (there is no diff between current
  // values and "_original").
  doc._original = _.extend(doc._original, EJSON.clone(
    doc._getMany(fieldsNames)
  ));

  // Return result of executing Mongo query.
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
    // Create an empty object for a modifier for the given document.
    var docModifier = {};

    if (modifier.$set) {
      doc.set(modifier.$set);

      // Rewrite casted values back to the modifier.
      docModifier.$set = {};
      _.each(modifier.$set, function(fieldValue, fieldName) {
        docModifier.$set[fieldName] = doc.get(fieldName);
      });
    }

    if (modifier.$push) {
      doc.push(modifier.$push);

      // Rewrite casted values back to the modifier.
      docModifier.$push = {};
      _.each(modifier.$push, function(fieldValue, fieldName) {
        var array = doc.get(fieldName);
        docModifier.$push[fieldName] = array[array.length - 1];
      });
    }

    Collection.update(doc._id, docModifier, {}, callback);
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
