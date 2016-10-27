import {
  isObject
}
from 'lodash';
import {
  EJSON
}
from 'meteor/ejson';
import traverse from '../utils/traverse.js';
import warn from '../../core/utils/warn.js';

function setOne(doc, fieldPattern, fieldValue, options) {
  // If the "clone" option was set and the value being set is an object,
  // then we clone value using the "EJSON.clone" function.
  if (options.clone && isObject(fieldValue)) {
    fieldValue = EJSON.clone(fieldValue);
  }

  return traverse(
    doc, fieldPattern,
    (nestedDoc, nestedFieldName, field) => {
      // If a field does not exist than we don't return anything.
      if (!field) {
        const Class = doc.constructor;
        const className = Class.getName();
        warn(
          `["${className}" class]["${fieldPattern}" field] ` +
          'Trying to set a value of the field that does not exist in the class'
        );
        return;
      }

      // Cast value if the "cast" option was set.
      if (options.cast) {
        fieldValue = field.cast(fieldValue, options);
      }

      // Set default value if the "defualts" option was set.
      if (fieldValue === undefined && options.defaults) {
        fieldValue = field.getDefault();
      }

      // Finally set casted/cloned/untouched value.
      nestedDoc[nestedFieldName] = fieldValue;
    }
  );
}

export default setOne;