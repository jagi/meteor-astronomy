import _isPlainObject from 'lodash/isPlainObject';
import _transform from 'lodash/transform';

function omitUndefined(obj) {
  return _transform(obj, function(result, value, key) {
    if (_isPlainObject(value)) {
      result[key] = omitUndefined(value);
    }
    else if (value !== undefined) {
      result[key] = value;
    }
  });
}

export default omitUndefined;