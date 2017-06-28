import _defaults from 'lodash/defaults';
import getMany from './getMany';

function getAll(doc, options = {}) {
  // Prepare default options values.
  _defaults(options, {
    transient: true,
    immutable: true,
    undefined: true
  });

  const Class = doc.constructor;

  // Get list of fields and their values.
  return getMany(doc, Class.getFieldsNames(options), options);
};

export default getAll;