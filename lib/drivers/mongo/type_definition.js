var base = Astro.base;
var mongo = Astro.getDriver('mongo');

mongo.TypeDefinition = function(definition) {
  definition = _.isUndefined(definition) ? {} : definition;

  base.TypeDefinition.call(this, definition);

  this.isNested = _.isUndefined(definition.isNested) ?
    false : definition.isNested;
};

mongo.TypeDefinition.prototype =
  Object.create(base.TypeDefinition.prototype);
mongo.TypeDefinition.prototype.constructor = mongo.TypeDefinition;
