Astro.Module.modules.indexes.onParseDefinition = function(
  definition, className
) {
  let parsedDefinition = {};

  // Check existence and validity of the "indexes" property.
  parsedDefinition.indexes = {};
  if (_.has(definition, 'indexes')) {
    _.each(definition.indexes, function(index, indexName) {
      if (!_.isObject(index)) {
        Astro.utils.core.throwParseError([
          {class: className}, {index: indexName},
          'The index definition has to be an object'
        ]);
      }

      index = {
        fields: index.fields,
        options: index.options
      };
      if (!_.has(index.options, 'name')) {
        index.options.name = indexName;
      }

      parsedDefinition.indexes[indexName] = index;
    });
  }

  // if (_.has(schemaDefinition, 'fields')) {
  //   _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
  //     if (_.isObject(fieldDefinition) && _.has(fieldDefinition, 'index')) {
  //       var indexDefinition;
  //
  //       if (
  //         fieldDefinition.index === -1 || fieldDefinition.index === 1 ||
  //         _.isString(fieldDefinition.index)
  //       ) {
  //         indexDefinition = {
  //           fields: {},
  //           options: {
  //             name: fieldName
  //           }
  //         };
  //         indexDefinition.fields[fieldName] = fieldDefinition.index;
  //       }
  //
  //       if (indexDefinition) {
  //         // Check validity of the event definition.
  //         checkDefinition(indexDefinition, fieldName, Class.getName());
  //         indexesDefinitions[fieldName] = indexDefinition;
  //       }
  //     }
  //   });
  // }

  return parsedDefinition;
};