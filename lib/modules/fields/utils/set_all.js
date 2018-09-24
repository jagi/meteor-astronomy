import _difference from 'lodash/difference';
import _each from 'lodash/each';
import _forOwn from 'lodash/forOwn';
import _keys from 'lodash/keys';
import setOne from './set_one.js';

function setAll(doc, fieldsValues, options) {
  const Class = doc.constructor;

  // Get names of the fields that are not present in the fieldsValues variable.
  const fieldsNames = _difference(Class.getFieldsNames(), _keys(fieldsValues));

  _each(fieldsNames, (fieldName) => {
    setOne(doc, fieldName, undefined, options);
  });

  _forOwn(fieldsValues, (fieldValue, fieldName) => {
    setOne(doc, fieldName, fieldValue, options);
  });
};

export default setAll;