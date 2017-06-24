import has from 'lodash/has';

function hasMethod(methodName) {
  return has(this.schema.methods, methodName);
};

export default hasMethod;