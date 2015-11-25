var classMethods = {};

var checkSelector = function(selector, methodName) {
  // If we are not on the server and we are trying to perform non insert
  // operation on a document then it has to be done by ID.
  if (
    !Meteor.isServer && !LocalCollection._selectorIsIdPerhapsAsObject(selector)
  ) {
    throw new Meteor.Error(
      403,
      'Not permitted. Untrusted code may only ' + methodName +
      ' documents by ID.'
    );
  }
};

classMethods.getCollection = function() {
  return this.schema.collection;
};

classMethods.getTypeField = function() {
  return this.schema.typeField;
};

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

  try {
    var doc = new Class(doc);
    var id = doc.save();
    // Execute a callback function if provided.
    if (_.isFunction(callback)) {
      callback(undefined, id);
      return id;
    }
    // Return result.
    return id;
  } catch (e) {
    if (e instanceof Meteor.Error && _.isFunction(callback)) {
      // Execute a callback function with an error.
      callback(e);
    } else {
      // Throw the error again, if we can not handle it.
      throw e;
    }
  }
};

/**
 * @summary Updates documents in the collection.
 * @return
 * @locus Anywhere
 * @method update
 * @memberOf Astro.BaseClass
 * @class
 * @param {MongoSelector} selector Specifies which documents to modify
 * @param {MongoModifier} modifier Specifies how to modify the documents
 * @param {Object} [options]
 * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
 * @param {Boolean} options.upsert True to insert a document if no matching documents are found.
 * @param {Function} [callback] Optional. If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
 * @returns {String|Number} Returns an inserted document ID or number of document that have been updated.
 */
classMethods.update = function(selector, modifier, options, callback) {
  var Class = this;
  var Collection = Class.getCollection();

  // The options argument is optional and if there are only three arguments,
  // then it may mean that the last argument is a callback function.
  if (arguments.length === 3 && _.isFunction(options)) {
    callback = options;
    options = {};
  }
  // Make sure that options object is created.
  options = options || {};
  // Check validity of selector.
  if (Collection._name) {
    checkSelector(selector, 'update');
  }

  try {
    // We select one or many documents depending on the "multi" flag.
    var docs;
    if (options.multi) {
      docs = Collection.find(selector);
    } else {
      docs = Collection.find(selector, {
        limit: 1,
      });
    }

    // INSERT.
    if (docs.count() === 0 && options.upsert) {

      // If there are no matching documents and the "upsert" option was set,
      // then we have to insert a new document.
      var doc = new Class();
      // If a selector is ID, then set it on a document.
      if (_.isString(selector)) {
        doc.set('_id', selector);
      // If selector is object, then set all fields from the selector on a
      // document.
      } else if (_.isObject(selector)) {
        doc.set(selector);
      }
      // Execute a modifier on the document.
      doc._executeModifier(modifier);
      // Insert a document.
      doc.save();
      // Execute a callback function if provided.
      if (_.isFunction(callback)) {
        callback(undefined, doc._id);
      }
      // Return result.
      return doc._id;

    // UPDATE.
    } else {

      // Execute a modifier on each document.
      var count = 0;
      docs.forEach(function(doc, i) {
        // Execute a modifier on the document.
        doc._executeModifier(modifier);
        // Run the "forEach" function if exists, i.
        if (_.isFunction(options.forEach) && !options.forEach(doc, i)) {
          return;
        }
        // Update a document.
        count += doc.save();
      });
      // Execute a callback function if provided.
      if (_.isFunction(callback)) {
        callback(undefined, count);
      }
      // Return result.
      return count;

    }
  } catch (e) {
    if (e instanceof Meteor.Error && _.isFunction(callback)) {
      // Execute a callback function with an error.
      callback(e);
    } else {
      // Throw the error again, if we can not handle it.
      throw e;
    }
  }
};

/**
 * @summary Modify one or more documents in the collection, or insert one if no matching documents were found.
 * @locus Anywhere
 * @method upsert
 * @memberOf Astro.BaseClass
 * @class
 * @param {MongoSelector} selector Specifies which documents to modify
 * @param {MongoModifier} modifier Specifies how to modify the documents
 * @param {Object} [options]
 * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
 * @param {Function} [callback] Optional. If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
 * @returns {String|Number} Returns an inserted document ID or number of document that have been updated.
 */
classMethods.upsert = function(selector, modifier, options, callback) {
  var Class = this;

  return Class.update(
    selector,
    modifier,
    _.extend({}, options, {upsert: true}),
    callback
  );
};

/**
 * @summary Remove documents from the collection
 * @locus Anywhere
 * @method remove
 * @memberOf Astro.BaseClass
 * @class
 * @param {MongoSelector} selector Specifies which documents to remove
 * @param {Function} [callback] Optional. If present, called with an error object as its argument.
 * @returns {Number} Returns number of removed documents.
 */
classMethods.remove = function(selector, callback) {
  var Class = this;
  var Collection = Class.getCollection();

  // Check validity of selector.
  if (Collection._name) {
    checkSelector(selector, 'remove');
  }

  // Select all documents matching selector.
  docs = Collection.find(selector);

  // Try removing each document.
  try {
    var count = 0;
    docs.forEach(function(doc, i) {
      // Remove a document.
      count += doc.remove();
    });
    // Execute a callback function if provided.
    if (_.isFunction(callback)) {
      callback(undefined, count);
    }
    // Return result.
    return count;
  } catch (e) {
    if (e instanceof Meteor.Error && _.isFunction(callback)) {
      // Execute a callback function with an error.
      callback(e);
    } else {
      // Throw the error again, if we can not handle it.
      throw e;
    }
  }
};

_.each(['find', 'findOne'], function(methodName) {
  classMethods[methodName] = function(selector, options) {
    var Class = this;
    var schema = Class.schema;
    var Collection = Class.getCollection();

    if (_.isString(selector)) {
      selector = {
        _id: selector
      };
    }
    selector = selector || {};
    options = options || {};
    options.transform = schema.transform ||
      Astro.utils.class.transformToClass(Class.getName());

    // Modify selector and options using the "beforeFind" event handlers.
    var event = new Astro.Event('beforeFind', {
      selector: selector,
      options: options
    });
    event.target = Class;
    Class.emitEvent(event);
    // If a default operation was prevented, then we have to stop here.
    if (event.defaultPrevented) {
      return;
    }

    // If it's an inherited class, then get only documents being instances of
    // the subclass.
    var typeField = Class.getTypeField();
    if (typeField) {
      selector[typeField] = Class.getName();
    }

    var result = Collection[methodName](selector, options);

    // Modify a query result using the "afterFind" event handlers.
    var event = new Astro.Event('afterFind', {
      selector: selector,
      options: options,
      result: result
    });
    event.target = Class;
    Class.emitEvent(event);

    return result;
  };
});

Astro.eventManager.on(
  'initClass', function onInitClassStorage(schemaDefinition) {
    var Class = this;

    // Add storage methods to the class.
    _.extend(Class, classMethods);
  }
);
