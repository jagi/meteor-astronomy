import rawAll from '../../fields/utils/raw_all.js';

function getModifier(options) {
  let {
    doc: newDoc,
    transient = false,
    immutable = false
  } = options;

  let Class = newDoc.constructor;
  let oldDoc = newDoc._isNew ? new Class() : Class.findOne(newDoc._id);

  let diff = function({
    oldDoc,
    newDoc,
    prefix = ''
  }) {
    let $set = {};
    let $unset = {};
    let $push = {};

    _.each(newDoc, function(newValue, fieldName) {
      let oldValue = oldDoc[fieldName];
      if (!EJSON.equals(oldValue, newValue)) {
        let nestedPrefix = (prefix && prefix + '.') + fieldName;

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
            let arrayPrefix = nestedPrefix + '.' + index;
            let oldElement = oldValue[index];
            if (!EJSON.equals(oldElement, newElement)) {
              // If both array elements are object, then we perform diff between
              // them.
              if (_.isPlainObject(oldElement) && _.isPlainObject(
                  newElement)) {
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
          // Array length increased or stayed the same.
          if (newValue.length >= oldValue.length) {
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

  // Get modifier.
  return diff({
    // Get raw data from the docs.
    oldDoc: rawAll(oldDoc, {
      transient,
      immutable
    }),
    newDoc: rawAll(newDoc, {
      transient,
      immutable
    })
  });
};

export default getModifier;