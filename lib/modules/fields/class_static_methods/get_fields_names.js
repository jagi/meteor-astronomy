import {
  defaults,
  each,
  extend
}
from 'lodash';

function getFieldsNames(options = {}) {
  // Prepare options.
  defaults(options, {
    transient: true,
    immutable: true
  });

  const fieldsNames = [];
  each(this.schema.fields, (field, name) => {
    // Don't get a transient field.
    if (!options.transient && field.transient) {
      return;
    }
    // Don't get an immutable field.
    if (!options.immutable && field.immutable) {
      return;
    }
    fieldsNames.push(name);
  });

  return fieldsNames;
};

export default getFieldsNames;