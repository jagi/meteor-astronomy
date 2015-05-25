var methods = {};

var setOne = function(fieldName, fieldValue) {
  // Deny changing _id of a document.
  if (fieldName === '_id' && this._values[fieldName]) {
    return;
  }

  // Trigger the "beforeset" event handlers for every schema.
  var event = new Astro.Event('beforeset', {
    field: fieldName,
    value: fieldValue
  });
  event.target = this;
  this.constructor.emitEvent(event);

  Astro.utils.setFieldValue(this, fieldName, fieldValue);

  // Trigger the "afterset" event handlers for every schema.
  var event = new Astro.Event('afterset', {
    field: fieldName,
    value: fieldValue
  });
  event.target = this;
  this.constructor.emitEvent(event);
};

methods.set = function() {
  if (arguments.length === 1 && _.isObject(arguments[0])) {
    // Set multiple fields.
    _.each(arguments[0], function(value, fieldName) {
      // We don't call "setOne" function directly because we want to check
      // arguments' types.
      this.set(fieldName, value);
    }, this);
  } else if (arguments.length === 2 && _.isString(arguments[0])) {
    setOne.apply(this, arguments);
  }
};

var getOne = function(fieldName) {
  // Trigger the "beforeget" event handlers for every schema.
  var event = new Astro.Event('beforeget', {
    field: fieldName
  });
  event.target = this;
  this.constructor.emitEvent(event);

  // Get current or default field's value.
  var value = Astro.utils.getFieldValue(this, fieldName);

  // Trigger the "afterget" event handlers for every schema.
  var event = new Astro.Event('afterget', {
    field: fieldName
  });
  event.target = this;
  this.constructor.emitEvent(event);

  return value;
};

var getMany = function(fieldsNames) {
  var values = {};

  _.each(fieldsNames, function(fieldName) {
    var value = this.get(fieldName);
    values[fieldName] = value;
  }, this);

  return values;
};

var getAll = function() {
  // Get list of fields and their values.
  return this.get(Astro.utils.getAllFieldsNames(this));
};

methods.get = function() {
  if (arguments.length === 0) {
    return getAll.call(this);
  } else if (arguments.length === 1) {
    if (_.isArray(arguments[0])) {
      return getMany.apply(this, arguments);
    } else if (_.isString(arguments[0])) {
      return getOne.apply(this, arguments);
    }
  }
};

methods.getModified = function(old) {
  old = old || false;

  var modified = {};

  _.each(this._values, function(fieldValue, fieldName) {
    // If a value in the "_values" object differs from the value in the
    // "_original" object using "EJSON.equals" method then it means that fields
    // was modified from the last save.
    if (!EJSON.equals(this._original[fieldName], fieldValue)) {
      // Decide if we want to take new or old value.
      if (old) {
        modified[fieldName] = this._original[fieldName];
      } else {
        modified[fieldName] = fieldValue;
      }
    }
  }, this);

  return modified;
};

methods.save = function(callback) {
  // Get collection for given class.
  var Collection = this.constructor.getCollection();
  if (!Collection) {
    throw new Error('There is no collection to save to');
  }

  // Flag indicating whether we should update or insert document.
  var update = !!this._values._id;
  // Trigger "beforesave" event handlers on the current and parent classes.
  var event = new Astro.Event('beforesave');
  event.target = this;
  this.constructor.emitEvent(event);
  // Trigger "beforeinsert" or "beforeupdate" event handlers on the current and
  // parent classes.
  event = new Astro.Event(update ? 'beforeupdate' : 'beforeinsert');
  event.target = this;
  this.constructor.emitEvent(event);

  // Get values to update or insert.
  var values;
  if (update) {
    values = this.getModified();
  } else {
    values = Astro.utils.getAllFieldsValues(this);
  }

  // Remove the "_id" field, if its value is empty (an object is new and have
  // not been saved yet) or it's not empty but the "update" flag is set what
  // means that we are updating a document.
  if (!values._id || update) {
    values = _.omit(values, '_id');
  }

  // Check if there are any values to update or insert. If there are no modified
  // fields, we shouldn't do anything.
  if (_.size(values) === 0) {
    return false;
  }

  // Add callback to arguments list if provided.
  var args = [];
  if (callback) {
    args.push(callback);
  }

  var result;
  if (update) {
    // Add selector and modifier at the beginning of the arguments list. Right
    // now in the array is a callback function (if provided).
    args.unshift({ // Selector.
      _id: this._values._id
    }, { // Modifier.
      $set: values
    });
    // Update document.
    result = Collection.update.apply(Collection, args);
  } else {
    // Add values to insert into the list of arguments passed to the "insert"
    // method.
    args.unshift(values);
    // Insert document.
    result = this._values._id = Collection.insert.apply(Collection, args);
  }

  // Copy values from the "_values" object to "_original" so that we are
  // starting with the clean object without modifications (there is no diff
  // between "_values" and "_original").
  this._original = EJSON.clone(this._values);

  // Trigger "afterinsert" or "afterupdate" event handlers on the current and
  // parent classes.
  var event = new Astro.Event(update ? 'afterupdate' : 'afterinsert');
  event.target = this;
  this.constructor.emitEvent(event);
  // Trigger "aftersave" event handlers on the current and parent classes.
  var event = new Astro.Event('aftersave');
  event.target = this;
  this.constructor.emitEvent(event);

  // Return result of executing Mongo query.
  return result;
};

methods.remove = function(callback) {
  // Get collection for given class or parent class.
  var Collection = this.constructor.getCollection();
  if (!Collection) {
    throw new Error('There is no collection to remove from');
  }

  // Remove only when document has _id, so it's saved in the collection.
  if (!this._values._id) {
    return;
  }

  // Trigger "beforeremove" event handlers on the current and parent classes.
  var event = new Astro.Event('beforeremove');
  event.target = this;
  this.constructor.emitEvent(event);

  // Add selector to arguments list.
  var args = [];
  args.push({
    _id: this._values._id
  });
  // Add callback to arguments list if provided.
  if (callback) {
    args.push(callback);
  }

  // Remove document and save result.
  var result = Collection.remove.apply(Collection, args);

  // Trigger "afterremove" event handlers on the current and parent classes.
  var event = new Astro.Event('afterremove');
  event.target = this;
  this.constructor.emitEvent(event);

  // Clear "_id" attribute, so that user can save document one more time.
  this._values._id = undefined;

  // Return result of removing document.
  return result;
};

methods.reload = function() {
  // Get collection for given class or parent class.
  var Collection = this.constructor.getCollection();
  if (!Collection) {
    throw new Error('There is no collection to reload the document from');
  }

  // The document has to be already saved in the collection.
  if (this._values._id) {
    // Get new values from collection without the transformation.
    var attrs = Collection.findOne(this._values._id, {
      transform: null
    });

    // Init instance with the new values from the collection.
    fieldsInitInstance.call(this, attrs);
  }
};

methods.copy = function(save) {
  save = save || false;

  // Use EJSON to clone object.
  var copy = EJSON.clone(this);

  // Remove the "_id" value so that it will save the object as a new document
  // instead updating the old one.
  delete copy._values._id;
  delete copy._original._id;

  if (save) {
    copy.save();
  }

  return copy;
};

fieldsOnInitModule = function() {
  _.extend(Astro.BaseClass.prototype, methods);
};
