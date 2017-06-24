import defaults from 'lodash/defaults';
import map from 'lodash/map';
import omitBy from 'lodash/omitBy';
import zipObject from 'lodash/zipObject';
import rawOne from './rawOne';

function rawMany(doc, fieldsNames, options = {}) {
  // Prepare default options values.
  defaults(options, {
    transient: true,
    immutable: true,
    undefined: true
  });

  const values = zipObject(
    fieldsNames,
    map(fieldsNames, (fieldName) => {
      return rawOne(doc, fieldName, options);
    })
  );

  if (options.undefined) {
    return values;
  }
  else {
    return omitBy(values, (value) => value === undefined);
  }
};

export default rawMany;