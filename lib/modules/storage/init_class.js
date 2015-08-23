var methods = {
  save: function(callback) {
    var doc = this;
    var Class = doc.constructor;

    // Get collection for given class or parent class.
    var Collection = Class.getCollection();
    if (!Collection) {
      throw new Error('There is no collection to save to');
    }

    // Trigger "beforeSave" event handlers on the current and parent classes.
    var event = new Astro.Event('beforeSave');
    event.target = doc;
    Class.emitEvent(event);
    // If user prevented default operation, then we have to stop here.
    if (event.defaultPrevented) {
      return;
    }

    // Trigger "beforeInsert" or "beforeUpdate" event handlers on the current
    // and parent classes.
    event = new Astro.Event(doc._isNew ? 'beforeInsert' : 'beforeUpdate');
    event.target = doc;
    Class.emitEvent(event);
    // If user prevented default operation, then we have to stop here.
    if (event.defaultPrevented) {
      return;
    }

    // Get values to update or insert.
    var values;
    if (doc._isNew) {
      values = Astro.utils.fields.getAllValues(doc, {
        cast: false
      });
    } else {
      values = Astro.utils.fields.getModifiedValues(doc, false, {
        cast: false
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

    // Trigger "afterInsert" or "afterUpdate" event handlers on the current and
    // parent classes.
    var event = new Astro.Event(doc._isNew ? 'afterInsert' : 'afterUpdate');
    event.target = doc;
    Class.emitEvent(event);
    // Trigger "afterSave" event handlers on the current and parent classes.
    var event = new Astro.Event('afterSave');
    event.target = doc;
    Class.emitEvent(event);

    // Change the "_isNew" flag to "false". Now the document is not new, it has
    // just been saved.
    doc._isNew = false;

    // Return result of executing Mongo query.
    return result;
  },

  remove: function(callback) {
    var doc = this;
    var Class = doc.constructor;

    // Get collection for given class or parent class.
    var Collection = Class.getCollection();
    if (!Collection) {
      throw new Error('There is no collection to remove from');
    }

    // Remove only when document has the "_id" field (it's persisted).
    var id = Astro.utils.fields.getValue(doc, '_id');
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
      _id: id
    });
    // Add callback to arguments list if provided.
    if (callback) {
      args.push(callback);
    }

    // Remove document and save result.
    var result = Collection.remove.apply(Collection, args);

    // Trigger "afterRemove" event handlers on the current and parent classes.
    var event = new Astro.Event('afterRemove');
    event.target = doc;
    Class.emitEvent(event);

    // Clear "_id" attribute and "_original" object, so that user can save
    // document one more time.
    Astro.utils.fields.setValue(doc, '_id', null);
    doc._original = {};

    // Return result of removing document.
    return result;
  },

  reload: function() {
    var doc = this;
    var Class = doc.constructor;

    // Get collection for given class or parent class.
    var Collection = Class.getCollection();
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
      Astro.BaseClass.call(doc, attrs);

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

Astro.eventManager.on('initClass', function(schemaDefinition) {
  var Class = this;

  // Create an object storing information about classes names connected to the
  // given collection and the "type" field.
  var Collection = Class.getCollection();
  if (!Collection) {
    return;
  }

  // Add storage methods, if a collection has been provided.
  _.extend(Class.prototype, methods);

  // Add the "_id" field.
  Class.addField('_id', {
    type: 'string'
  });

  // Add the "type" field, to distinguish to what class we have to cast a
  // document fetched from the collection.
  var typeField = Class.getTypeField();
  if (!typeField) {
    return;
  }

  Class.addField(typeField, {
    type: 'string'
  });

  Class.addEvent('afterInit', function(attrs) {
    var doc = this;
    doc.set(typeField, Class.getName());
  });
});
