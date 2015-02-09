Astronomy.Behavior = function (definition) {
  // Check parameters validity.
  if (!_.isObject(definition)) throw new Error('Pass behavior definition');
  // Check if behavior name is provided.
  if (!_.has(definition, 'name')) throw new Error('Pass behavior name');
  // Check if behavior name is a string.
  if (!_.isString(definition.name)) throw new Error('Behavior name has to be string');
  // Check if behavior with given name already exists.
  if (_.has(Astronomy._behaviors, definition.name)) throw new Error('Behavior with the name `' + definition.name + '` is already defined');

  Astronomy._behaviors[definition.name] = definition;
};
