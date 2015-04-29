methods = {};

methods.save = function(callback) {
  // Get collection for given class.
  var Collection = this.constructor.schema.getCollection();
  if (!Collection) {
    throw new Error('There is no collection to save to');
  }

  // Flag indicating whether we should update or insert document.
  var update = !!this._values._id;

  // Trigger "beforeSave", "beforeInsert" and "beforeUpdate" event handlers on
  // current and parent schemas.
  _.each(this.constructor.schemas, function(schema) {
    schema.triggerEvent('beforeSave', this, true);
    if (update) {
      schema.triggerEvent('beforeUpdate', this, true);
    } else {
      schema.triggerEvent('beforeInsert', this, true);
    }
  }, this);

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

  // Trigger "afterSave", "afterInsert" and "afterUpdate" event handlers on
  // current and parent schemas.
  _.each(this.constructor.schemas, function(schema) {
    if (update) {
      schema.triggerEvent('afterUpdate', this, true);
    } else {
      schema.triggerEvent('afterInsert', this, true);
    }
    // Trigger afterSave event handlers.
    schema.triggerEvent('afterSave', this, true);
  }, this);

  // Update values with new ones.
  _.extend(this._values, values);

  // Clear modified fields.
  this._modified = {};

  // Return result of executing Mongo query.
  return result;
};

methods.remove = function(callback) {
  // Get collection for given class or parent class.
  var Collection = this.constructor.schema.getCollection();
  if (!Collection) {
    throw new Error('There is no collection to remove from');
  }

  // Remove only when document has _id, so it's saved in the collection.
  if (!this._values._id) {
    return;
  }

  // Trigger "beforeRemove" event handlers on current and parent schemas.
  _.each(this.constructor.schemas, function(schema) {
    schema.triggerEvent('beforeRemove', this, true);
  }, this);

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

  // Trigger "afterRemove" event handlers on current and parent schemas.
  _.each(this.constructor.schemas, function(schema) {
    schema.triggerEvent('afterRemove', this, true);
  }, this);

  // Clear "_id" attribute, so that user can save document one more time.
  this._values['_id'] = undefined;

  // Return result of removing document.
  return result;
};

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
  // Define var for returned value.
  var value;

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

  // Trigger "beforeGet" event handlers.
  schema.triggerEvent('beforeGet', this, true, [fieldName]);

  if (_.has(this._modified, fieldName)) {

    // Look for value in "_modified" property.
    value = this._modified[fieldName];

  } else if (_.has(this._values, fieldName)) {

    // Look for value in "_values" property.
    value = this._values[fieldName];

  } else {

    // If seek value is not present in the "_values" and "_modified" objects
    // then we have to look for default value in the field's definition.
    // We have to use the EJSON "clone" method to make sure that value being set
    // is a copy of default value and not a reference. At this stage it's
    // important to have defined custom types for EJSON thanks to which it will
    // be possible to clone any non standard value.
    value = EJSON.clone(fieldDefinition.default);

    // At the same time, we can set the default value for that field in the
    // "_values" object so that checking for default value won't be needed any
    // more.
    this._values[fieldName] = value;
  }

  // Trigger "afterGet" event handlers.
  schema.triggerEvent('afterGet', this, true, [fieldName]);

  return value;
};

var getMany = function(fieldsNames) {
  var values = {};

  _.each(fieldsNames, function(fieldName) {
    values[fieldName] = this.get(fieldName);
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

  // Get values of modified fields before modification.
  if (old) {
    // Get keys of modified values.
    var modifiedKeys = _.keys(this._modified);

    // Get old values of modified fields.
    var oldValues = _.pick(this._values, modifiedKeys);

    // Get keys of old values that are present in the given instance. It will be
    // needed to check if all old values have been fetched.
    var oldValuesKeys = _.keys(oldValues);

    // Check whether number of modified fields equals number of old values. If
    // there are some missing old values, then we have to get their default
    // values from this and parent schemas.
    if (modifiedKeys.length !== oldValuesKeys.length) {
      // Get difference in old and modified fields.
      var missingKeys = _.difference(modifiedKeys, oldValuesKeys);

      // For each missing field try getting its default value.
      _.each(missingKeys, function(missingKey) {

        // Look in all schemas for missing field.
        _.find(this.constructor.schemas, function(schema) {
          // If field is defined in given schema.
          if (schema.hasField(missingKey)) {
            // Then get its default value.
            oldValues[missingKey] = schema.getField(missingKey).default;
            return true;
          }
        });

      }, this);
    }

    return oldValues;
  }

  return this._modified;
};
