Astronomy.Module = function(definition) {
  // Check parameters validity.
  if (!_.isObject(definition)) {
    throw new Error('Provide module definition');
  }
  // Check if module name is provided.
  if (!_.has(definition, 'name')) {
    throw new Error('Provide module name');
  }
  // Check if module name is a string.
  if (!_.isString(definition.name)) {
    throw new Error('Module name has to be string');
  }
  // Check if module with given name already exists.
  if (_.has(Modules, definition.name)) {
    throw new Error('Module with the name `' + definition.name + '` is already defined');
  }

  Modules[definition.name] = definition;
};
