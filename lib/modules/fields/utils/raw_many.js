import rawOne from './raw_one.js';

function rawMany(doc, fieldNames, options) {
  let values = {};

  _.each(fieldNames, (fieldName) => {
    values[fieldName] = rawOne(doc, fieldName, options);
  });

  return values;
};

export default rawMany;