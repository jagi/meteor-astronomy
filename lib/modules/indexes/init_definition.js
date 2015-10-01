var checkDefinition = function(indexDefinition, indexName, className) {
  if (!Match.test(indexName, String)) {
    throw new TypeError(
      'The index name in the "' + className + '" class has to be a string'
    );
  }
  if (!Match.test(indexDefinition, Object)) {
    throw new TypeError(
      'The index definition in the "' + className +
      '" class has to be an object'
    );
  }
};

Astro.eventManager.on(
  'initDefinition', function onInitDefinitionIndexes(schemaDefinition) {
    var Class = this;
    var schema = Class.schema;
    var indexesDefinitions = {};

    if (_.has(schemaDefinition, 'fields')) {
      _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
        if (_.has(fieldDefinition, 'index')) {
          var indexDefinition;

          if (
            fieldDefinition.index === -1 || fieldDefinition.index === 1 ||
            _.isString(fieldDefinition.index)
          ) {
            indexDefinition = {
              fields: {},
              options: {
                name: fieldName
              }
            };
            indexDefinition.fields[fieldName] = fieldDefinition.index;
          }

          if (indexDefinition) {
            // Check validity of the event definition.
            checkDefinition(indexDefinition, fieldName, Class.getName());
            indexesDefinitions[fieldName] = indexDefinition;
          }
        }
      });
    }

    if (_.has(schemaDefinition, 'indexes')) {
      _.each(schemaDefinition.indexes, function(definition, indexName) {
        var indexDefinition;

        // Prepare index definition.
        if (_.isObject(definition)) {
          var indexDefinition = _.pick(definition, ['fields', 'options']);
          indexDefinition.options = indexDefinition.options || {};
          if (!_.has(indexDefinition.options, 'name')) {
            indexDefinition.options.name = indexName;
          }
        }

        // Check validity of the event definition.
        if (indexDefinition) {
          checkDefinition(indexDefinition, indexName, Class.getName());
          indexesDefinitions[indexName] = indexDefinition;
        }
      });
    }

    if (_.size(indexesDefinitions) > 0) {
      var Collection = Class.getCollection();
      if (!Collection) {
        return;
      }
      // Add indexes to the collection
      _.each(indexesDefinitions, function(indexDefinition) {
        Collection._ensureIndex(
          indexDefinition.fields, indexDefinition.options
        );
      });

      // Add indexes to the schema.
      schema.indexes = schema.indexes || {};
      _.extend(schema.indexes, indexesDefinitions);
    }
  }
);
