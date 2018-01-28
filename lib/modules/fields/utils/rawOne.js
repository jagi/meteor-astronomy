import _defaults from 'lodash/defaults';
import _isArray from 'lodash/isArray';
import _map from 'lodash/map';
import AstroClass from '../../../core/class.js';
import traverse from './traverse.js';
import rawAll from './rawAll';

function rawOne(doc, fieldName, options = {}) {
  // Prepare default options values.
  _defaults(options, {
    transient: true,
    immutable: true,
    // We still need the "undefined" options in the "rawOne" util, because we
    // might want to get nested document that may have undefined fields.
    undefined: true
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

      // Get field's value.
      const fieldValue = nestedDoc[nestedFieldName];

      if (fieldValue instanceof AstroClass) {
        return rawAll(fieldValue, options);
      }
      else if (_isArray(fieldValue)) {
        return _map(fieldValue, function(element) {
          if (element instanceof AstroClass) {
            return rawAll(element, options);
          }
          else {
            return element;
          }
        });
      }
      else {
        return fieldValue;
      }
    }
  );
};

export default rawOne;