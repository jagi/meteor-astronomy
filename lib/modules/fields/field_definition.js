Astro.FieldDefinition = function(definition) {
  var self = this;

  definition = _.isUndefined(definition) ? {} : definition;

  // TODO: Remove on v1.0 release.
  var types = {
    'string': 'String',
    'number': 'Number',
    'boolean': 'Boolean',
    'object': 'Object',
    'array': 'Array',
    'date': 'Date'
  };
  if (
    _.isString(definition.type) &&
    _.has(types, definition.type)
  ) {
    var lower = definition.type;
    var upper = types[definition.type];
    console.warn(
      'ASTRONOMY: The lowercase form of the type name is deprecated and ' +
      'will be removed on v1.0 release. Use the uppercase (' +
      upper + ') form instead of the lowercase (' + lower + ').'
    );
    definition.type = upper;
  }

  // Check whether the given field type exists.
  if (definition.type && !_.has(Astro.types, definition.type)) {
    throw new Error(
      'The "' + definition.type + '" field type does not exist'
    );
  }

  this.name = _.isUndefined(definition.name) ?
    null : definition.name;
  if (_.isUndefined(definition.type) || _.isNull(definition.type)) {
    this.type = Astro.types.Null;
  } else {
    this.type = Astro.types[definition.type];
  }
  this.default = _.isUndefined(definition.default) ?
    null : definition.default;
  this.required = _.isUndefined(definition.required) ?
    false : definition.required;

  // Setup field definition using the "initField" event handlers.
  Astro.eventManager.each('initField', function(eventHandler) {
    eventHandler.call(self, definition);
  });
};
