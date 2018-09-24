import _defaults from 'lodash/defaults';
import traverse from './traverse.js';

function getOne(doc, fieldName, options = {}) {
  // Prepare default options values.
  _defaults(options, {
    transient: true,
    immutable: true
  });

  return traverse(
    doc, fieldName,
    function(nestedDoc, nestedFieldName, field) {
      // If a field does not exist than we don't return anything.
      if (!field) {
        return;
      }

      // Don't get a transient field.
      if (!options.transient && field.transient) {
        return;
      }

      // Don't get an immutable field.
      if (!options.immutable && field.immutable) {
        return;
      }

      // Just return value.
      return nestedDoc[nestedFieldName];
    }
  );
};

export default getOne;