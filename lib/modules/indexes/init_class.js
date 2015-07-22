var checks = {
  indexName: function(indexName) {
    if (!_.isString(indexName)) {
      throw new Error(
        'The index name in the "' + this.getName() +
        '" class schema has to be a string'
      );
    }
  },
};

var methods = {
  addIndex: function(indexName, indexDefinition) {
    if (!Meteor.isServer) {
      return;
    }

    // Check if the index name is a string.
    checks.indexName.call(this, indexName);

    var Collection = this.getCollection();

    // Add index definition to the schema.
    this.schema.indexes[indexName] = indexDefinition;

    // Set the index name.
    var options = _.extend({}, indexDefinition.options);
    options.name = indexName;

    Collection._ensureIndex(indexDefinition.fields, options);
  },

  addIndexes: function(indexesDefinition) {
    if (!Meteor.isServer) {
      return;
    }

    _.each(
      indexesDefinition,
      function(indexDefinition, indexName) {
        this.addIndex(
          indexName,
          indexDefinition
        );
      },
      this
    );
  },

  removeIndex: function(indexName) {
    if (!Meteor.isServer) {
      return;
    }

    // Check if the index name is a string.
    checks.indexName.call(this, indexName);

    var Collection = this.getCollection();

    // Remove an index definition from the schema.
    delete this.schema.indexes[indexName];

    Collection._dropIndex(indexName);
  }
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  // checks.schemaDefinition.call(this, schemaDefinition);

  var Class = this;

  // Add index methods to the class.
  _.extend(Class, methods);

  // Add the "indexes" attribute to the schema.
  Class.schema.indexes = {};

  // Add indexes from the schema definition.
  if (_.has(schemaDefinition, 'indexes') && Meteor.isServer) {
    Class.addIndexes(schemaDefinition.indexes);
  }

  // Add indexes that are defined next to the field definition.
  _.each(
    schemaDefinition.fields,
    function(fieldDefinition, patternOrFieldName) {
      if (_.has(fieldDefinition, 'index')) {
        var indexDefinition = {
          fields: {}
        };
        indexDefinition.fields[patternOrFieldName] = fieldDefinition.index;
        Class.addIndex(patternOrFieldName, indexDefinition);
      }
    }
  );
});
