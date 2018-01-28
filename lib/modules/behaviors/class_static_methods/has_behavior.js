import _has from 'lodash/has';

function hasBehavior(behaviorName) {
  return _has(this.schema.behaviors, behaviorName);
};

export default hasBehavior;