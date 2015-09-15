Astro.ClassBehavior = function ClassBehavior(classBehaviorDefinition) {
  this.behavior = classBehaviorDefinition.behavior;
  this.options = classBehaviorDefinition.options;
};

Astro.ClassBehavior.prototype.createSchemaDefinition = function() {
  return this.behavior.createSchemaDefinition(this.options);
};
