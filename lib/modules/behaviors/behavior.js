var checkArguments = function(behaviorDefinition) {
  // Check parameters validity.
  if (!_.isObject(behaviorDefinition)) {
    throw new Error('The behavior definition has to be an object');
  }

  // Check if behavior name is provided.
  if (!_.has(behaviorDefinition, 'name')) {
    throw new Error('The behavior name can not be empty');
  }

  // Check if behavior name is a string.
  if (!_.isString(behaviorDefinition.name)) {
    throw new Error('The behavior name has to be a string');
  }

  // Check if behavior with given name already exists.
  if (_.has(Astro.behaviors, behaviorDefinition.name)) {
    throw new Error(
      'Behavior with the "' + behaviorDefinition.name + '" name already exists'
    );
  }
};

Astro.Behavior = function Behavior(behaviorDefinition) {
  checkArguments.apply(this, arguments);

  this.name = behaviorDefinition.name;
  this.options = behaviorDefinition.options || {};
  this.createSchemaDefinition = behaviorDefinition.createSchemaDefinition ||
    function createSchemaDefinition() {
      return {};
    };
};

Astro.Behavior.prototype.createGenerator = function() {
  var behavior = this;

  return function classBehaviorGenerator(options) {
    return new Astro.ClassBehavior({
      behavior: behavior,
      options: _.extend({}, behavior.options, options)
    });
  };
};
