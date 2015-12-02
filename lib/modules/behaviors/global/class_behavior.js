Astro.ClassBehavior = class ClassBehavior {
  constructor(classBehaviorDefinition) {
    this.behavior = classBehaviorDefinition.behavior;
    this.options = classBehaviorDefinition.options;
    this.definition = this.behavior.createSchemaDefinition(this.options);
    _.extend(this, this.behavior.methods);
  }

  callMethod(methodName, doc) {
    var method = this.behavior.methods[methodName];
    if (!_.isFunction(method)) {
      throw new Error(
        'The "' + methodName + '" method in the "' +
        this.behavior.name + '" behavior does not exist '
      );
    }

    return method.call(doc);
  }
};