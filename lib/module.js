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
      'The module with the name "' + definition.name +
      '" is already defined'
    );
  }

  // Initialize a module if the "oninitmodule" event had been defined.
  if (
    _.has(definition, 'oninitmodule') &&
    _.isFunction(definition.oninitmodule)
  ) {
    definition.oninitmodule();
  }

  // Add events to the global events list.
  if (_.has(definition, 'oninitclass')) {
    Astro.eventManager.on('initclass', definition.oninitclass);
  }
  if (_.has(definition, 'oninitschema')) {
    Astro.eventManager.on('initschema', definition.oninitschema);
  }
  if (_.has(definition, 'oninitinstance')) {
    Astro.eventManager.on('initinstance', definition.oninitinstance);
  }

  Modules[definition.name] = definition;
};
