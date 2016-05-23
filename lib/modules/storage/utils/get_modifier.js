import _ from 'lodash';
import throwParseError from '../../core/utils/throw_parse_error.js';
import rawMany from '../../fields/utils/raw_many.js';
import omitUndefined from './omit_undefined.js';

function diff({
  oldDoc,
  newDoc,
  prefix = ''
}) {
  let $set = {};
  let $unset = {};
  let $push = {};

  const fieldsNames = _.union(_.keys(oldDoc), _.keys(newDoc));
  _.each(fieldsNames, function(fieldName) {
    const oldValue = oldDoc[fieldName];
    const newValue = newDoc[fieldName];

    if (!EJSON.equals(oldValue, newValue)) {
      const nestedPrefix = (prefix && prefix + '.') + fieldName;

      // Compare two objects.
      if (_.isPlainObject(oldValue) && _.isPlainObject(newValue)) {

        let {
          $set: $nestedSet,
          $unset: $nestedUnset,
          $push: $nestedPush
        } = diff({
          oldDoc: oldValue,
          newDoc: newValue,
          prefix: nestedPrefix
        });
        _.extend($set, $nestedSet);
        _.extend($unset, $nestedUnset);
        _.extend($push, $nestedPush);

      }
      // Compare two arrays.
      else if (_.isArray(oldValue) && _.isArray(newValue)) {

        // NOTE: We need check a new array size. If its length increased or
        // stayed the same then all changes can be registered using the $set
        // modifier. If an array length decreased, then we should slice it.
        // However it may not be possible if some element has also changed.
        // In such situation we have to override entire array.
        let $arraySet = {};
        let $arrayUnset = {};
        let $arrayPush = {};
        // Compare up to number of elements in the array after the change.
        _.each(newValue, function(newElement, index) {
          const arrayPrefix = nestedPrefix + '.' + index;
          const oldElement = oldValue[index];
          if (!EJSON.equals(oldElement, newElement)) {
            // If both array elements are object, then we perform diff between
            // them.
            if (_.isPlainObject(oldElement) && _.isPlainObject(newElement)) {
              // Get a difference between elements.
              let {
                $set: $elementSet,
                $unset: $elementUnset,
                $push: $elementPush
              } = diff({
                oldDoc: oldElement,
                newDoc: newElement,
                prefix: arrayPrefix
              });
              _.extend($arraySet, $elementSet);
              _.extend($arrayUnset, $elementUnset);
              _.extend($arrayPush, $elementPush);
            }
            else {
              $arraySet[arrayPrefix] = newElement;
            }
          }
        });

        // If an array was empty, then we override entire field with a new
        // array. That way we solve a problem with treating array indexes as
        // object keys, which cause inserting Object instead of Array into the
        // Mongo collection.
        if (oldValue.length === 0 && newValue.length > 0) {
          $set[nestedPrefix] = newValue;
        }
        // Array length increased or stayed the same.
        else if (newValue.length >= oldValue.length) {
          _.extend($set, $arraySet);
          _.extend($unset, $arrayUnset);
          _.extend($push, $arrayPush);
        }
        // Array length decreased.
        else {
          // At least one array element has changed.
          // FIXME: Due to an error in MiniMongo it's not possible to apply
          // $push modifier with the $slice operator set to positive number.
          // That's why the following "if" statement is always true and we
          // have to override entire array when it was shrinked.
          if (true || _.size($arraySet) > 0 || _.size($arrayPush) > 0) {
            // So, we need to override entire array with its new state.
            $set[nestedPrefix] = newValue;
          }
          // Array elements have not changed. The array length just shrinked.
          else {
            $push[nestedPrefix] = {
              // We do not want to add any elements, we just want to slice an
              // array.
              $each: [],
              // Slice array to new array length.
              $slice: newValue.length
            };
          }
        }

      }
      else {

        if (newValue !== undefined) {
          $set[nestedPrefix] = newValue;
        }
        else {
          $unset[nestedPrefix] = '';
        }
      }
    }
  });

  // Return only non empty modifiers.
  let modifier = {};
  if (_.size($set)) {
    modifier.$set = $set;
  }
  if (_.size($unset)) {
    modifier.$unset = $unset;
  }
  if (_.size($push)) {
    modifier.$push = $push;
  }
  return modifier;
};

function getModifier(options) {
  let {
    doc: newDoc,
    transient = false,
    immutable = false,
    fields
  } = options;

  const Class = newDoc.constructor;
  const Collection = Class.getCollection();
  const oldDoc = newDoc._isNew ? new Class() : Collection.findOne(newDoc._id, {
    transform: null
  });
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

  return diff({
    // Get raw data from the docs.
    oldDoc,
    newDoc: omitUndefined(rawMany(newDoc, fields, {
      transient,
      immutable
    }))
  });
};

export default getModifier;