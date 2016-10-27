import {
  difference,
  each,
  forOwn,
  keys
}
from 'lodash';
import setOne from './set_one.js';

function setAll(doc, fieldsValues, options) {
  const Class = doc.constructor;

  // Get names of the fields that are not present in the fieldsValues variable.
  const fieldsNames = difference(Class.getFieldsNames(), keys(fieldsValues));

  each(fieldsNames, (fieldName) => {
    setOne(doc, fieldName, undefined, options);
  });

  forOwn(fieldsValues, (fieldValue, fieldName) => {
    setOne(doc, fieldName, fieldValue, options);
  });
};

export default setAll;