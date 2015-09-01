var methods = {};

methods._traverseNestedFields = function(fieldName, callback) {
  var doc = this;
  var Class = doc.constructor;

  // Check whether the given field name is pattern.
  if (fieldName.indexOf('.') === -1) {
    // If it's not a pattern, then just invoke callback function.
    callback(doc, fieldName);
    return;
  }

  // Split the nested field name pattern by the "." sign.
  var segments = fieldName.split('.');
  var lastIndex = segments.length - 1;

  // Traverse nested fields until reaching the last one from the pattern.
  var next = function(nestedField, segmentIndex) {
    // Get a nested field name under the given index.
    var nestedFieldName = segments[segmentIndex];

    if (segmentIndex === lastIndex) {
      // Ivoke the callback function, if we reached the last nested field.
      callback(nestedField, nestedFieldName);
    } else {
      // Check if the value of the current nested field is an object, so that
      // we can go deeper.
      if (_.isObject(nestedField[nestedFieldName])) {
        var nextNestedField = nestedField[nestedFieldName];
        var nextSegmentIndex = segmentIndex + 1;
        if (nextNestedField instanceof Astro.BaseClass) {
          var remainingFieldName = segments.slice(nextSegmentIndex).join('.');
          nextNestedField._traverseNestedFields(
            remainingFieldName,
            callback
          );
        } else {
          next(nextNestedField, nextSegmentIndex);
        }
      } else {
        return;
      }
    }
  };

  // Start traversing nested fields.
  next(doc, 0);
};

_.extend(Astro.BaseClass.prototype, methods);
