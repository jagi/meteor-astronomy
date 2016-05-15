import _ from 'lodash';

function omitUndefined(obj) {
  const result = {};
  _.forOwn(obj, function(value, key) {
    if (_.isPlainObject(value)) {
      result[key] = omitUndefined(value);
    }
    else if (!_.isUndefined(value)) {
      result[key] = value;
    }
  });
  return result;
}

export default omitUndefined;