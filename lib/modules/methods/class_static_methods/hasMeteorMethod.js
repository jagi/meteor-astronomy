import _has from 'lodash/has';

function hasMethod(methodName) {
  return _has(this.schema.methods, methodName);
};

export default hasMethod;