import {
  each,
  extend,
  isArray,
  isObject,
  isString
}
from 'lodash';
import setMany from '../utils/set_many.js';
import setOne from '../utils/set_one.js';
import castNested from '../utils/castNested';

function merge(doc) {
  const result = {};
  each(doc, (fieldValue, fieldName) => {
    // If a field value is an object then we prefix each nested field name with
    // a field name of the parent object. However, we can not do it for arrays
    // as it's not obvious how we would like to merge arrays - concat/replace?
    if (isObject(fieldValue) && !isArray(fieldValue)) {
      each(merge(fieldValue), (nestedFieldValue, nestedFieldName) => {
        result[`${fieldName}.${nestedFieldName}`] = nestedFieldValue;
      });
    }
    else {
      result[fieldName] = fieldValue;
    }
  });
  return result;
}

function set(...args) {
  const doc = this;

  // Default options.
  const options = {
    defaults: true,
    clone: true,
    cast: false,
    merge: false
  };

  // Setting single field.
  if (isString(args[0]) && args.length >= 2) {
    // The last argument is an options object.
    if (isObject(args[2])) {
      extend(options, args[2]);
    }
    // Do not override values if the "merge" option is set and instead merge
    // nested objects.
    if (options.merge && isObject(args[1])) {
      setMany(doc, merge({
        [args[0]]: args[1]
      }), options);
    }
    else {
      setOne(doc, args[0], args[1], options);
    }
  }
  // Setting multiple fields at once.
  else if (isObject(args[0]) && args.length >= 1) {
    // The last argument is an options object.
    if (isObject(args[1])) {
      extend(options, args[1]);
    }
    // Do not override values if the "merge" option is set and instead merge
    // nested objects.
    if (options.merge) {
      setMany(doc, merge(args[0]), options);
    }
    else {
      setMany(doc, args[0], options);
    }
  }
};

export default set;