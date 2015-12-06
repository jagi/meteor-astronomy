Astro.Module.modules.storage.onParseDefinition = function(
  definition, className
) {
  let parsedDefinition = {};

  // Check existence and validity of the "collection" property.
  if (_.has(definition, 'collection') && definition.collection !== null) {
    // The "collection" property has to be an instance of the
    // "Mongo.Collection".
    if (!(definition.collection instanceof Mongo.Collection)) {
      throw new TypeError(
        '["' + className + '" class]["collection" property] ' +
        'The property value has to be an instance of "Mongo.Collection"'
      );
    }

    parsedDefinition.collection = definition.collection;
  }

  // Check existence and validity of the "typeField" property.
  if (_.has(definition, 'typeField') && definition.typeField !== null) {
    // The "typeField" property has to be a string.
    if (!_.isString(definition.typeField)) {
      throw new TypeError(
        '["' + className + '" class]["typeField" property] ' +
        'The property value has to be a string'
      );
    }

    parsedDefinition.typeField = definition.typeField;
  }

  // Check existence and validity of the "transform" property.
  if (_.has(definition, 'transform') && definition.transform !== null) {
    // The "transform" property has to be a function.
    if (!_.isFunction(definition.transform)) {
      throw new TypeError(
        '["' + className + '" class]["transform" property] ' +
        'The property value has to be a function'
      );
    }

    parsedDefinition.transform = definition.transform;
  }

  return parsedDefinition;
};