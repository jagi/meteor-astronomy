import _defaults from 'lodash/defaults';
import _map from 'lodash/map';
import _omitBy from 'lodash/omitBy';
import _zipObject from 'lodash/zipObject';
import rawOne from './rawOne';

function rawMany(doc, fieldsNames, options = {}) {
  // Prepare default options values.
  _defaults(options, {
    transient: true,
    immutable: true,
    undefined: true
  });

  const values = _zipObject(
    fieldsNames,
    _map(fieldsNames, (fieldName) => {
      return rawOne(doc, fieldName, options);
    })
  );

  if (options.undefined) {
    return values;
  }
  else {
    return _omitBy(values, (value) => value === undefined);
  }
};

export default rawMany;