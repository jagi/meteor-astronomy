var setOne = function(name, value) {
  var doc = this;
  var Class = doc.constructor;

  // Deny changing the "_id" property.
  if (name === '_id' && Astro.utils.fields.getValue(doc, '_id')) {
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
    var doc = this;

    return Astro.utils.fields.getModifiedValues(doc, old);
  },

  save: function(callback) {
    var doc = this;
    // Get collection for given class or parent class.
    var Collection = doc.constructor.getCollection();
    if (!Collection) {
      throw new Error('There is no collection to save to');
    }

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
    event = new Astro.Event(doc._isNew ? 'beforeinsert' : 'beforeupdate');
    event.target = doc;
    doc.constructor.emitEvent(event);
    // If user prevented default operation, then we have to stop here.
    if (event.defaultPrevented) {
      return;
    }

    // Get values to update or insert.
    var values;
    if (doc._isNew) {
      values = Astro.utils.fields.getAllValues(doc, {
        plain: true
      });
    } else {
      values = Astro.utils.fields.getModifiedValues(doc, false, {
        plain: true
      });
    }

    // Get the "_id" field's value.
    var id = Astro.utils.fields.getValue(doc, '_id');
    // Remove the "_id" field, if its value is empty (null) or a document is
    // already stored in the collection (we can't change id).
    if (!values._id || !doc._isNew) {
      values = _.omit(values, '_id');
    }

    // Check if there are any values to update or insert. If there are no modified
    // fields, we shouldn't do anything.
    if (_.size(values) === 0) {
      return;
    }

    // Add callback to arguments list if provided.
    var args = [];
    if (callback) {
      args.push(callback);
    }

    var result;
    if (doc._isNew) {
      // Add values to insert into the list of arguments passed to the "insert"
      // method.
      args.unshift(values);
      // Insert document.
      result = Collection.insert.apply(Collection, args);
      Astro.utils.fields.setValue(doc, '_id', result);
    } else {
      // Add selector and modifier at the beginning of the arguments list. Right
      // now in the array is a callback function (if provided).
      args.unshift({ // Selector.
        _id: id
      }, { // Modifier.
        $set: values
      });
      // Update document.
      result = Collection.update.apply(Collection, args);
    }

    // Copy all values to the "_original" property so that we are starting with
    // the clean object without modifications (there is no diff between current
    // values and "_original").
    doc._original = EJSON.clone(Astro.utils.fields.getAllValues(doc));

    // Trigger "afterinsert" or "afterupdate" event handlers on the current and
    // parent classes.
    var event = new Astro.Event(doc._isNew ? 'afterinsert' : 'afterupdate');
    event.target = doc;
    doc.constructor.emitEvent(event);
    // Trigger "aftersave" event handlers on the current and parent classes.
    var event = new Astro.Event('aftersave');
    event.target = doc;
    doc.constructor.emitEvent(event);

    // Change the "_isNew" flag to "false". Now the document is not new, it has
    // just been saved.
    doc._isNew = false;

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

    // Remove only when document has the "_id" field (it's persisted).
    var id = Astro.utils.fields.getValue(doc, '_id');
    if (!id) {
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
      _id: id
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

    // Clear "_id" attribute and "_original" object, so that user can save
    // document one more time.
    Astro.utils.fields.setValue(doc, '_id', null);
    doc._original = {};

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
    var id = Astro.utils.fields.getValue(doc, '_id');
    if (id) {
      // Get new values from collection without the transformation.
      var attrs = Collection.findOne(id, {
        transform: null
      });

      // Init instance with the new values from the collection.
      defaultConstructor.call(doc, attrs);

      // Set the "_isNew" flag back to false.
      doc._isNew = false;
    }
  },

  copy: function(save) {
    var doc = this;
    save = save || false;

    // Use EJSON to clone object.
    var copy = EJSON.clone(doc);

    // Remove the "_id" value and set the "_isNew" flag to false so that it will
    // save the object as a new document instead updating the old one.
    Astro.utils.fields.setValue(copy, '_id', null);
    copy._original._id = null;
    copy._isNew = true;

    if (save) {
      copy.save();
    }

    return copy;
  }
};

_.extend(Astro.base.Class.prototype, methods);
