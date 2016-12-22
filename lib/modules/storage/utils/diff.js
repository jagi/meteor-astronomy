import {
  each,
  isArray,
  isPlainObject,
  keys,
  noop,
  union
}
from 'lodash';
import {
  EJSON
}
from 'meteor/ejson';

function diff(args = {}) {
  const {
    fieldName,
    newDoc,
    oldDoc,
    prefix = '',
    result,
    onDiff = noop,
    onObjectDiff = noop,
    onListDiff = noop,
    onScalarDiff = noop,
  } = args;

  // Combine fields from old and new document.
  const fieldsNames = union(keys(oldDoc), keys(newDoc));

  // Loop through all fields and check if they differ.
  each(fieldsNames, function(fieldName) {
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
      if (isPlainObject(oldValue) && isPlainObject(newValue)) {
        onObjectDiff({
          oldDoc: oldValue,
          newDoc: newValue,
          prefix: nestedPrefix,
          result
        });
      }
      // Compare two lists.
      else if (isArray(oldValue) && isArray(newValue)) {
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