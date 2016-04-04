function throwParseError(details) {
  let message = '';

  _.each(details, function(detail) {
    if (_.isObject(detail)) {
      _.each(detail, function(value, key) {
        message += '["' + value + '" ' + key + ']'
      });
    } else if (_.isString(detail)) {
      message += ' ' + detail;
    }
  });

  throw new TypeError(message);
};

export default throwParseError;