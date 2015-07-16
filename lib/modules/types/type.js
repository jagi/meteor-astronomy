Astro.createType = function(typeDefinition) {
  // Check if the type definition is an object.
  if (!_.isObject(typeDefinition)) {
    throw new Error('Provide a type definition');
  }
  // Check if the type name is provided.
  if (!_.has(typeDefinition, 'name')) {
    throw new Error('Provide a type name');
  }
  // Check if the type name is a string.
  if (!_.isString(typeDefinition.name)) {
    throw new Error('The type name has to be a string');
  }
  // Check if the type with the given name already exists.
  if (_.has(Astro.types, typeDefinition.name)) {
    throw new Error('Type with the name "' + typeDefinition.name +
      '" is already defined');
  }
  // Check if the type checking function is provided.
  if (!_.has(typeDefinition, 'check')) {
    throw new Error('Provide the "check" function');
  }
  // Check if the "check" attribute is a function.
  if (!_.isFunction(typeDefinition.check)) {
    throw new Error('The "check" attribute has to be a function');
  }
  // Check if the casting function is provided.
  if (!_.has(typeDefinition, 'cast')) {
    throw new Error('Provide the "cast" function');
  }
  // Check if the "cast" attribute is a function.
  if (!_.isFunction(typeDefinition.cast)) {
    throw new Error('The "cast" attribute has to be a function');
  }

  Astro.types[typeDefinition.name] = _.pick(typeDefinition, ['check', 'cast']);
};
