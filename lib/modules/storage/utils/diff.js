import _each from 'lodash/each';
import _isArray from 'lodash/isArray';
import _isPlainObject from 'lodash/isPlainObject';
import _keys from 'lodash/keys';
import _noop from 'lodash/noop';
import _union from 'lodash/union';
import { EJSON } from 'meteor/ejson';

function diff(args = {}) {
  const {
    fieldName,
    newDoc,
    oldDoc,
    prefix = '',
    result,
    onDiff = _noop,
    onObjectDiff = _noop,
    onListDiff = _noop,
    onScalarDiff = _noop,
  } = args;

  // Combine fields from old and new document.
  const fieldsNames = _union(_keys(oldDoc), _keys(newDoc));

  // Loop through all fields and check if they differ.
  _each(fieldsNames, function(fieldName) {
    const oldValue = oldDoc[fieldName];
    const newValue = newDoc[fieldName];

    if (!EJSON.equals(oldValue, newValue)) {
      const nestedPrefix = (prefix && prefix + '.') + fieldName;

      onDiff({
        oldValue,
        newValue,
        prefix: nestedPrefix,
        result
      });

      // Compare two objects.
      if (_isPlainObject(oldValue) && _isPlainObject(newValue)) {
        onObjectDiff({
          oldDoc: oldValue,
          newDoc: newValue,
          prefix: nestedPrefix,
          result
        });
      }
      // Compare two lists.
      else if (_isArray(oldValue) && _isArray(newValue)) {
        onListDiff({
          oldList: oldValue,
          newList: newValue,
          prefix: nestedPrefix,
          result
        });
      }
      // Compare two scalars.
      else {
        onScalarDiff({
          oldValue,
          newValue,
          prefix: nestedPrefix,
          result
        });
      }
    }
  });
}

export default diff;