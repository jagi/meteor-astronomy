Astro.ClassBehavior = function ClassBehavior(classBehaviorDefinition) {
  this.behavior = classBehaviorDefinition.behavior;
  this.options = classBehaviorDefinition.options;
  this.definition = this.behavior.createSchemaDefinition(this.options);
};
