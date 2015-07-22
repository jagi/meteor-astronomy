Astro.base.FieldDefinition = function(definition) {
  definition = _.isUndefined(definition) ? {} : definition;

  this.type = _.isUndefined(definition.type) ?
    null : definition.type;

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
    _.isString(this.type) &&
    _.has(types, this.type)
  ) {
    var lower = this.type;
    var upper = types[this.type];
    console.warn(
      'ASTRONOMY: The lowercase form of the type name is deprecated and ' +
      'will be removed on v1.0 release. Use the uppercase (' +
      upper + ') form instead of the lowercase (' + lower + ').'
    );
    this.type = upper;
  }

  // Check whether the given field type exists.
  if (this.type !== null && !_.has(Astro.types, this.type)) {
    throw new Error(
      'The "' + this.type + '" field type does not exist'
    );
  }

  this.default = _.isUndefined(definition.default) ?
    null : definition.default;
  this.required = _.isUndefined(definition.required) ?
    false : definition.required;
};
