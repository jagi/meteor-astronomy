var classMethods = {};

classMethods.getBehavior = function(behaviorName) {
  return this.schema.behaviors[behaviorName];
};

classMethods.getBehaviors = function() {
  return this.schema.behaviors;
};

Astro.eventManager.on(
  'initClass', function onInitClassBehaviors() {
    var Class = this;
    var schema = Class.schema;

    _.extend(Class, classMethods);

    schema.behaviors = schema.behaviors || {};
  }
);
