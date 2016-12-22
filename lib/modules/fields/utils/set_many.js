import {
  forOwn
}
from 'lodash';
import setOne from './set_one.js';

function setMany(doc, fieldsValues, options) {
  // Set multiple fields.
  forOwn(fieldsValues, (setValue, fieldName) => {
    setOne(doc, fieldName, setValue, options);
  });
};

export default setMany;