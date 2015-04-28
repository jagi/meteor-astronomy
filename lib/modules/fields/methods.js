methods = {};

methods.save = function(callback) {
  // Get schema for given object.
  var schema = this.constructor.schema;
  // Get collection for given class or parent class.
  var Collection = schema.getCollection();
  if (!Collection) {
    throw new Error('There is no collection to save to');
  }
  // Flag indicating whether we should update or inster document.
  var update = !!this._values._id;

  // Trigger beforeSave event handlers.
  schema.triggerEvent('beforeSave', this, true);
  // Trigger beforeInsert and beforeUpdate events handlers.
  if (update) {
    schema.triggerEvent('beforeUpdate', this, true);
  } else {
    schema.triggerEvent('beforeInsert', this, true);
  }

  // Get values to update or insert.
  var values = update ? this.getModified() : this.get();
  // Get only values that have been defined in this and parent classes. Remove
  // _id field if its value is null or we are updating document.
  var fields = schema.getFieldsNames(true);
  if (!values['_id'] || update) {
    fields = _.without(fields, '_id');
  }
  values = _.pick(values, fields);

  // Check if there are any values to update or insert. Especially necessary
  // when updating. If there are no modified fields, we shouldn't do anything.
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
    args.unshift({ // Selector.
      _id: this._values._id
    }, { // Modifier.
      $set: values
    });
    result = Collection.update.apply(Collection, args);
  } else {
    args.unshift(values);
    result = this._values._id = Collection.insert.apply(Collection, args);
  }

  // Trigger afterInsert and afterUpdate events handlers.
  if (update) {
    schema.triggerEvent('afterUpdate', this, true);
  } else {
    schema.triggerEvent('afterInsert', this, true);
  }
  // Trigger afterSave event handlers.
  schema.triggerEvent('afterSave', this, true);

  // Update values with new ones.
  _.extend(this._values, values);
  // Clear modified fields.
  this._modified = {};

  return result;
};

methods.remove = function(callback) {
  var schema = this.constructor.schema;
  var args = [];

  // Get collection for given class or parent class.
  var Collection = schema.getCollection();
  if (!Collection) {
    throw new Error('There is no collection to remove from');
  }
  // Remove only when document has _id, so it's saved in the collection.
  if (!this._values._id) {
    return;
  }

  // Trigger beforeRemove event handlers.
  schema.triggerEvent('beforeRemove', this, true);

  // Add selector.
  args.push({
    _id: this._values._id
  });
  // Add callback to arguments list if provided.
  if (callback) {
    args.push(callback);
  }
  // Remove document.
  var result = Collection.remove.apply(Collection, args)

  // Trigger afterRemove event handlers.
  schema.triggerEvent('afterRemove', this, true);

  this._values['_id'] = null;

  return result;
};

/**
 * Reloads document from collection (if present).
 */
methods.reload = function() {
  // Get collection for given class or parent class.
  var Collection = this.constructor.schema.getCollection();
  if (!Collection) {
    throw new Error('There is no collection to reload document from');
  }
  if (this._values._id) {
    // Get new values from collection without the transformation.
    this._values = Collection.findOne(this._values._id, {
      transform: null
    }) || this._values;
    // Clear modified fields list.
    this._modified = {};
  }
};

methods.clone = function(attrs, save) {
  save = save || false;
  // Get object constructor.
  var Class = this.constructor;
  // Create new instance.
  var cloned = new Class();
  // Copy values and modified values but without "_id" field.
  cloned._values = EJSON.clone(_.omit(this._values, '_id'));
  cloned._modified = EJSON.clone(_.omit(this._modified, '_id'));
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

var getOne = function(fieldName) {
  // We can't return "null" value of "_id" field because it will fail to
  // save document.
  if (fieldName === '_id' && !this._values['_id']) {
    return;
  }

  if (_.has(this._modified, fieldName)) {
    // Look for value in "_modified" property.
    return this._modified[fieldName];
  } else if (_.has(this._values, fieldName)) {
    // Look for value in "_values" property.
    return this._values[fieldName];
  } else {
    // Look for default value in fields definitions. Field definition can be
    // places in the schema of some parent class, so we have to look up the
    // inheritance tree.
    var value;
    var fieldDefinition;
    var schema = _.find(this.constructor.schemas, function(schema) {
      return fieldDefinition = schema.getField(fieldName);
    });

    // Trigger "beforeGet" event handlers.
    schema.triggerEvent('beforeGet', this, true, [fieldName]);

    // If field definition was found, then return default value for the field.
    if (fieldDefinition) {
      value = fieldDefinition.default;
    }

    // Trigger "afterGet" event handlers.
    schema.triggerEvent('afterGet', this, true, [fieldName]);

    return value;
  }
};

var getMany = function(fieldsNames) {
  var values = {};

  _.each(fieldsNames, function(fieldName) {
    var value = this.get(fieldName);
    // We can't return "null" value of "_id" field because it will fail to
    // save document. We are checking this also in the "getOne" function but,
    // we have to repeat this check here because "undefined" is also not correct
    // value.
    if (fieldName === '_id' && !value) {
      return;
    }

    values[fieldName] = value;
  }, this);

  return values;
};

var getAll = function() {
  // Get list of all fields defined in this and parent schemas. "_.map" function
  // returns array of arrays of fields, so we have to flatten it to plain array.
  var fieldsNames = _.flatten(_.map(this.constructor.schemas, function(schema) {
    return _.keys(schema.getFields());
  }));

  // Get list of fields and their values.
  return this.get(fieldsNames);
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

  // Trigger "beforeSet" event handlers.
  schema.triggerEvent('beforeSet', this, true, [fieldName, value]);

  // The value being set has to be casted on the type defined in the schema.
  // We have to check in which parent schema given field is defined.
  if (fieldDefinition.type) {
    value = Types[fieldDefinition.type](value);
  }

  // Check if given value exists in the "_values" object and whether it
  // differs from old value.
  if (this._values[fieldName] && value === this._values[fieldName]) {
    return;
  }

  // Set new value.
  this._modified[fieldName] = value;

  // Trigger "afterSet" event handlers.
  schema.triggerEvent('afterSet', this, true, [fieldName, value]);
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

methods.getModified = function(old) {
  old = old || false;

  // Get values for modified fields before modification.
  if (old) {
    // Get keys of modified values.
    var modifiedKeys = _.keys(this._modified);
    // Get old values for modified fields.
    var oldValues = _.pick(this._values, modifiedKeys);
    // Get keys of old values that are present in the given instance. If there
    // are some missing values, then get them from default values, from schemas.
    var oldValuesKeys = _.keys(oldValues);
    if (modifiedKeys.length !== oldValuesKeys.length) {
      var missingKeys = _.difference(modifiedKeys, oldValuesKeys);
      _.each(missingKeys, function(missingKey) {
        var Class = this.constructor;
        do {
          var schema = Class.schema;
          value = schema.getField(missingKey);
          if (!_.isUndefined(value)) {
            oldValues[missingKey] = value;
            break;
          }
          Class = schema.getParentClass();
        } while (Class);
      }, this);
    }

    return oldValues;
  }

  return this._modified;
};

methods.toJSON = function() {
  return this.get(this.constructor.schema.getFieldsNames(true));
};
