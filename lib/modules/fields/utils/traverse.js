import isNestedFieldName from './is_nested_field_name.js';
import AstroClass from '../../../core/class.js';

function traverse(doc, name, callback) {
  if (!doc) {
    return;
  }

  let Class;
  let field;

  // Check whether the given field name is a nested field name.
  if (!isNestedFieldName(name)) {
    // Get a class.
    let Class = doc.constructor;
    // Get a field definition.
    let field = Class.getField(name);
    // Execute the callback function passing the last nested document, the last
    // segment name and a field object.
    return callback(doc, name, field);
  }

  // Split the nested field pattern name by the "." character.
  let segments = name.split('.');
  // Get the last and one before the last index.
  let lastIndex = segments.length - 1;

  // Traverse nested fields until reaching the last one from the pattern.
  let next = function(nestedDoc, segmentIndex) {
    segmentIndex = segmentIndex || 0;
    // Get a nested field name under the given index.
    let segment = segments[segmentIndex];
    // Check if a nested document is an instance of the Astronomy class and get
    // a field object for a given field name;
    if (nestedDoc instanceof AstroClass) {
      // Get a class for of a nested document.
      Class = nestedDoc.constructor;
      // Get a field object from the nested class.
      field = Class.getField(segment);
    }
    if (segmentIndex === lastIndex) {
      // Execute the callback function, if we reached the last nested document.
      return callback(nestedDoc, segment, field);
    }
    else if (_.isObject(nestedDoc[segment])) {
      // Go deeper if a value of the current nested document is an object.
      return next(nestedDoc[segment], segmentIndex + 1);
    }
  };

  // Start traversing nested fields.
  return next(doc);
};

export default traverse;