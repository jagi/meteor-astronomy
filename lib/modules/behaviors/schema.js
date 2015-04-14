var prototype = Astronomy.Schema.prototype;

prototype.addBehavior = function(behaviorName, behaviorOptions) {
  if (!_.isString(behaviorName)) {
    return;
  }
  behaviorOptions = behaviorOptions || {};

  // Check if bahavior with given name exists.
  if (!_.has(Behaviors, behaviorName)) {
    throw new Error('Behavior with the name `' + behaviorName +
      '` is not defined');
  }

  var behaviorDefinition = Behaviors[behaviorName];

  this._behaviors[behaviorName] = behaviorOptions;

  if (behaviorDefinition.events) {
    this.addEvents(behaviorDefinition.events);
  }
  if (behaviorDefinition.fields) {
    this.addFields(behaviorDefinition.fields);
  }
  if (behaviorDefinition.methods) {
    this.addMethods(behaviorDefinition.methods);
  }
  if (behaviorDefinition.validators) {
    this.addValidators(behaviorDefinition.validators);
  }
};

prototype.addBehaviors = function(behaviors) {
  if (_.isArray(behaviors)) {
    _.each(behaviors, function(behaviorName) {
      this.addBehavior(behaviorName, {});
    }, this);
  } else if (_.isObject(behaviors)) {
    _.each(behaviors, function(behavior, behaviorName) {
      this.addBehavior(behaviorName, behavior);
    }, this);
  }
};
