var checkAddIndex = function(indexName, indexDefinition) {
  // Index name has to be a string.
  if (!_.isString(indexName)) {
    throw new Error(
      'The index name in the "' + this.getName() +
      '" class has to be a string'
    );
  }
  // Index definition has to be an object.
  if (!_.isObject(indexDefinition)) {
    throw new Error(
      'The index definition in the "' + this.getName() +
      '" class has to be an object'
    );
  }
};

var checkAddIndexes = function(indexesDefinition) {
  // Index definition has to be an object.
  if (!_.isObject(indexesDefinition)) {
    throw new Error(
      'The indexes list in the "' + this.getName() +
      '" class has to be an object'
    );
  }
};

var checkRemoveIndex = function(indexName) {
  // Index name has to be a string.
  if (!_.isString(indexName)) {
    throw new Error(
      'The index name in the "' + this.getName() +
      '" class has to be a string'
    );
  }
};

var methods = {
  addIndex: function(indexName, indexDefinition) {
    if (!Meteor.isServer) {
      return;
    }
    var Class = this;
    checkAddIndex.apply(Class, arguments);

    var Collection = Class.getCollection();

    // Add index definition to the schema.
    Class.schema.indexes[indexName] = indexDefinition;

    // Set the index name.
    var options = _.extend({}, indexDefinition.options);
    options.name = indexName;

    Collection._ensureIndex(indexDefinition.fields, options);
  },

  addIndexes: function(indexesDefinition) {
    if (!Meteor.isServer) {
      return;
    }
    var Class = this;
    checkAddIndexes.apply(Class, arguments);

    _.each(indexesDefinition, function(indexDefinition, indexName) {
      Class.addIndex(indexName, indexDefinition);
    });
  },

  removeIndex: function(indexName) {
    if (!Meteor.isServer) {
      return;
    }
    var Class = this;
    checkRemoveIndex.apply(Class, arguments);

    var Collection = Class.getCollection();

    // Remove an index definition from the schema.
    delete Class.schema.indexes[indexName];

    Collection._dropIndex(indexName);
  }
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  var Class = this;

  // Add index methods to the class.
  _.extend(Class, methods);

  // Add indexes from the schema definition.
  if (_.has(schemaDefinition, 'indexes') && Meteor.isServer) {
    Class.addIndexes(schemaDefinition.indexes);
  }

  // Add indexes that are defined next to the embeded field definition.
  _.each(schemaDefinition.embedOne, function(fieldDefinition, fieldName) {
    if (_.isObject(fieldDefinition) && _.has(fieldDefinition, 'index')) {
      var indexDefinition = {
        fields: {}
      };
      indexDefinition.fields[fieldName] = fieldDefinition.index;
      Class.addIndex(fieldName, indexDefinition);
    }
  });
  _.each(schemaDefinition.embedMany, function(fieldDefinition, fieldName) {
    if (_.isObject(fieldDefinition) && _.has(fieldDefinition, 'index')) {
      var indexDefinition = {
        fields: {}
      };
      indexDefinition.fields[fieldName] = fieldDefinition.index;
      Class.addIndex(fieldName, indexDefinition);
    }
  });

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
});
