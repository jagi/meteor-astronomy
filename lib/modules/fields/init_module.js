var setOne = function(name, value) {
  var doc = this;
  var Class = doc.constructor;

  // Deny changing the "_id" property.
  if (name === '_id' && this._id) {
    return;
  }

  // Trigger the "beforeset" event handlers for every schema.
  var event = new Astro.Event('beforeset', {
    field: name,
    value: value
  });
  event.target = doc;
  doc.constructor.emitEvent(event);

  // Cast the value to the proper type and set it on the document.
  Astro.utils.fields.setValue(doc, name, value);

  // Trigger the "afterset" event handlers for every schema.
  var event = new Astro.Event('afterset', {
    field: name,
    value: value
  });
  event.target = doc;
  doc.constructor.emitEvent(event);
};

var setMany = function(values) {
  var doc = this;

  // Set multiple fields.
  _.each(values, function(value, name) {
    setOne.call(doc, name, value);
  });
};

var getOne = function(name) {
  var doc = this;
  var Class = doc.constructor;

  // Trigger the "beforeget" event handlers for every schema.
  var event = new Astro.Event('beforeget', {
    field: name
  });
  event.target = doc;
  Class.emitEvent(event);

  // Get current or default field's value.
  var value = Astro.utils.fields.getValue(doc, name);

  // Trigger the "afterget" event handlers for every schema.
  var event = new Astro.Event('afterget', {
    field: name
  });
  event.target = doc;
  Class.emitEvent(event);

  return value;
};

var getMany = function(names) {
  var doc = this;
  var values = {};

  _.each(names, function(name) {
    var value = doc.get(name);
    values[name] = value;
  });

  return values;
};

var getAll = function() {
  var doc = this;
  var Class = doc.constructor;

  // Get list of fields and their values.
  return doc.get(Astro.utils.fields.getAllFieldsNames(Class));
};

var methods = {
  set: function(fieldNameOrPattern, fieldValue) {
    var doc = this;

    if (arguments.length === 1 && _.isObject(fieldNameOrPattern)) {

      setMany.call(doc, fieldNameOrPattern);

    } else if (arguments.length === 2 && _.isString(fieldNameOrPattern)) {

      if (fieldNameOrPattern.indexOf('$') === -1) {

        setOne.call(doc, fieldNameOrPattern, fieldValue);

      } else {

        var fieldsNames = Astro.utils.fields.getFieldsNamesFromPattern(
          doc,
          fieldNameOrPattern
        );
        var fieldsValues = {};
        _.each(fieldsNames, function(fieldNameOrPattern) {
          fieldsValues[fieldNameOrPattern] = fieldValue;
        });
        return setMany.call(doc, fieldsValues);

      }

    }
  },

  get: function(fieldNameOrPattern) {
    var doc = this;

    if (arguments.length === 0) {

      return getAll.call(doc);

    } else if (arguments.length === 1) {

      if (_.isArray(fieldNameOrPattern)) {

        return getMany.call(doc, fieldNameOrPattern);

      } else if (_.isString(fieldNameOrPattern)) {

        if (fieldNameOrPattern.indexOf('$') === -1) {
          return getOne.call(doc, fieldNameOrPattern);
        } else {
          var fieldsNames = Astro.utils.fields.getFieldsNamesFromPattern(
            doc,
            fieldNameOrPattern
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
    var fieldsValues = Astro.utils.fields.getAllValues(doc);

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
    var doc = this;
    // Get collection for given class or parent class.
    var Collection = doc.constructor.getCollection();
    if (!Collection) {
      throw new Error('There is no collection to save to');
    }

    // Flag indicating whether we should update or insert document.
    var update = !!doc._id;
    // Trigger "beforesave" event handlers on the current and parent classes.
    var event = new Astro.Event('beforesave');
    event.target = doc;
    doc.constructor.emitEvent(event);
    // If user prevented default operation, then we have to stop here.
    if (event.defaultPrevented) {
      return;
    }

    // Trigger "beforeinsert" or "beforeupdate" event handlers on the current
    // and parent classes.
    event = new Astro.Event(update ? 'beforeupdate' : 'beforeinsert');
    event.target = doc;
    doc.constructor.emitEvent(event);
    // If user prevented default operation, then we have to stop here.
    if (event.defaultPrevented) {
      return;
    }

    // Get values to update or insert.
    var values;
    if (update) {
      values = doc.getModified();
    } else {
      values = Astro.utils.fields.getAllValues(doc);
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
      return ;
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
        _id: doc._id
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
      result = doc._id = Collection.insert.apply(Collection, args);
    }

    // Copy all values to the "_original" property so that we are starting with
    // the clean object without modifications (there is no diff between current
    // values and "_original").
    doc._original = EJSON.clone(Astro.utils.fields.getAllValues(doc));

    // Trigger "afterinsert" or "afterupdate" event handlers on the current and
    // parent classes.
    var event = new Astro.Event(update ? 'afterupdate' : 'afterinsert');
    event.target = doc;
    doc.constructor.emitEvent(event);
    // Trigger "aftersave" event handlers on the current and parent classes.
    var event = new Astro.Event('aftersave');
    event.target = doc;
    doc.constructor.emitEvent(event);

    // Return result of executing Mongo query.
    return result;
  },

  remove: function(callback) {
    var doc = this;
    // Get collection for given class or parent class.
    var Collection = doc.constructor.getCollection();
    if (!Collection) {
      throw new Error('There is no collection to remove from');
    }

    // Remove only when document has _id, so it's saved in the collection.
    if (!doc._id) {
      return;
    }

    // Trigger "beforeremove" event handlers on the current and parent classes.
    var event = new Astro.Event('beforeremove');
    event.target = doc;
    doc.constructor.emitEvent(event);

    // If user prevented default operation, then we have to stop here.
    if (event.defaultPrevented) {
      return;
    }

    // Add selector to arguments list.
    var args = [];
    args.push({
      _id: doc._id
    });
    // Add callback to arguments list if provided.
    if (callback) {
      args.push(callback);
    }

    // Remove document and save result.
    var result = Collection.remove.apply(Collection, args);

    // Trigger "afterremove" event handlers on the current and parent classes.
    var event = new Astro.Event('afterremove');
    event.target = doc;
    doc.constructor.emitEvent(event);

    // Clear "_id" attribute, so that user can save document one more time.
    doc._id = undefined;

    // Return result of removing document.
    return result;
  },

  reload: function() {
    var doc = this;
    // Get collection for given class or parent class.
    var Collection = doc.constructor.getCollection();
    if (!Collection) {
      throw new Error('There is no collection to reload the document from');
    }

    // The document has to be already saved in the collection.
    if (doc._id) {
      // Get new values from collection without the transformation.
      var attrs = Collection.findOne(doc._id, {
        transform: null
      });

      // Init instance with the new values from the collection.
      defaultConstructor.call(doc, attrs);
    }
  },

  copy: function(save) {
    var doc = this;
    save = save || false;

    // Use EJSON to clone object.
    var copy = EJSON.clone(doc);

    // Remove the "_id" value so that it will save the object as a new document
    // instead updating the old one.
    delete copy._id;
    delete copy._original._id;

    if (save) {
      copy.save();
    }

    return copy;
  }
};

fieldsOnInitModule = function() {
  _.extend(Astro.BaseClass.prototype, methods);
};
