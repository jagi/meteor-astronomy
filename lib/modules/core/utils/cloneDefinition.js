import cloneDeepWith from 'lodash/cloneDeepWith';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';

function cloneDefinition(definition) {
  return cloneDeepWith(definition, (value) => {
    if (!isPlainObject(value) && !isArray(value)) {
      return value;
    }
  });
}

export default cloneDefinition;