import _ from 'lodash';

function omitUndefined(obj) {
  return _.transform(obj, function(result, value, key) {
    if (_.isPlainObject(value)) {
      result[key] = omitUndefined(value);
    }
    else if (!_.isUndefined(value)) {
      result[key] = value;
    }
  });
}

export default omitUndefined;