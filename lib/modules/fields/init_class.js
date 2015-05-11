var save = function(callback) {
  // Get collection for given class.
  var Collection = this.constructor.schema.getCollection();
  if (!Collection) {
    throw new Error('There is no collection to save to');
  }

  // Get the "schemas" reference.
  var schemas = this.constructor.schemas;

  // Flag indicating whether we should update or insert document.
  var update = !!this._values._id;

  // Get values to update or insert.
  var values = update ? this.getModified() : this.get();
  // Remove "_id" field, if its value is null (object is new and have not been
  // saved yet) or it's not null but "update" flag is set what means that we are
  // updating document.
  if (!values['_id'] || update) {
    values = _.omit(values, '_id');
  }

  // Check if there are any values to update or insert. If there are no modified
  // fields, we shouldn't do anything.
  if (_.size(values) === 0) {
    return false;
  }

  // Trigger "beforesave" event handlers on current and parent schemas.
  Astro.eventManager.emit('beforesave', new Astro.EventData(null), this);
  // Trigger "beforeinsert" or "beforeupdate" event handlers on current and
  // parent schemas.
  Astro.eventManager.emit(
    update ? 'beforeupdate' : 'beforeinsert',
    new Astro.EventData(null),
    this
  );

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

  // Trigger "afterinsert" or "afterupdate" event handlers on current and
  // parent schemas.
  Astro.eventManager.emit(
    update ? 'afterupdate' : 'afterinsert',
    new Astro.EventData(null),
    this
  );
  // Trigger "aftersave" event handlers on current and parent schemas.
  Astro.eventManager.emit('aftersave', new Astro.EventData(null), this);

  // Init instance with modified values.
  fieldsOnInitInstance.call(this, this._values);

  // Return result of executing Mongo query.
  return result;
};

var remove = function(callback) {
  // Get collection for given class or parent class.
  var Collection = this.constructor.schema.getCollection();
  if (!Collection) {
    throw new Error('There is no collection to remove from');
  }

  // Remove only when document has _id, so it's saved in the collection.
  if (!this._values._id) {
    return;
  }

  // Trigger "beforeremove" event handlers on current and parent schemas.
  Astro.eventManager.emit('beforeremove', new Astro.EventData(null), this);

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

  // Trigger "afterremove" event handlers on current and parent schemas.
  Astro.eventManager.emit('afterremove', new Astro.EventData(null), this);

  // Clear "_id" attribute, so that user can save document one more time.
  this._values._id = undefined;

  // Return result of removing document.
  return result;
};

var reload = function() {
  // Get collection for given class or parent class.
  var Collection = this.constructor.schema.getCollection();
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

var clone = function(attrs, save) {
  save = save || false;

  // Get object constructor.
  var Class = this.constructor;
  // Create new instance.
  var cloned = new Class();

  // Copy values and modified values but without "_id" field.
  cloned._values = EJSON.clone(_.omit(this._values, '_id'));
  cloned._original = EJSON.clone(_.omit(this._original, '_id'));

  // Apply new values if provided.
  if (_.isObject(attrs)) {
    _.extend(cloned, attrs);
  }

  // Save clone to collection.
  if (save) {
    cloned.save();
  }

  return cloned;
};

var getFieldsNames = function() {
  // Get list of all fields defined in this and parent schemas.
  var fieldsNames = [];

  _.each(this.constructor.schemas, function(schema) {
    fieldsNames = fieldsNames.concat(_.keys(schema.getFields()));
  });

  return fieldsNames;
};

var getFieldValue = function(fieldName) {
  // Look for field's definition and schema. Field definition can be places in
  // this or parent schema.
  var fieldDefinition;
  var schema = _.find(this.constructor.schemas, function(schema) {
    return fieldDefinition = schema.getField(fieldName);
  });

  // If field's definition is not present then we just return "undefined".
  if (!fieldDefinition) {
    return value;
  }

  // Look for value in the "_values" object.
  if (_.has(this._values, fieldName)) {

    value = this._values[fieldName];

  } else {

    // If value is not present in the "_values" objects then we have to look for
    // default value in the field's definition. We have to use the "EJSON.clone"
    // method to make sure that the value being set is a copy of default value
    // and not a reference.
    value = EJSON.clone(fieldDefinition.default);

    // At the same time, we can set value for that field in the "_values" object
    // so that getting this value in the future won't required checking its
    // default value.
    this._values[fieldName] = value;
  }
};

var getOne = function(fieldName) {
  // Trigger the "beforeget" event handlers for every schema.
  Astro.eventManager.emit('beforeget', new Astro.EventData({
    field: fieldName
  }), this);

  // Get current or default field's value.
  var value = getFieldValue.call(this, fieldName);

  // Trigger the "afterget" event handlers for every schema.
  Astro.eventManager.emit('afterget', new Astro.EventData({
    field: fieldName
  }), this);

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
  return this.get(getFieldsNames.call(this));
};

var get = function() {
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

var setOne = function(fieldName, value) {
  // Deny changing _id of a document.
  if (fieldName === '_id' && this._values[fieldName]) {
    return;
  }

  // Loop through all parent schemas including this one and get field definition
  // in the first schema that has given field defined. We will also get schema
  // in which field is defined. It will be used to invoke events.
  var fieldDefinition;
  var schema = _.find(this.constructor.schemas, function(schema) {
    return fieldDefinition = schema.getField(fieldName);
  });

  // If there is no field definition then do not set field's value.
  if (!fieldDefinition) {
    return;
  }

  // Trigger the "beforeset" event handlers for every schema.
  Astro.eventManager.emit(
    'beforeset',
    new Astro.EventData({
      field: fieldName,
      value: value
    }),
    this
  );

  // The value being set has to be casted on the type defined in the schema.
  value = Astro.Utils.cast(fieldDefinition.type, value);

  // We just set a new value without checking if the new value differs from the
  // old one.
  this._values[fieldName] = value;

  // Trigger the "afterset" event handlers for every schema.
  Astro.eventManager.emit(
    'afterset',
    new Astro.EventData({
      field: fieldName,
      value: value
    }),
    this
  );
};

var set = function() {
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

var getModified = function(old) {
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

fieldsOnInitClass = function() {
  this.prototype.set = set;
  this.prototype.get = get;
  this.prototype.getModified = getModified;
  this.prototype.save = save;
  this.prototype.remove = remove;
  this.prototype.reload = reload;
  this.prototype.clone = clone;
};
