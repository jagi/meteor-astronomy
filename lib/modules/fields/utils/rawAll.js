import {
  defaults,
  isUndefined,
  map,
  zipObject
}
from 'lodash';
import rawMany from './rawMany';

function rawAll(doc, options = {}) {
  // Prepare default options values.
  defaults(options, {
    transient: true,
    immutable: true,
    undefined: true
  });

  const Class = doc.constructor;

  // Get list of fields and their values.
  return rawMany(doc, Class.getFieldsNames(options), options);
};

export default rawAll;