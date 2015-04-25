Astronomy.Module = function(definition) {
  // Check parameters validity.
  if (!_.isObject(definition)) {
    throw new Error('The module definition has to be an object');
  }
  // Check if module name is provided.
  if (!_.has(definition, 'name')) {
    throw new Error('The module name has to be provided');
  }
  // Check if module name is a string.
  if (!_.isString(definition.name)) {
    throw new Error('The module name has to be a string');
  }
  // Check if module with given name already exists.
  if (_.has(Modules, definition.name)) {
    throw new Error(
      'The module with the name "' + definition.name + '" is already defined'
    );
  }

  Modules[definition.name] = definition;
};
