import _forOwn from 'lodash/forOwn';
import setOne from './set_one.js';

function setMany(doc, fieldsValues, options) {
  // Set multiple fields.
  _forOwn(fieldsValues, (setValue, fieldName) => {
    setOne(doc, fieldName, setValue, options);
  });
};

export default setMany;