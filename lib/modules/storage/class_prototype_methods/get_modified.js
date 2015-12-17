let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.getModified = function(old) {
  old = old || false;

  let currDoc = this;
  let Class = currDoc.constructor;
  let Collection = Class.getCollection();
  let prevDoc = currDoc._id ? Class.findOne(currDoc._id) : new Class();

  // Get raw data from the docs.
  let rawCurrDoc = Astro.utils.fields.rawAll(
    currDoc,
    {transient: false, immutable: false}
  );
  let rawPrevDoc = Astro.utils.fields.rawAll(
    prevDoc,
    {transient: false, immutable: false}
  );

  let diff = function(currDoc, prevDoc) {
    let modified = {};

    if (currDoc === null || currDoc === undefined || !_.isObject(currDoc)) {
      return modified;
    }

    // Loop through all fields.
    _.each(currDoc, function(currFieldValue, fieldName) {
      let prevFieldValue = prevDoc[fieldName];

      if (
        _.isArray(currFieldValue) && _.isArray(prevFieldValue) &&
        currFieldValue.length >= prevFieldValue.length
      ) {

        // The number of elements after modifications is greater or equal to the
        // number of elements before modifications. We have to compare each
        // elements and add any new element.
        for (let i = 0; i < currFieldValue.length; i++) {
          // Get the current value of the element.
          let currElement = currFieldValue[i];
          // Get the previous (original) value of the element.
          let prevElement = prevFieldValue[i];
          // If it's an element that existed before modifications.
          if (i < prevFieldValue.length) {
            // Get a difference between elements.
            let subModified = diff(currElement, prevElement);
            // If there are any differences between elements.
            if (_.size(subModified) > 0) {
              _.each(subModified, function(subFieldValue, subFieldName) {
                modified[fieldName + '.' + i + '.' + subFieldName] =
                  subFieldValue;
              });
            }
          } else {
            // If it's a new element.
            modified[fieldName + '.' + i] = old ? prevElement : currElement;
          }
        }

      }
      else if (
        // FIXME: We should use the _.isPlainObject method from lodash when it
        // will be merged into underscore.
        _.isObject(currFieldValue) && _.isObject(prevFieldValue) &&
        currFieldValue.constructor === Object
      ) {

        let subModified = diff(currFieldValue, prevFieldValue);
        if (_.size(subModified) > 0) {
          _.each(subModified, function(nestedFieldValue, nestedFieldName) {
            modified[fieldName + '.' + nestedFieldName] = nestedFieldValue;
          });
        }

      }
      else {

        let currPlainValue = currFieldValue ?
          currFieldValue.valueOf() : currFieldValue;
        let prevPlainValue = prevFieldValue ?
          prevFieldValue.valueOf() : prevFieldValue;

        if (currPlainValue !== prevPlainValue) {
          // Take a value before or after modification.
          modified[fieldName] = old ? prevFieldValue : currFieldValue;
        }

      }
    });

    return modified;
  };

  return diff(
    rawCurrDoc,
    rawPrevDoc
  );
};