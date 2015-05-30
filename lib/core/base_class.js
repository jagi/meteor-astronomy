Astro.BaseClass = function() {};

var setOne = function(fieldName, fieldValue) {
  var doc = this;
  var Class = doc.constructor;

  // Deny changing the "_id" property.
  if (fieldName === '_id' && this._id) {
    return;
  }

  // Trigger the "beforeset" event handlers for every schema.
  var event = new Astro.Event('beforeset', {
    field: fieldName,
    value: fieldValue
  });
  event.target = doc;
  doc.constructor.emitEvent(event);

  // Cast the value to the proper type and...
  var value = Astro.utils.class.castValueOfField(Class, fieldName, fieldValue);
  // set it on the document.
  Astro.utils.instance.setValueOfField(doc, fieldName, value);

  // Trigger the "afterset" event handlers for every schema.
  var event = new Astro.Event('afterset', {
    field: fieldName,
    value: fieldValue
  });
  event.target = doc;
  doc.constructor.emitEvent(event);
};

var setMany = function(fieldsValues) {
  var doc = this;

  // Set multiple fields.
  _.each(fieldsValues, function(fieldValue, fieldName) {
    setOne.call(doc, fieldName, fieldValue);
  });
};

var getOne = function(fieldName) {
  var doc = this;
  var Class = doc.constructor;

  // Trigger the "beforeget" event handlers for every schema.
  var event = new Astro.Event('beforeget', {
    field: fieldName
  });
  event.target = doc;
  Class.emitEvent(event);

  // Get current or default field's value.
  var value = Astro.utils.instance.getValueOfField(doc, fieldName);

  // Trigger the "afterget" event handlers for every schema.
  var event = new Astro.Event('afterget', {
    field: fieldName
  });
  event.target = doc;
  Class.emitEvent(event);

  return value;
};

var getMany = function(fieldsNames) {
  var doc = this;
  var values = {};

  _.each(fieldsNames, function(fieldName) {
    var value = doc.get(fieldName);
    values[fieldName] = value;
  });

  return values;
};

var getAll = function() {
  var doc = this;
  var Class = doc.constructor;

  // Get list of fields and their values.
  return doc.get(Astro.utils.class.getNamesOfAllFields(Class));
};

_.extend(Astro.BaseClass.prototype, {
  set: function(fieldName, fieldValue) {
    var doc = this;

    if (arguments.length === 1 && _.isObject(fieldName)) {

      setMany.call(doc, fieldName);

    } else if (arguments.length === 2 && _.isString(fieldName)) {

      if (fieldName.indexOf('$') === -1) {

        setOne.call(doc, fieldName, fieldValue);

      } else {

        var fieldsNames = Astro.utils.instance.collectNamesOfNestedFields(
          doc,
          fieldName
        );
        var fieldsValues = {};
        _.each(fieldsNames, function(fieldName) {
          fieldsValues[fieldName] = fieldValue;
        });
        return setMany.call(doc, fieldsValues);

      }

    }
  },

  get: function(fieldName) {
    var doc = this;

    if (arguments.length === 0) {

      return getAll.call(doc);

    } else if (arguments.length === 1) {

      if (_.isArray(fieldName)) {

        return getMany.call(doc, fieldName);

      } else if (_.isString(fieldName)) {

        if (fieldName.indexOf('$') === -1) {
          return getOne.call(doc, fieldName);
        } else {
          var fieldsNames = Astro.utils.instance.collectNamesOfNestedFields(
            doc,
            fieldName
          );
          return getMany.call(doc, fieldsNames);
        }

      }

    }
  },

  getModified: function(old) {
    old = old || false;
    var doc = this;
    var Class = doc.constructor;

    var modified = {};

    // Get current values for all fields.
    var fieldsValues = Astro.utils.instance.getValuesOfAllFields(doc);

    _.each(fieldsValues, function(fieldValue, fieldName) {
      // If a value differs from the value in the "_original" object then it means
      // that fields was modified from the last save.
      if (!EJSON.equals(doc._original[fieldName], fieldValue)) {
        // Decide if we want to take new or old value.
        if (old) {
          modified[fieldName] = doc._original[fieldName];
        } else {
          modified[fieldName] = fieldValue;
        }
      }
    });

    return modified;
  },

  save: function(callback) {
    // Get collection for given class.
    var Collection = this.constructor.getCollection();
    if (!Collection) {
      throw new Error('There is no collection to save to');
    }

    // Flag indicating whether we should update or insert document.
    var update = !!this._id;
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
      values = Astro.utils.instance.getValuesOfAllFields(this);
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
        _id: this._id
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
      result = this._id = Collection.insert.apply(Collection, args);
    }

    // Copy values to the "_original" property so that we are starting with the
    // clean object without modifications (there is no diff between current values
    // and "_original").
    this._original = EJSON.clone(values);

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
  },

  remove: function(callback) {
    // Get collection for given class or parent class.
    var Collection = this.constructor.getCollection();
    if (!Collection) {
      throw new Error('There is no collection to remove from');
    }

    // Remove only when document has _id, so it's saved in the collection.
    if (!this._id) {
      return;
    }

    // Trigger "beforeremove" event handlers on the current and parent classes.
    var event = new Astro.Event('beforeremove');
    event.target = this;
    this.constructor.emitEvent(event);

    // Add selector to arguments list.
    var args = [];
    args.push({
      _id: this._id
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
    this._id = undefined;

    // Return result of removing document.
    return result;
  },

  reload: function() {
    // Get collection for given class or parent class.
    var Collection = this.constructor.getCollection();
    if (!Collection) {
      throw new Error('There is no collection to reload the document from');
    }

    // The document has to be already saved in the collection.
    if (this._id) {
      // Get new values from collection without the transformation.
      var attrs = Collection.findOne(this._id, {
        transform: null
      });

      // Init instance with the new values from the collection.
      fieldsInitInstance.call(this, attrs);
    }
  },

  copy: function(save) {
    save = save || false;

    // Use EJSON to clone object.
    var copy = EJSON.clone(this);

    // Remove the "_id" value so that it will save the object as a new document
    // instead updating the old one.
    delete copy._id;
    delete copy._original._id;

    if (save) {
      copy.save();
    }

    return copy;
  }
});
