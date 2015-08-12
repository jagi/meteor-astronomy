Astro.eventManager.on('initField', function(definition) {
  // For the "Array" type check whether a nested field type had been provided.
  // If yes, then check if the given type exists.
  if (definition.type === 'Array') {
    if (definition.nestedType && !_.has(Astro.types, definition.nestedType)) {
      throw new Error(
        'The "' + definition.nestedType + '" field type does not exist'
      );
    }
  }

  this.nestedType = _.isUndefined(definition.nestedType) ||
    definition.type !== 'Array' ? null : Astro.types[definition.nestedType];
});
