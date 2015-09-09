var Future = Npm.require('fibers/future');

var checkIndexName = function(indexName) {
  if (!Match.test(indexName, String)) {
    throw new TypeError(
      'The index name in the "' + this.getName() + '" class has to be a string'
    );
  }
};

var checkIndexDefinition = function(indexDefinition) {
  if (!Match.test(indexDefinition, Object)) {
    throw new TypeError(
      'The index definition in the "' + this.getName() +
      '" class has to be an object'
    );
  }
};

var methods = {};

methods.hasIndex = function(indexName) {
  var Class = this;
  var Collection = Class.getCollection();
  var raw = Collection.rawCollection();
  var future = new Future();

  raw.indexExists(indexName, function(err, exists) {
    if (err) {
      future.throw(err);
    }

    future.return(exists);
  });

  return future.wait();
};

methods.addIndex = function(indexName, indexDefinition) {
  checkIndexName.call(this, indexName);
  checkIndexDefinition.call(this, indexDefinition);

  if (this.hasIndex(indexName)) {
    return;
  }

  var Collection = this.getCollection();

  // Prepare index options.
  var options = _.extend({}, indexDefinition.options, {
    name: indexName
  });
  options.name = indexName;
  // Add index.
  Collection._ensureIndex(indexDefinition.fields, options);
};

methods.removeIndex = function(indexName) {
  checkIndexName.call(this, indexName);

  if (!this.hasIndex(indexName)) {
    return;
  }

  var Collection = this.getCollection();

  // Remove index.
  Collection._dropIndex(indexName);
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  var Class = this;

  // Add index methods to the class.
  _.extend(Class, methods);

  // Add indexes that are defined next to the field definition.
  _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
    if (_.isObject(fieldDefinition) && _.has(fieldDefinition, 'index')) {
      var indexDefinition = {
        fields: {}
      };
      indexDefinition.fields[fieldName] = fieldDefinition.index;
      Class.addIndex(fieldName, indexDefinition);
    }
  });

  // Add indexes from the schema definition.
  _.each(schemaDefinition.indexes, function(indexDefinition, indexName) {
    Class.addIndex(indexName, indexDefinition);
  });
});
