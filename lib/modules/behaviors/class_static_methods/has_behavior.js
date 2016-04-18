import _ from 'lodash';

function hasBehavior(behaviorName) {
  return _.has(this.schema.behaviors, behaviorName);
};

export default hasBehavior;