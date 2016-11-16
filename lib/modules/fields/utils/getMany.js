import {
  defaults,
  intersection,
  isUndefined,
  map,
  omitBy,
  zipObject
}
from 'lodash';
import getOne from './getOne';

function getMany(doc, fieldsNames, options = {}) {
  // Prepare default options values.
  defaults(options, {
    transient: true,
    immutable: true,
    undefined: true
  });

  const Class = doc.constructor;

  // Do not get transient and immutable fields if those options are set to
  // false.
  fieldsNames = intersection(fieldsNames, Class.getFieldsNames(options));

  const values = zipObject(
    fieldsNames,
    map(fieldsNames, (fieldName) => {
      return getOne(doc, fieldName, options);
    })
  );

  if (options.undefined) {
    return values;
  }
  else {
    return omitBy(values, isUndefined);
  }
};

export default getMany;