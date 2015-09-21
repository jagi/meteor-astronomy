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
    var className = schemaDefinition.name;

    var definitions = {};

    if (_.has(schemaDefinition, 'fields')) {
      _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
        if (_.has(fieldDefinition, 'index')) {
          var definition;

          if (
            fieldDefinition.index === -1 || fieldDefinition.index === 1 ||
            _.isString(fieldDefinition.index)
          ) {
            definition = {
              fields: {},
              options: {
                name: fieldName
              }
            };
            definition.fields[fieldName] = fieldDefinition.index;
          }

          if (definition) {
            // Check validity of the event definition.
            checkDefinition(definition, fieldName, className);
            definitions[fieldName] = definition;
          }
        }
      });
    }

    if (_.has(schemaDefinition, 'indexes')) {
      _.each(schemaDefinition.indexes, function(indexDefinition, indexName) {
        var definition;

        // Prepare index definition.
        if (_.isObject(indexDefinition)) {
          var definition = _.pick(indexDefinition, ['fields', 'options']);
          definition.options = definition.options || {};
          if (!_.has(definition.options, 'name')) {
            definition.options.name = indexName;
          }
        }

        // Check validity of the event definition.
        if (definition) {
          checkDefinition(definition, indexName, className);
          definitions[indexName] = definition;
        }
      });
    }

    schemaDefinition.indexes = definitions;
  }
);
