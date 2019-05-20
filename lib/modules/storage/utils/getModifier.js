import _each from "lodash/each";
import _isNaN from "lodash/isNaN";
import _isNumber from "lodash/isNumber";
import _isPlainObject from "lodash/isPlainObject";
import _omitBy from "lodash/omitBy";
import _size from "lodash/size";
import { EJSON } from "meteor/ejson";
import throwParseError from "../../core/utils/throw_parse_error.js";
import rawMany from "../../fields/utils/rawMany";
import diff from "./diff";

const handlers = {};

handlers.onObjectDiff = function({ oldDoc, newDoc, prefix, result }) {
  diff({
    oldDoc,
    newDoc,
    prefix,
    result,
    ...handlers
  });
};

handlers.onListDiff = function({ oldList, newList, prefix, result }) {
  // NOTE: We need check a new array size. If its length increased or stayed the
  // same then all changes can be registered using the $set modifier. If an
  // array length decreased, then we should slice it. However it may not be
  // possible if some element has also changed. In such situation we have to
  // override entire array.

  // Array length decreased.
  if (newList.length < oldList.length) {
    // Due to an error in MiniMongo it's not possible to apply $push modifier
    // with the $slice operator set to positive number. That's why we have to
    // override entire array when it was shrinked.
    result.$set[prefix] = newList;
  }
  // Array length increased or stayed the same.
  else if (newList.length >= oldList.length) {
    let modified = false;
    // Compare up to number of elements in the new list.
    _each(newList, (newElement, index) => {
      const arrayPrefix = `${prefix}.${index}`;
      const oldElement = oldList[index];
      // When iterating over elements up to old array length.
      if (index < oldList.length) {
        if (!EJSON.equals(oldElement, newElement)) {
          modified = true;
          // If both array elements are object, then we perform diff.
          if (_isPlainObject(oldElement) && _isPlainObject(newElement)) {
            // Get a difference between elements.
            diff({
              oldDoc: oldElement,
              newDoc: newElement,
              prefix: arrayPrefix,
              result,
              ...handlers
            });
          } else {
            result.$set[arrayPrefix] = newElement;
          }
        }
      }
      // When iterating over newly added array elements.
      else {
        // Elements up to the old array length were modified, so we can not
        // use the $push operator in conjunction with the $set operator.
        if (modified) {
          // If both array elements are object, then we perform diff.
          if (_isPlainObject(oldElement) && _isPlainObject(newElement)) {
            // Get a difference between elements.
            diff({
              oldDoc: oldElement,
              newDoc: newElement,
              prefix: arrayPrefix,
              result,
              ...handlers
            });
          } else {
            result.$set[arrayPrefix] = newElement;
          }
        }
        // Elements up to the old array length were not modified, so if there
        // is any new array element added, we can insert it with the $push
        // operator.
        else {
          // We have to check if there is only one element being pushed or
          // more. If there is only one element then we use
          // $push[prefix]: element
          if (newList.length - oldList.length === 1) {
            result.$push[prefix] = newElement;
          }
          // If there are more elements we have to use
          // $push: { [prefix]: { $each: elements } }
          else {
            result.$push[prefix] = {
              $each: newList.slice(index)
            };
            // We have to break each loop here. We don't need to check any
            // more elements.
            return false;
          }
        }
      }
    });
  }
};

handlers.onScalarDiff = function({ oldValue, newValue, prefix, result }) {
  if (newValue !== undefined) {
    if (
      _isNumber(oldValue) &&
      _isNumber(newValue) &&
      !_isNaN(oldValue) &&
      !_isNaN(newValue)
    ) {
      result.$inc[prefix] = newValue - oldValue;
    } else {
      result.$set[prefix] = newValue;
    }
  } else {
    result.$unset[prefix] = "";
  }
};

const getModifier = function(options = {}) {
  let {
    doc: newDoc,
    transient = false,
    immutable = false,
    fields,
    oldDoc
  } = options;

  const Class = newDoc.constructor;
  const opts = {
    defaults: false
  };
  if (!oldDoc) {
    oldDoc = Class.findOne(newDoc._id, opts);
  }
  if (!oldDoc) {
    oldDoc = new Class({}, opts);
  }

  // If there is no document before modifications that may mean that we are not
  // subscribed to the publication publishing given document or we modified the
  // _id of a document.
  if (!oldDoc) {
    throwParseError([
      {
        module: "storage"
      },
      {
        utility: "getModified"
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
    $inc: {},
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
  return _omitBy(result, modifier => {
    return _size(modifier) === 0;
  });
};

export default getModifier;
