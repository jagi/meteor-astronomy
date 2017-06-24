import has from 'lodash/has';

function hasBehavior(behaviorName) {
  return has(this.schema.behaviors, behaviorName);
};

export default hasBehavior;