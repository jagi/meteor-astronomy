import _each from 'lodash/each';
import _isPlainObject from 'lodash/isPlainObject';
import _range from 'lodash/range';
import { EJSON } from 'meteor/ejson';
import throwParseError from '../../core/utils/throw_parse_error.js';
import rawMany from '../../fields/utils/rawMany';
import diff from './diff';

const handlers = {};

handlers.onDiff = function({prefix, result}) {
  result.push(prefix);
};

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
  const maxLength = Math.max(oldList.length, newList.length);
  _each(_range(maxLength), function(index) {
    const arrayPrefix = `${prefix}.${index}`;
    const oldElement = oldList[index];
    const newElement = newList[index];
    if (!EJSON.equals(oldElement, newElement)) {
      result.push(arrayPrefix);
      // If both array elements are object, then we perform diff between
      // them.
      if (_isPlainObject(oldElement) && _isPlainObject(newElement)) {
        // Get a difference between elements.
        diff({
          oldDoc: oldElement,
          newDoc: newElement,
          prefix: arrayPrefix,
          result,
          ...handlers
        });
      }
    }
  });
};

function getModified(options = {}) {
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

  const result = [];
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
  return result;
};

export default getModified;