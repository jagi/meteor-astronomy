import isPlainObject from 'lodash/isPlainObject';
import transform from 'lodash/transform';

function omitUndefined(obj) {
  return transform(obj, function(result, value, key) {
    if (isPlainObject(value)) {
      result[key] = omitUndefined(value);
    }
    else if (value !== undefined) {
      result[key] = value;
    }
  });
}

export default omitUndefined;