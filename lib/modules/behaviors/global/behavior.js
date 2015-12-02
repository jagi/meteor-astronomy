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
  if (_.has(Astro.Behavior.behaviors, behaviorDefinition.name)) {
    throw new Error(
      'Behavior with the "' + behaviorDefinition.name + '" name already exists'
    );
  }
};

Astro.Behavior = class Behavior {
  constructor(behaviorDefinition) {
    checkArguments.apply(this, arguments);

    this.name = behaviorDefinition.name;
    this.options = behaviorDefinition.options || {};
    this.methods = behaviorDefinition.methods || {};
    if (_.isFunction(behaviorDefinition.createSchemaDefinition)) {
      this.createSchemaDefinition = behaviorDefinition.createSchemaDefinition;
    }
  }

  createGenerator() {
    var behavior = this;

    return function classBehaviorGenerator(options) {
      return new Astro.ClassBehavior({
        behavior: behavior,
        options: _.extend({}, behavior.options, options)
      });
    };
  }

  createSchemaDefinition() {}

  static create(behaviorDefinition) {
    var behavior = new Astro.Behavior(behaviorDefinition);
    return Astro.Behavior.behaviors[behavior.name] = behavior.createGenerator();
  }

  static get(behaviorName) {
    return Astro.Behavior.behaviors[behaviorName];
  }
};