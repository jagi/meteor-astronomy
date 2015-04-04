Astronomy.Validator = function(definition) {
  // Check parameters validity.
  if (!_.isObject(definition)) {
    throw new Error('Provide validator definition');
  }
  // Check if validator name is provided.
  if (!_.has(definition, 'name')) {
    throw new Error('Provide validator name');
  }
  // Check if validator name is a string.
  if (!_.isString(definition.name)) {
    throw new Error('Validator name has to be string');
  }
  // Check if validator with given name already exists.
  if (_.has(Validators, definition.name)) {
    throw new Error('Validator with the name `' + definition.name +
      '` is already defined');
  }

  Validators[definition.name] = definition;
};
