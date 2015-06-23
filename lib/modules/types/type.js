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
  // Check if the casting function is provided.
  if (!_.has(typeDefinition, 'cast')) {
    throw new Error('Provide the "cast" function');
  }
  // Check if the "cast" attribute is function.
  if (!_.isFunction(typeDefinition.cast)) {
    throw new Error('The "cast" attribute has to be a function');
  }

  // Check if the "display" attribute is function (if it's present).
  if (typeDefinition.display && !_.isFunction(typeDefinition.cast)) {
    throw new Error('The "display" attribute has to be a function');
  }

  Astro.types[typeDefinition.name] = typeDefinition.cast;
  if (typeDefinition.display)
   Astro.displays[typeDefinition.name] = typeDefinition.display;

};
