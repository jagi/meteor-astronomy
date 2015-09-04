Astro.utils.fields = {};

Astro.utils.fields.traverseNestedDocs = function(doc, fieldName, callback) {
  // Method for running callback function with all its arguments.
  var runCallback = function(nestedDoc, nestedFieldName, index) {
    var Class;
    var field;
    if (nestedDoc instanceof Astro.BaseClass) {
      Class = nestedDoc.constructor;
      field = Class.getField(nestedFieldName);
    }
    callback(nestedDoc, nestedFieldName, Class, field, index);
  };

  // Check whether the given field name is pattern.
  if (fieldName.indexOf('.') === -1) {
    // If it's not a pattern, then just invoke callback function.
    runCallback(doc, fieldName);
    return;
  }

  // Split the nested field name pattern by the "." sign.
  var segments = fieldName.split('.');
  var lastIndex = segments.length - 1;
  var oneBeforeLastIndex = lastIndex - 1;

  // Check wheter the last segment is a number. If it is, then we have to change
  // the way how we traverse the last field.
  var lastSegment = segments[lastIndex];
  var lastSegmentIsNumber = /^\d+$/.test(lastSegment);
  if (lastSegmentIsNumber) {
    lastSegment = parseInt(lastSegment, 10);
  }

  // Traverse nested fields until reaching the last one from the pattern.
  var next = function(nestedDoc, segmentIndex) {
    // Get a nested field name under the given index.
    var nestedFieldName = segments[segmentIndex];

    if (segmentIndex === lastIndex) {
      // Ivoke the callback function, if we reached the last nested document.
      runCallback(nestedDoc, nestedFieldName);
    } else if (lastSegmentIsNumber && segmentIndex === oneBeforeLastIndex) {
      runCallback(nestedDoc, nestedFieldName, lastSegment);
    } else {
      // Check if the value of the current nested document is an object, so that
      // we can go deeper.
      if (_.isObject(nestedDoc[nestedFieldName])) {
        var nextNestedDoc = nestedDoc[nestedFieldName];
        var nextSegmentIndex = segmentIndex + 1;
        if (nextNestedDoc instanceof Astro.BaseClass) {
          var remainingFieldName = segments.slice(nextSegmentIndex).join('.');
          Astro.utils.fields.traverseNestedDocs(
            nextNestedDoc,
            remainingFieldName,
            callback
          );
        } else {
          next(nextNestedDoc, nextSegmentIndex);
        }
      } else {
        return;
      }
    }
  };

  // Start traversing nested fields.
  next(doc, 0);
};
