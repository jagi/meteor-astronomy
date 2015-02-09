Schema.prototype.addBehavior = function (behaviorName, behaviorOptions) {
  if (!_.isString(behaviorName)) return;
  behaviorOptions = behaviorOptions || {};

  // Check if bahavior with given name exists.
  if (!_.has(Astronomy._behaviors, behaviorName)) throw new Error('Behavior with the name `' + behaviorName + '` is not defined');

  var behaviorDefinition = Astronomy._behaviors[behaviorName];

  this._behaviors[behaviorName] = behaviorOptions;

  if (behaviorDefinition.events) this.addEvents(behaviorDefinition.events);
  if (behaviorDefinition.fields) this.addFields(behaviorDefinition.fields);
  if (behaviorDefinition.methods) this.addMethods(behaviorDefinition.methods);
  if (behaviorDefinition.validators) this.addValidators(behaviorDefinition.validators);
};

Schema.prototype.addBehaviors = function (behaviors) {
  if (_.isArray(behaviors)) {
    for (var i = 0, length = behaviors.length; i < length; i++) {
      this.addBehavior(behaviors[i], {});
    }
  } else if (_.isObject(behaviors)) {
    for (var behaviorName in behaviors) {
      this.addBehavior(behaviorName, behaviors[behaviorName]);
    }
  }
};
