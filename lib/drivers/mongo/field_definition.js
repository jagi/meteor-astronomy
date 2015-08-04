var base = Astro.base;
var mongo = Astro.getDriver('mongo');

mongo.FieldDefinition = function(definition) {
  definition = _.isUndefined(definition) ? {} : definition;

  base.FieldDefinition.call(this, definition);

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
};

mongo.FieldDefinition.prototype =
  Object.create(base.FieldDefinition.prototype);
mongo.FieldDefinition.prototype.constructor = mongo.FieldDefinition;
