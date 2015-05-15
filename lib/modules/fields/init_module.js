fieldsOnInitModule = function() {
  var schemaProto = Astro.Schema.prototype;

  schemaProto.hasField = function(fieldName) {
    if (!_.isString(fieldName)) {
      return;
    }

    return _.has(this._fields, fieldName);
  };

  schemaProto.getField = function(fieldName) {
    if (!_.isString(fieldName)) {
      return;
    }

    return this._fields[fieldName];
  };

  schemaProto.getFields = function() {
    return this._fields;
  };

  schemaProto.addField = function(fieldName, fieldDefinition) {
    // Check if a field name had been provided and is a string.
    if (!_.isString(fieldName)) {
      throw new Error(
        'The field name in the "' + this.getName() + '" class schema has to ' +
        'be a string'
      );
    }

    // Check if a field with the given name had already been defined.
    if (_.has(this._fields, fieldName)) {
      throw new Error(
        'The "' + fieldName + '" field had already been defined in the "' +
        this.getName() + '" class schema'
      );
    }

    if (_.isUndefined(fieldDefinition)) {

      // If "fieldDefinition" is an "undefined" then set "type" and "default" to null.
      fieldDefinition = {
        type: null,
        default: null
      };

    } else if (_.isString(fieldDefinition)) {

      // If "fieldDefinition" is a "string" then set it as a type if given type
      // exists.
      fieldDefinition = {
        type: fieldDefinition,
        default: null
      };

    } else if (_.isObject(fieldDefinition)) {

      // If "fieldDefinition" is an "object" then pick the "type" and "default"
      // attributes.
      fieldDefinition = {
        type: fieldDefinition.type || null,
        default: fieldDefinition.default || null
      };

    } else {
      throw new Error(
        'The field definition in the "' + this.getName() + '" class schema ' +
        'has to be a string, an object or left empty'
      );
    }

    // Check whether given field type exists.
    if (fieldDefinition.type !== null && !_.has(Types, fieldDefinition.type)) {
      throw new Error(
        'The "' + fieldDefinition.type + '" field type for "' + fieldName +
        '" field in the "' + this.getName() + '" class schema does not exist'
      );
    }

    // Add field definition to the schema.
    this._fields[fieldName] = fieldDefinition;

    // Define setter and getter for the field.
    Object.defineProperty(this.getClass().prototype, fieldName, {
      get: function() {
        return this.get(fieldName);
      },
      set: function(value) {
        this.set(fieldName, value);
      }
    });
  };

  schemaProto.addFields = function(fields) {
    if (_.isArray(fields)) {

      _.each(fields, function(fieldName) {
        this.addField(fieldName);
      }, this);

    } else if (_.isObject(fields)) {

      _.each(fields, function(fieldDefinition, fieldName) {
        this.addField(fieldName, fields[fieldName]);
      }, this);

    } else {

      // Fields definition has to be an object or an array.
      throw new Error(
        'The fields definition in the "' + this.getName() + '" class schema ' +
        'has to be an array or an object'
      );

    }
  };

  var baseClassProto = Astro.BaseClass.prototype;

  var setOne = function(fieldName, fieldValue) {
    // Deny changing _id of a document.
    if (fieldName === '_id' && this._values[fieldName]) {
      return;
    }

    // Trigger the "beforeset" event handlers for every schema.
    Astro.eventManager.emit(
      'beforeset',
      new Astro.EventData({
        field: fieldName,
        value: fieldValue
      }),
      this
    );

    Astro.Utils.setFieldValue.call(this, fieldName, fieldValue);

    // Trigger the "afterset" event handlers for every schema.
    Astro.eventManager.emit(
      'afterset',
      new Astro.EventData({
        field: fieldName,
        value: fieldValue
      }),
      this
    );
  };

  baseClassProto.set = function() {
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
    Astro.eventManager.emit('beforeget', new Astro.EventData({
      field: fieldName
    }), this);

    // Get current or default field's value.
    var value = Astro.Utils.getFieldValue.call(this, fieldName);

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
    return this.get(Astro.Utils.getAllFieldsNames.call(this));
  };

  baseClassProto.get = function() {
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

  baseClassProto.getModified = function(old) {
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

  baseClassProto.save = function(callback) {
    // Get collection for given class.
    var Collection = this.constructor.schema.getCollection();
    if (!Collection) {
      throw new Error('There is no collection to save to');
    }

    // Flag indicating whether we should update or insert document.
    var update = !!this._values._id;
    // Trigger "beforesave" event handlers on current and parent schemas.
    Astro.eventManager.emit('beforesave', new Astro.EventData(null), this);
    // Trigger "beforeinsert" or "beforeupdate" event handlers on current and
    // parent schemas.
    Astro.eventManager.emit(
      update ? 'beforeupdate' : 'beforeinsert',
      new Astro.EventData(null),
      this
    );

    // Get values to update or insert.
    var values;
    if (update) {
      values = this.getModified();
    } else {
      values = Astro.Utils.getAllFieldsValues.call(this);
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

    // Trigger "afterinsert" or "afterupdate" event handlers on current and
    // parent schemas.
    Astro.eventManager.emit(
      update ? 'afterupdate' : 'afterinsert',
      new Astro.EventData(null),
      this
    );
    // Trigger "aftersave" event handlers on current and parent schemas.
    Astro.eventManager.emit('aftersave', new Astro.EventData(null), this);

    // Return result of executing Mongo query.
    return result;
  };

  baseClassProto.remove = function(callback) {
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

  baseClassProto.reload = function() {
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

  baseClassProto.copy = function(save) {
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
};
