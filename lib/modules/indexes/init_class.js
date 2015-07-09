var checks = {
  indexes: function(indexes) {

  }
};

var methods = {
  addIndex: function(indexName, indexDefinition) {
    this.getCollection();

    // Add index definition to the schema.
    this.schema.indexes[indexName] = indexDefinition;
  },

  addIndexes: function(indexesNames) {
    if (_.isArray(indexesNames)) {

      _.each(indexesNames, function(indexName) {
        this.addIndex(indexName);
      }, this);

    } else if (_.isObject(indexesNames)) {

      _.each(
        indexesNames,
        function(indexDefinition, indexName) {
          this.addIndex(
            indexName,
            indexesNames[indexName]
          );
        },
        this
      );

    } else {

      // Fields definition has to be an object or an array.
      throw new Error(
        'The indexes definition in the "' + this.getName() +
        '" class schema has to be an array or an object'
      );

    }
  }
};

indexesOnInitClass = function(schemaDefinition) {
  // checks.schemaDefinition.call(this, schemaDefinition);

  var Class = this;

  // Add index methods to the class.
  _.extend(Class, methods);

  // Add the "indexes" attribute to the schema.
  Class.schema.indexes = {};

  // Add indexes from the schema definition.
  if (_.has(schemaDefinition, 'indexes')) {
    Class.addIndexes(schemaDefinition.indexes);
  }
};
