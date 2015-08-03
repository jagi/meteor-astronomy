var base = Astro.base;
var mongo = Astro.getDriver('mongo');

mongo.FieldDefinition = function(definition) {
  definition = _.isUndefined(definition) ? {} : definition;

  base.FieldDefinition.call(this, definition);

  this.nestedType = _.isUndefined(definition.nestedType) ||
    definition.type !== 'Array' ? null : definition.nestedType;

  if (this.type === 'Array') {
    // Check whether the given nested field type exists.
    if (this.nestedType && !_.has(Astro.types, this.nestedType)) {
      throw new Error(
        'The "' + this.nestedType + '" field type does not exist'
      );
    }
  }
};

mongo.FieldDefinition.prototype =
  Object.create(base.FieldDefinition.prototype);
mongo.FieldDefinition.prototype.constructor = mongo.FieldDefinition;
