function getBehavior(behaviorName) {
  return this.schema.behaviors[behaviorName];
};

export default getBehavior;