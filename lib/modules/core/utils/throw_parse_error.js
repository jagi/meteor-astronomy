import each from 'lodash/each';
import isObject from 'lodash/isObject';

function throwParseError(details) {
  let message = '';

  each(details, (detail) => {
    if (isObject(detail)) {
      each(detail, (value, key) => {
        message += '["' + value + '" ' + key + ']'
      });
    }
    else if (typeof detail === 'string') {
      message += ' ' + detail;
    }
  });

  throw new TypeError(message);
};

export default throwParseError;