import {
  cloneDeepWith,
  isPlainObject,
  isArray
}
from 'lodash';

function cloneDefinition(definition) {
  return cloneDeepWith(definition, function(value) {
    if (!isPlainObject(value) && !isArray(value)) {
      return value;
    }
  });
}

export default cloneDefinition;