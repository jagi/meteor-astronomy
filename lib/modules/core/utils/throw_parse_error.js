import _each from 'lodash/each';
import _isObject from 'lodash/isObject';

function throwParseError(details) {
  let message = '';

  _each(details, (detail) => {
    if (_isObject(detail)) {
      _each(detail, (value, key) => {
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