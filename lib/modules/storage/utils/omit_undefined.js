import _ from 'lodash';

function omitUndefined(obj) {
  return _.reduce(obj, function(result, value, key) {
    if (_.isPlainObject(value)) {
      result[key] = omitUndefined(value);
    }
    else if (!_.isUndefined(value)) {
      result[key] = value;
    }
    return result;
  }, {});
}

export default omitUndefined;