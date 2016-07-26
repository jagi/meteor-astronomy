import _ from 'lodash';
import setOne from './set_one.js';

function setMany(doc, fieldsValues, options = {}) {
  _.defaults(options, {
    clone: true
  });

  // Set multiple fields.
  _.forOwn(fieldsValues, (setValue, fieldName) => {
    setOne(doc, fieldName, setValue, options);
  });
};

export default setMany;