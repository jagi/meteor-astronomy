import {
  each,
  isPlainObject,
  omitBy,
  size
}
from 'lodash';
import {
  EJSON
}
from 'meteor/ejson';
import throwParseError from '../../core/utils/throw_parse_error.js';
import rawMany from '../../fields/utils/rawMany';
import diff from './diff';

const handlers = {};

handlers.onObjectDiff = function({oldDoc, newDoc, prefix, result}) {
  diff({
    oldDoc,
    newDoc,
    prefix,
    result,
    ...handlers
  });
};

handlers.onListDiff = function({oldList, newList, prefix, result}) {
  // NOTE: We need check a new array size. If its length increased or stayed the
  // same then all changes can be registered using the $set modifier. If an
  // array length decreased, then we should slice it. However it may not be
  // possible if some element has also changed. In such situation we have to
  // override entire array.

  if (
    // If an array was empty, then we override entire field with a new array.
    // That way we solve a problem with treating array indexes as object keys,
    // which cause inserting Object instead of Array into the Mongo collection.
    (newList.length > 0 && oldList.length === 0) ||
    // Array length decreased. Due to an error in MiniMongo it's not possible to
    // apply $push modifier with the $slice operator set to positive number.
    // That's why we have to override entire array when it was shrinked.
    (newList.length < oldList.length)
  ) {
    result.$set[prefix] = newList;
  }
  // Array length increased or stayed the same.
  else if (newList.length >= oldList.length) {
    // Compare up to number of elements in the new list.
    each(newList, function(newElement, index) {
      const arrayPrefix = `${prefix}.${index}`;
      const oldElement = oldList[index];
      if (!EJSON.equals(oldElement, newElement)) {
        // If both array elements are object, then we perform diff between
        // them.
        if (isPlainObject(oldElement) && isPlainObject(newElement)) {
          // Get a difference between elements.
          diff({
            oldDoc: oldElement,
            newDoc: newElement,
            prefix: arrayPrefix,
            result,
            ...handlers
          });
        }
        else {
          result.$set[arrayPrefix] = newElement;
        }
      }
    });
  }
};

handlers.onScalarDiff = function({oldValue, newValue, prefix, result}) {
  if (newValue !== undefined) {
    result.$set[prefix] = newValue;
  }
  else {
    result.$unset[prefix] = '';
  }
};

function getModifier(options = {}) {
  let {
    doc: newDoc,
    transient = false,
    immutable = false,
    fields
  } = options;

  const Class = newDoc.constructor;
  const opts = {
    defaults: false
  };
  let oldDoc = Class.findOne(newDoc._id, opts);
  if (!oldDoc) {
    oldDoc = new Class({}, opts);
  }

  // If there is no document before modifications that may mean that we are not
  // subscribed to the publication publishing given document or we modified the
  // _id of a document.
  if (!oldDoc) {
    throwParseError([{
        'module': 'storage'
      }, {
        'utility': 'getModified'
      },
      `Can not get a document before modifications. You are not subscribed ` +
      `to the publication publishing a "${Class.getName()}" document with ` +
      `the id "${newDoc._id}" or you have modified the "_id" field`
    ]);
  }

  // If there are not fields specified, then get all of them.
  if (!fields) {
    fields = Class.getFieldsNames();
  }

  const result = {
    $set: {},
    $unset: {},
    $push: {}
  };
  diff({
    // Get raw data from the docs.
    oldDoc: rawMany(oldDoc, fields, {
      transient,
      immutable,
      undefined: false
    }),
    newDoc: rawMany(newDoc, fields, {
      transient,
      immutable,
      undefined: false
    }),
    result,
    ...handlers
  });

  // Return only non empty modifiers.
  return omitBy(result, (modifier) => {
    return size(modifier) === 0;
  });
};

export default getModifier;