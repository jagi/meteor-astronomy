var base = Astro.base;
var mongo = Astro.getDriver('mongo');

mongo.FieldDefinition = function(definition) {
  definition = _.isUndefined(definition) ? {} : definition;

  base.FieldDefinition.call(this, definition);

  this.nestedType = _.isUndefined(definition.nestedType) ?
    null : definition.nestedType;
};

mongo.FieldDefinition.prototype =
  Object.create(base.FieldDefinition.prototype);
mongo.FieldDefinition.prototype.constructor = mongo.FieldDefinition;
