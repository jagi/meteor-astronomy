import _ from 'lodash';
import setOne from './set_one.js';

function setAll(doc, fieldsValues, options = {}) {
  _.defaults(options, {
    clone: true
  });
  const Class = doc.constructor;

  // Get names of the fields that are not present in the fieldsValues variable.
  const fieldsNames = _.difference(Class.getFieldsNames(), _.keys(fieldsValues));

  _.each(fieldsNames, (fieldName) => {
    setOne(doc, fieldName, undefined, options);
  });

  _.forOwn(fieldsValues, (fieldValue, fieldName) => {
    setOne(doc, fieldName, fieldValue, options);
  });
};

export default setAll;