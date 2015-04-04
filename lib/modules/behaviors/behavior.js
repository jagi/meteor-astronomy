Astronomy.Behavior = function(definition) {
  // Check parameters validity.
  if (!_.isObject(definition)) {
    throw new Error('Provide behavior definition');
  }
  // Check if behavior name is provided.
  if (!_.has(definition, 'name')) {
    throw new Error('Provide behavior name');
  }
  // Check if behavior name is a string.
  if (!_.isString(definition.name)) {
    throw new Error('Behavior name has to be string');
  }
  // Check if behavior with given name already exists.
  if (_.has(Behaviors, definition.name)) {
    throw new Error('Behavior with the name `' + definition.name + '` is already defined');
  }

  Behaviors[definition.name] = definition;
};
