Astro.TypeDefinition = function(definition) {
  definition = _.isUndefined(definition) ? {} : definition;

  // Check if the type name is provided.
  if (!_.has(definition, 'name')) {
    throw new Error('The type name has to be provided');
  }
  // Check if the type name is a string.
  if (!_.isString(definition.name)) {
    throw new Error('The type name has to be a string');
  }
  // Check if the casting function is provided.
  if (!_.has(definition, 'cast')) {
    throw new Error('The "cast" function has to be provided');
  }
  // Check if the "cast" attribute is a function.
  if (!_.isFunction(definition.cast)) {
    throw new Error('The "cast" attribute has to be a function');
  }
  // Check if the plain function is provided.
  if (!_.has(definition, 'plain')) {
    throw new Error('The "plain" function has to be provided');
  }
  // Check if the "plain" attribute is a function.
  if (!_.isFunction(definition.plain)) {
    throw new Error('The "plain" attribute has to be a function');
  }

  this.name = definition.name;
  this.cast = definition.cast;
  this.plain = definition.plain;
};
