import _cloneDeepWith from 'lodash/cloneDeepWith';
import _isPlainObject from 'lodash/isPlainObject';
import _isArray from 'lodash/isArray';

function cloneDefinition(definition) {
  return _cloneDeepWith(definition, (value) => {
    if (!_isPlainObject(value) && !_isArray(value)) {
      return value;
    }
  });
}

export default cloneDefinition;